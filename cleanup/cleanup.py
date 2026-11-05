import pandas as pd
import json
import glob
import os
from pathlib import Path

# Configuration
input_folder = "data"
output_folder = "cleaned_data"
os.makedirs(output_folder, exist_ok=True)

# Data containers
words_data = []
ratings_data = []
demographics_data = []
id_key_data = []

# Get all matching CSV files
files = glob.glob(os.path.join(input_folder, "*_data.csv"))
print(f"{len(files)} data file(s) found")

for file_path in files:
    # Extract session_id from filename
    file_name = os.path.basename(file_path)
    session_id = file_name.replace("_data.csv", "")
    
    df = pd.read_csv(file_path)
    
    current_video = None
    
    for _, row in df.iterrows():
        trial_name = row["trial_name"]

        # Clean the response string (handle NaN and empty)
        resp_str = str(row["response"]).strip()
        if not resp_str or resp_str == "nan":
            continue
            
        # Try to decode JSON
        try:
            resp_json = json.loads(resp_str)
        except json.JSONDecodeError:
            print("ERROR: Can't decode JSON!")
            continue

        # words.csv
        if trial_name == "video":
            for entry in resp_json:
                words_data.append({
                    "session_id": session_id,
                    "word": entry.get("word"),
                    "timestamp": entry.get("timestamp"),
                    "response_state": entry.get("response_state"),
                    "video": Path(row["video"]).stem, #Gets filename from video path
                    "video_id": row["video_id"],
                    "list_name": row["list_name"],
                })
                # Update current video (so ratings.csv knows the corresponding video)
                current_video = row["video_name"]

        # ratings.csv
        elif trial_name == "ratings":
            for trait in resp_json:
                if trait != "instructions":
                    ratings_data.append({
                        "session_id": session_id,
                        "trait": trait,
                        "value": resp_json[trait],
                        "video": current_video,
                        "rt": row["rt"]
                    })
        
        # demographics.csv
        elif trial_name == "demographics":
            demographics_data.append({
                "session_id": session_id,
                "age": resp_json.get("age"),
                "gender": ",".join(resp_json.get("gender", [])) if isinstance(resp_json.get("gender"), list) else resp_json.get("gender"),
                "race": ",".join(resp_json.get("race", [])) if isinstance(resp_json.get("race"), list) else resp_json.get("race"),
                "education": resp_json.get("education"),
                "feedback": resp_json.get("feedback")
            })

        # id_key.csv
        elif trial_name == "info":
            id_key_data.append({
                "session_id": session_id,
                "prolific_id": row["prolific_id"],
                "start_time": row["start_time"],
                "end_time": row["end_time"]
            })

# Convert to DataFrames and save
pd.DataFrame(words_data).to_csv(f"{output_folder}/words.csv", index=False)
pd.DataFrame(ratings_data).to_csv(f"{output_folder}/ratings.csv", index=False)
pd.DataFrame(demographics_data).to_csv(f"{output_folder}/demographics.csv", index=False)
pd.DataFrame(id_key_data).to_csv(f"{output_folder}/id_key.csv", index=False)

print(f"Cleaning complete. Files saved to {output_folder}")