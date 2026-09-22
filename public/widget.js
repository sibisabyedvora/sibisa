(function () {
  'use strict';

  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var publicKey = currentScript ? currentScript.getAttribute('data-key') : null;
  if (!publicKey) {
    console.error('[SIBISA Widget] Missing data-key attribute on script tag.');
    return;
  }

  var scriptSrc = currentScript.src || '';
  var originUrl = new URL(scriptSrc).origin;

  var containerId = 'sibisa-widget-container';
  if (document.getElementById(containerId)) return;

  var container = document.createElement('div');
  container.id = containerId;
  container.style.position = 'fixed';
  container.style.zIndex = '2147483647';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  // Floating Launcher Bubble Button (56px)
  var button = document.createElement('button');
  button.id = 'sibisa-widget-launcher';
  button.setAttribute('aria-label', 'Buka Chat SIBISA');
  button.style.width = '56px';
  button.style.height = '56px';
  button.style.borderRadius = '50%';
  button.style.backgroundColor = '#4F46E5';
  button.style.color = '#FFFFFF';
  button.style.border = 'none';
  button.style.boxShadow = '0 10px 25px -5px rgba(79, 70, 229, 0.4)';
  button.style.cursor = 'pointer';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
  button.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  // Iframe Container
  var iframe = document.createElement('iframe');
  iframe.id = 'sibisa-widget-iframe';
  iframe.src = originUrl + '/embed/' + encodeURIComponent(publicKey);
  iframe.title = 'SIBISA AI Chatbot';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 20px 30px -10px rgba(15, 23, 42, 0.2)';
  iframe.style.width = '380px';
  iframe.style.height = '560px';
  iframe.style.display = 'none';
  iframe.style.opacity = '0';
  iframe.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  iframe.style.transform = 'translateY(10px)';

  var isOpen = false;

  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.display = 'block';
      setTimeout(function () {
        iframe.style.opacity = '1';
        iframe.style.transform = 'translateY(0)';
      }, 10);
      button.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      iframe.style.opacity = '0';
      iframe.style.transform = 'translateY(10px)';
      setTimeout(function () {
        iframe.style.display = 'none';
      }, 250);
      button.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    }
  }

  button.addEventListener('click', toggleWidget);

  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);

  // Handle Mobile Responsiveness
  function checkMobile() {
    if (window.innerWidth <= 480) {
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.borderRadius = '0';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
    } else {
      iframe.style.width = '380px';
      iframe.style.height = '560px';
      iframe.style.borderRadius = '16px';
      iframe.style.position = 'static';
    }
  }

  window.addEventListener('resize', checkMobile);
  checkMobile();

  // Listen for iframe config updates (e.g. primary color or position)
  window.addEventListener('message', function (event) {
    if (event.origin !== originUrl) return;
    try {
      var data = JSON.parse(event.data);
      if (data.type === 'SIBISA_CONFIG') {
        if (data.primaryColor) button.style.backgroundColor = data.primaryColor;
        if (data.position === 'bottom-left') {
          container.style.right = 'auto';
          container.style.left = '20px';
        }
      } else if (data.type === 'SIBISA_CLOSE') {
        if (isOpen) toggleWidget();
      }
    } catch {}
  });
})();
