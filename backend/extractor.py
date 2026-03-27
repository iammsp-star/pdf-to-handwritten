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

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a PDF, handling both proper digital PDFs and scanned images.
    Preserves reading order handling basic column layouts.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    full_text = []
    
    # Step 1: Smart Text Extraction
    doc = fitz.open(pdf_path)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Get blocks of text and sort them vertically (y-axis) then horizontally (x-axis)
        # Block format: (x0, y0, x1, y1, "lines in block", block_no, block_type)
        blocks = page.get_text("blocks")
        
        # Filter out non-text blocks (block_type 0 is text)
        text_blocks = [b for b in blocks if b[6] == 0]
        
        # Sort by vertical position (y0), then horizontal (x0) to maintain reading flow
        text_blocks.sort(key=lambda b: (b[1], b[0]))
        
        page_text = "\n\n".join([b[4].strip() for b in text_blocks])
        
        # Step 2: The OCR Fallback
        # If the character count is suspiciously low, assume it's a scanned image
        if len(page_text.strip()) < 50:
            print(f"[INFO] Low character count on page {page_num+1}. Falling back to OCR...")
            
            # Convert just this page to a PIL Image (pages are 1-indexed in pdf2image)
            images = convert_from_path(pdf_path, first_page=page_num+1, last_page=page_num+1)
            
            if images:
                image = images[0]
                # Run tesseract on the image
                page_text = pytesseract.image_to_string(image)
        
        full_text.append(page_text.strip())

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
