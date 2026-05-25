import os
import time
import requests
import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

load_dotenv()

# Initialize API clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("knowledge-base")

BASE_URL = "https://calendar.carleton.ca"
START_URL = f"{BASE_URL}/undergrad/courses/"
NAMESPACE = "carleton"

def get_department_links():
    """Stage 1: Uses urljoin to catch every single relative and absolute department link."""
    print(f"[Stage 1] Fetching master course directory from: {START_URL}")
    response = requests.get(START_URL)
    if response.status_code != 200:
        print("Error: Could not access main course directory page.")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    content_area = soup.find('div', class_='pageblock') or soup.find('main') or soup.find('body')
    
    dept_links = []
    for link in content_area.find_all('a', href=True):
        href = link['href']
        
        # FIX: Assemble the absolute URL before testing it
        full_url = urljoin(START_URL, href)
        
        # Filter: Must be a sub-page of /undergrad/courses/, and ignore PDFs/Anchors
        if full_url.startswith(START_URL) and full_url != START_URL:
            if ".pdf" not in full_url and "#" not in full_url:
                if full_url not in dept_links:
                    dept_links.append(full_url)
                
    print(f"-> Success: Identified {len(dept_links)} distinct department pages to harvest.")
    return dept_links

def scrape_clean_page(url):
    """Stage 2: Uses BeautifulSoup to extract text WITHOUT deleting hyperlink course codes."""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Strip structural noise
        for element in soup(["script", "style", "nav", "header", "footer", "form"]):
            element.decompose()
            
        main_content = soup.find('div', class_='pageblock') or soup.find('main') or soup.find('body')
        text = main_content.get_text(separator="\n") if main_content else soup.get_text(separator="\n")
            
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return "\n".join(lines)
    except Exception as e:
        print(f"Skipping {url} due to error: {e}")
        return None

def process_and_upload(text, source_url, dept_index):
    # STRICT SPLIT: Only splits at official headers (e.g., "\nSYSC 4416 [0.5 credit]")
    # This prevents chopping course descriptions in half.
    raw_chunks = re.split(r'\n(?=[A-Z]{4}\s\d{4}\s*\[)', text)
    
    chunks = [chunk.strip() for chunk in raw_chunks if len(chunk.strip()) > 50]
    
    vectors_to_upsert = []
    for i, chunk in enumerate(chunks):
        # We only upload if it looks like a real course (contains the bracket)
        if "[" in chunk[:50]: 
            response = openai_client.embeddings.create(input=chunk, model="text-embedding-3-small")
            embedding = response.data[0].embedding
            
            vectors_to_upsert.append({
                "id": f"dept-{dept_index}-chunk-{i}",
                "values": embedding,
                "metadata": {"text": chunk, "source": source_url, "tenant": NAMESPACE}
            })
        
    if vectors_to_upsert:
        index.upsert(vectors=vectors_to_upsert, namespace=NAMESPACE)
        print(f"      -> Uploaded {len(vectors_to_upsert)} verified course chunks.")

def run_pipeline():
    start_time = time.time()
    dept_urls = get_department_links()
    
    if not dept_urls:
        print("Pipeline aborted. No links harvested.")
        return

    print("\n[Stage 2] Beginning Deep Clean Harvest...")
    for idx, url in enumerate(dept_urls):
        print(f"[{idx + 1}/{len(dept_urls)}] Shredding noise and extracting from: {url}")
        
        clean_text = scrape_clean_page(url)
        if clean_text and len(clean_text) > 100:
            process_and_upload(clean_text, url, idx)
        else:
            print(f"      Warning: No meaningful context extracted from link.")
            
        time.sleep(1)

    print(f"\n✅ RECURSIVE HARVEST COMPLETE! Total execution time: {round((time.time() - start_time)/60, 2)} minutes.")

if __name__ == "__main__":
    run_pipeline()