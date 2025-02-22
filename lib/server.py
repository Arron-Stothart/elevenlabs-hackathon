from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Dict
import asyncio
from .parse import parse_pdf, get_structured_values
from pydantic import BaseModel
import json
from .main import conversation, dynamic_vars

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
            "structured_data": structured_data.dict(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        # Start the conversation session
        conversation.start_session()
        
        while True:
            # Receive audio data from the client
            audio_data = await websocket.receive_bytes()
            
            # Process the audio through the conversation
            response = await conversation.process_audio(audio_data)
            
            # Send the response back to the client
            await websocket.send_text(json.dumps({
                "type": "response",
                "text": response
            }))
            
    except Exception as e:
        print(f"Error in websocket: {e}")
        await websocket.close()
    finally:
        conversation.end_session()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
