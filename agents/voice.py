from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import whisper
import shutil
import os
import uuid

app = FastAPI()

# Allow frontend to access backend (adjust origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model (base for speed or small for accuracy)
model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    # Save uploaded file
    temp_filename = f"temp_{uuid.uuid4()}.mp3"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Transcribe using Whisper
        result = model.transcribe(temp_filename)
        text = result["text"]
        return {"text": text}
    except Exception as e:
        return {"error": str(e)}
    finally:
        # Clean up
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
