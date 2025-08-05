import json
from transformers import pipeline

# Load the emotion classifier from Hugging Face
classifier = pipeline("text-classification", model="nateraw/bert-base-uncased-emotion")

def analyze_script(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        script_data = json.load(f)

    for scene in script_data:
        print(f"\nScene: {scene['scene']}")
        for dialogue in scene.get("dialogues", []):
            character = dialogue["character"]
            line = dialogue["line"]
            result = classifier(line)[0]
            tone = result["label"]
            confidence = round(result["score"], 3)
            print(f"{character} ({tone} {confidence}): {line}")

# Run the analysis
if __name__ == "__main__":
    analyze_script("script.json")  # <- Replace with your actual JSON file
