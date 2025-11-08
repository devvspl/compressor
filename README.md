# PDF Compressor Pro

A **comprehensive, full-featured web application** for compressing PDF files **directly in the browser**. Built as a **single-page application (SPA)** using:

- **Vanilla JavaScript (ES6+)**
- **Tailwind CSS** for styling
- **`pdf-lib`** for PDF manipulation and compression

> **100% Client-Side | No Uploads | Privacy-First**

---

## Features

### Core Functionality

| Feature | Description |
|-------|-------------|
| **File Upload** | Drag-and-drop or click to select (up to **50MB**) |
| **PDF Preview** | Real-time first-page thumbnail + metadata |
| **Compression Options** | Adjustable levels + advanced settings |
| **Real-time Estimation** | Live preview of estimated output size |
| **Progress Bar** | Visual feedback during compression |
| **Download** | Auto-download with `compressed_[name].pdf` |
| **Size Comparison** | Modal with before/after stats |
| **Batch Mode** | Compress multiple PDFs in a queue |

---

### UI/UX Highlights

- **Modern SaaS Design** – Clean, professional, inspired by Smallpdf & ILovePDF  
- **Dark / Light Mode** – Toggle with persistent preference  
- **Fully Responsive** – Mobile-first, works on all devices  
- **Accessible (a11y)** – ARIA labels, keyboard navigation, screen reader support  
- **Smooth Animations** – Fade-ins, hover effects, transitions via Tailwind  
- **Interactive Controls** – Sliders, toggles, collapsible panels

---

### Technical Excellence

| Feature | Details |
|-------|--------|
| **Zero Server** | All processing in-browser using `FileReader` & `ArrayBuffer` |
| **Privacy-Focused** | Files never leave your device |
| **Fast & Efficient** | Optimized with `pdf-lib` stream compression |
| **Error Handling** | Graceful fallbacks for corrupt/encrypted/large files |
| **Browser Support** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

---

## How to Use

### Quick Start

1. Open `index.html` in any modern browser
2. Drag & drop a PDF or click to upload
3. Adjust **compression level** and **advanced options**
4. Click **"Compress PDF"**
5. Download your optimized file instantly

---

### Detailed Workflow

#### Single File Compression

1. **Upload** → Drag or click upload zone
2. **Preview** → See first page + file size + page count
3. **Configure**:
   - Compression Level: `Low`, `Medium`, `High`
   - Advanced Options:
     - Remove metadata
     - Subset embedded fonts
     - Convert images to grayscale
     - Downsample images to 150 DPI
     - Remove duplicate objects
4. **Compress** → Click button → See progress
5. **Result** → Auto-download + open comparison modal

#### Batch Processing

1. Click **"Add More Files"** in upload zone
2. Select multiple PDFs
3. Files are queued and processed one-by-one
4. Individual **"Download"** buttons appear per file

---

### Compression Levels

| Level | Quality | Size Reduction | Best For |
|------|--------|----------------|---------|
| **Low** | High | ~10–20% | Archiving, printing |
| **Medium** | Good | ~30–50% | **General use (recommended)** |
| **High** | Fair | ~60–80% | Email, sharing, storage |

---

## File Structure

```bash
pdf-compressor/
├── index.html      # Main page with Tailwind & logic
├── app.js          # All JavaScript (modular, commented)
└── README.md       # This file
