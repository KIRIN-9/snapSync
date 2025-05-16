#!/usr/bin/env python3

import os
import time
import requests
import subprocess
import argparse

def notify(message):
    try: subprocess.run(['notify-send', 'SnapSync', message])
    except: pass

def toggle_caps_lock():
    try: subprocess.run(['xdotool', 'key', 'Caps_Lock'])
    except: pass

def blink_caps_lock(times=2):
    try:
        result = subprocess.run(['xset', 'q'], capture_output=True, text=True)
        if "Caps Lock:   on" in result.stdout:
            toggle_caps_lock()
            time.sleep(0.5)
        for i in range(times):
            toggle_caps_lock()
            time.sleep(0.5)
            toggle_caps_lock()
            time.sleep(0.5)
    except: pass

def upload_image(image_path, api_url):
    try:
        filename = os.path.basename(image_path)
        with open(image_path, 'rb') as img:
            files = {'file': (filename, img, 'image/png')}
            response = requests.post(api_url, files=files)
            if response.status_code == 200:
                notify("Success!")
                blink_caps_lock(2)
                return True
            else:
                notify(f"Error: {response.status_code}")
                blink_caps_lock(3)
                return False
    except Exception as e:
        notify(f"Error: {str(e)}")
        blink_caps_lock(3)
        return False

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--folder', type=str, default='/home/antinomy/Pictures/')
    parser.add_argument('--filename', type=str, default='hello.png')
    parser.add_argument('--url', type=str, default='http://52.172.203.153:8000/api/v1/ai/getAnswer')
    parser.add_argument('--interval', type=float, default=1.0)
    parser.add_argument('--once', action='store_true', help='Process once and exit')

    args = parser.parse_args()

    if args.once:
        image_path = os.path.join(args.folder, args.filename)
        if os.path.exists(image_path):
            upload_image(image_path, args.url)
            if args.folder == '/home/antinomy/Pictures/':
                os.system(f"rm -r {args.folder}/{args.filename}")
    else:
        notify("Started monitoring")
        try:
            while True:
                if os.path.exists(args.folder):
                    files = os.listdir(args.folder)

                    if len(files) > 1:
                        os.system(f"rm -r {args.folder}/*")
                    elif len(files) == 1 and files[0] == args.filename:
                        image_path = os.path.join(args.folder, args.filename)
                        upload_image(image_path, args.url)
                        os.system(f"rm -r {args.folder}/{args.filename}")

                time.sleep(args.interval)
        except KeyboardInterrupt:
            notify("Stopped monitoring")

if __name__ == "__main__":
    main()
