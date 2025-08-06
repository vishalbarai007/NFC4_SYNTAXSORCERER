
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from agents.script_analyzer import ScriptAnalyzerAgent
from agents.tone import detect_tone
from agents.enhance import enhance_script_file
from agents.parse import extract_scenes_and_characters
import os
import json

app = FastAPI(title="Screenplay Analyzer API")

# ✅ CORS for HTTP & HTTPS
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer_agent = ScriptAnalyzerAgent()

@app.get("/")
def home():
    return {"message": "Script Analyzer Agent is running!"}

# ✅ Analyze script (plain text)
@app.post("/analyze")
def analyze(script: str = Body(..., embed=True)):
    if not script.strip():
        return JSONResponse(content={"error": "Script is empty"}, status_code=400)
    result = analyzer_agent.analyze_script(script)
    return JSONResponse(content={"parsed_scenes": result})

# ✅ Tone detection (JSON)
@app.post("/detect")
def detect(script_data: dict = Body(...)):
    filename = "temp.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(script_data, f)
    updated_data = detect_tone(filename)
    os.remove(filename)
    return JSONResponse(content=updated_data)

# ✅ Modify script (JSON)
@app.post("/modify")
def modify(script_data: dict = Body(...)):
    filename = "temp.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(script_data, f)
    updated_data = enhance_script_file(filename)
    os.remove(filename)
    return JSONResponse(content=updated_data)

# ✅ Characters & Scenes (JSON)
@app.post("/charnscenes")
def get_characters(script_data: dict = Body(...)):
    """
    Expects JSON: { "script": "<screenplay text>" }
    """
    script = script_data.get("script", "")
    if not script.strip():
        return JSONResponse(content={"error": "Script is empty"}, status_code=400)
    result = extract_scenes_and_characters(script)
    print("Result: ")
    print(result)
    return JSONResponse(content=result)
