from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
from agents.script_analyzer import ScriptAnalyzerAgent

app = FastAPI(title="Screenplay Analyzer API")

# Initialize your AI agent
analyzer_agent = ScriptAnalyzerAgent()

@app.get("/")
def home():
  return {"message": "Script Analyzer Agent is running!"}

@app.post("/analyze")
def analyze_script(script: str = Body(..., media_type="text/plain")):
  """
  Accepts plain text screenplay (Fountain or script format),
  returns structured scene + dialogue + action breakdown.
  """
  result = analyzer_agent.analyze_script(script)
  return JSONResponse(content={"parsed_scenes": result})
