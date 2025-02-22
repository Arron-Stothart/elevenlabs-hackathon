from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Dict
import asyncio
from .parse import parse_pdf, get_structured_values
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseRequest(BaseModel):
    filename: str

@app.post("/parse")
async def parse_pdf_endpoint(request: ParseRequest):
    try:
        # Parse the PDF using the provided filename
        parsed_text = await parse_pdf(filename=request.filename)
        
        # Get structured values
        structured_data = get_structured_values(parsed_text)
        
        return {
            "message": "File processed successfully",
            "structured_data": structured_data.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 