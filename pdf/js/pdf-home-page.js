(function () {
  'use strict';
  
  // 1. Create a unique container to prevent style leakage
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.left = '50%';
  container.style.transform = 'translateX(-50%)';
  container.style.zIndex = '999999';
  container.id = 'home-btn-container-gtd';
  document.body.appendChild(container);

  // 2. Inject scoped styles
  const style = document.createElement('style');
  style.textContent = `
    #home-page-button-top-gtd {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 50px;
      font-family: sans-serif;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      color: #333;
      background: #fff;
      border: 1px solid #ddd;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      white-space: nowrap;
    }
    #home-page-button-top-gtd:hover {
      border-color: #000;
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
    #home-page-button-top-gtd.hide {
      opacity: 0;
      visibility: hidden;
      transform: translateY(-20px);
    }
  `;
  document.head.appendChild(style);

  // 3. Build the button
  const btn = document.createElement('a');
  btn.id = 'home-page-button-top-gtd';
  btn.href = '/pdf/';
  btn.innerHTML = '🏠 PDF Home';
  container.appendChild(btn);

  // 4. Scroll logic (no deformation)
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    if (y > lastY && y > 100) {
      btn.classList.add('hide');
    } else {
      btn.classList.remove('hide');
    }
    lastY = y;
  }, { passive: true });
})();
