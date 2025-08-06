import re
from typing import List, Dict

class ScriptAnalyzerAgent:
  def __init__(self):
    self.name = "ScriptAnalyzerAgent"
    self.goal = "Extract structured screenplay data from unstructured or Fountain-formatted text"
    self.last_script = ""
    self.last_output = []

  def is_scene_heading(self, line: str) -> bool:
    return bool(re.match(r"^(INT\.|EXT\.|INT/EXT\.)", line.strip()))

  def is_character_name(self, line: str) -> bool:
    return line.isupper() and len(line.split()) <= 4 and not self.is_scene_heading(line)

  def is_transition(self, line: str) -> bool:
    return line.endswith("TO:") or line in {"FADE OUT", "FADE IN"}

  def analyze_script(self, script_text: str) -> List[Dict]:
    self.last_script = script_text
    scenes = []
    current_scene = None
    current_character = None
    lines = script_text.split("\n")

    for i, raw_line in enumerate(lines):
      line = raw_line.strip()

      if not line:
        continue

      # Scene heading
      if self.is_scene_heading(line):
        if current_scene:
          scenes.append(current_scene)
        current_scene = {
          "scene": line,
          "actions": [],
          "dialogues": []
        }
        current_character = None

      # Character name
      elif self.is_character_name(line):
        current_character = line

      # Dialogue block: under character name
      elif current_character:
        current_scene["dialogues"].append({
          "character": current_character,
          "line": line
        })
        current_character = None

      # Transition
      elif self.is_transition(line):
        if current_scene:
          current_scene["actions"].append(f"(Transition) {line}")

      # Action or general description
      else:
        if current_scene:
          current_scene["actions"].append(line)

    if current_scene:
      scenes.append(current_scene)

    self.last_output = scenes
    return scenes

  def get_last_output(self) -> List[Dict]:
    return self.last_output

  def describe(self) -> str:
    return f"I am {self.name}. My goal is: {self.goal}"

sample_script = """
INT. BEDROOM - NIGHT

A dimly lit room. The clock ticks.

SARAH
I can't keep doing this, John.

JOHN
Then stop pretending.

CUT TO:

EXT. PARK - DAY

Children play in the distance.

MARK
It’s a beautiful day.
"""
