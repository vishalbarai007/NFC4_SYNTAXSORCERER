from fastapi import FastAPI
from pydantic import BaseModel
from agents.script_analyzer import ScriptAnalyzerAgent

app = FastAPI(title="Screenplay Analyzer API")

# Pydantic model for request body
class ScriptInput(BaseModel):
  script: str

# Create the agent instance
analyzer_agent = ScriptAnalyzerAgent()

@app.get("/")
def home():
  return {"message": "Script Analyzer Agent is running!"}

@app.post("/analyze")
def analyze_script(input_data: ScriptInput):
  result = analyzer_agent.analyze_script(input_data.script)
  return {"parsed_scenes": result}
