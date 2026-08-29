const fileInput=document.getElementById("fileInput"),dropArea=document.getElementById("dropArea"),uploadBtn=document.getElementById("uploadBtn"),imagePreviews=document.getElementById("imagePreviews"),resultContainer=document.getElementById("resultContainer"),historyBtn=document.getElementById("historyBtn"),historyModal=document.getElementById("historyModal"),closeModal=document.getElementById("closeModal"),urlHistory=document.getElementById("urlHistory"),progressBar=document.getElementById("progressBar"),toast=document.getElementById("toast"),toastMessage=document.getElementById("toastMessage"),WORKER_URL="https://img-to-url-hi.aarifbabu8948.workers.dev";let userLimits={dailyRem:0,dailyMax:0,monthlyRem:0,monthlyMax:0,resetAt:""},selectedFiles=[],isWorkerConnected=!1;function setupEventListeners(){fileInput.addEventListener("change",e=>{handleFiles(e.target.files)}),dropArea.addEventListener("dragover",e=>{e.preventDefault(),dropArea.classList.add("dragover")}),dropArea.addEventListener("dragleave",()=>{dropArea.classList.remove("dragover")}),dropArea.addEventListener("drop",e=>{e.preventDefault(),dropArea.classList.remove("dragover"),e.dataTransfer.files.length&&handleFiles(e.dataTransfer.files)}),uploadBtn.addEventListener("click",uploadImages),historyBtn.addEventListener("click",()=>{historyModal.style.display="flex",loadHistory()}),closeModal.addEventListener("click",()=>{historyModal.style.display="none"}),window.addEventListener("click",e=>{e.target===historyModal&&(historyModal.style.display="none")})}async function loadWorkerConfig(){try{let e=await fetch(`${WORKER_URL}/config`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();t.limits&&(userLimits={dailyRem:t.limits.dailyRem||0,dailyMax:t.limits.dailyMax||0,monthlyRem:t.limits.monthlyRem||0,monthlyMax:t.limits.monthlyMax||0,resetAt:t.limits.resetAt||""}),isWorkerConnected=!0,console.log("✅ Worker connected successfully"),enableUpload(),showUploadStats()}catch(s){console.error("❌ Worker connection failed:",s),showToast("Cannot connect to server. Please refresh.","error"),disableUpload()}}function enableUpload(){uploadBtn.disabled=!1,uploadBtn.style.opacity="1",uploadBtn.style.cursor="pointer",uploadBtn.title="",fileInput.disabled=!1,fileInput.style.opacity="1",dropArea.style.opacity="1",dropArea.style.pointerEvents="auto",dropArea.title=""}function disableUpload(){uploadBtn.disabled=!0,uploadBtn.style.opacity="0.5",uploadBtn.style.cursor="not-allowed",uploadBtn.title="Server connection failed",fileInput.disabled=!0,fileInput.style.opacity="0.5",dropArea.style.opacity="0.5",dropArea.style.pointerEvents="none",dropArea.title="Server connection failed",imagePreviews.innerHTML=`
        <div style="text-align: center; color: #e63946; padding: 20px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 10px;"></i>
            <p>Cannot connect to server. Please refresh.</p>
            <p style="font-size: 12px; margin-top: 10px;">Contact @AARIFALAM0105</p>
        </div>
    `}function showLimitsToast(){if(0===userLimits.dailyMax)return;let e=document.createElement("div");e.id="limitsToast";let t=userLimits.resetAt?`<div style="font-size:11px;color:#94a3b8;margin-top:6px;">🕛 Resets: ${userLimits.resetAt}</div>`:"";e.innerHTML=`
        <div style="background:#1e293b;color:white;padding:16px;border-radius:12px;
                    box-shadow:0 10px 25px rgba(0,0,0,.2);border-left:4px solid #4361ee;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span>📸 Daily:</span>
                <span style="color:${userLimits.dailyRem<3?"#ff6b6b":"#4ade80"};font-weight:bold;">
                    ${userLimits.dailyRem}/${userLimits.dailyMax} left
                </span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span>📅 Monthly:</span>
                <span style="color:${userLimits.monthlyRem<20?"#ff6b6b":"#4ade80"};font-weight:bold;">
                    ${userLimits.monthlyRem}/${userLimits.monthlyMax} left
                </span>
            </div>
            ${t}
        </div>`,e.style.cssText="position:fixed;top:20px;right:20px;z-index:9999;animation:slideIn .3s ease;",document.body.appendChild(e),setTimeout(()=>{e.style.animation="slideOut .3s ease",setTimeout(()=>e.remove(),300)},5e3)}function showUploadStats(){if(0===userLimits.dailyMax)return;let e=document.getElementById("uploadStats");e&&e.remove();let t=userLimits.dailyMax-userLimits.dailyRem,s=userLimits.monthlyMax-userLimits.monthlyRem,i=document.createElement("div");i.id="uploadStats";let a=0===userLimits.dailyRem,o=a&&userLimits.resetAt?`<span style="color:#ef4444;font-size:12px;display:block;margin-top:6px;">
               ⛔ Today's limit reached. Resets at midnight UTC — ${userLimits.resetAt}
           </span>`:"";i.innerHTML=`
        <div style="background:#f8f9fa;border-radius:8px;padding:12px;margin:15px 0;
                    border-left:4px solid #4361ee;font-size:14px;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                <span>
                    <i class="fas fa-cloud-upload-alt" style="color:#4361ee;"></i>
                    Daily: <strong>${t}/${userLimits.dailyMax}</strong> used
                    &nbsp;\xb7&nbsp; <strong style="color:${userLimits.dailyRem<3?"#ef4444":"#10b981"};">
                        ${userLimits.dailyRem} left
                    </strong>
                </span>
                <span>
                    <i class="fas fa-calendar-alt" style="color:#4361ee;"></i>
                    Monthly: <strong>${s}/${userLimits.monthlyMax}</strong> used
                </span>
            </div>
            ${o}
        </div>`;let r=document.getElementById("progressBar");r&&r.parentNode&&r.parentNode.insertBefore(i,r.nextSibling)}function handleFiles(e){if(!e||0===e.length)return;if(!isWorkerConnected){showToast("Server not connected","error");return}let t=Array.from(e).filter(e=>e.type.startsWith("image/"));if(0===t.length){showToast("Please select image files only","error");return}if(0===userLimits.dailyRem){showToast(`Today's limit reached. Resets: ${userLimits.resetAt||"midnight UTC"}`,"error");return}let s=selectedFiles.length+t.length;if(s>userLimits.dailyRem){showToast(`Only ${userLimits.dailyRem} slot(s) left today. You have ${selectedFiles.length} selected.`,"warning");return}selectedFiles=[...selectedFiles,...t],displayPreviews(),showToast(`${t.length} image(s) added. Total: ${selectedFiles.length}`,"success")}function displayPreviews(){if(imagePreviews.innerHTML="",0===selectedFiles.length){imagePreviews.innerHTML='<div class="empty-preview">No images selected</div>';return}selectedFiles.forEach((e,t)=>{let s=new FileReader;s.onload=e=>{let s=document.createElement("div");s.className="image-preview",s.setAttribute("data-index",t),s.innerHTML=`
                <img src="${e.target.result}" alt="Preview">
                <span class="preview-badge">${t+1}</span>
                <button class="remove-preview-btn" onclick="removeSelectedImage(${t})" title="Remove image">
                    <i class="fas fa-times"></i>
                </button>`,imagePreviews.appendChild(s)},s.readAsDataURL(e)})}async function uploadImages(){if(!isWorkerConnected){showToast("Server not connected","error");return}if(!selectedFiles.length){showToast("Select images first","error");return}if(0===userLimits.dailyRem){showToast(`Today's limit reached. Resets: ${userLimits.resetAt||"midnight UTC"}`,"error");return}if(selectedFiles.length>userLimits.dailyRem){showToast(`Only ${userLimits.dailyRem} upload(s) left today`,"error");return}if(selectedFiles.length>userLimits.monthlyRem){showToast(`Only ${userLimits.monthlyRem} upload(s) left this month`,"error");return}uploadBtn.disabled=!0,uploadBtn.classList.add("processing"),progressBar.style.width="0%",resultContainer.innerHTML="";let e=new FormData;selectedFiles.forEach(t=>e.append("file",t));try{progressBar.style.width="30%";let t=await fetch(`${WORKER_URL}/upload`,{method:"POST",mode:"cors",body:e});progressBar.style.width="80%";let s=await t.json();if(progressBar.style.width="100%",!t.ok||!s.success){let i=s.error||"Upload failed";429===t.status&&s.limits?.resetAt?showToast(`${i} — Resets: ${s.limits.resetAt}`,"error"):showToast(i,"error"),s.limits&&updateLimitsFromResponse(s.limits),uploadBtn.disabled=!1,uploadBtn.classList.remove("processing");return}s.limits&&updateLimitsFromResponse(s.limits);let a=(s.uploadedImages||[]).map(e=>({url:e.url,fileName:e.originalFilename||"image",publicId:e.publicId,timestamp:new Date().toISOString()}));a.length>0&&saveToHistory(a),displayResults(s.uploadedImages||[],selectedFiles),showUploadStats(),selectedFiles=[],imagePreviews.innerHTML="",setTimeout(()=>{scrollToResults()},500)}catch(o){console.error("Upload error:",o),showToast("Upload failed. Check connection and try again.","error"),progressBar.style.width="0%"}uploadBtn.disabled=!1,uploadBtn.classList.remove("processing")}function updateLimitsFromResponse(e){void 0!==e.dailyRem&&(userLimits.dailyRem=e.dailyRem),void 0!==e.dailyMax&&(userLimits.dailyMax=e.dailyMax),void 0!==e.monthlyRem&&(userLimits.monthlyRem=e.monthlyRem),void 0!==e.monthlyMax&&(userLimits.monthlyMax=e.monthlyMax),void 0!==e.resetAt&&(userLimits.resetAt=e.resetAt),showUploadStats()}function scrollToResults(){let e=document.querySelector(".main-content .card:nth-child(2)");e&&(e.scrollIntoView({behavior:"smooth",block:"start"}),e.style.transition="all .5s ease",e.style.boxShadow="0 0 0 3px rgba(67,97,238,.5)",e.style.transform="scale(1.01)",setTimeout(()=>{e.style.boxShadow="",e.style.transform=""},1500))}function displayResults(e,t){resultContainer.innerHTML="";let s=e.length;s>0&&showToast(`✅ ${s} image(s) uploaded!`,"success"),e.forEach(e=>{let t=new Date;resultContainer.innerHTML+=`
            <div class="url-item">
                <img src="${e.url}" alt="Uploaded" loading="lazy">
                <div class="url-info">
                    <strong>${escapeHtml(e.originalFilename||"image")}</strong>
                    <p class="url-text">${e.url}</p>
                    <small style="color:#94a3b8;">
                        <i class="far fa-clock"></i> Uploaded: ${t.toLocaleString()}
                    </small>
                </div>
                <div class="url-actions">
                    <button class="action-btn copy-btn" onclick="copyUrl('${e.url}', this)">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="removeFromHistory('${e.publicId}', '${e.url}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`})}function saveToHistory(e){let t=JSON.parse(localStorage.getItem("imageUrls"))||[];e.forEach(e=>{t.some(t=>t.url===e.url)||t.unshift({url:e.url,fileName:e.fileName,publicId:e.publicId,timestamp:e.timestamp})}),t=t.slice(0,400),localStorage.setItem("imageUrls",JSON.stringify(t));try{sessionStorage.setItem("imageUrls_backup",JSON.stringify(t.slice(0,150)))}catch(s){console.log("Backup save failed:",s)}}function loadHistory(){let e=JSON.parse(localStorage.getItem("imageUrls"))||[];if(0===e.length){let t=sessionStorage.getItem("imageUrls_backup");if(t)try{e=JSON.parse(t),localStorage.setItem("imageUrls",JSON.stringify(e)),console.log("✅ History recovered from backup!"),showToast("History restored from backup!","success")}catch(s){console.log("Backup recovery failed:",s)}}if(urlHistory.innerHTML="",!e.length){urlHistory.innerHTML='<div class="empty-state"><i class="fas fa-history"></i><p>No history yet</p></div>';return}e.forEach(e=>{let t=new Date(e.timestamp);urlHistory.innerHTML+=`
            <div class="url-item">
                <img src="${e.url}" alt="History" loading="lazy">
                <div class="url-info">
                    <strong>${escapeHtml(e.fileName)}</strong>
                    <p><i class="far fa-clock"></i> ${t.toLocaleString()}</p>
                </div>
                <div class="url-actions">
                    <button class="action-btn copy-btn" onclick="copyUrl('${e.url}', this)">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="removeFromHistory('${e.publicId}', '${e.url}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`})}function showToast(e,t="info"){toast.className=`toast show ${t}`,toastMessage.textContent=e,setTimeout(()=>{toast.classList.remove("show")},3e3)}function escapeHtml(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function addAnimations(){let e=document.createElement("style");e.textContent=`
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
    `,document.head.appendChild(e)}function addScrollToTopButton(){let e=document.createElement("button");e.id="scrollTop",e.innerHTML='<i class="fas fa-arrow-up"></i>',e.style.cssText=`
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
    `,e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}),e.addEventListener("mouseenter",()=>{e.style.transform="scale(1.1)"}),e.addEventListener("mouseleave",()=>{e.style.transform="scale(1)"}),document.body.appendChild(e),window.addEventListener("scroll",()=>{e.style.display=window.pageYOffset>300?"flex":"none"})}document.addEventListener("DOMContentLoaded",async()=>{console.log("Image to URL tool initializing..."),await loadWorkerConfig(),setTimeout(()=>{showLimitsToast()},1e3),loadHistory(),addAnimations(),addScrollToTopButton(),setupEventListeners()}),window.removeSelectedImage=function(e){selectedFiles.splice(e,1),displayPreviews(),showToast("Image removed","success")},window.copyUrl=function(e,t){navigator.clipboard.writeText(e).then(()=>{let e=t.innerHTML;t.innerHTML='<i class="fas fa-check"></i>',t.style.background="#10b981",setTimeout(()=>{t.innerHTML=e,t.style.background=""},2e3),showToast("URL copied!","success")}).catch(()=>{showToast("Failed to copy","error")})},window.removeFromHistory=async function(e,t){if(!confirm("Remove this image from your history?"))return;let s=JSON.parse(localStorage.getItem("imageUrls"))||[];s=s.filter(e=>e.url!==t),localStorage.setItem("imageUrls",JSON.stringify(s));try{let i=JSON.parse(sessionStorage.getItem("imageUrls_backup"))||[];i=i.filter(e=>e.url!==t),sessionStorage.setItem("imageUrls_backup",JSON.stringify(i))}catch(a){}document.querySelectorAll(".url-item").forEach(e=>{let s=e.querySelector(".url-text");s&&s.textContent===t&&e.remove()}),loadHistory(),showToast("Removed from history","success")};