import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, Download } from 'lucide-react';

export const PythonScriptModal: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const pythonScriptContent = `# extract_pdf.py
# Lossless Tamil PDF Extraction with pdfplumber & Tesseract OCR fallback
import sys
import json
import unicodedata
from pathlib import Path

def extract_with_pdfplumber(pdf_path):
    """Try direct PDF text layer extraction preserving layout and line order."""
    import pdfplumber
    pages_data = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text(x_tolerance=1, y_tolerance=1) or ""
            # Normalize to Unicode NFC to avoid orphan Tamil pulli and diacritics
            text = unicodedata.normalize("NFC", text)
            pages_data.append({"page": i, "text": text})
    return pages_data

def ocr_with_tesseract(pdf_path):
    """Fallback OCR with Tesseract Tamil language model (tam) at 300 DPI."""
    from pdf2image import convert_from_path
    import pytesseract
    
    print("PDF Text Layer empty or scanned. Initializing Tamil OCR (tam)...")
    images = convert_from_path(pdf_path, dpi=300)
    pages_data = []
    
    for i, image in enumerate(images, start=1):
        print(f"OCR Processing Page {i}/{len(images)}...")
        text = pytesseract.image_to_string(image, lang='tam', config='--psm 1')
        text = unicodedata.normalize("NFC", text)
        pages_data.append({"page": i, "text": text})
        
    return pages_data

def main(pdf_file_path):
    pdf_path = Path(pdf_file_path)
    if not pdf_path.exists():
        print(f"Error: File not found {pdf_file_path}")
        sys.exit(1)

    print(f"Starting Tamil PDF Extraction for: {pdf_path.name}")
    
    try:
        results = extract_with_pdfplumber(str(pdf_path))
        empty_pages = sum(1 for p in results if not p["text"].strip())
        
        # Fallback to OCR if more than 50% pages have no text layer
        if empty_pages > len(results) // 2:
            print("Detected scanned PDF pages. Triggering Tesseract OCR...")
            results = ocr_with_tesseract(str(pdf_path))
            
    except Exception as e:
        print(f"pdfplumber extraction failed ({e}). Falling back to Tesseract OCR...")
        results = ocr_with_tesseract(str(pdf_path))

    output_json = pdf_path.stem + "_extracted_text.json"
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Success! Extracted {len(results)} pages saved to {output_json}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf.py input.pdf")
    else:
        main(sys.argv[1])
`;

  const copyCode = () => {
    navigator.clipboard.writeText(pythonScriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    const blob = new Blob([pythonScriptContent], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extract_pdf.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              <span>Lossless Tamil PDF Extraction Script (Python)</span>
            </h2>
            <p className="text-xs text-slate-400">
              `pdfplumber` உரை அடுக்கு எடுப்பான் + `Tesseract OCR (tam)` fallback + Unicode NFC சமநிலையாக்கம்.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'நிரல் எடுத்தாச்சு' : 'நிரல் பிரதி எடு'}</span>
            </button>

            <button
              onClick={downloadScript}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md shadow-amber-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>extract_pdf.py பதிவிறக்கு</span>
            </button>
          </div>
        </div>

        {/* Shell Installation & Usage */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <Terminal className="w-4 h-4" />
            <span>நிறுவல் & இயக்கும் முறைமை (Terminal Setup)</span>
          </div>
          <p className="text-slate-400"># 1. தேவைப்படும் Python நூலகங்களை நிறுவுக:</p>
          <p className="text-emerald-400 bg-slate-900 p-2 rounded border border-slate-800">
            pip install pdfplumber pdf2image pytesseract pillow
          </p>
          <p className="text-slate-400 mt-2"># 2. PDF கோப்பினை உரை பெற இயக்குக:</p>
          <p className="text-emerald-400 bg-slate-900 p-2 rounded border border-slate-800">
            python extract_pdf.py input.pdf
          </p>
        </div>

        {/* Python Code Display */}
        <div className="relative">
          <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto max-h-[450px] custom-scrollbar">
            <code>{pythonScriptContent}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
