'use strict';

// Keep the same navigation surface between routes so the lens can travel.
(() => {
  const nav = document.getElementById('nav-links');
  const rail = document.querySelector('.glass-rail');
  let frame;
  let preview = null;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // Edge displacement is an enhancement. Other engines retain the CSS material.
  const map = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="x"><stop stop-color="#ff0000"/><stop offset=".2" stop-color="#800000"/><stop offset=".8" stop-color="#800000"/><stop offset="1" stop-color="#000000"/></linearGradient><linearGradient id="y" x2="0" y2="1"><stop stop-color="#00ff00"/><stop offset=".2" stop-color="#008000"/><stop offset=".8" stop-color="#008000"/><stop offset="1" stop-color="#000000"/></linearGradient></defs><rect width="100" height="100" fill="url(#x)"/><rect width="100" height="100" fill="url(#y)" style="mix-blend-mode:screen"/></svg>`;
  const optics = document.createElementNS('http://www.w3.org/2000/svg','svg');
  optics.setAttribute('aria-hidden','true');
  optics.classList.add('glass-optics');
  optics.innerHTML = `<defs><filter id="nav-glass-refraction" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage href="data:image/svg+xml,${encodeURIComponent(map)}" width="100%" height="100%" preserveAspectRatio="none" result="lens-map"/><feDisplacementMap in="SourceGraphic" in2="lens-map" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
  document.body.append(optics);
  const moveLens = () => {
    const target = preview || nav.querySelector('.active');
    rail.classList.toggle('lens-visible', Boolean(target));
    if (!target || !nav.offsetHeight) return;
    nav.style.setProperty('--lens-y', `${target.offsetTop}px`);
    nav.style.setProperty('--lens-height', `${target.offsetHeight}px`);
  };
  window.refreshGlass = () => {
    preview = null;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(moveLens);
  };
  nav.addEventListener('pointerover', event => {
    const link = event.target.closest('a');
    if (link) { preview = link; moveLens(); }
  });
  nav.addEventListener('pointerleave', () => { preview = null; moveLens(); });
  nav.addEventListener('focusin', event => { preview = event.target.closest('a'); moveLens(); });
  nav.addEventListener('focusout', () => { preview = null; moveLens(); });
  rail.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const bounds = rail.getBoundingClientRect();
    rail.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
    rail.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
  });
  rail.addEventListener('pointerleave', () => {
    rail.style.removeProperty('--light-x');
    rail.style.removeProperty('--light-y');
  });
  // Native links remain clickable; keys change focus without triggering navigation.
  nav.addEventListener('keydown', event => {
    if (!['ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    const links = [...nav.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links[next].focus();
  });
  window.addEventListener('resize', window.refreshGlass);
  window.refreshGlass();
})();
