# 📸 AffinityFlow

A lightweight, fast, and intuitive photo cataloging tool designed for photographers who use **Affinity Photo** but miss the powerful cataloging and batch workflow features of Lightroom Classic.

AffinityFlow lets you organize, rate, preview, tag, and batch-export RAW photos — and seamlessly open them in **Affinity Photo** for final edits.

---

## 🎯 Why AffinityFlow?

Affinity Photo is a powerful image editor — but it lacks a built-in library, RAW batch processing, or photo management tools. Lightroom users enjoy powerful cataloging and workflow features, but Affinity users are left piecing together solutions manually.

AffinityFlow bridges that gap.

---

## 🚀 Features

✅ Import photos from folders (RAW, JPEG, TIFF)  
✅ Thumbnail grid view with fast preview  
✅ Read and display EXIF/metadata (ISO, shutter, aperture, etc.)  
✅ Add star ratings, color labels, and flags  
✅ Tag and filter photos by date, camera, lens, rating, etc.  
✅ Batch export photos (JPEG, TIFF, etc.)  
✅ One-click **Open in Affinity Photo**  
✅ Lightweight local database (SQLite)  
✅ Cross-platform: macOS first, Windows next  

---

## 🧰 Tech Stack

| Layer        | Tech                            |
|--------------|----------------------------------|
| UI           | Electron + React (or Swift/macOS native) |
| RAW handling | [`libraw`](https://www.libraw.org/), [`rawpy`](https://letmaik.github.io/rawpy/) |
| Metadata     | [`exiftool`](https://exiftool.org/) or Python-based `piexif` |
| File DB      | SQLite (lightweight, fast)       |
| Preview cache| Local thumbnail caching          |
| Affinity hook| AppleScript / CLI open commands (macOS) |

---

## 🛠️ Installation (MVP / Developer Mode)

### Prerequisites

- Node.js (for Electron build)
- Python (for raw image + EXIF extraction)
- macOS (Affinity automation tested on macOS Ventura+)
- Affinity Photo installed

### Clone and Run

```bash
git clone https://github.com/yourusername/affinityflow.git
cd affinityflow

# Install dependencies
npm install

# Run Electron app
npm start
