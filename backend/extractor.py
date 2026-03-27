"""
Hybrid PDF Extractor
Uses PyMuPDF (fitz) for smart text extraction on standard PDFs.
If a page has fewer than 50 characters (likely a scanned image/book),
it automatically falls back to Tesseract OCR via pdf2image and pytesseract.

Requirements:
    pip install PyMuPDF pytesseract pdf2image Pillow
    System Requirement: Tesseract-OCR must be installed and in your PATH.
"""

import os
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path

def extract_text_from_pdf(pdf_path: str, ocr_threshold: int = 250) -> str:
    """
    Extracts text from a PDF, handling both proper digital PDFs and scanned images.
    Preserves reading order handling basic column layouts using native PyMuPDF sorting.
    
    Args:
        pdf_path: Path to the PDF file.
        ocr_threshold: If a page yields fewer than this many characters, OCR is triggered.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    full_text = []
    
    # Step 1: Smart Text Extraction
    doc = fitz.open(pdf_path)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # PyMuPDF's built-in sorted text extraction handles reading order and columns robustly
        raw_text = page.get_text("text", sort=True)
        page_text = raw_text.strip()
        
        # Step 2: The OCR Fallback
        # If the character count is suspiciously low, assume it's a scanned image or broken OCR layer
        if len(page_text) < ocr_threshold:
            print(f"[INFO] Page {page_num+1} has low text count ({len(page_text)} chars). Trying OCR...")
            
            try:
                # Convert just this page to a PIL Image (pages are 1-indexed in pdf2image)
                images = convert_from_path(pdf_path, first_page=page_num+1, last_page=page_num+1)
                
                if images:
                    image = images[0]
                    # Run tesseract on the image
                    ocr_text = pytesseract.image_to_string(image).strip()
                    
                    # If OCR yields more text than the digital layer, prioritize OCR
                    if len(ocr_text) > len(page_text):
                        page_text = ocr_text
                        
            except Exception as e:
                print(f"[WARNING] OCR Fallback failed on page {page_num+1}: {e}")
                print("[WARNING] Please ensure Tesseract-OCR and Poppler tools are installed.")
        
        full_text.append(page_text)

    # Combine all pages and do basic cleanup
    final_text = "\n\n--- Page Break ---\n\n".join(full_text)
    
    # Cleanup: Remove excessive repeating newlines (more than 3 empty lines)
    while "\n\n\n\n" in final_text:
        final_text = final_text.replace("\n\n\n\n", "\n\n\n")
        
    return final_text

if __name__ == "__main__":
    # Example usage (will run if called directly)
    # print(extract_text_from_pdf("sample.pdf"))
    pass
