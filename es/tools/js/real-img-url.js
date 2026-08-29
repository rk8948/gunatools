// date to fixed : 21-08-2026 1:01AM
// below protection js — only checks one thing: the owner meta tag.
// No hidden div, no second element, no visible badge.


(function() {
    const _dec = (s) => atob(s);

    // Scrambled credentials — only the meta tag's name + content matter now.
    const _K1 = _dec('b3duZXItYWEwMTA1'); // owner-aa0105
    const _K2 = _dec('QGFhcmlmYWxhbTAxMDU='); // @aarifalam0105

    const _m = document.querySelector(`meta[name="${_K1}"]`);
    const _v = _m && _m.getAttribute('content') === _K2;

    if (!_v) {
        // --- INVISIBLE LOCKDOWN ---
        // Force the UI to be non-interactive without changing its look
        const _s = document.createElement('style');
        _s.innerHTML = `* { pointer-events: none !important; user-select: none !important; cursor: default !important; }`;
        document.head.appendChild(_s);

        // Block all event propagation
        const _kill = (e) => { e.preventDefault(); e.stopImmediatePropagation(); };
        ['click', 'keydown', 'touchstart', 'contextmenu', 'copy'].forEach(v => {
            document.addEventListener(v, _kill, true);
        });

        // Break the rest of the main JS from executing
        window.stop();
        throw new Error();
    }
    // AUTHORIZED — tag matched, nothing else happens, page runs normally.
})();


// above protection js 
//best and good - save with biggner


// DOM Elements
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const uploadBtn = document.getElementById('uploadBtn');
const imagePreviews = document.getElementById('imagePreviews');
const resultContainer = document.getElementById('resultContainer');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeModal = document.getElementById('closeModal');
const urlHistory = document.getElementById('urlHistory');
const progressBar = document.getElementById('progressBar');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// API Configuration — Firebase Worker
// ⚠️ Confirm this matches the Worker for THIS language page
// (img-to-url-hi for the Hindi site, img-to-url-pt for the Portuguese site, etc.)
const WORKER_URL = 'https://img-to-url-pt.aarifbabu8948.workers.dev';

// User limits — field names MUST match worker response
let userLimits = {
    dailyRem:    0,
    dailyMax:    0,
    monthlyRem:  0,
    monthlyMax:  0,
    resetAt:     ''
};

// Store selected files
let selectedFiles = [];
let isWorkerConnected = false;

// ============================================================
// IMAGE COMPRESSION + FORMAT CONVERSION — PNG & JPG only
// ============================================================
// Runs automatically right before upload.
//
// Default (auto-convert ON): PNG and JPG are BOTH always
// re-encoded as JPEG at a strong-but-clean quality — this is the
// normal, silent behavior most users see.
//
// If the user taps "Lock Format" (visible toggle button, injected
// below): PNG stays PNG — untouched, no re-encode, no conversion.
// JPG files are still compressed either way (that's a re-encode,
// not a format change, so the lock doesn't affect it).
//
// Rules:
//   - PNG transparency is filled with white before any JPEG
//     conversion (JPEG has no alpha channel).
//   - Anything else (GIF, WebP, etc.) is left completely untouched.
//   - If the JPEG encode genuinely fails, the original file is used.
const COMPRESS = {
    enabled: true,
    jpegQuality: 0.80,       // good visual quality, strong size cut — applied to every PNG/JPG
    maxDimension: 3000       // safety cap so huge phone photos don't stress the canvas; rarely triggers
};

// Format-lock state — toggled by the injected "Lock Format" button.
// false (default) = auto-convert PNG -> JPG. true = keep PNG as PNG.
let formatLocked = false;

function icLoadImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => resolve({ img, url });
        img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
        img.src = url;
    });
}

function icDrawToCanvas(img) {
    let { width, height } = img;
    const scale = Math.min(1, COMPRESS.maxDimension / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // JPEG has no alpha channel — fill white first so any
    // transparent PNG areas don't turn black on conversion.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
}

function icCanvasToBlob(canvas, mime, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Canvas encode failed')),
            mime,
            quality
        );
    });
}

async function compressImageFile(file) {
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
    const isPng  = file.type === 'image/png';

    if (!COMPRESS.enabled || (!isJpeg && !isPng)) return file; // untouched formats

    if (formatLocked) {
        console.log(`[compress] ${file.name} — locked, uploading as-is`);
        return file; // user explicitly locked — original file goes untouched, no compression, no conversion
    }

    let objectUrl;
    try {
        const { img, url } = await icLoadImage(file);
        objectUrl = url;
        const canvas = icDrawToCanvas(img);

        const outBlob = await icCanvasToBlob(canvas, 'image/jpeg', COMPRESS.jpegQuality);
        const outName = file.name.replace(/\.(png|jpe?g)$/i, '') + '.jpg';

        // Always use the JPG conversion — this mode is "always convert
        // to JPG, no exceptions", so we do NOT fall back to the
        // original just because a flat-color PNG happened to be
        // smaller as PNG than as JPEG (common for screenshots/icons).
        // The only fallback is a genuine encode failure (outBlob null).
        if (!outBlob) return file;

        console.log(`[compress] ${file.name} (${file.type}, ${(file.size/1024).toFixed(0)}KB) -> ${outName} (image/jpeg, ${(outBlob.size/1024).toFixed(0)}KB)`);
        return new File([outBlob], outName, { type: 'image/jpeg', lastModified: Date.now() });
    } catch (e) {
        console.warn('Compression skipped for', file.name, e);
        return file; // fail-safe — upload original if anything goes wrong
    } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Image to URL tool initializing...');
    
    await loadWorkerConfig();
    
    // Show limits for 5 seconds
    setTimeout(() => {
        showLimitsToast();
    }, 1000);
    
    loadHistory();
    addAnimations();
    addScrollToTopButton();
    addFormatLockButton();
    setupEventListeners();
});

// ── FORMAT LOCK TOGGLE — compact icon-only button, doesn't stretch the row ──
function addFormatLockButton() {
    const container = document.querySelector('.button-group') || uploadBtn?.parentNode;
    if (!container) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'formatLockBtn';
    // No .btn class on purpose — .btn is flex:1 and full-width on mobile,
    // which is what made this stretch the row. This button is a fixed-size
    // icon circle instead, sized like the existing .action-btn icons.
    Object.assign(btn.style, {
        flex: '0 0 auto',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--primary, #4361ee)',
        background: 'transparent',
        color: 'var(--primary, #4361ee)',
        fontSize: '16px',
        cursor: 'pointer',
        transition: '.3s',
        padding: '0'
    });

    function render() {
        btn.innerHTML = formatLocked
            ? '<i class="fas fa-lock"></i>'
            : '<i class="fas fa-lock-open"></i>';

        // Desktop hover tooltip — explains what the feature does either way.
        btn.title = formatLocked
            ? 'Optimise = Compress + Convert — Locked (image keeps its original format & quality). Click to unlock.'
            : 'Optimise = Compress + Convert (image → JPG, smaller size). Click to lock and keep the original format.';

        if (formatLocked) {
            btn.style.background = 'var(--primary, #4361ee)';
            btn.style.color = '#fff';
        } else {
            btn.style.background = 'transparent';
            btn.style.color = 'var(--primary, #4361ee)';
        }
    }

    btn.addEventListener('click', () => {
        formatLocked = !formatLocked;
        render();
        // Plain-language notify so the user knows exactly what just changed.
        showToast(
            formatLocked
                ? '🔒 Locked — your image will upload as-is (original format & quality, no compression)'
                : '✅ Unlocked — images will auto-optimise (compress + convert) again',
            'info'
        );
    });

    render();
    container.appendChild(btn);
}

// Setup event listeners
function setupEventListeners() {
    // File input
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Upload button
    uploadBtn.addEventListener('click', uploadImages);

    // History modal
    historyBtn.addEventListener('click', () => {
        historyModal.style.display = 'flex';
        loadHistory();
    });

    closeModal.addEventListener('click', () => {
        historyModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });
}

// Load config from worker — Firebase stores persistent user limits
async function loadWorkerConfig() {
    try {
        const response = await fetch(`${WORKER_URL}/config`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const config = await response.json();
        
        // Get limits from worker — matches Firebase worker response fields
        if (config.limits) {
            userLimits = {
                dailyRem:    config.limits.dailyRem    || 0,
                dailyMax:    config.limits.dailyMax    || 0,
                monthlyRem:  config.limits.monthlyRem  || 0,
                monthlyMax:  config.limits.monthlyMax  || 0,
                resetAt:     config.limits.resetAt     || ''
            };
        }
        
        isWorkerConnected = true;
        console.log('✅ Worker connected successfully');
        enableUpload();
        showUploadStats();
        
    } catch (error) {
        console.error('❌ Worker connection failed:', error);
        showToast('Cannot connect to server. Please refresh.', 'error');
        disableUpload();
    }
}

// Enable upload
function enableUpload() {
    uploadBtn.disabled = false;
    uploadBtn.style.opacity = '1';
    uploadBtn.style.cursor = 'pointer';
    uploadBtn.title = '';
    
    fileInput.disabled = false;
    fileInput.style.opacity = '1';
    
    dropArea.style.opacity = '1';
    dropArea.style.pointerEvents = 'auto';
    dropArea.title = '';
}

// Disable upload
function disableUpload() {
    uploadBtn.disabled = true;
    uploadBtn.style.opacity = '0.5';
    uploadBtn.style.cursor = 'not-allowed';
    uploadBtn.title = 'Server connection failed';
    
    fileInput.disabled = true;
    fileInput.style.opacity = '0.5';
    
    dropArea.style.opacity = '0.5';
    dropArea.style.pointerEvents = 'none';
    dropArea.title = 'Server connection failed';
    
    imagePreviews.innerHTML = `
        <div style="text-align: center; color: #e63946; padding: 20px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 10px;"></i>
            <p>Cannot connect to server. Please refresh.</p>
            <p style="font-size: 12px; margin-top: 10px;">Contact @AARIFALAM0105</p>
        </div>
    `;
}

// Show limits toast on page load
function showLimitsToast() {
    if (userLimits.dailyMax === 0) return;

    const el = document.createElement('div');
    el.id = 'limitsToast';

    const resetLine = userLimits.resetAt
        ? `<div style="font-size:11px;color:#94a3b8;margin-top:6px;">🕛 Resets: ${userLimits.resetAt}</div>`
        : '';

    el.innerHTML = `
        <div style="background:#1e293b;color:white;padding:16px;border-radius:12px;
                    box-shadow:0 10px 25px rgba(0,0,0,.2);border-left:4px solid #4361ee;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span>📸 Daily:</span>
                <span style="color:${userLimits.dailyRem < 3 ? '#ff6b6b' : '#4ade80'};font-weight:bold;">
                    ${userLimits.dailyRem}/${userLimits.dailyMax} left
                </span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span>📅 Monthly:</span>
                <span style="color:${userLimits.monthlyRem < 20 ? '#ff6b6b' : '#4ade80'};font-weight:bold;">
                    ${userLimits.monthlyRem}/${userLimits.monthlyMax} left
                </span>
            </div>
            ${resetLine}
        </div>`;

    el.style.cssText = `position:fixed;top:20px;right:20px;z-index:9999;animation:slideIn .3s ease;`;
    document.body.appendChild(el);

    setTimeout(() => {
        el.style.animation = 'slideOut .3s ease';
        setTimeout(() => el.remove(), 300);
    }, 5000);
}

// Show upload stats in page
function showUploadStats() {
    if (userLimits.dailyMax === 0) return;

    const existing = document.getElementById('uploadStats');
    if (existing) existing.remove();

    const dailyUsed   = userLimits.dailyMax   - userLimits.dailyRem;
    const monthlyUsed = userLimits.monthlyMax - userLimits.monthlyRem;

    const div = document.createElement('div');
    div.id = 'uploadStats';

    // Warn if daily limit is fully hit
    const limitHit = userLimits.dailyRem === 0;
    const resetLine = limitHit && userLimits.resetAt
        ? `<span style="color:#ef4444;font-size:12px;display:block;margin-top:6px;">
               ⛔ Today's limit reached. Resets at midnight UTC — ${userLimits.resetAt}
           </span>`
        : '';

    div.innerHTML = `
        <div style="background:#f8f9fa;border-radius:8px;padding:12px;margin:15px 0;
                    border-left:4px solid #4361ee;font-size:14px;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                <span>
                    <i class="fas fa-cloud-upload-alt" style="color:#4361ee;"></i>
                    Daily: <strong>${dailyUsed}/${userLimits.dailyMax}</strong> used
                    &nbsp;·&nbsp; <strong style="color:${userLimits.dailyRem < 3 ? '#ef4444' : '#10b981'};">
                        ${userLimits.dailyRem} left
                    </strong>
                </span>
                <span>
                    <i class="fas fa-calendar-alt" style="color:#4361ee;"></i>
                    Monthly: <strong>${monthlyUsed}/${userLimits.monthlyMax}</strong> used
                </span>
            </div>
            ${resetLine}
        </div>`;

    const pb = document.getElementById('progressBar');
    if (pb && pb.parentNode) pb.parentNode.insertBefore(div, pb.nextSibling);
}

// Handle file selection
function handleFiles(files) {
    if (!files || files.length === 0) return;

    if (!isWorkerConnected) {
        showToast('Server not connected', 'error');
        return;
    }

    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (newFiles.length === 0) {
        showToast('Please select image files only', 'error');
        return;
    }

    if (userLimits.dailyRem === 0) {
        showToast(`Today's limit reached. Resets: ${userLimits.resetAt || 'midnight UTC'}`, 'error');
        return;
    }

    const total = selectedFiles.length + newFiles.length;
    if (total > userLimits.dailyRem) {
        showToast(`Only ${userLimits.dailyRem} slot(s) left today. You have ${selectedFiles.length} selected.`, 'warning');
        return;
    }

    selectedFiles = [...selectedFiles, ...newFiles];
    displayPreviews();
    showToast(`${newFiles.length} image(s) added. Total: ${selectedFiles.length}`, 'success');
}

// Display previews
function displayPreviews() {
    imagePreviews.innerHTML = '';
    if (selectedFiles.length === 0) {
        imagePreviews.innerHTML = '<div class="empty-preview">No images selected</div>';
        return;
    }
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.setAttribute('data-index', index);
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <span class="preview-badge">${index + 1}</span>
                <button class="remove-preview-btn" onclick="removeSelectedImage(${index})" title="Remove image">
                    <i class="fas fa-times"></i>
                </button>`;
            imagePreviews.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

window.removeSelectedImage = function(index) {
    selectedFiles.splice(index, 1);
    displayPreviews();
    showToast('Image removed', 'success');
};

// Upload images — POST to worker /upload endpoint
async function uploadImages() {
    if (!isWorkerConnected) { showToast('Server not connected', 'error'); return; }
    if (!selectedFiles.length) { showToast('Select images first', 'error'); return; }

    if (userLimits.dailyRem === 0) {
        showToast(`Today's limit reached. Resets: ${userLimits.resetAt || 'midnight UTC'}`, 'error');
        return;
    }
    if (selectedFiles.length > userLimits.dailyRem) {
        showToast(`Only ${userLimits.dailyRem} upload(s) left today`, 'error');
        return;
    }
    if (selectedFiles.length > userLimits.monthlyRem) {
        showToast(`Only ${userLimits.monthlyRem} upload(s) left this month`, 'error');
        return;
    }

    uploadBtn.disabled = true;
    uploadBtn.classList.add('processing');
    progressBar.style.width = '0%';
    resultContainer.innerHTML = '';

    try {
        progressBar.style.width = '15%';

        // Silent compression pass — PNG/JPG only, everything else passes
        // through untouched. User never sees this step; it just makes
        // the upload that follows lighter.
        const filesToUpload = await Promise.all(selectedFiles.map(compressImageFile));

        progressBar.style.width = '30%';

        // Build single FormData with all files
        const fd = new FormData();
        filesToUpload.forEach(file => fd.append('file', file));

        const resp = await fetch(`${WORKER_URL}/upload`, {
            method: 'POST',
            mode: 'cors',
            body: fd
            // No Content-Type header — browser sets multipart boundary automatically
        });

        progressBar.style.width = '80%';

        const data = await resp.json();

        progressBar.style.width = '100%';

        if (!resp.ok || !data.success) {
            // Worker rejected — could be rate limit, abuse, or error
            const msg = data.error || 'Upload failed';

            // Show reset time if daily limit is hit
            if (resp.status === 429 && data.limits?.resetAt) {
                showToast(`${msg} — Resets: ${data.limits.resetAt}`, 'error');
            } else {
                showToast(msg, 'error');
            }

            // Update limits from error response if provided
            if (data.limits) updateLimitsFromResponse(data.limits);

            uploadBtn.disabled = false;
            uploadBtn.classList.remove('processing');
            return;
        }

        // Success — update local limits from worker response
        if (data.limits) updateLimitsFromResponse(data.limits);

        // Save to localStorage history
        const imageData = (data.uploadedImages || []).map(img => ({
            url:       img.url,
            fileName:  img.originalFilename || 'image',
            publicId:  img.publicId,
            timestamp: new Date().toISOString()
        }));
        if (imageData.length > 0) saveToHistory(imageData);

        // Display results
        displayResults(data.uploadedImages || [], selectedFiles);

        // Update stats bar
        showUploadStats();

        // Reset selection
        selectedFiles = [];
        imagePreviews.innerHTML = '';

        setTimeout(() => { scrollToResults(); }, 500);

    } catch (err) {
        console.error('Upload error:', err);
        showToast('Upload failed. Check connection and try again.', 'error');
        progressBar.style.width = '0%';
    }

    uploadBtn.disabled = false;
    uploadBtn.classList.remove('processing');
}

// Update limits from worker response
function updateLimitsFromResponse(limits) {
    if (limits.dailyRem    !== undefined) userLimits.dailyRem    = limits.dailyRem;
    if (limits.dailyMax    !== undefined) userLimits.dailyMax    = limits.dailyMax;
    if (limits.monthlyRem  !== undefined) userLimits.monthlyRem  = limits.monthlyRem;
    if (limits.monthlyMax  !== undefined) userLimits.monthlyMax  = limits.monthlyMax;
    if (limits.resetAt     !== undefined) userLimits.resetAt     = limits.resetAt;
    showUploadStats();
}

// Scroll to results
function scrollToResults() {
    const card = document.querySelector('.main-content .card:nth-child(2)');
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        card.style.transition = 'all .5s ease';
        card.style.boxShadow  = '0 0 0 3px rgba(67,97,238,.5)';
        card.style.transform  = 'scale(1.01)';
        setTimeout(() => {
            card.style.boxShadow = '';
            card.style.transform = '';
        }, 1500);
    }
}

// Display results
function displayResults(uploadedImages, originalFiles) {
    resultContainer.innerHTML = '';

    const successCount = uploadedImages.length;
    if (successCount > 0) showToast(`✅ ${successCount} image(s) uploaded!`, 'success');

    uploadedImages.forEach(img => {
        const uploadDate = new Date();
        resultContainer.innerHTML += `
            <div class="url-item">
                <img src="${img.url}" alt="Uploaded" loading="lazy">
                <div class="url-info">
                    <strong>${escapeHtml(img.originalFilename || 'image')}</strong>
                    <p class="url-text">${img.url}</p>
                    <small style="color:#94a3b8;">
                        <i class="far fa-clock"></i> Uploaded: ${uploadDate.toLocaleString()}
                    </small>
                </div>
                <div class="url-actions">
                    <button class="action-btn copy-btn" onclick="copyUrl('${img.url}', this)">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="removeFromHistory('${img.publicId}', '${img.url}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
    });
}

// Copy URL
window.copyUrl = function(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#10b981';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
        showToast('URL copied!', 'success');
    }).catch(() => { showToast('Failed to copy', 'error'); });
};

// Remove from history
window.removeFromHistory = async function(publicId, url) {
    if (!confirm('Remove this image from your history?')) return;

    let history = JSON.parse(localStorage.getItem('imageUrls')) || [];
    history = history.filter(item => item.url !== url);
    localStorage.setItem('imageUrls', JSON.stringify(history));

    try {
        let backup = JSON.parse(sessionStorage.getItem('imageUrls_backup')) || [];
        backup = backup.filter(item => item.url !== url);
        sessionStorage.setItem('imageUrls_backup', JSON.stringify(backup));
    } catch(e) {}

    document.querySelectorAll('.url-item').forEach(item => {
        const link = item.querySelector('.url-text');
        if (link && link.textContent === url) item.remove();
    });

    loadHistory();
    showToast('Removed from history', 'success');
};

// Save to history with backup
function saveToHistory(images) {
    let history = JSON.parse(localStorage.getItem('imageUrls')) || [];
    
    images.forEach(img => {
        if (!history.some(item => item.url === img.url)) {
            history.unshift({
                url: img.url,
                fileName: img.fileName,
                publicId: img.publicId,
                timestamp: img.timestamp
            });
        }
    });
    
    // Keep last 400
    history = history.slice(0, 400);
    
    // Save to main storage
    localStorage.setItem('imageUrls', JSON.stringify(history));
    
    // Save backup in sessionStorage
    try {
        sessionStorage.setItem('imageUrls_backup', JSON.stringify(history.slice(0, 150)));
    } catch(e) {
        console.log('Backup save failed:', e);
    }
}

// Load history with backup recovery
function loadHistory() {
    // Try main storage first
    let history = JSON.parse(localStorage.getItem('imageUrls')) || [];
    
    // If main is empty, try backup
    if (history.length === 0) {
        const backup = sessionStorage.getItem('imageUrls_backup');
        if (backup) {
            try {
                history = JSON.parse(backup);
                // Restore to main storage
                localStorage.setItem('imageUrls', JSON.stringify(history));
                console.log('✅ History recovered from backup!');
                showToast('History restored from backup!', 'success');
            } catch(e) {
                console.log('Backup recovery failed:', e);
            }
        }
    }
    
    urlHistory.innerHTML = '';
    
    if (!history.length) {
        urlHistory.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>No history yet</p></div>';
        return;
    }
    
    history.forEach(item => {
        const uploadDate = new Date(item.timestamp);
        
        urlHistory.innerHTML += `
            <div class="url-item">
                <img src="${item.url}" alt="History" loading="lazy">
                <div class="url-info">
                    <strong>${escapeHtml(item.fileName)}</strong>
                    <p><i class="far fa-clock"></i> ${uploadDate.toLocaleString()}</p>
                </div>
                <div class="url-actions">
                    <button class="action-btn copy-btn" onclick="copyUrl('${item.url}', this)">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="removeFromHistory('${item.publicId}', '${item.url}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
    });
}

// Show toast
function showToast(message, type = 'info') {
    toast.className = `toast show ${type}`;
    toastMessage.textContent = message;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Helper: escape HTML
function escapeHtml(str) {
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// Add animations
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .processing {
            position: relative;
            overflow: hidden;
        }
        .processing::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: processing 1.5s infinite;
        }
        @keyframes processing {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        .preview-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #4361ee;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .dragover {
            border-color: #4361ee !important;
            background-color: rgba(67, 97, 238, 0.1) !important;
        }
        .toast.error { background: #e63946 !important; }
        .toast.success { background: #10b981 !important; }
        .toast.warning { background: #f59e0b !important; }
        .toast.info { background: #3b82f6 !important; }
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #94a3b8;
        }
        .empty-state i {
            font-size: 48px;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);
}

// Scroll to top button
function addScrollToTopButton() {
    const btn = document.createElement('button');
    btn.id = 'scrollTop';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: #4361ee;
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 99;
        transition: all 0.3s ease;
    `;
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        btn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    });
}


// above js perfect
