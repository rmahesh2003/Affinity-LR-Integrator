# 📸 AffinityFlow (In progress)

A lightweight, fast, and intuitive photo cataloging tool designed for photographers who use **Affinity Photo** but miss the powerful cataloging and batch workflow features of Lightroom Classic.

AffinityFlow lets you organize, rate, preview, tag, and batch-export RAW photos — and seamlessly open them in **Affinity Photo** for final edits.


---

## 🎯 Why AffinityFlow?

Affinity Photo is a powerful image editor — but it lacks a built-in library, RAW batch processing, or photo management tools. Lightroom users enjoy powerful cataloging and workflow features, but Affinity users are left piecing together solutions manually.

AffinityFlow bridges that gap.

🧠 What Problem Are We Solving?

| Problem                    | Solution AffinityFlow Offers                        |
| -------------------------- | ----------------------------------------------- |
| No catalog in Affinity     | Full-featured image organizer                   |
| Can't manage large shoots  | Bulk import, preview, tag, rate                 |
| No RAW batch workflow      | Preview and prep before Affinity edit           |
| No roundtrip support       | One-click open into Affinity                    |
| Lightroom is too expensive | \$0 or low-cost one-time buy for Affinity users |

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

```

## Development Setup

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- Affinity Photo installed

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/affinity-flow.git
cd affinity-flow
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Building for Production

To build the application for your platform:

```bash
npm run build
```

This will create a distributable package in the `dist` directory.

## Project Structure

```
affinity-flow/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.js     # Main process entry
│   │   └── db/         # Database operations
│   └── renderer/       # React frontend
│       ├── components/ # React components
│       └── App.js      # Main React component
├── public/             # Static assets
└── package.json        # Project configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

#Note 
This app currently only works on MacOS, please stay tuned for Windows
