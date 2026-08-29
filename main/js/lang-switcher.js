/**
 * Language Switcher — GunaTools.dev (Fixed Visibility)
 */
(function () {
  const LANGUAGES = [
    { code: 'en', label: 'English',    flag: '🇬🇧', path: '/tools/image-to-url' },
    { code: 'es', label: 'Español',    flag: '🇪🇸', path: '/es/tools/image-to-url' },
    { code: 'hi', label: 'हिंदी',      flag: '🇮🇳', path: '/hi/tools/image-to-url' },
    { code: 'pt', label: 'Português',  flag: '🇧🇷', path: '/pt/tools/image-to-url' },
    { code: 'de', label: 'Deutsch',    flag: '🇩🇪', path: '/de/tools/image-to-url' },
    { code: 'fr', label: 'Français',   flag: '🇫🇷', path: '/fr/tools/image-to-url' },
    { code: 'id', label: 'Indonesia',  flag: '🇮🇩', path: '/id/tools/image-to-url' },
    { code: 'tr', label: 'Türkçe',     flag: '🇹🇷', path: '/tr/tools/image-to-url' },
    { code: 'ar', label: 'العربية',    flag: '🇸🇦', path: '/ar/tools/image-to-url' },
    { code: 'ja', label: '日本語',     flag: '🇯🇵', path: '/ja/tools/image-to-url' },
    { code: 'it', label: 'Italiano',   flag: '🇮🇹', path: '/it/tools/image-to-url' },
  ];

  const currentLang = document.documentElement.lang || 'en';
  const current = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const styles = `
    <style>
      .gt-lang-switcher {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        position: relative;
        margin: 10px auto 0;
        font-family: 'Poppins', sans-serif;
        z-index: 9999;
      }
      .gt-lang-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        /* FIXED: Using a high-contrast background that works on light and dark */
        background: #f8f9fa; 
        border: 1px solid #ced4da;
        color: #333;
        padding: 7px 16px;
        border-radius: 30px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .gt-lang-btn:hover {
        background: #e9ecef;
        border-color: #adb5bd;
      }
      .gt-lang-btn .gt-arrow { font-size: 0.6rem; margin-left: 4px; }
      
      .gt-lang-dropdown {
        display: none;
        position: absolute;
        top: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        border: 1px solid #dee2e6;
        border-radius: 12px;
        padding: 8px;
        min-width: 180px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        max-height: 300px;
        overflow-y: auto;
      }
      .gt-lang-switcher.open .gt-lang-dropdown { display: block; }
      
      .gt-lang-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 8px;
        color: #333;
        font-size: 0.9rem;
        text-decoration: none;
      }
      .gt-lang-option:hover { background: #f1f3f5; }
      .gt-lang-option.gt-active { background: #e7f1ff; color: #007bff; font-weight: 600; }
    </style>
  `;

  // ... (Rest of your original logic remains the same)
  const optionsHTML = LANGUAGES.map(lang => {
    const isActive = lang.code === currentLang;
    return `<a href="${lang.path}" class="gt-lang-option${isActive ? ' gt-active' : ''}">
      <span class="gt-flag">${lang.flag}</span>
      <span>${lang.label}</span>
    </a>`;
  }).join('');

  const switcherHTML = `${styles}<div class="gt-lang-switcher" id="gtLangSwitcher"><button class="gt-lang-btn" id="gtLangBtn"><span>${current.flag}</span><span>${current.label}</span><span class="gt-arrow">▼</span></button><div class="gt-lang-dropdown" id="gtLangDropdown">${optionsHTML}</div></div>`;

  function injectSwitcher() {
    const target = document.querySelector('.container > header') || document.querySelector('header');
    if (!target) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = switcherHTML;
    target.appendChild(wrapper);

    const switcher = document.getElementById('gtLangSwitcher');
    const btn = document.getElementById('gtLangBtn');
    btn.addEventListener('click', (e) => { e.stopPropagation(); switcher.classList.toggle('open'); });
    document.addEventListener('click', () => switcher.classList.remove('open'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectSwitcher);
  else injectSwitcher();
})();