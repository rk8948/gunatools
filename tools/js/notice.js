/*!
 * gunatools.dev full-screen WARNING notice: site closing + for sale + contact (v5)
 * Add before </body>:  <script src="/gunatools-notice.js" defer></script>
 * Edit only the CONFIG block below.
 */
(function () {
  "use strict";

  /* ================= CONFIG (edit this) ================= */
  var CONFIG = {
    instagramUrl: "https://instagram.com/newlearn_in_code",
    instagramHandle: "@newlearn_in_code",
    contactUrl: "https://gunatools.dev/footer/contact-us/contact",
    whatsappUrl: "",             // optional, e.g. "https://wa.me/91XXXXXXXXXX"  (empty = hidden)
    email: "",                   // optional, e.g. "you@example.com"             (empty = hidden)
    newSiteUrl: "https://imgtry.com",
    promptsUrl: "https://newlearn.in/ai-image-prompts/",
    priceText: "$80 - $100",     // GunaTools.dev domain + complete website
    devText: "$40 - $100",       // price to build a new website for someone
    noticeDate: "2026-09-30",    // YYYY-MM-DD
    closeDate: "2026-10-01",     // site closes
    recheckDate: "2026-10-05",   // site opens again
    images: [                    // 0-4 small preview images (empty list = no strip)
      "https://gunatools.dev/notice/1.webp",
      "https://gunatools.dev/notice/2.webp",
      "https://gunatools.dev/notice/3.webp",
      "https://gunatools.dev/notice/4.webp"
    ],
    showDelayMs: 0,              // cover appears immediately on EVERY page load / refresh
    closeDelaySec: 10,           // close (X) unlocks after 10 seconds (0 = instantly)
    repeatEverySec: 0,           // after closing, cover returns after N sec (0 = only on refresh)
    maxPopups: 0,                // max covers per page visit when repeating (0 = unlimited)
    expireDate: "2026-10-05",    // after this date the notice stops by itself
    skipBots: true               // do not show to search-engine bots
  };
  /* ====================================================== */

  var LANGS = {
    en: { name: "English", code: "en-US", t: {
      badge: "Notice", title: "GunaTools.dev is for sale",
      p2: "This site will close for server cleanup. Domain and complete website: {price}. Reason: financial issues. I am a student, sorry.",
      notice: "Notice", closes: "Site closes", recheck: "Reopens",
      ofr: "Available to buy",
      i1: "GunaTools.dev: domain + complete website",
      i2: "My other websites (ImgTry.com, NewLearn.in, AI prompt site): send me your offer",
      i3: "Need a new website built for you?",
      ct: "Contact me directly",
      ig: "Message on Instagram", pg: "Contact page", cp: "Copy handle", cpd: "Copied ✓",
      note: "Meanwhile, use our new website for image tools:", go: "ImgTry.com", prompts: "Free AI image prompts",
      listen: "Listen", stop: "Stop", close: "Close", pause: "Pause", play: "Play", wait: "You can close in {n}s" } },
    hi: { name: "हिन्दी", code: "hi-IN", t: {
      badge: "सूचना", title: "GunaTools.dev बिक्री के लिए उपलब्ध है",
      p2: "सर्वर की सफ़ाई के लिए यह साइट बंद रहेगी। डोमेन और पूरी वेबसाइट की कीमत: {price}। कारण: आर्थिक समस्या। मैं एक छात्र हूँ, माफ़ कीजिए।",
      notice: "सूचना", closes: "साइट बंद", recheck: "फिर खुलेगी",
      ofr: "खरीदने के लिए उपलब्ध",
      i1: "GunaTools.dev: डोमेन + पूरी वेबसाइट",
      i2: "मेरी अन्य वेबसाइट (ImgTry.com, NewLearn.in, AI प्रॉम्प्ट साइट): अपना ऑफ़र भेजें",
      i3: "अपने लिए नई वेबसाइट बनवानी है?",
      ct: "मुझसे सीधे संपर्क करें",
      ig: "Instagram पर मैसेज करें", pg: "कॉन्टैक्ट पेज", cp: "हैंडल कॉपी करें", cpd: "कॉपी हो गया ✓",
      note: "तब तक इमेज टूल्स के लिए हमारी नई वेबसाइट इस्तेमाल करें:", go: "ImgTry.com", prompts: "फ्री AI इमेज प्रॉम्प्ट",
      listen: "सुनें", stop: "रोकें", close: "बंद करें", pause: "रोकें", play: "चलाएँ", wait: "{n} सेकंड में बंद कर सकेंगे" } },
    es: { name: "Español", code: "es-ES", t: {
      badge: "Aviso", title: "GunaTools.dev está en venta",
      p2: "Este sitio se cerrará para limpiar el servidor. Dominio y sitio web completo: {price}. Motivo: problemas económicos. Soy estudiante, lo siento.",
      notice: "Aviso", closes: "Cierre", recheck: "Reapertura",
      ofr: "Disponible para comprar",
      i1: "GunaTools.dev: dominio + sitio web completo",
      i2: "Mis otros sitios (ImgTry.com, NewLearn.in, sitio de prompts IA): envíame tu oferta",
      i3: "¿Necesitas que te creen un sitio web nuevo?",
      ct: "Contáctame directamente",
      ig: "Escribir por Instagram", pg: "Página de contacto", cp: "Copiar usuario", cpd: "Copiado ✓",
      note: "Mientras tanto, usa nuestro nuevo sitio para herramientas de imagen:", go: "ImgTry.com", prompts: "Prompts de imagen IA gratis",
      listen: "Escuchar", stop: "Detener", close: "Cerrar", pause: "Pausar", play: "Reproducir", wait: "Podrás cerrar en {n} s" } },
    zh: { name: "中文", code: "zh-CN", t: {
      badge: "通知", title: "GunaTools.dev 正在出售",
      p2: "本站将因服务器清理而关闭。域名及完整网站价格：{price}。原因：经济困难。我是学生，抱歉。",
      notice: "通知日期", closes: "关站日期", recheck: "重新开放",
      ofr: "可购买",
      i1: "GunaTools.dev：域名 + 完整网站",
      i2: "我的其他网站（ImgTry.com、NewLearn.in、AI 提示词网站）：欢迎报价",
      i3: "需要为您定制新网站？",
      ct: "直接联系我",
      ig: "Instagram 私信", pg: "联系页面", cp: "复制账号", cpd: "已复制 ✓",
      note: "在此期间，欢迎使用我们的新网站的图片工具：", go: "ImgTry.com", prompts: "免费 AI 图片提示词",
      listen: "朗读", stop: "停止", close: "关闭", pause: "暂停", play: "播放", wait: "{n} 秒后可关闭" } },
    ar: { name: "العربية", code: "ar-SA", t: {
      badge: "إشعار", title: "موقع GunaTools.dev للبيع",
      p2: "سيتم إغلاق هذا الموقع لتنظيف الخادم. سعر النطاق والموقع الكامل: {price}. السبب: ظروف مالية. أنا طالب، أعتذر.",
      notice: "الإشعار", closes: "إغلاق الموقع", recheck: "إعادة الفتح",
      ofr: "متاح للشراء",
      i1: "GunaTools.dev: النطاق + الموقع الكامل",
      i2: "مواقعي الأخرى (ImgTry.com وNewLearn.in وموقع أوامر الذكاء الاصطناعي): أرسل عرضك",
      i3: "هل تحتاج إلى موقع جديد يُبنى لك؟",
      ct: "تواصل معي مباشرة",
      ig: "راسلني على إنستغرام", pg: "صفحة الاتصال", cp: "نسخ الحساب", cpd: "تم النسخ ✓",
      note: "في هذه الأثناء، استخدم موقعنا الجديد لأدوات الصور:", go: "ImgTry.com", prompts: "أوامر صور ذكاء اصطناعي مجانية",
      listen: "استمع", stop: "إيقاف", close: "إغلاق", pause: "إيقاف مؤقت", play: "تشغيل", wait: "يمكنك الإغلاق بعد {n} ث" } },
    pt: { name: "Português", code: "pt-BR", t: {
      badge: "Aviso", title: "GunaTools.dev está à venda",
      p2: "Este site será fechado para limpeza do servidor. Domínio e site completo: {price}. Motivo: problemas financeiros. Sou estudante, desculpem.",
      notice: "Aviso", closes: "Site fecha", recheck: "Reabre",
      ofr: "Disponível para compra",
      i1: "GunaTools.dev: domínio + site completo",
      i2: "Meus outros sites (ImgTry.com, NewLearn.in, site de prompts de IA): envie sua oferta",
      i3: "Precisa de um site novo feito para você?",
      ct: "Fale comigo diretamente",
      ig: "Mensagem no Instagram", pg: "Página de contato", cp: "Copiar usuário", cpd: "Copiado ✓",
      note: "Enquanto isso, use nosso novo site para ferramentas de imagem:", go: "ImgTry.com", prompts: "Prompts de imagem IA grátis",
      listen: "Ouvir", stop: "Parar", close: "Fechar", pause: "Pausar", play: "Reproduzir", wait: "Você pode fechar em {n}s" } },
    bn: { name: "বাংলা", code: "bn-IN", t: {
      badge: "বিজ্ঞপ্তি", title: "GunaTools.dev বিক্রির জন্য আছে",
      p2: "সার্ভার পরিষ্কারের জন্য এই সাইট বন্ধ থাকবে। ডোমেন ও পুরো ওয়েবসাইটের দাম: {price}। কারণ: আর্থিক সমস্যা। আমি একজন ছাত্র, দুঃখিত।",
      notice: "বিজ্ঞপ্তি", closes: "সাইট বন্ধ", recheck: "আবার খুলবে",
      ofr: "কেনার জন্য উপলব্ধ",
      i1: "GunaTools.dev: ডোমেন + পুরো ওয়েবসাইট",
      i2: "আমার অন্যান্য ওয়েবসাইট (ImgTry.com, NewLearn.in, AI প্রম্পট সাইট): আপনার অফার পাঠান",
      i3: "নিজের জন্য নতুন ওয়েবসাইট বানাতে চান?",
      ct: "সরাসরি যোগাযোগ করুন",
      ig: "Instagram-এ মেসেজ করুন", pg: "কন্টাক্ট পেজ", cp: "হ্যান্ডেল কপি করুন", cpd: "কপি হয়েছে ✓",
      note: "ততক্ষণ ইমেজ টুলসের জন্য আমাদের নতুন ওয়েবসাইট ব্যবহার করুন:", go: "ImgTry.com", prompts: "ফ্রি AI ইমেজ প্রম্পট",
      listen: "শুনুন", stop: "থামান", close: "বন্ধ করুন", pause: "থামান", play: "চালান", wait: "{n} সেকেন্ডে বন্ধ করতে পারবেন" } },
    ru: { name: "Русский", code: "ru-RU", t: {
      badge: "Объявление", title: "GunaTools.dev продаётся",
      p2: "Этот сайт будет закрыт для очистки сервера. Домен и готовый сайт: {price}. Причина: финансовые трудности. Я студент, извините.",
      notice: "Объявление", closes: "Закрытие сайта", recheck: "Откроется снова",
      ofr: "Доступно для покупки",
      i1: "GunaTools.dev: домен + готовый сайт",
      i2: "Мои другие сайты (ImgTry.com, NewLearn.in, сайт ИИ-промптов): присылайте своё предложение",
      i3: "Нужен новый сайт под ключ?",
      ct: "Свяжитесь со мной напрямую",
      ig: "Написать в Instagram", pg: "Страница контактов", cp: "Копировать ник", cpd: "Скопировано ✓",
      note: "А пока пользуйтесь нашим новым сайтом для работы с изображениями:", go: "ImgTry.com", prompts: "Бесплатные промпты для ИИ-изображений",
      listen: "Слушать", stop: "Стоп", close: "Закрыть", pause: "Пауза", play: "Играть", wait: "Закрыть можно через {n} с" } },
    ja: { name: "日本語", code: "ja-JP", t: {
      badge: "お知らせ", title: "GunaTools.devは売却します",
      p2: "サーバー整理のため、このサイトは閉鎖されます。ドメインと完成済みサイトの価格：{price}。理由：経済的な事情。私は学生です、申し訳ありません。",
      notice: "通知日", closes: "閉鎖日", recheck: "再開日",
      ofr: "購入可能",
      i1: "GunaTools.dev：ドメイン＋完成済みサイト",
      i2: "私の他のサイト（ImgTry.com、NewLearn.in、AIプロンプトサイト）：ご提案をお送りください",
      i3: "新しいサイトの制作をご希望ですか？",
      ct: "直接ご連絡ください",
      ig: "Instagramでメッセージ", pg: "お問い合わせページ", cp: "ハンドルをコピー", cpd: "コピーしました ✓",
      note: "それまでは、新サイトの画像ツールをご利用ください：", go: "ImgTry.com", prompts: "無料AI画像プロンプト",
      listen: "音声で聞く", stop: "停止", close: "閉じる", pause: "一時停止", play: "再生", wait: "あと{n}秒で閉じられます" } },
    fr: { name: "Français", code: "fr-FR", t: {
      badge: "Avis", title: "GunaTools.dev est à vendre",
      p2: "Ce site fermera pour nettoyage du serveur. Domaine et site complet : {price}. Raison : difficultés financières. Je suis étudiant, désolé.",
      notice: "Avis", closes: "Fermeture", recheck: "Réouverture",
      ofr: "Disponible à l'achat",
      i1: "GunaTools.dev : domaine + site complet",
      i2: "Mes autres sites (ImgTry.com, NewLearn.in, site de prompts IA) : envoyez-moi votre offre",
      i3: "Besoin d'un nouveau site créé pour vous ?",
      ct: "Contactez-moi directement",
      ig: "Écrire sur Instagram", pg: "Page de contact", cp: "Copier le pseudo", cpd: "Copié ✓",
      note: "En attendant, utilisez notre nouveau site pour vos outils d'image :", go: "ImgTry.com", prompts: "Prompts d'images IA gratuits",
      listen: "Écouter", stop: "Arrêter", close: "Fermer", pause: "Pause", play: "Lecture", wait: "Fermeture possible dans {n} s" } }
  };

  /* ---------- guards ---------- */
  if (window.__gunaNoticeLoaded) return;
  window.__gunaNoticeLoaded = true;
  if (CONFIG.skipBots && /bot|crawl|spider|slurp|lighthouse|pagespeed|headless/i.test(navigator.userAgent)) return;
  if (CONFIG.expireDate && Date.now() > new Date(CONFIG.expireDate + "T23:59:59").getTime()) return;

  function boot() {
    var LKEY = "guna_notice_lang";

    function pickLang() {
      try { var s = localStorage.getItem(LKEY); if (s && LANGS[s]) return s; } catch (e) {}
      var n = (navigator.language || "en").slice(0, 2).toLowerCase();
      return LANGS[n] ? n : "en";
    }
    var lang = pickLang(), reading = false, locked = false, timer = null;

    function fmtDate(iso) {
      try { return new Intl.DateTimeFormat(LANGS[lang].code, { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso + "T00:00:00")); }
      catch (e) { return iso; }
    }
    function fill(s) { return s.replace(/\{price\}/g, CONFIG.priceText); }

    /* ---------- styles (professional warning: amber + deep orange, red only for the close date) ---------- */
    var css = "\
#gn-root,#gn-root *{box-sizing:border-box;font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans','Noto Sans Devanagari','Noto Sans Bengali','Noto Sans Arabic','Noto Sans JP','Noto Sans SC',sans-serif}\
#gn-ov{position:fixed;inset:0;z-index:2147483000;overflow-y:auto;overscroll-behavior:contain;background:radial-gradient(circle at 50% 0%,#1e293b 0%,#0b1220 70%);display:flex;padding:16px;opacity:0;transition:opacity .3s}\
#gn-ov.gn-in{opacity:1}\
#gn-pg{position:fixed;top:0;left:0;right:0;height:4px;background:rgba(255,255,255,.12);z-index:3}\
#gn-pgi{display:block;height:100%;width:100%;background:linear-gradient(90deg,#f59e0b,#dc2626)}\
#gn-card{position:relative;width:100%;max-width:640px;margin:100px auto 32px;background:#fff;color:#111827;border-radius:16px;border-top:5px solid #f59e0b;box-shadow:0 24px 70px rgba(0,0,0,.55),0 0 0 1px rgba(245,158,11,.25);overflow:hidden;outline:none}\
.gn-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:14px 16px;background:linear-gradient(180deg,#fffbeb,#fef3c7);border-bottom:1px solid #fcd34d}\
.gn-badge{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#fff;background:#b45309;padding:7px 14px;border-radius:99px;margin-inline-end:auto;box-shadow:0 2px 6px rgba(180,83,9,.35)}\
.gn-btn{cursor:pointer;background:#fff;color:#1f2937;border:1px solid #e5d3a3;border-radius:99px;height:36px;min-width:36px;padding:0 12px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 2px rgba(0,0,0,.06);transition:background .2s,border-color .2s,transform .1s}\
.gn-btn:hover{background:#fff7e0;border-color:#f59e0b}.gn-btn:active{transform:scale(.96)}\
.gn-btn:focus-visible,.gn-cta a:focus-visible,.gn-menu button:focus-visible,.gn-note a:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}\
.gn-x{width:36px;padding:0;justify-content:center;font-size:14px;font-variant-numeric:tabular-nums}\
.gn-x:hover{background:#fee2e2;border-color:#fecaca;color:#b91c1c}.gn-x svg{display:block}\
.gn-x[disabled]{cursor:not-allowed;opacity:.75;background:#f3f4f6;color:#6b7280;border-color:#e5e7eb}\
.gn-snd.gn-on{background:#b45309;color:#fff;border-color:#b45309}\
.gn-lw{position:relative}\
.gn-menu{position:absolute;inset-inline-end:0;top:42px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.2);padding:6px;min-width:160px;max-height:240px;overflow:auto;display:none;z-index:9}\
.gn-menu.gn-show{display:block}\
.gn-menu button{display:block;width:100%;text-align:start;border:0;background:none;padding:9px 12px;border-radius:8px;font-size:14px;cursor:pointer;color:#111827}\
.gn-menu button:hover,.gn-menu button.gn-cur{background:#fef3c7;font-weight:700}\
.gn-body{padding:18px 18px 20px}\
.gn-title{font-size:clamp(22px,5vw,28px);line-height:1.25;font-weight:800;margin:0 0 12px;color:#7c2d12}\
.gn-dates{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}\
.gn-d{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 10px}\
.gn-d small{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280}\
.gn-d b{font-size:13.5px}\
.gn-d.gn-warn{background:#fef2f2;border-color:#fecaca}.gn-d.gn-warn b{color:#b91c1c}\
.gn-p{font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px}\
.gn-oh{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;margin:0 0 8px}\
.gn-list{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-direction:column;gap:8px}\
.gn-list li{display:flex;align-items:center;gap:10px;border:1px solid #e5e7eb;border-radius:12px;padding:11px 12px;font-size:14.5px;line-height:1.45}\
.gn-ic{font-size:18px;flex:0 0 auto}\
.gn-lt{flex:1 1 auto;min-width:0}\
.gn-pr{flex:0 0 auto;font-size:13px;font-weight:800;color:#78350f;background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:4px 8px;white-space:nowrap}\
.gn-ct{background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:14px}\
.gn-cth{font-size:16px;font-weight:800;margin:0 0 10px}\
.gn-cta{display:flex;gap:8px;flex-wrap:wrap}\
.gn-cta a{flex:1 1 180px;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:13px 14px;border-radius:11px;transition:transform .1s,filter .2s}\
.gn-cta a:hover{filter:brightness(1.12)}.gn-cta a:active{transform:scale(.98)}\
.gn-pri{background:linear-gradient(135deg,#b45309,#92400e);color:#fff}\
.gn-sec{background:#fff;color:#92400e;border:2px solid #92400e}\
.gn-copy{margin-top:10px;font-size:13px;height:32px}\
.gn-note{font-size:13.5px;line-height:1.6;color:#6b7280;margin:16px 0 0;text-align:center}\
.gn-note a{color:#374151;font-weight:700}\
.gn-car{position:relative;border-radius:12px;overflow:hidden;background:#f3f4f6;margin-top:12px}\
.gn-track{display:flex;gap:8px;overflow-x:hidden;padding:8px}\
.gn-th{position:relative;flex:0 0 auto;height:92px;min-width:60px;border-radius:8px;overflow:hidden;background:#e5e7eb}\
.gn-th img{height:100%;width:auto;display:block;cursor:zoom-in}\
.gn-pp{position:absolute;inset-inline-end:6px;top:6px;height:26px;font-size:11px;padding:0 9px}\
#gn-lb{position:fixed;inset:0;z-index:2147483600;background:rgba(2,6,23,.95);display:none;align-items:center;justify-content:center;padding:16px}\
#gn-lb.gn-show{display:flex}#gn-lb img{max-width:100%;max-height:100%;border-radius:10px}\
#gn-lb .gn-lx{position:absolute;top:14px;inset-inline-end:14px}\
#gn-lb .gn-nav{position:absolute;top:50%;margin-top:-18px}\
#gn-lb .gn-prev{inset-inline-start:12px}#gn-lb .gn-next{inset-inline-end:12px}\
#gn-lb .gn-cnt{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);color:#cbd5e1;font-size:13px}\
#gn-pill{position:fixed;inset-inline-end:14px;bottom:14px;z-index:2147482000;display:none;align-items:center;background:#111827;color:#fff;border-radius:99px;box-shadow:0 8px 24px rgba(0,0,0,.35);overflow:hidden;max-width:calc(100vw - 28px)}\
#gn-pill button{border:0;background:none;color:#fff;cursor:pointer;font-size:13px;font-weight:600}\
#gn-pb{display:flex;align-items:center;gap:8px;padding:11px 8px 11px 14px;min-width:0}\
#gn-pt{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px}\
.gn-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;flex:0 0 auto}\
#gn-px{padding:11px 14px 11px 8px;opacity:.7;font-size:16px}#gn-px:hover{opacity:1}\
@media(max-width:480px){#gn-ov{padding:10px}.gn-body{padding:14px 14px 16px}.gn-dates{gap:6px}.gn-d b{font-size:12.5px}#gn-card{margin-top:100px}}\
@media(prefers-reduced-motion:reduce){#gn-ov{transition:none}}";

    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);

    /* ---------- DOM ---------- */
    var XI = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>';
    var root = document.createElement("div");
    root.id = "gn-root";
    root.innerHTML = '\
<div id="gn-ov" role="dialog" aria-modal="true" aria-labelledby="gn-title">\
 <div id="gn-pg"><i id="gn-pgi"></i></div>\
 <div id="gn-card" tabindex="-1">\
  <div class="gn-top">\
   <span class="gn-badge" id="gn-badge"></span>\
   <div class="gn-lw">\
    <button class="gn-btn" id="gn-lbtn" aria-haspopup="true">🌐 <span id="gn-lname"></span></button>\
    <div class="gn-menu" id="gn-menu"></div>\
   </div>\
   <button class="gn-btn gn-snd" id="gn-snd"><span id="gn-sico">🔊</span> <span id="gn-slab"></span></button>\
   <button class="gn-btn gn-x" id="gn-x"></button>\
  </div>\
  <div class="gn-body">\
   <h2 class="gn-title" id="gn-title"></h2>\
   <div class="gn-dates">\
    <div class="gn-d"><small id="gn-l1"></small><b id="gn-v1"></b></div>\
    <div class="gn-d gn-warn"><small id="gn-l2"></small><b id="gn-v2"></b></div>\
    <div class="gn-d"><small id="gn-l3"></small><b id="gn-v3"></b></div>\
   </div>\
   <p class="gn-p" id="gn-p2"></p>\
   <h3 class="gn-oh" id="gn-ofr"></h3>\
   <ul class="gn-list">\
    <li><span class="gn-ic">🌐</span><span class="gn-lt" id="gn-i1"></span><b class="gn-pr" id="gn-pr1"></b></li>\
    <li><span class="gn-ic">🗂️</span><span class="gn-lt" id="gn-i2"></span></li>\
    <li><span class="gn-ic">🛠️</span><span class="gn-lt" id="gn-i3"></span><b class="gn-pr" id="gn-pr3"></b></li>\
   </ul>\
   <div class="gn-ct">\
    <h3 class="gn-cth" id="gn-ct"></h3>\
    <div class="gn-cta" id="gn-cta"></div>\
    <button class="gn-btn gn-copy" id="gn-cp"></button>\
   </div>\
   <p class="gn-note"><span id="gn-note"></span> <a id="gn-go" target="_blank" rel="noopener"></a> · <a id="gn-more" target="_blank" rel="noopener"></a></p>\
   <div class="gn-car" id="gn-car"><div class="gn-track" id="gn-track"></div><button class="gn-btn gn-pp" id="gn-pp"></button></div>\
  </div>\
 </div>\
</div>\
<div id="gn-pill"><button id="gn-pb"><span class="gn-dot"></span><span id="gn-pt"></span></button><button id="gn-px" aria-label="Dismiss">✕</button></div>\
<div id="gn-lb" role="dialog" aria-modal="true"><button class="gn-btn gn-x gn-lx" aria-label="Close">' + XI + '</button><button class="gn-btn gn-nav gn-prev" aria-label="Previous">‹</button><img alt=""><button class="gn-btn gn-nav gn-next" aria-label="Next">›</button><span class="gn-cnt" id="gn-cnt"></span></div>';
    document.body.appendChild(root);

    function $(id) { return document.getElementById(id); }
    var ov = $("gn-ov"), card = $("gn-card"), track = $("gn-track"), lb = $("gn-lb"), pill = $("gn-pill"), xb = $("gn-x");

    /* contact buttons (Instagram first, optional WhatsApp / email) */
    var cta = $("gn-cta");
    function mkLink(id, href, cls) {
      var a = document.createElement("a");
      a.id = id; a.className = cls; a.rel = "noopener"; a.target = "_blank"; a.href = href;
      cta.appendChild(a); return a;
    }
    mkLink("gn-ig", CONFIG.instagramUrl, "gn-pri");
    if (CONFIG.whatsappUrl) mkLink("gn-wa", CONFIG.whatsappUrl, "gn-sec").textContent = "WhatsApp";
    if (CONFIG.email) mkLink("gn-em", "mailto:" + CONFIG.email, "gn-sec").textContent = "✉ " + CONFIG.email;
    var pg = mkLink("gn-pg2", CONFIG.contactUrl, "gn-sec"); pg.removeAttribute("target");

    /* ---------- page scroll lock ---------- */
    var prevOverflow = null;
    function lockScroll() { if (prevOverflow === null) { prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden"; } }
    function unlockScroll() { if (prevOverflow !== null) { document.documentElement.style.overflow = prevOverflow; prevOverflow = null; } }

    /* ---------- preview strip + lightbox ---------- */
    var imgs = (CONFIG.images || []).slice(0, 4), cur = 0;
    var paused = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    var hover = false, pos = 0, raf = 0;
    if (!imgs.length) $("gn-car").style.display = "none";

    function addImgs() {
      imgs.forEach(function (src, i) {
        var th = document.createElement("div"); th.className = "gn-th";
        var im = document.createElement("img");
        im.src = src; im.alt = "Preview " + (i + 1); im.decoding = "async";
        im.onerror = function () { th.style.display = "none"; };
        im.addEventListener("click", function () { openLb(i); });
        th.appendChild(im); track.appendChild(th);
      });
    }
    addImgs(); addImgs();
    track.addEventListener("mouseenter", function () { hover = true; });
    track.addEventListener("mouseleave", function () { hover = false; });

    function loopWidth() {
      var kids = track.children, n = imgs.length;
      if (kids.length < n * 2) return 0;
      return kids[n].offsetLeft - kids[0].offsetLeft;
    }
    function tick() {
      raf = requestAnimationFrame(tick);
      if (paused || hover || lb.classList.contains("gn-show")) return;
      var half = loopWidth();
      if (!half || track.scrollWidth <= track.clientWidth) return;
      pos += 0.6;
      if (pos >= half) pos -= half;
      track.scrollLeft = pos;
    }
    function startCarousel() { if (imgs.length && !raf) raf = requestAnimationFrame(tick); }
    function stopCarousel() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    function showLb() { lb.querySelector("img").src = imgs[cur]; $("gn-cnt").textContent = (cur + 1) + " / " + imgs.length; }
    function openLb(i) { cur = i; showLb(); lb.classList.add("gn-show"); }
    function closeLb() { lb.classList.remove("gn-show"); }
    function step(d) { cur = (cur + d + imgs.length) % imgs.length; showLb(); }
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.tagName === "IMG") closeLb(); });
    lb.querySelector(".gn-lx").addEventListener("click", closeLb);
    lb.querySelector(".gn-prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    lb.querySelector(".gn-next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    (function () {
      var sx = null;
      lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        if (sx === null) return;
        var dx = e.changedTouches[0].clientX - sx; sx = null;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }, { passive: true });
    })();

    /* ---------- text / language ---------- */
    function speechParts() {
      var t = LANGS[lang].t;
      return [
        t.title,
        t.notice + " " + fmtDate(CONFIG.noticeDate) + ". " + t.closes + " " + fmtDate(CONFIG.closeDate) + ". " + t.recheck + " " + fmtDate(CONFIG.recheckDate) + ".",
        fill(t.p2),
        t.ofr + ". " + t.i1 + " " + CONFIG.priceText + ". " + t.i2 + ". " + t.i3 + " " + CONFIG.devText + ".",
        t.ct + ": Instagram " + CONFIG.instagramHandle
      ];
    }
    function updateCloseTitle() {
      var t = LANGS[lang].t;
      if (locked) xb.title = t.wait.replace("{n}", xb.getAttribute("data-n") || CONFIG.closeDelaySec);
      else { xb.title = t.close; xb.setAttribute("aria-label", t.close); }
    }
    function render() {
      var L = LANGS[lang], t = L.t;
      card.dir = (lang === "ar") ? "rtl" : "ltr";
      lb.dir = card.dir;
      $("gn-badge").textContent = "⚠ " + t.badge;
      $("gn-lname").textContent = L.name;
      $("gn-title").textContent = t.title;
      $("gn-pt").textContent = t.title;
      $("gn-l1").textContent = t.notice; $("gn-v1").textContent = fmtDate(CONFIG.noticeDate);
      $("gn-l2").textContent = t.closes; $("gn-v2").textContent = fmtDate(CONFIG.closeDate);
      $("gn-l3").textContent = t.recheck; $("gn-v3").textContent = fmtDate(CONFIG.recheckDate);
      $("gn-p2").textContent = fill(t.p2);
      $("gn-ofr").textContent = t.ofr;
      $("gn-i1").textContent = t.i1; $("gn-pr1").textContent = CONFIG.priceText;
      $("gn-i2").textContent = t.i2;
      $("gn-i3").textContent = t.i3; $("gn-pr3").textContent = CONFIG.devText;
      $("gn-ct").textContent = t.ct;
      $("gn-ig").textContent = "📷 " + t.ig + " " + CONFIG.instagramHandle;
      $("gn-pg2").textContent = "✉ " + t.pg;
      if (!copied) $("gn-cp").textContent = "📋 " + t.cp + " " + CONFIG.instagramHandle;
      $("gn-note").textContent = t.note;
      $("gn-go").textContent = t.go; $("gn-go").href = CONFIG.newSiteUrl;
      $("gn-more").textContent = t.prompts; $("gn-more").href = CONFIG.promptsUrl;
      $("gn-pp").textContent = paused ? "▶ " + t.play : "⏸ " + t.pause;
      $("gn-slab").textContent = reading ? t.stop : t.listen;
      updateCloseTitle();
      var items = $("gn-menu").children;
      for (var i = 0; i < items.length; i++) items[i].className = items[i].getAttribute("data-l") === lang ? "gn-cur" : "";
    }

    var copied = false;
    $("gn-cp").addEventListener("click", function () {
      var btn = this, done = function () {
        copied = true; btn.textContent = LANGS[lang].t.cpd;
        setTimeout(function () { copied = false; render(); }, 1800);
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONFIG.instagramHandle).then(done, done);
        else {
          var ta = document.createElement("textarea"); ta.value = CONFIG.instagramHandle; document.body.appendChild(ta);
          ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done();
        }
      } catch (e) {}
    });

    var menu = $("gn-menu");
    Object.keys(LANGS).forEach(function (k) {
      var b = document.createElement("button");
      b.setAttribute("data-l", k); b.textContent = LANGS[k].name;
      b.addEventListener("click", function () {
        lang = k;
        try { localStorage.setItem(LKEY, k); } catch (e) {}
        menu.classList.remove("gn-show");
        render();
        if (reading) speak();
      });
      menu.appendChild(b);
    });
    $("gn-lbtn").addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("gn-show"); });
    document.addEventListener("click", function () { menu.classList.remove("gn-show"); });
    $("gn-pp").addEventListener("click", function () { paused = !paused; render(); });

    /* ---------- sound (click only; browsers block autoplay) ---------- */
    var synth = window.speechSynthesis, speakId = 0;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") { synth = null; $("gn-snd").style.display = "none"; }

    function stopSpeak() {
      speakId++;
      if (synth) synth.cancel();
      reading = false;
      $("gn-snd").classList.remove("gn-on");
      $("gn-sico").textContent = "🔊";
      $("gn-slab").textContent = LANGS[lang].t.listen;
    }
    function pickVoice() {
      var vs = synth.getVoices(), code = LANGS[lang].code.toLowerCase();
      for (var i = 0; i < vs.length; i++) if (vs[i].lang && vs[i].lang.toLowerCase().replace("_", "-") === code) return vs[i];
      for (var j = 0; j < vs.length; j++) if (vs[j].lang && vs[j].lang.toLowerCase().indexOf(lang) === 0) return vs[j];
      return null;
    }
    function speak() {
      if (!synth) return;
      synth.cancel();
      var id = ++speakId, voice = pickVoice(), parts = speechParts();
      reading = true;
      $("gn-snd").classList.add("gn-on");
      $("gn-sico").textContent = "⏹";
      $("gn-slab").textContent = LANGS[lang].t.stop;
      parts.forEach(function (txt, i) {
        var u = new SpeechSynthesisUtterance(txt);
        u.lang = LANGS[lang].code;
        if (voice) u.voice = voice;
        u.onend = function () { if (id === speakId && i === parts.length - 1) stopSpeak(); };
        u.onerror = function () { if (id === speakId) stopSpeak(); };
        synth.speak(u);
      });
    }
    $("gn-snd").addEventListener("click", function () { reading ? stopSpeak() : speak(); });

    /* ---------- open / close (close button unlocks after N seconds) ---------- */
    function unlock() {
      locked = false; clearInterval(timer);
      xb.disabled = false; xb.innerHTML = XI; xb.removeAttribute("data-n");
      $("gn-pg").style.display = "none";
      updateCloseTitle();
    }
    function startLock() {
      var n = CONFIG.closeDelaySec;
      if (n <= 0) { unlock(); return; }
      clearInterval(timer);
      locked = true; xb.disabled = true; xb.textContent = n; xb.setAttribute("data-n", n);
      $("gn-pg").style.display = "";
      var bar = $("gn-pgi");
      bar.style.transition = "none"; bar.style.width = "100%";
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        bar.style.transition = "width " + n + "s linear"; bar.style.width = "0%";
      }); });
      updateCloseTitle();
      timer = setInterval(function () {
        n--;
        if (n <= 0) { unlock(); return; }
        xb.textContent = n; xb.setAttribute("data-n", n); updateCloseTitle();
      }, 1000);
    }

    var popups = 0, repTimer = null, hideTimer = null;
    function scheduleRepeat() {
      clearTimeout(repTimer);
      if (CONFIG.repeatEverySec <= 0) return;
      if (CONFIG.maxPopups > 0 && popups >= CONFIG.maxPopups) return;
      repTimer = setTimeout(function () { if (ov.style.display !== "flex") openModal(true); }, CONFIG.repeatEverySec * 1000);
    }
    function openModal(auto) {
      clearTimeout(repTimer); clearTimeout(hideTimer);
      if (auto === true) popups++;
      pill.style.display = "none";
      ov.style.display = "flex";
      lockScroll();
      requestAnimationFrame(function () { ov.classList.add("gn-in"); try { card.focus({ preventScroll: true }); } catch (e) {} });
      startCarousel();
      if (auto === true) startLock(); else unlock(); // re-opened from pill: close is instant
    }
    function close() {
      if (locked) return;
      stopSpeak();
      closeLb();
      ov.classList.remove("gn-in");
      unlockScroll();
      hideTimer = setTimeout(function () { ov.style.display = "none"; pill.style.display = "flex"; stopCarousel(); }, 300);
      scheduleRepeat();
    }
    xb.addEventListener("click", close);
    // full cover: clicking the dark background does NOT close it
    document.addEventListener("keydown", function (e) {
      if (ov.style.display !== "flex") return;
      if (e.key === "Escape") { if (lb.classList.contains("gn-show")) closeLb(); else close(); }
      else if (lb.classList.contains("gn-show")) {
        var rtl = card.dir === "rtl";
        if (e.key === "ArrowRight") step(rtl ? -1 : 1); else if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
      } else if (e.key === "Tab") {
        var f = card.querySelectorAll("button:not([disabled]),a[href]");
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    $("gn-pb").addEventListener("click", function () { openModal(false); });
    $("gn-px").addEventListener("click", function () { pill.style.display = "none"; });
    render();
    ov.style.display = "none";
    // EVERY load / refresh shows the full-screen cover again
    if (CONFIG.showDelayMs > 0) setTimeout(function () { openModal(true); }, CONFIG.showDelayMs);
    else openModal(true);
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
