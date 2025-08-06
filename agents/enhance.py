import json
import re
import google.generativeai as genai

INPUT_FILE = "script.json"
OUTPUT_FILE = "script_enhanced.json"
API_KEY = "AIzaSyD_O5oXegmnQuXL3BIttAm86AZ8KcEZGBY"
MODEL = "gemini-2.5-flash"
BATCH_SIZE = 5

genai.configure(api_key=API_KEY)


def clean_json(raw_text):
    """Extract JSON array from Gemini output safely."""
    raw_text = raw_text.strip()
    raw_text = re.sub(r"^```(?:json)?", "", raw_text, flags=re.MULTILINE).strip()
    raw_text = re.sub(r"```$", "", raw_text, flags=re.MULTILINE).strip()
    try:
        match = re.search(r"\[.*\]", raw_text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except Exception as e:
        print("⚠ JSON parse error:", e)
    return None


def enhance_lines(batch):
    """Send a batch of dialogue lines to Gemini and return parsed output."""
    prompt = (
        "You are a dialogue enhancer. For each object, rewrite `line` into `enhanced_line` "
        "while keeping the meaning and tone but making it more vivid. Return JSON array with "
        "`character`, original `line`, `enhanced_line`, and `tone_label`."
        "\nInput:\n" + json.dumps(batch, ensure_ascii=False)
    )

    response = genai.GenerativeModel(MODEL).generate_content(prompt)
    parsed = clean_json(response.text)

    if not parsed:
        print("⚠ Could not parse Gemini output for batch, keeping originals.")
        parsed = [{"character": d["character"],
                   "line": d["line"],
                   "enhanced_line": d["line"],
                   "tone_label": "neutral"} for d in batch]
    return parsed


def enhance_script():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    for scene in data.get("parsed_scenes", []):
        dialogues = scene.get("dialogues", [])
        for i in range(0, len(dialogues), BATCH_SIZE):
            batch = dialogues[i:i+BATCH_SIZE]
            enhanced_batch = enhance_lines(batch)

            for j, enhanced in enumerate(enhanced_batch):
                dialogues[i+j]["enhanced_line"] = enhanced["enhanced_line"]
                dialogues[i+j]["tone_label"] = enhanced.get("tone_label", "neutral")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"✅ Enhancement complete. Output saved to {OUTPUT_FILE}")

# enhance.py
def enhance_script_file(input_file: str) -> dict:
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for scene in data.get("parsed_scenes", []):
        dialogues = scene.get("dialogues", [])
        for i in range(0, len(dialogues), BATCH_SIZE):
            batch = dialogues[i:i+BATCH_SIZE]
            enhanced_batch = enhance_lines(batch)
            for j, enhanced in enumerate(enhanced_batch):
                dialogues[i+j]["enhanced_line"] = enhanced["enhanced_line"]
                dialogues[i+j]["tone_label"] = enhanced.get("tone_label", "neutral")

    return data


if __name__ == "__main__":
    enhance_script()
