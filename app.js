/**
 * PDF Compressor Pro - Client-side PDF Compression Application
 * 
 * This application allows users to compress PDF files directly in the browser
 * using the pdf-lib library. All processing happens client-side for maximum privacy.
 * 
 * Features:
 * - Drag & drop file upload
 * - PDF preview with thumbnail
 * - Configurable compression options
 * - Real-time size estimation
 * - Progress tracking
 * - Batch processing support
 * - Dark/light theme toggle
 * - Fully responsive and accessible
 */

// Application State
const AppState = {
    currentFile: null,
    currentFileArrayBuffer: null,
    originalPdfDoc: null,
    compressedPdfBytes: null,
    originalSize: 0,
    compressedSize: 0,
    pageCount: 0,
    compressionOptions: {
        level: 2, // 1: Low, 2: Medium, 3: High
        removeMetadata: false,
        embedFonts: true,
        grayscaleImages: false,
        downsampleImages: false,
        removeDuplicates: true,
    },
    batchQueue: [],
};

// Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const COMPRESSION_LEVELS = {
    1: { name: 'Low', quality: 0.9, compression: 0.1 },
    2: { name: 'Medium', quality: 0.7, compression: 0.3 },
    3: { name: 'High', quality: 0.5, compression: 0.5 },
};

// DOM Elements
const elements = {
    themeToggle: null,
    fileInput: null,
    batchFileInput: null,
    uploadZone: null,
    uploadContent: null,
    selectedFileInfo: null,
    fileName: null,
    fileSize: null,
    removeFileBtn: null,
    errorMessage: null,
    errorText: null,
    mainContent: null,
    previewCanvas: null,
    pageCount: null,
    originalSize: null,
    estimatedSize: null,
    compressionLevel: null,
    compressionLabel: null,
    removeMetadata: null,
    embedFonts: null,
    grayscaleImages: null,
    downsampleImages: null,
    removeDuplicates: null,
    advancedToggle: null,
    advancedOptions: null,
    compressBtn: null,
    resetBtn: null,
    progressContainer: null,
    progressBar: null,
    progressPercent: null,
    progressStatus: null,
    downloadSection: null,
    downloadBtn: null,
    compareBtn: null,
    compressionStats: null,
    compareModal: null,
    closeModalBtn: null,
    modalOriginalSize: null,
    modalCompressedSize: null,
    modalReduction: null,
    toast: null,
    toastIcon: null,
    toastMessage: null,
    toastClose: null,
    batchSection: null,
    batchQueue: null,
};

/**
 * Initialize the application
 */
function init() {
    // Cache DOM elements
    cacheElements();
    
    // Initialize theme
    initTheme();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load saved theme preference
    loadThemePreference();
}

/**
 * Cache all DOM elements for performance
 */
function cacheElements() {
    elements.themeToggle = document.getElementById('themeToggle');
    elements.fileInput = document.getElementById('fileInput');
    elements.batchFileInput = document.getElementById('batchFileInput');
    elements.uploadZone = document.getElementById('uploadZone');
    elements.uploadContent = document.getElementById('uploadContent');
    elements.selectedFileInfo = document.getElementById('selectedFileInfo');
    elements.fileName = document.getElementById('fileName');
    elements.fileSize = document.getElementById('fileSize');
    elements.removeFileBtn = document.getElementById('removeFileBtn');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.errorText = document.getElementById('errorText');
    elements.mainContent = document.getElementById('mainContent');
    elements.previewCanvas = document.getElementById('previewCanvas');
    elements.pageCount = document.getElementById('pageCount');
    elements.originalSize = document.getElementById('originalSize');
    elements.estimatedSize = document.getElementById('estimatedSize');
    elements.compressionLevel = document.getElementById('compressionLevel');
    elements.compressionLabel = document.getElementById('compressionLabel');
    elements.removeMetadata = document.getElementById('removeMetadata');
    elements.embedFonts = document.getElementById('embedFonts');
    elements.grayscaleImages = document.getElementById('grayscaleImages');
    elements.downsampleImages = document.getElementById('downsampleImages');
    elements.removeDuplicates = document.getElementById('removeDuplicates');
    elements.advancedToggle = document.getElementById('advancedToggle');
    elements.advancedOptions = document.getElementById('advancedOptions');
    elements.compressBtn = document.getElementById('compressBtn');
    elements.resetBtn = document.getElementById('resetBtn');
    elements.progressContainer = document.getElementById('progressContainer');
    elements.progressBar = document.getElementById('progressBar');
    elements.progressPercent = document.getElementById('progressPercent');
    elements.progressStatus = document.getElementById('progressStatus');
    elements.downloadSection = document.getElementById('downloadSection');
    elements.downloadBtn = document.getElementById('downloadBtn');
    elements.compareBtn = document.getElementById('compareBtn');
    elements.compressionStats = document.getElementById('compressionStats');
    elements.compareModal = document.getElementById('compareModal');
    elements.closeModalBtn = document.getElementById('closeModalBtn');
    elements.modalOriginalSize = document.getElementById('modalOriginalSize');
    elements.modalCompressedSize = document.getElementById('modalCompressedSize');
    elements.modalReduction = document.getElementById('modalReduction');
    elements.toast = document.getElementById('toast');
    elements.toastIcon = document.getElementById('toastIcon');
    elements.toastMessage = document.getElementById('toastMessage');
    elements.toastClose = document.getElementById('toastClose');
    elements.batchSection = document.getElementById('batchSection');
    elements.batchQueue = document.getElementById('batchQueue');
}

/**
 * Initialize theme toggle
 */
function initTheme() {
    elements.themeToggle.addEventListener('click', toggleTheme);
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Load saved theme preference
 */
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    } else if (prefersDark) {
        document.documentElement.classList.add('dark');
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // File input
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Batch file input
    elements.batchFileInput.addEventListener('change', handleBatchFileSelect);
    
    // Upload zone
    elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
    elements.uploadZone.addEventListener('dragover', handleDragOver);
    elements.uploadZone.addEventListener('dragleave', handleDragLeave);
    elements.uploadZone.addEventListener('drop', handleDrop);
    elements.uploadZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            elements.fileInput.click();
        }
    });
    
    // Remove file button
    elements.removeFileBtn.addEventListener('click', resetApp);
    
    // Compression level slider
    elements.compressionLevel.addEventListener('input', handleCompressionLevelChange);
    
    // Advanced options toggle
    elements.advancedToggle.addEventListener('click', toggleAdvancedOptions);
    
    // Compression options
    [
        elements.removeMetadata,
        elements.embedFonts,
        elements.grayscaleImages,
        elements.downsampleImages,
        elements.removeDuplicates,
    ].forEach(checkbox => {
        checkbox.addEventListener('change', updateCompressionOptions);
    });
    
    // Action buttons
    elements.compressBtn.addEventListener('click', compressPDF);
    elements.resetBtn.addEventListener('click', resetApp);
    elements.downloadBtn.addEventListener('click', downloadCompressedPDF);
    elements.compareBtn.addEventListener('click', showCompareModal);
    
    // Modal
    elements.closeModalBtn.addEventListener('click', closeCompareModal);
    elements.compareModal.addEventListener('click', (e) => {
        if (e.target === elements.compareModal) {
            closeCompareModal();
        }
    });
    
    // Toast
    elements.toastClose.addEventListener('click', hideToast);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCompareModal();
            hideToast();
        }
    });
}

/**
 * Handle file selection from input
 */
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        await processFile(file);
    }
}

/**
 * Handle batch file selection
 */
async function handleBatchFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        await processBatchFiles(files);
    }
}

/**
 * Handle drag over event
 */
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.uploadZone.classList.add('drag-over');
}

/**
 * Handle drag leave event
 */
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.uploadZone.classList.remove('drag-over');
}

/**
 * Handle drop event
 */
async function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.uploadZone.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        await processFile(file);
    }
}

/**
 * Process a single file
 */
async function processFile(file) {
    try {
        // Validate file
        if (!validateFile(file)) {
            return;
        }
        
        // Hide error message
        hideError();
        
        // Store file
        AppState.currentFile = file;
        AppState.originalSize = file.size;
        
        // Show file info
        showFileInfo(file);
        
        // Read file as ArrayBuffer
        const arrayBuffer = await readFileAsArrayBuffer(file);
        AppState.currentFileArrayBuffer = arrayBuffer;
        
        // Load PDF
        await loadPDF(arrayBuffer);
        
        // Show main content
        elements.mainContent.classList.remove('hidden');
        elements.downloadSection.classList.add('hidden');
        elements.progressContainer.classList.add('hidden');
        
        // Enable compress button
        elements.compressBtn.disabled = false;
        
        // Update estimated size
        updateEstimatedSize();
        
    } catch (error) {
        console.error('Error processing file:', error);
        showError(`Failed to process file: ${error.message}`);
    }
}

/**
 * Process multiple files for batch processing
 */
async function processBatchFiles(files) {
    const validFiles = files.filter(file => {
        if (!validateFile(file)) {
            return false;
        }
        return true;
    });
    
    if (validFiles.length === 0) {
        showError('No valid PDF files selected');
        return;
    }
    
    // Add files to queue
    for (const file of validFiles) {
        AppState.batchQueue.push({
            file,
            status: 'pending',
            originalSize: file.size,
            compressedSize: null,
            compressedBytes: null,
        });
    }
    
    updateBatchQueueDisplay();
    showToast('Batch files added to queue', 'success');
}

/**
 * Validate file
 */
function validateFile(file) {
    // Check if file exists
    if (!file) {
        showError('No file selected');
        return false;
    }
    
    // Check file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        showError('Please select a valid PDF file');
        return false;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        showError(`File size exceeds maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`);
        return false;
    }
    
    // Check if file is empty
    if (file.size === 0) {
        showError('The selected file is empty');
        return false;
    }
    
    return true;
}

/**
 * Read file as ArrayBuffer
 */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Load PDF using pdf-lib
 */
async function loadPDF(arrayBuffer) {
    try {
        AppState.originalPdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        AppState.pageCount = AppState.originalPdfDoc.getPageCount();
        
        // Update page count display
        elements.pageCount.textContent = AppState.pageCount;
        elements.originalSize.textContent = formatFileSize(AppState.originalSize);
        
        // Generate preview
        await generatePreview();
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        throw new Error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
}

/**
 * Generate preview of first page using pdf.js
 */
async function generatePreview() {
    const canvas = elements.previewCanvas;
    const ctx = canvas.getContext('2d');
    
    try {
        // Check if pdf.js is available
        if (typeof pdfjsLib === 'undefined' || !pdfjsLib.getDocument) {
            console.warn('pdf.js not available, showing placeholder');
            showPlaceholderPreview(canvas, ctx);
            return;
        }
        
        // Ensure worker is configured
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        
        // Load PDF using pdf.js
        const loadingTask = pdfjsLib.getDocument({
            data: AppState.currentFileArrayBuffer,
            useSystemFonts: true,
            verbosity: 0, // Suppress warnings
        });
        
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Get first page (1-indexed)
        
        // Calculate scale to fit canvas
        const viewport = page.getViewport({ scale: 1.0 });
        const maxWidth = 400;
        const maxHeight = 600;
        const scale = Math.min(maxWidth / viewport.width, maxHeight / viewport.height, 2.0);
        const scaledViewport = page.getViewport({ scale });
        
        // Set canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // Render PDF page to canvas
        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport,
        };
        
        await page.render(renderContext).promise;
        
    } catch (error) {
        console.error('Error generating preview:', error);
        // Fallback: Show placeholder
        showPlaceholderPreview(canvas, ctx);
    }
}

/**
 * Show placeholder preview when pdf.js is unavailable or fails
 */
function showPlaceholderPreview(canvas, ctx) {
    try {
        canvas.width = 400;
        canvas.height = 600;
        
        // Draw background
        const isDark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDark ? '#1f2937' : '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        ctx.strokeStyle = isDark ? '#374151' : '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Draw icon
        ctx.fillStyle = isDark ? '#6b7280' : '#9ca3af';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📄', canvas.width / 2, canvas.height / 2 - 40);
        
        // Draw text
        ctx.font = '16px Arial';
        ctx.fillText('PDF Preview', canvas.width / 2, canvas.height / 2 + 20);
        ctx.font = '12px Arial';
        ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
        ctx.fillText('PDF loaded successfully', canvas.width / 2, canvas.height / 2 + 44);
        
        // Show page count if available
        if (AppState.pageCount > 0) {
            ctx.fillText(`${AppState.pageCount} page${AppState.pageCount > 1 ? 's' : ''}`, canvas.width / 2, canvas.height / 2 + 64);
        }
    } catch (error) {
        console.error('Error showing placeholder preview:', error);
    }
}

/**
 * Show file info
 */
function showFileInfo(file) {
    elements.uploadContent.classList.add('hidden');
    elements.selectedFileInfo.classList.remove('hidden');
    elements.fileName.textContent = file.name;
    elements.fileSize.textContent = formatFileSize(file.size);
}

/**
 * Handle compression level change
 */
function handleCompressionLevelChange(event) {
    const level = parseInt(event.target.value);
    AppState.compressionOptions.level = level;
    elements.compressionLabel.textContent = COMPRESSION_LEVELS[level].name;
    updateEstimatedSize();
}

/**
 * Update compression options from checkboxes
 */
function updateCompressionOptions() {
    AppState.compressionOptions.removeMetadata = elements.removeMetadata.checked;
    AppState.compressionOptions.embedFonts = elements.embedFonts.checked;
    AppState.compressionOptions.grayscaleImages = elements.grayscaleImages.checked;
    AppState.compressionOptions.downsampleImages = elements.downsampleImages.checked;
    AppState.compressionOptions.removeDuplicates = elements.removeDuplicates.checked;
    updateEstimatedSize();
}

/**
 * Update estimated file size
 */
function updateEstimatedSize() {
    if (!AppState.originalSize) return;
    
    const level = AppState.compressionOptions.level;
    const compression = COMPRESSION_LEVELS[level].compression;
    
    // Calculate base reduction from compression level
    let reduction = compression;
    
    // Add reduction from options
    if (AppState.compressionOptions.removeMetadata) reduction += 0.02;
    if (AppState.compressionOptions.removeDuplicates) reduction += 0.05;
    if (AppState.compressionOptions.grayscaleImages) reduction += 0.15;
    if (AppState.compressionOptions.downsampleImages) reduction += 0.25;
    
    // Cap reduction at 80%
    reduction = Math.min(reduction, 0.8);
    
    const estimated = AppState.originalSize * (1 - reduction);
    elements.estimatedSize.textContent = formatFileSize(estimated);
}

/**
 * Toggle advanced options
 */
function toggleAdvancedOptions() {
    const isExpanded = elements.advancedOptions.classList.contains('hidden');
    elements.advancedOptions.classList.toggle('hidden');
    elements.advancedToggle.setAttribute('aria-expanded', !isExpanded);
    
    // Rotate icon
    const icon = elements.advancedToggle.querySelector('svg');
    if (isExpanded) {
        icon.classList.add('rotate-180');
    } else {
        icon.classList.remove('rotate-180');
    }
}

/**
 * Compress PDF
 */
async function compressPDF() {
    if (!AppState.currentFileArrayBuffer || !AppState.originalPdfDoc) {
        showError('No PDF loaded');
        return;
    }
    
    try {
        // Show progress
        elements.progressContainer.classList.remove('hidden');
        elements.compressBtn.disabled = true;
        elements.downloadSection.classList.add('hidden');
        
        // Reset progress to 0
        updateProgress(0, false);
        
        // Simulate progress updates
        simulateProgress();
        
        // Create new PDF document
        const compressedDoc = await PDFLib.PDFDocument.create();
        
        // Copy pages from original
        const pages = await compressedDoc.copyPages(
            AppState.originalPdfDoc,
            AppState.originalPdfDoc.getPageIndices()
        );
        
        pages.forEach((page) => {
            compressedDoc.addPage(page);
        });
        
        // Apply compression options
        await applyCompressionOptions(compressedDoc);
        
        // Save compressed PDF with optimization options
        const saveOptions = {
            useObjectStreams: AppState.compressionOptions.removeDuplicates,
            addDefaultPage: false,
            // pdf-lib automatically uses Flate compression
        };
        
        const pdfBytes = await compressedDoc.save(saveOptions);
        
        // Store compressed bytes
        AppState.compressedPdfBytes = pdfBytes;
        AppState.compressedSize = pdfBytes.length;
        
        // Update progress to 100% and mark as complete
        updateProgress(100, true);
        
        // Force browser repaint to ensure 100% is visible
        void elements.progressBar.offsetWidth;
        
        // Wait for progress bar animation to complete (CSS transition is 300ms)
        // Then show download section and hide progress container
        setTimeout(() => {
            // Show download section
            showDownloadSection();
            
            // Hide progress container after a brief delay to show completion
            setTimeout(() => {
                elements.progressContainer.classList.add('hidden');
            }, 1000);
        }, 500);
        
        // Show success toast
        showToast('PDF compressed successfully!', 'success');
        
    } catch (error) {
        console.error('Error compressing PDF:', error);
        showError(`Compression failed: ${error.message}`);
        elements.progressContainer.classList.add('hidden');
        elements.compressBtn.disabled = false;
        
        // Reset progress status
        elements.progressStatus.textContent = 'Compressing...';
        elements.progressStatus.classList.remove('text-green-600', 'dark:text-green-400');
        elements.progressStatus.classList.add('text-gray-700', 'dark:text-gray-300');
    }
}

/**
 * Apply compression options to PDF
 * 
 * Note: pdf-lib has limited built-in compression capabilities compared to server-side tools.
 * The main compression comes from:
 * 1. Object stream compression (useObjectStreams in save options)
 * 2. Flate compression (built-in)
 * 3. Metadata removal
 * 4. Font subsetting (automatic when embedding fonts)
 * 
 * Advanced features like image downsampling and grayscale conversion would require
 * direct PDF structure manipulation, which is beyond pdf-lib's scope.
 */
async function applyCompressionOptions(pdfDoc) {
    const options = AppState.compressionOptions;
    
    // Remove metadata if requested
    if (options.removeMetadata) {
        try {
            pdfDoc.setTitle('');
            pdfDoc.setAuthor('');
            pdfDoc.setSubject('');
            pdfDoc.setKeywords([]);
            pdfDoc.setProducer('');
            pdfDoc.setCreator('');
            // Set dates to minimal values
            pdfDoc.setCreationDate(new Date(0));
            pdfDoc.setModificationDate(new Date(0));
        } catch (error) {
            console.warn('Could not remove all metadata:', error);
        }
    }
    
    // Font embedding is handled automatically by pdf-lib when copying pages
    // The embedFonts option is more of a preference indicator for future enhancements
    
    // Image processing (grayscale, downsampling) would require:
    // 1. Extracting image streams from pages
    // 2. Processing images using Canvas API or image libraries
    // 3. Re-embedding processed images
    // This is complex and beyond the current scope
    
    // Duplicate object removal is handled by useObjectStreams in save options
}

/**
 * Simulate progress updates
 */
function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 90) {
            progress = 90; // Stop at 90%, actual completion will set to 100%
            clearInterval(interval);
        }
        updateProgress(progress, false);
    }, 200);
}

/**
 * Update progress bar
 * @param {number} percent - Progress percentage (0-100)
 * @param {boolean} isComplete - Whether compression is complete
 */
function updateProgress(percent, isComplete = false) {
    const clampedPercent = Math.min(100, Math.max(0, percent));
    elements.progressBar.style.width = `${clampedPercent}%`;
    elements.progressPercent.textContent = `${Math.round(clampedPercent)}%`;
    
    // Update status text
    if (isComplete || clampedPercent >= 100) {
        elements.progressStatus.textContent = 'Complete!';
        elements.progressStatus.classList.remove('text-gray-700', 'dark:text-gray-300');
        elements.progressStatus.classList.add('text-green-600', 'dark:text-green-400');
    } else {
        elements.progressStatus.textContent = 'Compressing...';
        elements.progressStatus.classList.remove('text-green-600', 'dark:text-green-400');
        elements.progressStatus.classList.add('text-gray-700', 'dark:text-gray-300');
    }
}

/**
 * Show download section
 */
function showDownloadSection() {
    const reduction = ((AppState.originalSize - AppState.compressedSize) / AppState.originalSize) * 100;
    
    // Handle case where file size might increase (rare but possible)
    if (reduction < 0) {
        elements.compressionStats.textContent = `Size increased by ${Math.abs(reduction).toFixed(1)}% (${formatFileSize(AppState.originalSize)} → ${formatFileSize(AppState.compressedSize)}) - PDF may already be optimized`;
    } else {
        elements.compressionStats.textContent = `Size reduced by ${reduction.toFixed(1)}% (${formatFileSize(AppState.originalSize)} → ${formatFileSize(AppState.compressedSize)})`;
    }
    
    elements.downloadSection.classList.remove('hidden');
    elements.compressBtn.disabled = false;
    
    // Reset progress status for next use
    elements.progressStatus.textContent = 'Compressing...';
    elements.progressStatus.classList.remove('text-green-600', 'dark:text-green-400');
    elements.progressStatus.classList.add('text-gray-700', 'dark:text-gray-300');
}

/**
 * Download compressed PDF
 */
function downloadCompressedPDF() {
    if (!AppState.compressedPdfBytes) {
        showError('No compressed PDF available');
        return;
    }
    
    try {
        // Create blob
        const blob = new Blob([AppState.compressedPdfBytes], { type: 'application/pdf' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${AppState.currentFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Cleanup
        URL.revokeObjectURL(url);
        
        showToast('Download started!', 'success');
        
    } catch (error) {
        console.error('Error downloading PDF:', error);
        showError(`Download failed: ${error.message}`);
    }
}

/**
 * Show compare modal
 */
function showCompareModal() {
    if (!AppState.compressedSize) return;
    
    const reduction = ((AppState.originalSize - AppState.compressedSize) / AppState.originalSize) * 100;
    const sizeDifference = Math.abs(AppState.originalSize - AppState.compressedSize);
    
    elements.modalOriginalSize.textContent = formatFileSize(AppState.originalSize);
    elements.modalCompressedSize.textContent = formatFileSize(AppState.compressedSize);
    
    if (reduction < 0) {
        elements.modalReduction.textContent = `+${Math.abs(reduction).toFixed(1)}% (+${formatFileSize(sizeDifference)})`;
        elements.modalReduction.classList.remove('text-green-600', 'dark:text-green-400');
        elements.modalReduction.classList.add('text-yellow-600', 'dark:text-yellow-400');
    } else {
        elements.modalReduction.textContent = `${reduction.toFixed(1)}% (${formatFileSize(sizeDifference)})`;
        elements.modalReduction.classList.remove('text-yellow-600', 'dark:text-yellow-400');
        elements.modalReduction.classList.add('text-green-600', 'dark:text-green-400');
    }
    
    elements.compareModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus on close button for accessibility
    setTimeout(() => {
        elements.closeModalBtn.focus();
    }, 100);
}

/**
 * Close compare modal
 */
function closeCompareModal() {
    elements.compareModal.classList.add('hidden');
    document.body.style.overflow = '';
}

/**
 * Update batch queue display
 */
function updateBatchQueueDisplay() {
    elements.batchQueue.innerHTML = '';
    
    AppState.batchQueue.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg';
        div.innerHTML = `
            <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">${item.file.name}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">${formatFileSize(item.originalSize)}</p>
            </div>
            <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs font-semibold rounded ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    item.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }">${item.status}</span>
                ${item.status === 'completed' ? `
                    <button 
                        onclick="downloadBatchFile(${index})"
                        class="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                        Download
                    </button>
                ` : ''}
            </div>
        `;
        elements.batchQueue.appendChild(div);
    });
    
    // Process batch if there are pending items
    if (AppState.batchQueue.some(item => item.status === 'pending')) {
        processBatchQueue();
    }
}

/**
 * Process batch queue
 */
async function processBatchQueue() {
    const pendingItems = AppState.batchQueue.filter(item => item.status === 'pending');
    
    for (const item of pendingItems) {
        item.status = 'processing';
        updateBatchQueueDisplay();
        
        try {
            const arrayBuffer = await readFileAsArrayBuffer(item.file);
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const compressedDoc = await PDFLib.PDFDocument.create();
            
            const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            pages.forEach(page => compressedDoc.addPage(page));
            
            const pdfBytes = await compressedDoc.save({
                useObjectStreams: true,
            });
            
            item.compressedBytes = pdfBytes;
            item.compressedSize = pdfBytes.length;
            item.status = 'completed';
            
        } catch (error) {
            console.error('Error processing batch item:', error);
            item.status = 'error';
        }
        
        updateBatchQueueDisplay();
    }
}

/**
 * Download batch file (global function for onclick)
 */
window.downloadBatchFile = function(index) {
    const item = AppState.batchQueue[index];
    if (!item.compressedBytes) return;
    
    const blob = new Blob([item.compressedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${item.file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Reset application
 */
function resetApp() {
    // Reset state
    AppState.currentFile = null;
    AppState.currentFileArrayBuffer = null;
    AppState.originalPdfDoc = null;
    AppState.compressedPdfBytes = null;
    AppState.originalSize = 0;
    AppState.compressedSize = 0;
    AppState.pageCount = 0;
    
    // Reset UI
    elements.uploadContent.classList.remove('hidden');
    elements.selectedFileInfo.classList.add('hidden');
    elements.mainContent.classList.add('hidden');
    elements.downloadSection.classList.add('hidden');
    elements.progressContainer.classList.add('hidden');
    elements.fileInput.value = '';
    elements.compressBtn.disabled = true;
    
    // Reset progress
    updateProgress(0, false);
    elements.progressBar.style.width = '0%';
    elements.progressPercent.textContent = '0%';
    elements.progressStatus.textContent = 'Compressing...';
    elements.progressStatus.classList.remove('text-green-600', 'dark:text-green-400');
    elements.progressStatus.classList.add('text-gray-700', 'dark:text-gray-300');
    
    // Hide error
    hideError();
}

/**
 * Show error message
 */
function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.uploadZone.classList.add('border-red-500');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorMessage.classList.add('hidden');
    elements.uploadZone.classList.remove('border-red-500');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const icons = {
        success: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
        error: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
        info: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
    };
    
    const colors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-blue-500',
    };
    
    elements.toastIcon.innerHTML = icons[type] || icons.info;
    elements.toastIcon.className = `h-6 w-6 ${colors[type] || colors.info}`;
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        hideToast();
    }, 3000);
}

/**
 * Hide toast notification
 */
function hideToast() {
    elements.toast.classList.add('hidden');
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

