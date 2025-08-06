import json
import re
import google.generativeai as genai

API_KEY = "AIzaSyD_O5oXegmnQuXL3BIttAm86AZ8KcEZGBY"
MODEL = "gemini-2.5-flash"
BATCH_SIZE = 5

genai.configure(api_key=API_KEY)

def extract_scenes_and_characters(script_text: str) -> dict:
  model = genai.GenerativeModel("gemini-2.5-flash")

  prompt = f"""
  From the screenplay below, extract:
  - scenes: a list of all scene headings in order of appearance
  - characters: a list of all unique character names across the entire script
  Return the result as a JSON object with two keys: "scenes" and "characters".
  Output only valid JSON, no extra text.

  Screenplay:
  {script_text}
  """

  response = model.generate_content(prompt)
  print("Response: ")
  print(response.text)
  raw_text = response.text.strip()

  # Extract JSON from code fences or extra text
  json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
  if not json_match:
    print("No JSON object found in response.")
    return {"scenes": [], "characters": []}

  json_str = json_match.group(0)

  try:
    return json.loads(json_str)
  except json.JSONDecodeError:
    print("Error decoding JSON response.")
    return {"scenes": [], "characters": []}

# Example usage
if __name__ == "__main__":
  script_text = """
  INT. COFFEE SHOP – DAY

  JOHN sits at the table, sipping his coffee. MARY walks in, looking around nervously.

  JOHN
  Hey Mary, over here!

  MARY
  Hi John, sorry I’m late.

  EXT. PARK – AFTERNOON

  DAVID jogs past while SARAH reads a book on a bench.
  """

  result = extract_scenes_and_characters(script_text)
  print(json.dumps(result, indent=2))
