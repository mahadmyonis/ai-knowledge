import os
import json
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from openai import OpenAI
from dotenv import load_dotenv
import fitz  # PyMuPDF for reading attachments in memory

# Load API Key from .env file
load_dotenv()

app = FastAPI()

# Allow the Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI and Database clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
chroma_client = chromadb.PersistentClient(path="./vectorstore")
collection = chroma_client.get_or_create_collection(name="ocdsb_policies")


@app.get("/api/documents")
async def get_documents():
    """Reads the docs folder and sends the list of PDFs to the frontend sidebar."""
    docs_dir = "./docs"
    if not os.path.exists(docs_dir):
        return {"documents": []}
    
    files = [f for f in os.listdir(docs_dir) if f.endswith(".pdf")]
    
    documents = []
    for i, file in enumerate(files):
        documents.append({
            "id": str(i + 1),
            "name": file,
            "status": "indexed" 
        })
        
    return {"documents": documents}


@app.post("/api/chat")
async def chat_endpoint(
    question: str = Form(...),
    history: str = Form("[]"), # 🔴 NEW: Catch the history from the frontend
    file: UploadFile = File(None) # Now accepts an optional file!
):
    """Handles the user's question, searches DB, reads any attached files, and remembers history."""
    user_query = question
    print(f"Searching database for: {user_query}")
    
    attachment_text = ""
    
    try:
        # --- Handle Attached File ---
        if file:
            print(f"Reading attached file: {file.filename}")
            content = await file.read()
            # Open PDF directly from memory
            doc = fitz.open(stream=content, filetype="pdf")
            for page in doc:
                attachment_text += page.get_text("text") + "\n"
        
        # --- Handle RAG Database Search ---
        query_embedding = openai_client.embeddings.create(
            input=user_query,
            model="text-embedding-3-small"
        ).data[0].embedding
        
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3
        )
        
        context_text = ""
        sources = []
        
        if results['documents'] and len(results['documents'][0]) > 0:
            for i in range(len(results['documents'][0])):
                doc_text = results['documents'][0][i]
                metadata = results['metadatas'][0][i]
                
                context_text += f"\n--- Document: {metadata['doc']} | Section: {metadata['section']} ---\n{doc_text}\n"
                
                sources.append({
                    "doc": metadata['doc'],
                    "section": metadata['section'],
                    "snippet": doc_text[:150] + "..." 
                })
        
        # --- Build AI Prompt ---
        system_prompt = f"""You are a helpful institutional knowledge assistant.
        You have two sources of information: 
        1. CONTEXT: Official documents from the database.
        2. ATTACHMENT: A temporary file the user just uploaded.
        
        Answer the user's question using ONLY these provided texts. 
        If the answer is not in the text, explicitly say so. Keep answers clear and concise.
        
        DATABASE CONTEXT:
        {context_text}
        
        USER ATTACHMENT TEXT:
        {attachment_text if attachment_text else "None"}
        """
        
        # 🔴 NEW: Unpack the history and build the conversation thread
        past_messages = json.loads(history)
        
        api_messages = [{"role": "system", "content": system_prompt}]
        
        # Add all previous messages to the thread
        for msg in past_messages:
            api_messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Add the current question at the very end
        api_messages.append({"role": "user", "content": user_query})
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=api_messages
        )
        
        # Add the attachment to the sources list so the UI knows it was used
        if file:
            sources.append({
                "doc": file.filename,
                "section": "User Attachment",
                "snippet": "File uploaded directly to this conversation."
            })
        
        return {
            "answer": response.choices[0].message.content,
            "sources": sources
        }
        
    except Exception as e:
        print(f"Error: {e}")
        return {"answer": "Sorry, there was an error processing your request.", "sources": []}