# SnapSync

Image Q&A app using Gemini AI.

## Flow

1. **Manual Upload**: Upload image via web UI → Gemini AI analysis → View results
2. **Auto Upload**: Python script monitors folder → New image detected → Sent to API → Results in web UI

## Quick Start

```bash
# Start web app
bun install && bun dev

# Start auto-upload script (in another terminal)
./snap_sync.py
```

Add Gemini API key to `.env.local` file.
