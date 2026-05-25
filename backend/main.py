import os
import json
import re
from functools import lru_cache

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pinecone import Pinecone
from openai import OpenAI
from dotenv import load_dotenv
import fitz

# =========================================================
# LOAD ENVIRONMENT
# =========================================================
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# =========================================================
# CLIENTS
# =========================================================
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index = pc.Index("knowledge-base")

# =========================================================
# CONSTANTS
# =========================================================
EMBED_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini"
NAMESPACE = "carleton"

# =========================================================
# HELPERS
# =========================================================

def normalize_course_code(course_code: str) -> str:
    """
    Converts:
    sysc4001
    SYSC-4001
    sysc:4001
    into:
    SYSC 4001
    """
    match = re.search(
        r'\b([A-Za-z]{4})[-\s:]?(\d{4}[A-Za-z]?)\b',
        course_code
    )

    if not match:
        return None

    dept = match.group(1).upper()
    number = match.group(2).upper()

    return f"{dept} {number}"


@lru_cache(maxsize=500)
def get_course_embedding(course_code: str):
    """
    Cache embeddings for repeated course lookups.
    """
    response = openai_client.embeddings.create(
        input=f"Course description for {course_code}",
        model=EMBED_MODEL
    )

    return response.data[0].embedding


def is_valid_course_match(doc_text: str, clean_code: str) -> bool:
    """
    Strict validation to prevent prerequisite hijacking.
    """

    if not doc_text:
        return False

    normalized_doc = (
        doc_text
        .replace(" ", "")
        .replace("\xa0", "")
        .upper()
        .strip()
    )

    normalized_code = clean_code.replace(" ", "").upper()

    # Must START with course code
    starts_correctly = normalized_doc.startswith(normalized_code)

    # Course headers usually contain credits early
    has_credit_bracket = "[" in doc_text[:80]

    return starts_correctly and has_credit_bracket


@lru_cache(maxsize=500)
def get_verified_course(clean_code: str):
    """
    Hardened course retrieval interceptor.
    """

    dept = clean_code.split(" ")[0]

    url_upper = f"https://calendar.carleton.ca/undergrad/courses/{dept}/"
    url_lower = f"https://calendar.carleton.ca/undergrad/courses/{dept.lower()}/"

    try:
        query_embedding = get_course_embedding(clean_code)

        results = index.query(
            vector=query_embedding,
            top_k=50,
            filter={
                "source": {
                    "$in": [url_upper, url_lower]
                }
            },
            include_metadata=True,
            namespace=NAMESPACE
        )

        if not results.matches:
            return None

        for match in results.matches:
            metadata = match.metadata or {}

            doc_text = metadata.get("text", "")

            if is_valid_course_match(doc_text, clean_code):
                return {
                    "text": doc_text,
                    "source": metadata.get("source", "Official Calendar")
                }

        return None

    except Exception as e:
        print(f"[COURSE INTERCEPTOR ERROR] {e}")
        return None


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
async def health_check():
    return {
        "status": "CampusQ Brain is active and listening."
    }


# =========================================================
# DOCUMENTS ENDPOINT
# =========================================================

@app.get("/api/documents")
async def get_documents():

    docs_dir = "./docs"

    if not os.path.exists(docs_dir):
        return {"documents": []}

    files = [
        f for f in os.listdir(docs_dir)
        if f.endswith(".pdf")
    ]

    documents = [
        {
            "id": str(i + 1),
            "name": file,
            "status": "indexed"
        }
        for i, file in enumerate(files)
    ]

    return {"documents": documents}


# =========================================================
# DIRECT COURSE LOOKUP API
# =========================================================

@app.get("/api/course/{course_code}")
async def course_lookup(course_code: str):

    clean_code = normalize_course_code(course_code)

    if not clean_code:
        return {
            "found": False,
            "error": "Invalid course code format."
        }

    try:
        course = get_verified_course(clean_code)

        if course:
            return {
                "found": True,
                "course_code": clean_code,
                "description": course["text"]
            }

        return {"found": False}

    except Exception as e:
        return {
            "found": False,
            "error": str(e)
        }


# =========================================================
# CHAT ENDPOINT
# =========================================================

@app.post("/api/chat")
async def chat_endpoint(
    question: str = Form(...),
    history: str = Form("[]"),
    file: UploadFile = File(None)
):

    user_query = question.strip()

    print(f"[QUERY] {user_query}")

    # =====================================================
    # 🛑 SILENT COURSE INTERCEPTOR
    # =====================================================

    clean_code = normalize_course_code(user_query)

    if clean_code and not file:

        print(f"[INTERCEPTOR] Triggered for {clean_code}")

        course = get_verified_course(clean_code)

        if course:

            return {
                "answer": f"**Course Match Found:**\n\n{course['text']}",
                "sources": [
                    {
                        "doc": course["source"],
                        "section": "Verified Course Match",
                        "snippet": "Exact course details retrieved from official calendar."
                    }
                ]
            }

    # =====================================================
    # NORMAL RAG FLOW
    # =====================================================

    attachment_text = ""

    try:

        # -------------------------------------------------
        # PDF EXTRACTION
        # -------------------------------------------------

        if file:

            content = await file.read()

            doc = fitz.open(
                stream=content,
                filetype="pdf"
            )

            for page in doc:
                attachment_text += (
                    page.get_text("text") + "\n"
                )

        # -------------------------------------------------
        # EMBEDDING
        # -------------------------------------------------

        query_embedding = openai_client.embeddings.create(
            input=user_query,
            model=EMBED_MODEL
        ).data[0].embedding

        # -------------------------------------------------
        # VECTOR SEARCH
        # -------------------------------------------------

        results = index.query(
            vector=query_embedding,
            top_k=10,
            include_metadata=True,
            namespace=NAMESPACE
        )

        context_text = ""

        sources = []

        seen_sources = set()

        # -------------------------------------------------
        # BUILD CONTEXT
        # -------------------------------------------------

        if results.matches:

            for match in results.matches:

                if match.score < 0.30:
                    continue

                metadata = match.metadata or {}

                doc_text = metadata.get("text", "")

                doc_source = metadata.get(
                    "source",
                    "Unknown Source"
                )

                context_text += (
                    f"\n--- Source: {doc_source} ---\n"
                    f"{doc_text}\n"
                )

                if doc_source not in seen_sources:

                    seen_sources.add(doc_source)

                    sources.append({
                        "doc": doc_source,
                        "section": "Knowledge Base",
                        "snippet": doc_text[:150] + "..."
                    })

        # -------------------------------------------------
        # SYSTEM PROMPT
        # -------------------------------------------------

        system_prompt = f"""
You are CampusQ, an independent institutional knowledge assistant designed to help students navigate Carleton University policies.

DISCLAIMER:
YOU ARE NOT OFFICIALLY AFFILIATED WITH CARLETON UNIVERSITY.

CRITICAL RULES:
1. NO MIXING PROGRAMS:
The context may contain information from MULTIPLE different programs.
You must strictly verify that a course, stream, or requirement belongs to the program being discussed.

2. NO GUESSING:
If the answer is not explicitly in the context, say:
"I do not have enough information to answer this based on the provided documents."

3. STAY FACTUAL:
Never invent policies, requirements, or prerequisites.

4. KEEP ANSWERS CLEAR:
Be concise, accurate, and professional.

DATABASE CONTEXT:
{context_text}

USER ATTACHMENT TEXT:
{attachment_text if attachment_text else "None"}
"""

        # -------------------------------------------------
        # BUILD MESSAGE HISTORY
        # -------------------------------------------------

        past_messages = json.loads(history)

        api_messages = [
            {
                "role": "system",
                "content": system_prompt
            }
        ]

        for msg in past_messages:

            api_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        api_messages.append({
            "role": "user",
            "content": user_query
        })

        # -------------------------------------------------
        # LLM RESPONSE
        # -------------------------------------------------

        response = openai_client.chat.completions.create(
            model=CHAT_MODEL,
            messages=api_messages
        )

        # -------------------------------------------------
        # ADD FILE SOURCE
        # -------------------------------------------------

        if file:

            sources.append({
                "doc": file.filename,
                "section": "User Attachment",
                "snippet": "File uploaded directly to this conversation."
            })

        # -------------------------------------------------
        # RETURN RESPONSE
        # -------------------------------------------------

        return {
            "answer": response.choices[0].message.content,
            "sources": sources
        }

    except Exception as e:

        print(f"[ERROR] {e}")

        return {
            "answer": "Sorry, there was an error processing your request.",
            "sources": []
        }