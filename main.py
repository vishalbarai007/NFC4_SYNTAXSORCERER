from fastapi import FastAPI, Body, UploadFile, File
from fastapi.responses import JSONResponse
from agents.script_analyzer import ScriptAnalyzerAgent
import os
import json
from agents.tone import detect_tone
from agents.enhance import enhance_script_file



app = FastAPI(title="Screenplay Analyzer API")

# Initialize your AI agent
analyzer_agent = ScriptAnalyzerAgent()

@app.get("/")
def home():
  return {"message": "Script Analyzer Agent is running!"}

@app.post("/analyze")
def analyze(script: str = Body(..., media_type="text/plain")):
  """
  Accepts plain text screenplay (Fountain or script format),
  returns structured scene + dialogue + action breakdown.
  """
  result = analyzer_agent.analyze_script(script)
  return JSONResponse(content={"parsed_scenes": result})

from fastapi import Body

@app.post("/detect")
def detect(script_data: dict = Body(...)):
    filename = "temp.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(script_data, f)

    updated_data = detect_tone(filename)

    os.remove(filename)
    return JSONResponse(content=updated_data)

@app.post("/modify")
def modify(script_data: dict = Body(...)):
    filename = "temp.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(script_data, f)

    updated_data = enhance_script_file(filename)

    os.remove(filename)
    return JSONResponse(content=updated_data)
