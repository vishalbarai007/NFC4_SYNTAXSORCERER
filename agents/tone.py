import json
import os
from transformers import pipeline

# Load the emotion classifier from Hugging Face
classifier = pipeline("text-classification", model="nateraw/bert-base-uncased-emotion")

def detect_tone(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        script_data = json.load(f)

    for scene in script_data["parsed_scenes"]:
        for dialogue in scene.get("dialogues", []):
            line = dialogue["line"]
            result = classifier(line)[0]
            tone = result["label"]
            confidence = round(result["score"], 3)
            # Add new attribute "tone"
            dialogue["tone"] = {"label": tone, "confidence": confidence}

    # Save updated JSON back to file
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(script_data, f, indent=4, ensure_ascii=False)

    return script_data

if __name__ == "__main__":
    detect_tone("script.json")  # <- Replace with your actual JSON file
    os._exit(0)
