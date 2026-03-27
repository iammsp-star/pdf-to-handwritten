/**
 * UI Interaction & Mock Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('theme-icon-sun');
    const iconMoon = document.getElementById('theme-icon-moon');
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const isDark = document.body.classList.contains('theme-dark');
        
        if (isDark) {
            iconMoon.classList.add('hidden');
            iconSun.classList.remove('hidden');
        } else {
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        }
    });

    // --- Drag and Drop File Upload ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const extractSkeleton = document.getElementById('extract-skeleton');
    const extractStatus = document.getElementById('extraction-status');
    const textEditor = document.getElementById('text-editor');

    // Click to browse
    dropZone.querySelector('.text-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag events
    ['dragover', 'dragenter'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
    });

    ['dragleave', 'dragend', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });

    function handleFileUpload(file) {
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        // Mock Extraction process
        textEditor.value = '';
        extractSkeleton.classList.remove('hidden');
        extractStatus.classList.remove('hidden');

        // Simulate network/extraction delay
        setTimeout(() => {
            extractSkeleton.classList.add('hidden');
            extractStatus.classList.add('hidden');
            textEditor.value = `This is mock extracted text from "${file.name}".\n\nYou can effortlessly edit it here before generating it into authentic looking handwritten pages.\n\nThe settings on the right will auto-apply to the generated output.`;
        }, 2000);
    }

    // --- Settings UI Elements ---

    // Ink Color Selection
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Remove active from all
            swatches.forEach(s => {
                s.classList.remove('active');
                s.querySelector('.check-icon').classList.add('hidden');
            });
            // Add to clicked
            swatch.classList.add('active');
            swatch.querySelector('.check-icon').classList.remove('hidden');
        });
    });

    // Imperfection Slider
    const slider = document.getElementById('imperfections');
    const sliderValue = document.getElementById('imperfection-value');
    
    slider.addEventListener('input', (e) => {
        sliderValue.textContent = `${e.target.value}%`;
    });

    // --- Generation Mock Logic ---
    const generateBtn = document.getElementById('generate-btn');
    const previewPlaceholder = document.getElementById('preview-placeholder');
    const previewSkeleton = document.getElementById('preview-skeleton');
    const previewResult = document.getElementById('preview-result');
    
    const downloadPdfBtn = document.getElementById('btn-download-pdf');
    const downloadImgBtn = document.getElementById('btn-download-img');

    generateBtn.addEventListener('click', () => {
        if (!textEditor.value.trim()) {
            alert('Please upload a PDF or enter some text first.');
            return;
        }

        // Hide current states
        previewPlaceholder.classList.add('hidden');
        previewResult.classList.add('hidden');
        
        // Show loading skeleton
        previewSkeleton.classList.remove('hidden');
        generateBtn.disabled = true;
        generateBtn.innerHTML = 'Generating...';

        // Simulate API call to generate image
        setTimeout(() => {
            previewSkeleton.classList.add('hidden');
            
            // Apply current UI settings to mock view
            applySettingsToMockResult();
            
            previewResult.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.innerHTML = `<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg> Generate again`;

            // Enable downloads
            downloadPdfBtn.disabled = false;
            downloadImgBtn.disabled = false;

        }, 2500);
    });

    function applySettingsToMockResult() {
        const mockDoc = previewResult.querySelector('.mock-generated-doc');
        const textElem = previewResult.querySelector('.written-text');
        
        // Text
        textElem.textContent = textEditor.value.substring(0, 100) + '... (preview truncated)';

        // Color
        const activeColor = document.querySelector('.color-swatch.active').dataset.value;
        mockDoc.classList.remove('color-blue', 'color-black');
        mockDoc.classList.add(`color-${activeColor}`);

        // Background
        const paperBg = document.getElementById('paper-bg').value;
        if (paperBg === 'lined') {
            mockDoc.classList.add('bg-lined');
            mockDoc.style.backgroundColor = '#fdfaf6';
            mockDoc.style.backgroundImage = 'linear-gradient(#e5e5e5 1px, transparent 1px)';
        } else if (paperBg === 'blank') {
            mockDoc.classList.remove('bg-lined');
            mockDoc.style.backgroundImage = 'none';
            mockDoc.style.backgroundColor = '#ffffff';
        } else if (paperBg === 'grid') {
            mockDoc.classList.remove('bg-lined');
            mockDoc.style.backgroundColor = '#fdfaf6';
            mockDoc.style.backgroundImage = 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)';
            mockDoc.style.backgroundSize = '1.5rem 1.5rem';
        }

        // Font
        const fontStyle = document.getElementById('font-style').value;
        if (fontStyle === 'messy') {
            textElem.style.fontFamily = "'Caveat', cursive, serif";
            textElem.style.fontStyle = 'normal';
        } else if (fontStyle === 'neat') {
            textElem.style.fontFamily = "cursive, sans-serif";
            textElem.style.fontStyle = 'italic';
        } else {
            textElem.style.fontFamily = "monospace";
            textElem.style.fontStyle = 'normal';
            textElem.style.textTransform = 'uppercase';
        }
    }
});
