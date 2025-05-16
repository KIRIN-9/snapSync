#!/usr/bin/env python3

import os
import time
import requests
import subprocess

# Constants
DEFAULT_WATCH_DIR = "/home/susanoo/Pictures"
DEFAULT_FILENAME = "hello.png"
CHECK_INTERVAL = 2  # seconds
API_URL = "http://localhost:3000/api/process-image"

# No notification function needed - responses will only be shown in the web UI

def process_image(image_path):
    try:
        # Always use detailed mode for web UI
        print("Processing image for web UI display")

        with open(image_path, 'rb') as img:
            files = {'image': (os.path.basename(image_path), img, 'image/png')}
            response = requests.post(API_URL, files=files)

            if response.status_code == 200:
                result = response.json()
                full_response = result['result'].strip()

                # Save the full response to a file for reference
                response_file = os.path.join(os.path.dirname(image_path), "last_response.txt")
                with open(response_file, 'w') as f:
                    f.write(full_response)

                # Extract just the answer letter from the result
                answer = extract_answer_letter(full_response)

                # Log the answer to console
                if len(answer) == 1 and 'A' <= answer <= 'Z':
                    print(f"Answer: {answer}")
                else:
                    print("Uncertain answer, defaulting to '?'")

                return True
            else:
                print(f"Error: {response.status_code}")
                return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def extract_answer_letter(text):
    """Extract the answer letter from a detailed or simple response."""
    import re

    # If it's already just a single letter, return it (letter-only mode)
    if len(text) == 1 and 'A' <= text.upper() <= 'Z':
        return text.upper()

    # For detailed mode, look for specific patterns in this priority order:

    # 1. Look for "ANSWER: X" pattern (our primary format)
    answer_match = re.search(r'ANSWER:\s*([A-Za-z])', text)
    if answer_match:
        return answer_match.group(1).upper()

    # 2. Look for "The answer is X" pattern (alternative format)
    answer_match = re.search(r'[Tt]he answer is\s*([A-Za-z])', text)
    if answer_match:
        return answer_match.group(1).upper()

    # 3. Look for "Option X is correct" pattern
    answer_match = re.search(r'[Oo]ption\s*([A-Za-z])\s*is correct', text)
    if answer_match:
        return answer_match.group(1).upper()

    # 4. Look for a standalone letter with formatting like (A) or A.
    answer_match = re.search(r'[\(\s]([A-Za-z])[\)\.\s]', text)
    if answer_match:
        return answer_match.group(1).upper()

    # If no pattern found, try to clean up the text
    # Remove common characters that might be around the letter
    cleaned_text = text
    for pattern in ["(", ")", ".", ":", ",", " ", "\n", "\t"]:
        cleaned_text = cleaned_text.replace(pattern, "")
    cleaned_text = cleaned_text.strip()

    # If it's a single letter after cleaning, return it
    if len(cleaned_text) == 1 and 'A' <= cleaned_text.upper() <= 'Z':
        return cleaned_text.upper()

    # If it's still longer, look for the first letter
    for char in text:
        if 'A' <= char.upper() <= 'Z':
            return char.upper()

    # If all else fails, return "?"
    return "?"

def monitor_directory(watch_dir, filename):
    image_path = os.path.join(watch_dir, filename)
    print(f"Monitoring for {image_path}")

    while True:
        if os.path.exists(image_path):
            print(f"Found {filename}, processing...")
            success = process_image(image_path)

            if success:
                # Remove the image after processing
                try:
                    os.remove(image_path)
                    print(f"Removed {filename}")
                except Exception as e:
                    print(f"Error removing {filename}: {str(e)}")

        time.sleep(CHECK_INTERVAL)

def main():
    watch_dir = DEFAULT_WATCH_DIR
    filename = DEFAULT_FILENAME

    # Ensure the watch directory exists
    if not os.path.exists(watch_dir):
        print(f"Creating directory: {watch_dir}")
        os.makedirs(watch_dir)

    # Check if the web app is running
    try:
        response = requests.get("http://localhost:3000", timeout=2)
        if response.status_code == 200:
            print(f"✅ Connected to SnapSync web app")
        else:
            print("⚠️ Web app is running but returned an unexpected status code")
    except:
        print("⚠️ Web app doesn't appear to be running")
        print("   Start the web app with: cd /path/to/app && bun dev")

    print(f"\n📁 Monitoring directory: {watch_dir}")
    print(f"🔍 Watching for file: {filename}")
    print("💡 Results will be displayed in the web UI")
    print("⌨️  Press Ctrl+C to stop")

    try:
        monitor_directory(watch_dir, filename)
    except KeyboardInterrupt:
        print("\n🛑 Monitoring stopped")

if __name__ == "__main__":
    main()
