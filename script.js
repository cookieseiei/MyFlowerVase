const translations = {
    'th': { 'title': 'แจกันดอกไม้ของฉัน', 'subtitle': 'จัดดอกไม้ในแจกันตามสไตล์ของคุณเอง', 'choose-style': 'เลือกสไตล์ของคุณ', 'start-btn': 'เริ่ม', 'done-btn': 'เสร็จสิ้น' },
    'en': { 'title': 'My Flower Vase', 'subtitle': 'Arrange the flowers in a vase in your own style.', 'choose-style': 'Choose your style', 'start-btn': 'Start', 'done-btn': 'Done' }
};

const bgColors = ["#ffffff", "#bfbfbf", "#000000", "#b2816b", "#b79694", "#8da1b5", "#b0ab74"];
const textColors = ["#C5A059", "#576A8F", "#BBCB2E", "#E1D9BC", "#ffffff", "#562F00", "#000000"];

const quotes = {
    'th': ["วันนี้คุณทำได้เยี่ยมมากเลย!", "แจกันดอกไม้ของคุณสวยงามที่สุด!", "ขอให้วันของคุณสดใสเหมือนดอกไม้เหล่านี้", "ผลงานชิ้นเอกที่สร้างสรรค์โดยคุณ", "ส่งต่อความสุขและกำลังใจผ่านดอกไม้นะ"],
    'en': ["You did a great job today!", "Your flower arrangement is stunning!", "May your day be as bright as these flowers.", "A masterpiece created by you.", "Sending you good vibes and flowers."]
};

const homeImages = ["images/vase_home1.png", "images/vase_home2.png", "images/vase_home3.png"];
let homeIndex = 0;
let currentTextColor = "#C5A059";
let currentTab = 'vase';

// 1. Slideshow (ทำงานเฉพาะหน้าแรก)
setInterval(() => {
    const img = document.getElementById("slideshow-img");
    const screenStart = document.getElementById('screen-start');
    if(img && screenStart && !screenStart.classList.contains('hidden')) {
        img.style.opacity = 0;
        setTimeout(() => {
            homeIndex = (homeIndex + 1) % homeImages.length;
            img.src = homeImages[homeIndex];
            img.style.opacity = 1;
        }, 800);
    }
}, 3000);

// 2. ไปที่หน้าหลัก (Main)
function goToMain() {
    document.getElementById('screen-start').classList.add('hidden');
    document.getElementById('screen-main').classList.remove('hidden');
    
    // สำคัญ: ซ่อนรูป Slideshow ของหน้าแรกทิ้งไปเลยเมื่อเริ่มจัด
    document.getElementById('slideshow-img').classList.add('hidden');
    
    switchTab('vase');
}

// 3. ระบบสลับ Tab
function switchTab(tab) {
    currentTab = tab.toLowerCase();
    document.querySelectorAll('.tab-item-circle').forEach(item => {
        const spanText = item.querySelector('span').innerText.toLowerCase();
        item.classList.toggle('active', spanText === currentTab);
    });
    const isText = (currentTab === 'text');
    document.getElementById('grid-options').classList.toggle('hidden', isText);
    document.getElementById('text-input-area').classList.toggle('hidden', !isText);
    if (isText) renderTextColorGrid();
    else renderGrid();
}

// 4. เรนเดอร์ Grid ของตกแต่ง
function renderGrid() {
    const grid = document.getElementById('grid-options');
    grid.innerHTML = '';
    
    // ปุ่มล้างค่า (✕)
    const emptyBtn = document.createElement('div');
    emptyBtn.className = 'grid-item';
    emptyBtn.innerHTML = '<span style="color:#C5A059; opacity:0.5; font-size:1.8rem;">✕</span>';
    emptyBtn.onclick = function() {
        if (currentTab === 'bg') document.getElementById('layer-bg').style.backgroundColor = 'transparent';
        else selectItem(null);
        highlightSelected(this);
    };
    grid.appendChild(emptyBtn);

    if (currentTab === 'bg') {
        bgColors.forEach(color => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerHTML = `<div class="bg-circle" style="background:${color}; width:45px; height:45px;"></div>`;
            item.onclick = function() {
                document.getElementById('layer-bg').style.backgroundColor = color;
                highlightSelected(this);
            };
            grid.appendChild(item);
        });
    } else {
        // แก้ไข Loop: ให้แสดงรูป 1 ถึง 7 ตามที่คุณต้องการ
        for (let i = 1; i <= 7; i++) {
            const item = document.createElement('div');
            item.className = 'grid-item';
            const src = `images/img_${currentTab}_${i}.png`;
            item.innerHTML = `<img src="${src}" class="grid-preview-img" onerror="this.style.opacity='0'">`;
            item.onclick = function() { selectItem(src); highlightSelected(this); };
            grid.appendChild(item);
        }
    }
}

// 5. ระบบสี Text
function renderTextColorGrid() {
    const container = document.getElementById('text-color-options');
    container.innerHTML = '';
    textColors.forEach(color => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.style.width = '42px'; item.style.height = '42px';
        if (currentTextColor === color) item.classList.add('selected');
        item.innerHTML = `<div class="bg-circle" style="background:${color}; width:26px; height:26px;"></div>`;
        item.onclick = function() {
            currentTextColor = color;
            updateText();
            renderTextColorGrid();
        };
        container.appendChild(item);
    });
}

function selectItem(src) {
    const layer = document.getElementById(`layer-${currentTab}`);
    if (layer) {
        if (src) { layer.src = src; layer.classList.remove('hidden'); }
        else layer.classList.add('hidden');
    }
}

function highlightSelected(clicked) {
    clicked.parentElement.querySelectorAll('.grid-item').forEach(i => i.classList.remove('selected'));
    clicked.classList.add('selected');
}

function updateText() {
    const val = document.getElementById('user-text').value;
    const display = document.getElementById('display-text');
    display.innerText = val;
    display.style.color = currentTextColor;
    display.classList.toggle('hidden', !val);
}

function changeLang(l) {
    document.querySelectorAll('[data-key]').forEach(e => {
        if (translations[l][e.getAttribute('data-key')]) {
            e.innerText = translations[l][e.getAttribute('data-key')];
        }
    });
    document.documentElement.lang = l; 
    document.getElementById('lang-th').classList.toggle('active', l === 'th');
    document.getElementById('lang-en').classList.toggle('active', l === 'en');
}

function goToFinish() {
    document.getElementById('screen-main').classList.add('hidden');
    document.getElementById('screen-finish').classList.remove('hidden');
    const lang = document.documentElement.lang || 'en';
    const q = quotes[lang];
    document.getElementById('quote-text').innerText = q[Math.floor(Math.random() * q.length)];
}

function saveImage() {
    const area = document.getElementById('capture-area');
    const logo = document.getElementById('main-logo');

    // 1. แสดงโลโก้ก่อนบันทึก
    if (logo) logo.style.display = 'block';

    // 2. ตั้งค่า html2canvas
    html2canvas(area, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // ปรับเป็น 2 เพื่อไม่ให้ไฟล์ใหญ่เกินไปจนเบราว์เซอร์บล็อก
        backgroundColor: null,
        width: area.offsetWidth,
        height: area.offsetHeight
    }).then(canvas => {
        // 3. ซ่อนโลโก้กลับคืน
        if (logo) logo.style.display = 'none';

        // ตรวจสอบอุปกรณ์ว่าเป็น iPad/iPhone หรือไม่
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isIOS) {
            // สำหรับ iPad: ใช้ window.open เหมือนเดิม
            const imageData = canvas.toDataURL("image/png");
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`
                    <title>Save Your Flower Vase</title>
                    <body style="margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f4f4f4; font-family:sans-serif;">
                        <p style="margin:20px; color:#C5A059; font-size:1.2rem;">จิ้มที่รูปค้างไว้เพื่อ "บันทึกภาพ"</p>
                        <img src="${imageData}" style="max-width:90%; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                    </body>
                `);
            } else {
                alert("Please allow pop-ups to save image");
            }
        } else {
            // สำหรับคอมพิวเตอร์: เปลี่ยนมาใช้ Blob เพื่อความเสถียรในการดาวน์โหลด
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'MyFlowerVase.png';
                link.href = url;
                document.body.appendChild(link); // ต้องเพิ่มลงใน body ก่อนคลิกในบางเบราว์เซอร์
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url); // ล้างหน่วยความจำ
            }, 'image/png');
        }
    }).catch(err => {
        console.error("Canvas error:", err);
        alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ กรุณาลองใหม่อีกครั้ง");
    });
}

changeLang('en');