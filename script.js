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
            // Trigger real-time preview after extraction
            updateRealTimePreview();
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
            // Trigger real-time preview update
            updateRealTimePreview();
        });
    });

    // Imperfection Slider
    const slider = document.getElementById('imperfections');
    const sliderValue = document.getElementById('imperfection-value');
    
    slider.addEventListener('input', (e) => {
        sliderValue.textContent = `${e.target.value}%`;
    });

    // --- Real-Time Generation Logic ---
    const generateBtn = document.getElementById('generate-btn');
    const previewPlaceholder = document.getElementById('preview-placeholder');
    const previewSkeleton = document.getElementById('preview-skeleton');
    const previewResult = document.getElementById('preview-result');
    const mockDoc = previewResult.querySelector('.mock-generated-doc');
    const textElem = previewResult.querySelector('.written-text');
    
    const downloadPdfBtn = document.getElementById('btn-download-pdf');
    const downloadImgBtn = document.getElementById('btn-download-img');

    function updateRealTimePreview() {
        if (!textEditor.value.trim()) {
            previewPlaceholder.classList.remove('hidden');
            previewResult.classList.add('hidden');
            downloadPdfBtn.disabled = true;
            downloadImgBtn.disabled = true;
            return;
        }

        previewPlaceholder.classList.add('hidden');
        previewResult.classList.remove('hidden');
        previewSkeleton.classList.add('hidden');
        
        downloadPdfBtn.disabled = false;
        downloadImgBtn.disabled = false;

        // Apply text
        textElem.textContent = textEditor.value;

        // Apply Color
        const activeColor = document.querySelector('.color-swatch.active').dataset.value;
        mockDoc.classList.remove('color-blue', 'color-black');
        mockDoc.classList.add(`color-${activeColor}`);

        // Apply Background
        const paperBg = document.getElementById('paper-bg').value;
        mockDoc.classList.remove('bg-lined');
        mockDoc.style.backgroundSize = '100% 1.5rem';
        mockDoc.style.borderLeft = 'none';
        mockDoc.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        
        if (paperBg === 'classic-ruled') {
            mockDoc.style.backgroundColor = '#ffffff';
            mockDoc.style.backgroundImage = 'linear-gradient(#e5e5e5 1px, transparent 1px)';
            mockDoc.style.borderLeft = '2px solid #ffcccc'; // margin line mock
        } else if (paperBg === 'yellow-pad') {
            mockDoc.style.backgroundColor = '#fffce0';
            mockDoc.style.backgroundImage = 'linear-gradient(#a3c2e0 1px, transparent 1px)';
            mockDoc.style.borderLeft = '3px double #ffb3b3';
        } else if (paperBg === 'eng-grid') {
            mockDoc.style.backgroundColor = '#ffffff';
            mockDoc.style.backgroundImage = 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)';
            mockDoc.style.backgroundSize = '1.5rem 1.5rem';
        } else if (paperBg === 'crisp-a4') {
            mockDoc.style.backgroundColor = '#ffffff';
            mockDoc.style.backgroundImage = 'none';
        } else if (paperBg === 'backpack') {
            mockDoc.style.backgroundColor = '#fdfcfb';
            mockDoc.style.backgroundImage = 'linear-gradient(#e5e5e5 1px, transparent 1px)';
            mockDoc.style.boxShadow = 'inset -10px -10px 20px rgba(0,0,0,0.05), inset 10px 10px 20px rgba(0,0,0,0.02)';
        } else if (paperBg === 'midnight-coffee') {
            mockDoc.style.backgroundColor = '#f7f3e8';
            mockDoc.style.backgroundImage = 'radial-gradient(circle at 80% 20%, rgba(139,69,19,0.1) 0%, rgba(139,69,19,0.02) 15%, transparent 20%)';
        }

        // Apply Font
        const fontStyle = document.getElementById('font-style').value;
        
        textElem.style.fontFamily = "inherit";
        textElem.style.fontStyle = 'normal';
        textElem.style.textTransform = 'none';
        textElem.style.letterSpacing = 'normal';
        textElem.style.opacity = '1';
        textElem.style.transform = 'none';
        
        if (['cram-session', 'doctors-note', 'left-handed'].includes(fontStyle)) {
            textElem.style.fontFamily = "'Caveat', cursive, serif";
            if (fontStyle === 'doctors-note') {
                textElem.style.letterSpacing = '-1px';
                textElem.style.transform = 'rotate(-1deg)';
            } else if (fontStyle === 'left-handed') {
                textElem.style.fontStyle = 'italic';
                textElem.style.transform = 'skewX(10deg)';
            }
        } else if (['love-letter', 'fountain-pen', 'grandmas-recipe'].includes(fontStyle)) {
            textElem.style.fontFamily = "cursive, serif"; // Ideally 'Dancing Script' or similar
            textElem.style.fontStyle = 'italic';
            if (fontStyle === 'grandmas-recipe') {
                textElem.style.opacity = '0.85'; // fading ink mock
            }
        } else {
            // Neat & Readable
            if (fontStyle === 'architect') {
                textElem.style.fontFamily = "monospace";
                textElem.style.textTransform = 'uppercase';
                textElem.style.letterSpacing = '1px';
            } else if (fontStyle === 'valedictorian') {
                textElem.style.fontFamily = "sans-serif";
            } else {
                textElem.style.fontFamily = "'Comic Sans MS', cursive, sans-serif"; // Study Hall
            }
        }
    }

    // Bind Event Listeners for Real-Time UI updates
    textEditor.addEventListener('input', updateRealTimePreview);
    document.getElementById('font-style').addEventListener('change', updateRealTimePreview);
    document.getElementById('paper-bg').addEventListener('change', updateRealTimePreview);
    
    // Convert 'Generate' button to represent the backend High-Res API call
    generateBtn.addEventListener('click', () => {
        if (!textEditor.value.trim()) {
            alert('Please upload a PDF or enter some text first.');
            return;
        }

        generateBtn.disabled = true;
        const ogText = generateBtn.innerHTML;
        generateBtn.innerHTML = 'Generating High-Res PDF on Server...';

        // Simulate backend generation delay
        setTimeout(() => {
            generateBtn.disabled = false;
            generateBtn.innerHTML = ogText;
            alert("This is where we send the text and settings to the Python backend to do the real high-res rendering!");
        }, 1500);
    });

    // Initial check in case browser cached text in textarea
    if(textEditor.value.trim().length > 0) {
        updateRealTimePreview();
    }
});
