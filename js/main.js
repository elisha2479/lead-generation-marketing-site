/* =============================================================
   Omanyi.Media — main.js
   Mobile nav, FAQ accordion, scroll-reveal, active link state.
   Vanilla JS, no dependencies, accessible by default.
   ============================================================= */

(() => {
  'use strict';

  /* ── 1. ACTIVE NAV LINK ───────────────────────────────────── */
  const setActiveLink = () => {
    const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-menu a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (a.classList.contains('nav-cta')) return; // CTA never gets active state
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('is-active');
      } else {
        a.classList.remove('is-active');
      }
    });
  };

  /* ── 2. HAMBURGER MENU ────────────────────────────────────── */
  const initMobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('nav-open');
    };
    const openMenu = () => {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('nav-open');
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });

    // Close when a link is clicked
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Reset state if resized above breakpoint
    const mq = window.matchMedia('(min-width: 881px)');
    const handleResize = () => { if (mq.matches) closeMenu(); };
    mq.addEventListener ? mq.addEventListener('change', handleResize) : mq.addListener(handleResize);
  };

  /* ── 3. FAQ ACCORDION ─────────────────────────────────────── */
  const initFaq = () => {
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // Optional: close others (single-open behaviour)
        // document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  /* ── 4. SCROLL REVEAL ─────────────────────────────────────── */
  const initReveal = () => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('is-in'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  };

  /* ── 5. CONTACT FORM (light enhancement) ──────────────────── */
  const initForm = () => {
    const form = document.querySelector('[data-form="contact"]');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      // Honest placeholder: in production this posts to a real endpoint.
      // For now we just show a success state so the page is testable.
      const success = form.querySelector('.form-success');
      const formBody = form.querySelector('.form-body');
      if (success && formBody) {
        formBody.style.display = 'none';
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Log for dev only; in production replace with fetch() to a service
      // such as Formspree, Basin, or your own backend.
      console.log('[Omanyi.Media] form submitted:', data);
    });
  };

  /* ── BOOT ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    initMobileNav();
    initFaq();
    initReveal();
    initForm();
  });
})();