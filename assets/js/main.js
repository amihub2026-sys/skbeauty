/* SK BEAUTY SPOT · Responsive cinematic single page website */
(() => {
  'use strict';
  const $ = (query, root = document) => root.querySelector(query);
  const $$ = (query, root = document) => [...root.querySelectorAll(query)];
  const config = window.SK_CONFIG || {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intro = $('#intro');
  const introVideo = $('#introVideo');
  const heroVideo = $('#heroVideo');
  const header = $('#siteHeader');
  const menu = $('#siteNav');
  const menuToggle = $('#menuToggle');
  const backTop = $('#backToTop');
  const scrollMeter = $('#scrollMeter');
  const bookForm = $('#bookingForm');
  let introTimer = null;
  let introClosing = false;
  let introHasPlayed = false;

  function whatsAppUrl(text) {
    return `https://wa.me/${String(config.phoneDigits || '919000000000').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  }
  function readIntroSession() {
    try { return sessionStorage.getItem('skBeautySpotIntroSeen') === '1'; }
    catch { return false; }
  }
  function saveIntroSession() {
    try { sessionStorage.setItem('skBeautySpotIntroSeen', '1'); }
    catch { /* Private-browsing storage may be disabled */ }
  }
  function fadeIntro() {
    if (introClosing || !intro) return;
    introClosing = true;
    window.clearTimeout(introTimer);
    intro.classList.add('is-hidden');
    intro.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('intro-active');
    saveIntroSession();
    introHasPlayed = true;
    if (introVideo) introVideo.pause();
    if (heroVideo && !prefersReducedMotion.matches) {
      heroVideo.play().catch(() => {});
    }
  }
  function playIntro(force = false) {
    if (!intro || !introVideo) { document.body.classList.remove('intro-active'); return; }
    if (!force && (readIntroSession() || prefersReducedMotion.matches)) {
      intro.classList.add('is-hidden');
      intro.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('intro-active');
      introHasPlayed = true;
      return;
    }
    introClosing = false;
    introHasPlayed = false;
    intro.classList.remove('is-hidden');
    intro.setAttribute('aria-hidden', 'false');
    document.body.classList.add('intro-active');
    introVideo.muted = true;
    introVideo.currentTime = 0;
    if (heroVideo) heroVideo.pause();
    const pending = introVideo.play();
    if (pending && pending.catch) pending.catch(() => {
      // Autoplay may be blocked, so do not leave visitors trapped on black.
      fadeIntro();
    });
    window.clearTimeout(introTimer);
    introTimer = window.setTimeout(fadeIntro, 11000);
  }
  if (introVideo) {
    introVideo.addEventListener('ended', fadeIntro);
    introVideo.addEventListener('error', fadeIntro);
  }
  $('#skipIntro')?.addEventListener('click', fadeIntro);
  $('#replayIntro')?.addEventListener('click', () => playIntro(true));
  playIntro();

  // Make temporary business links editable from one location.
  $$('[data-phone-text]').forEach(node => node.textContent = config.phoneDisplay || '+91 90000 00000');
  $$('[data-call-link]').forEach(node => node.href = `tel:+${String(config.phoneDigits || '919000000000').replace(/\D/g, '')}`);
  $$('[data-instagram-link]').forEach(node => node.href = config.instagramUrl || 'https://www.instagram.com/');
  $$('[data-whatsapp-link]').forEach(node => node.href = whatsAppUrl(config.enquiryGreeting || 'Hello SK Beauty Spot!'));
  $('#copyrightYear').textContent = String(new Date().getFullYear());

  function closeMenu() {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  }
  menuToggle?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', isOpen);
  });
  $$('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (menu?.classList.contains('is-open') && !event.target.closest('.site-header')) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 990) closeMenu(); });

  // One passive scroll listener handles nav, back to top and progress.
  let scheduled = false;
  function updateScroll() {
    const y = window.scrollY || 0;
    header?.classList.toggle('is-sticky', y > 45);
    backTop?.classList.toggle('is-visible', y > 500);
    if (scrollMeter) {
      const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollMeter.style.width = `${Math.min(100, y / distance * 100)}%`;
    }
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateScroll);
  }, { passive: true });
  updateScroll();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'instant' : 'smooth' }));

  // Section highlight.
  const observedSections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        let selector = entry.target.id;
        if (selector === 'outlet' || selector === 'signature') selector = 'services';
        if (selector === 'why' || selector === 'experience') selector = 'about';
        $$('.site-nav a').forEach(link => link.classList.toggle('nav-active', link.hash === `#${selector}`));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    observedSections.forEach(section => observer.observe(section));
  }

  // Apply alternating, staggered entrance animations to repeated cards.
  // Avoid adding scroll handlers per card: the one observer below handles all.
  const cardGroups = ['.look-card','.service-card','.outlet-item','.artist-card','.signature-item','.client-value'];
  cardGroups.forEach(selector => {
    $$(selector).forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 95}ms`);
    });
  });

  // Scroll reveal with graceful fallback.
  const revealNodes = $$('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
    const reveals = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .09, rootMargin: '0px 0px -34px 0px' });
    revealNodes.forEach(node => reveals.observe(node));
  } else revealNodes.forEach(node => node.classList.add('is-visible'));

  // Video pause/play control for visitors and accessibility.
  const videoButton = $('#videoToggle');
  const updateVideoButton = () => {
    if (!videoButton || !heroVideo) return;
    videoButton.textContent = heroVideo.paused ? '▶ PLAY' : 'Ⅱ PAUSE';
    videoButton.setAttribute('aria-label', heroVideo.paused ? 'Play background video' : 'Pause background video');
  };
  videoButton?.addEventListener('click', () => {
    if (!heroVideo) return;
    if (heroVideo.paused) heroVideo.play().catch(() => {});
    else heroVideo.pause();
    updateVideoButton();
  });
  heroVideo?.addEventListener('play', updateVideoButton);
  heroVideo?.addEventListener('pause', updateVideoButton);
  if (prefersReducedMotion.matches && heroVideo) heroVideo.pause();
  updateVideoButton();

  // Gallery filtering and accessible lightbox.
  const allItems = $$('[data-gallery-item]');
  const filters = $$('[data-filter]');
  let visibleItems = allItems;
  let currentIndex = 0;
  let previousFocus = null;
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  function setFilter(category) {
    filters.forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    allItems.forEach(item => item.classList.toggle('is-filtered', category !== 'all' && item.dataset.category !== category));
    visibleItems = allItems.filter(item => !item.classList.contains('is-filtered'));
  }
  filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  function showLightboxImage(index) {
    if (!visibleItems.length) return;
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    lightboxImage.src = item.dataset.image;
    lightboxImage.alt = item.dataset.title + ', beauty look inspiration';
    lightboxCaption.textContent = `${item.dataset.title} · ${currentIndex + 1} / ${visibleItems.length}`;
  }
  function openLightbox(item) {
    if (!lightbox) return;
    previousFocus = document.activeElement;
    currentIndex = Math.max(0, visibleItems.indexOf(item));
    showLightboxImage(currentIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lightboxClose')?.focus();
  }
  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.removeAttribute('src');
    previousFocus?.focus?.();
  }
  allItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
  $('#lightboxClose')?.addEventListener('click', closeLightbox);
  $('#lightboxPrev')?.addEventListener('click', () => showLightboxImage(currentIndex - 1));
  $('#lightboxNext')?.addEventListener('click', () => showLightboxImage(currentIndex + 1));
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeLightbox(); closeMenu(); if (!introHasPlayed) fadeIntro(); }
    if (!lightbox?.classList.contains('is-open')) return;
    if (event.key === 'ArrowLeft') showLightboxImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showLightboxImage(currentIndex + 1);
    // Confine tab navigation to lightbox controls.
    if (event.key === 'Tab') {
      const focusables = $$('button', lightbox);
      const index = focusables.indexOf(document.activeElement);
      const next = (index + (event.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
      event.preventDefault();
      focusables[next].focus();
    }
  });

  // Service enquiries can also be started directly from any service card.
  $$('[data-book]').forEach(button => button.addEventListener('click', () => {
    const service = button.dataset.book || 'Beauty service';
    const select = $('#bookingService');
    if (select) {
      const exact = [...select.options].find(option => option.value === service);
      select.value = exact ? service : 'Other beauty service';
      if (!exact) $('#bookingMessage').value = `I would like to enquire about ${service}.`;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
    window.setTimeout(() => $('#bookingName')?.focus({ preventScroll: true }), 500);
  }));

  bookForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookForm.reportValidity()) return;
    const form = new FormData(bookForm);
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const service = String(form.get('service') || '').trim();
    const message = String(form.get('message') || '').trim();
    const text = [
      config.enquiryGreeting || 'Hello SK Beauty Spot!',
      '',
      `Name: ${name}`,
      `Mobile: ${phone}`,
      `Service: ${service}`,
      ...(message ? [`Details: ${message}`] : []),
      '', 'Please share appointment availability and details. Thank you!'
    ].join('\n');
    const url = whatsAppUrl(text);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // Nice offline behaviour while retaining online-first HTTP imagery.
  $$('img[src^="https://images.unsplash.com/"]').forEach(node => {
    node.addEventListener('error', () => {
      node.onerror = null;
      node.src = 'assets/images/photo-fallback.svg';
    }, { once: true });
  });
})();
