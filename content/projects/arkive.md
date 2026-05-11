---
slug: arkive
name: Arkive
folder: inflight
tagline: >-
  Privacy-first desktop application (C++17, Qt 6/QML, CMake/Ninja) that ingests
  personal data — photo…
status: active
tech:
  - C++17
  - Qt 6
  - QML
  - CMake
  - Ninja
  - Google Test
  - llama.cpp
  - Claude API
started: 2026-01
order: 8
github: 'https://github.com/ktnCodes/arkive'
demo: null
category: Desktop / C++
---
# Arkive

Privacy-first desktop application (C++17, Qt 6/QML, CMake/Ninja) that ingests personal data — photos, iMessages, Snapchat exports — and compiles it into a queryable local wiki with a chat interface. Built from scratch with 8 modular subsystems (VaultManager, MarkdownParser, ExifReader, GeocodeCache, PhotoIngestor, and QAbstractItemModel-based Qt data models), 92 Google Test unit tests, and a hybrid LLM backend (llama.cpp local inference + Claude/OpenAI API) behind a common interface for swappable inference providers.
