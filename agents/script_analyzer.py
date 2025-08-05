import json
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# Model choice: larger than base for better rewriting, but still fits in 4GB VRAM in 4-bit
MODEL_NAME = "google/flan-t5-large"
BATCH_SIZE = 8  # adjust based on VRAM
MAX_TOKENS = 64

print("Loading model in 4-bit…")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME,
    load_in_4bit=True,
    device_map="auto",
    bnb_4bit_compute_dtype=torch.float16  # Changed from string to torch dtype
)

rewriter = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=MAX_TOKENS,
    temperature=0.7,  # for creativity
    top_p=0.9,
    do_sample=True    # enable sampling so tone is more varied
)

def enhance_batch(batch):
    prompts = [
        (
            f"You are an expert Hollywood screenwriter. Rewrite the following dialogue for the character "
            f"'{item['character']}'. Preserve the meaning, but amplify the emotional tone to strongly convey "
            f"'{item['tone_label']}'. Keep the style and voice authentic to the character, and maintain proper screenplay format. "
            f"Do not add narration or change scene context.\n\nOriginal: {item['line']}\n\nEnhanced:"
        )
        for item in batch
    ]
    outputs = rewriter(prompts)
    return [out['generated_text'].strip() for out in outputs]

def enhance_script(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        script_data = json.load(f)

    # Collect dialogues for batching
    dialogues_to_process = []
    for scene in script_data["parsed_scenes"]:
        for dialogue in scene.get("dialogues", []):
            tone_info = dialogue.get("tone", {})
            tone_label = tone_info.get("tone", "neutral")
            dialogues_to_process.append({
                "scene": scene["scene"],
                "character": dialogue["character"],
                "line": dialogue["line"],
                "tone_label": tone_label,
                "ref": dialogue
            })

    # Process in batches
    for i in range(0, len(dialogues_to_process), BATCH_SIZE):
        batch = dialogues_to_process[i:i+BATCH_SIZE]
        enhanced_lines = enhance_batch(batch)
        for dialogue_item, enhanced_line in zip(batch, enhanced_lines):
            dialogue_item["ref"]["enhanced_line"] = enhanced_line

    out_file = "script_with_enhanced_dialogue.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(script_data, f, indent=4, ensure_ascii=False)

    print(f"✅ Saved enhanced script: {out_file}")

if __name__ == "__main__":
    enhance_script("script_with_tone.json")  # input is tone.py output
