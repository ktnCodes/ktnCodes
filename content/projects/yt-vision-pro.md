---
slug: yt-vision-pro
name: yt-vision-pro
folder: shipped
tagline: >-
  YouTube visual analysis pipeline. Chapter-aware frame extraction with OCR-first
  slide preservation, quality filtering, and LLM-ready manifest synthesis.
status: released
tech:
  - Python
  - yt-dlp
  - ffmpeg
  - RapidOCR
  - PySceneDetect
  - Whisper
started: 2026-01
order: 3
featured: true
github: https://github.com/ktnCodes/yt-vision-pro
demo: null
category: AI / Developer Tools
---
# yt-vision-pro

YouTube visual analysis pipeline. Downloads a YouTube video plus captions via yt-dlp, parses chapters (or generates synthetic 15-minute chunks for unchaptered videos), detects scene boundaries with PySceneDetect, extracts scene-start frames plus optional within-scene samples, runs OCR on each frame before deduplication, filters black/blurry frames with slide-aware pHash thresholds, and aligns captions to frames. Outputs chunked Markdown manifests with density metadata for downstream LLM synthesis. Density tiers (high/normal/low) tune sampling rate and dedup aggressiveness per video type. Replaces the older youtube-research-report-tool with a proper engine.
