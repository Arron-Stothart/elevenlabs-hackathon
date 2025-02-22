from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from lib.parse import parse_pdf, get_structured_values
from lib.main import conversation
from typing import List 
import json
from lib.admin import process_chat_message
import os

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ParseRequest(BaseModel):
    filepath: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: str = ""

@app.post("/parse")
async def parse_pdf_endpoint(request: ParseRequest):
    try:
        # Parse the PDF using the provided filepath
        parsed_text = await parse_pdf(filepath=request.filepath)

        # Get structured values
        structured_data = get_structured_values(parsed_text)

        return {
            "message": "File processed successfully",
            "structured_data": structured_data.dict(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Convert Pydantic messages to dict format expected by Gemini
        formatted_messages = [
            {"role": msg.role, "content": msg.content} 
            for msg in request.messages
        ]
        
        # Try to load the transcript markdown file
        transcript_content = ""
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(script_dir, "..", "output_test", f"{request.context}.md")
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    transcript_content = f.read()
        except Exception as e:
            print(f"Warning: Could not load transcript: {e}")
            
        # Add transcript to context if found
        context = request.context
        if transcript_content:
            context = f"{context}\n\nTranscript:\n{transcript_content}"
        
        response = process_chat_message(formatted_messages, context)
        return {"response": response}
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
            try:
                # Receive message from the client
                message = await websocket.receive()
                
                if message["type"] == "bytes":
                    audio_data = message["bytes"]
                    # Process the audio through the conversation
                    response = await conversation.process_audio(audio_data)
                    
                    await websocket.send_json({
                        "type": "response",
                        "text": response
                    })
                elif message["type"] == "text":
                    # Parse the text message
                    data = json.loads(message["text"])
                    if data["type"] == "end_session":
                        # End the conversation session
                        conversation.end_session()
                        break
                    
            except Exception as e:
                print(f"Error processing message: {e}")
                await websocket.send_json({
                    "type": "error",
                    "text": str(e)
                })
            
    except Exception as e:
        print(f"Error in websocket: {e}")
    finally:
        # Make sure the conversation session is ended
        conversation.end_session()