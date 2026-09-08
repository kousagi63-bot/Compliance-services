(function () {
  'use strict';

  if (typeof window === 'undefined' || !window.gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  gsap.defaults({ ease: 'expo.out' });

  var mm = gsap.matchMedia();

  var PRELOAD_HOLD = 0.85;
  var PRELOAD_LIFT = 0.8;
  var isMobile = (typeof window !== 'undefined' && window.innerWidth < 768);

  function splitWords(el) {
    var frag = document.createDocumentFragment();
    Array.prototype.forEach.call(el.childNodes, function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else {
            var s = document.createElement('span');
            s.className = 'gsap-word';
            s.style.display = 'inline-block';
            s.style.willChange = 'transform';
            s.textContent = part;
            frag.appendChild(s);
          }
        });
      } else {
        frag.appendChild(node.cloneNode(true));
      }
    });
    el.textContent = '';
    el.appendChild(frag);
  }

  document.querySelectorAll('[data-hero]').forEach(function (wrap) {
    var section = wrap.closest('section');
    var glow = section ? section.querySelector('.hero-radial-glow') : null;
    var children = [];
    Array.prototype.forEach.call(wrap.children, function (c) {
      if (c.getAttribute('data-hero-skip') === null) children.push(c);
    });
    var visuals = section ? section.querySelectorAll('[data-hero-visual]') : [];
    if (!children.length && !visuals.length) return;

    var tl = gsap.timeline({ delay: PRELOAD_HOLD + 0.1 });

    if (glow) {
      tl.fromTo(
        glow,
        { autoAlpha: 0, scale: 0.86 },
        { autoAlpha: 0.85, scale: 1, duration: 1.8, ease: 'expo.out' },
        0
      );
    }

    tl.fromTo(
      wrap,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', clearProps: 'clipPath' },
      0
    );

    if (visuals.length) {
      tl.fromTo(
        visuals,
        { autoAlpha: 0, y: isMobile ? 18 : 32, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: 'expo.out',
          stagger: { amount: 0.22, ease: 'power2.out' },
          clearProps: 'transform'
        },
        children.length * 0.08 + 0.2
      );
    }

    children.forEach(function (child, i) {
      if (child.tagName === 'H1') {
        splitWords(child);
        var words = child.querySelectorAll('.gsap-word');
        tl.fromTo(
          words,
          {
            y: isMobile ? 24 : 36,
            autoAlpha: 0,
            scale: 0.96,
            rotateX: isMobile ? 0 : 16,
            transformOrigin: '50% 100%',
            transformPerspective: 600
          },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.95,
            ease: 'expo.out',
            stagger: {
              amount: Math.min(0.42, words.length * 0.04),
              ease: 'power2.out'
            },
            clearProps: 'transform'
          },
          i * 0.08
        );
      } else {
        tl.fromTo(
          child,
          { y: isMobile ? 18 : 28, autoAlpha: 0, scale: 0.97 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.85, ease: 'expo.out', clearProps: 'transform' },
          i * 0.09 + 0.12
        );
      }
    });
  });

  var header = document.querySelector('header');
  if (header) {
    header.classList.add('header-transitions');

    var nav = header.querySelector('nav');
    if (nav) {
      nav.classList.add('nav-desktop');
      var pageFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
      Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        if (a.getAttribute('href').toLowerCase() === pageFile) a.classList.add('nav-active');
      });
    }

    gsap.from(header, {
      yPercent: -100,
      autoAlpha: 0,
      duration: 0.85,
      ease: 'expo.out',
      delay: PRELOAD_HOLD - 0.1,
      clearProps: 'transform'
    });

    function updateHeader() {
      if ((window.scrollY || window.pageYOffset) > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('load', updateHeader);
    updateHeader();
  }

  function buildPreloader() {
    if (document.getElementById('sitePreloader')) return;

    var pre = document.createElement('div');
    pre.id = 'sitePreloader';
    pre.innerHTML =
      '<div class="preloader-inner">' +
      '<span class="preloader-ring"></span>' +
      '<img class="preloader-logo" src="logo.webp" alt="Stackly" />' +
      '<span class="preloader-icons">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15l2 2 4-4"/></svg>' +
      '</span>' +
      '<span class="preloader-bar"><span></span></span>' +
      '<span class="preloader-status"><i></i>Loading</span>' +
      '</div>';
    document.body.appendChild(pre);

    var inner = pre.querySelector('.preloader-inner');
    var bar = pre.querySelector('.preloader-bar > span');
    var ring = pre.querySelector('.preloader-ring');
    var logo = pre.querySelector('.preloader-logo');
    var icons = pre.querySelectorAll('.preloader-icons svg');
    var status = pre.querySelector('.preloader-status');

    var tl = gsap.timeline();
    tl.fromTo(ring, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0);
    tl.fromTo(
      ring,
      { rotate: 0 },
      { rotate: 360, duration: 1.1, repeat: -1, ease: 'none' },
      0
    );
    tl.fromTo(logo, { y: 12, autoAlpha: 0, scale: 0.94 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.55, ease: 'expo.out' }, 0.05);
    tl.fromTo(
      icons,
      { y: 8, autoAlpha: 0, scale: 0.6 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)', stagger: 0.08 },
      0.15
    );
    tl.fromTo(status, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'expo.out' }, 0.2);
    tl.to(bar, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 0.1);

    gsap.delayedCall(PRELOAD_HOLD, function () {
      var exit = gsap.timeline({
        onComplete: function () {
          if (pre.parentNode) pre.parentNode.removeChild(pre);
        }
      });
      exit.to(inner, { autoAlpha: 0, y: -16, scale: 0.96, duration: 0.35, ease: 'power2.in' }, 0);
      exit.to(pre, { yPercent: -100, duration: PRELOAD_LIFT, ease: 'expo.inOut' }, 0.1);
    });
  }

  buildPreloader();

  // Premium easing, upward entrance & subtle 3D rotation reveal definitions
  var types = {
    up: {
      from: {
        y: isMobile ? 26 : 48,
        rotationX: isMobile ? 5 : 12,
        scale: isMobile ? 0.985 : 0.96,
        autoAlpha: 0,
        transformOrigin: '50% 100%',
        transformPerspective: 850
      },
      ease: 'expo.out',
      duration: isMobile ? 0.8 : 0.95
    },
    down: {
      from: {
        y: isMobile ? -26 : -48,
        rotationX: isMobile ? -5 : -12,
        scale: isMobile ? 0.985 : 0.96,
        autoAlpha: 0,
        transformOrigin: '50% 0%',
        transformPerspective: 850
      },
      ease: 'expo.out',
      duration: isMobile ? 0.8 : 0.95
    },
    left: {
      // On mobile, lateral x translation is safely converted to vertical rise + subtle scale,
      // strictly guaranteeing zero risk of triggering horizontal overflow.
      from: isMobile
        ? { y: 24, rotationX: 5, scale: 0.985, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 }
        : { x: -40, y: 22, rotationX: 10, scale: 0.97, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 },
      ease: 'expo.out',
      duration: isMobile ? 0.8 : 0.95
    },
    right: {
      from: isMobile
        ? { y: 24, rotationX: 5, scale: 0.985, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 }
        : { x: 40, y: 22, rotationX: 10, scale: 0.97, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 },
      ease: 'expo.out',
      duration: isMobile ? 0.8 : 0.95
    },
    zoom: {
      from: { scale: isMobile ? 0.96 : 0.92, y: isMobile ? 12 : 22, rotationX: isMobile ? 4 : 8, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 },
      ease: 'expo.out',
      duration: isMobile ? 0.85 : 1.0
    },
    pop: {
      from: { scale: isMobile ? 0.94 : 0.91, y: isMobile ? 14 : 24, rotationX: isMobile ? 4 : 10, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 },
      ease: 'back.out(1.4)',
      duration: isMobile ? 0.8 : 0.95
    },
    flip: {
      from: isMobile
        ? { y: 24, rotationX: 6, scale: 0.97, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 }
        : { rotationX: -32, y: 28, scale: 0.96, autoAlpha: 0, transformOrigin: '50% 120%', transformPerspective: 900 },
      ease: 'expo.out',
      duration: isMobile ? 0.8 : 1.0
    },
    fade: {
      from: { y: isMobile ? 12 : 18, rotationX: isMobile ? 3 : 6, scale: 0.985, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 },
      ease: 'expo.out',
      duration: isMobile ? 0.75 : 0.85
    },
    clip: {
      from: { clipPath: 'inset(100% 0% 0% 0%)', y: isMobile ? 16 : 28, rotationX: isMobile ? 4 : 8, scale: 0.98, autoAlpha: 0, transformOrigin: '50% 100%', transformPerspective: 850 },
      ease: 'expo.out',
      duration: isMobile ? 0.85 : 1.05
    }
  };

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    var type = el.getAttribute('data-reveal') || 'up';
    var cfg = types[type] || types.up;
    var delay = parseFloat(el.getAttribute('data-delay') || 0);
    var from = Object.assign({}, cfg.from);
    var isSmall = window.innerWidth < 768;

    gsap.fromTo(
      el,
      from,
      {
        x: 0,
        y: 0,
        scale: 1,
        rotationX: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        autoAlpha: 1,
        duration: cfg.duration || 0.95,
        ease: cfg.ease || 'expo.out',
        delay: delay,
        clearProps: 'transform,clipPath',
        scrollTrigger: {
          trigger: el,
          start: isSmall ? 'top 92%' : 'top 88%',
          once: true
        }
      }
    );
  });

  document.querySelectorAll('[data-stagger]').forEach(function (container) {
    var type = container.getAttribute('data-stagger') || 'up';
    var cfg = types[type] || types.up;
    var customGap = container.getAttribute('data-gap');
    var children = Array.prototype.slice.call(container.children).filter(function (c) {
      var r = c.getBoundingClientRect();
      return r.width > 0 || r.height > 0;
    });
    if (!children.length) return;
    if (!isMobile) container.style.perspective = '1000px';

    var from = Object.assign({}, cfg.from);
    var isSmall = window.innerWidth < 768;

    // Reveal cards one-by-one with sequential stagger
    var staggerOpts;
    if (customGap) {
      staggerOpts = parseFloat(customGap);
    } else {
      staggerOpts = {
        each: isSmall ? 0.08 : 0.11,
        from: 'start',
        ease: 'power1.inOut'
      };
    }

    gsap.fromTo(
      children,
      from,
      {
        x: 0,
        y: 0,
        scale: 1,
        rotationX: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        autoAlpha: 1,
        duration: cfg.duration || 0.9,
        ease: cfg.ease || 'expo.out',
        stagger: staggerOpts,
        clearProps: 'transform,clipPath',
        scrollTrigger: {
          trigger: container,
          start: isSmall ? 'top 90%' : 'top 82%',
          once: true
        }
      }
    );
  });

  document.querySelectorAll('[data-steps]').forEach(function (container) {
    var items = Array.prototype.slice.call(container.children);
    if (!items.length) return;
    var isSmall = window.innerWidth < 768;

    gsap.fromTo(
      items,
      { y: isSmall ? 26 : 38, scale: isSmall ? 0.98 : 0.96, autoAlpha: 0 },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: {
          amount: Math.min(isSmall ? 0.35 : 0.5, items.length * 0.12),
          ease: 'power2.out'
        },
        clearProps: 'transform',
        scrollTrigger: { trigger: container, start: isSmall ? 'top 88%' : 'top 82%', once: true }
      }
    );
    items.forEach(function (item, i) {
      var num = item.querySelector('.font-mono.text-xs.text-equator');
      var dash = item.querySelector('.h-0\\.5');
      var delay = 0.12 + i * 0.12;
      if (num) {
        gsap.fromTo(
          num,
          { scale: 0.85, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            delay: delay,
            ease: 'expo.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: container, start: isSmall ? 'top 88%' : 'top 82%', once: true }
          }
        );
      }
      if (dash) {
        gsap.fromTo(
          dash,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.85,
            delay: delay,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: container, start: isSmall ? 'top 88%' : 'top 82%', once: true }
          }
        );
      }
    });
  });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    var text = (el.textContent || '').trim();
    var m = text.match(/^([\d.,]+)([^0-9]*)$/);
    if (!m) return;
    var raw = m[1].replace(/,/g, '');
    var hasComma = m[1].indexOf(',') !== -1;
    var target = parseFloat(raw);
    var suffix = m[2];
    var obj = { v: 0 };
    var isSmall = window.innerWidth < 768;

    gsap.fromTo(
      el,
      { scale: isSmall ? 0.98 : 0.95, autoAlpha: 0.8 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 1.1,
        ease: 'expo.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );

    gsap.to(obj, {
      v: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () {
        var val;
        if (hasComma || target >= 1000) {
          val = Math.round(obj.v).toLocaleString('en-US');
        } else if (target % 1 !== 0) {
          val = obj.v.toFixed(1);
        } else {
          val = Math.round(obj.v) + '';
        }
        el.textContent = val + suffix;
      }
    });
  });

  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', function () {
    document.querySelectorAll('[data-parallax]').forEach(function (wrap) {
      var img = wrap.querySelector('img');
      if (!img) return;
      gsap.set(img, { scale: 1.25 });
      gsap.fromTo(
        img,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    });

    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.style.willChange = 'transform';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, {
          rotationY: px * 7,
          rotationX: -py * 5,
          scale: 1.012,
          transformPerspective: 900,
          duration: 0.5,
          ease: 'expo.out'
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'expo.out', clearProps: 'transform' });
      });
    });

    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.style.willChange = 'transform';
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = ((e.clientX - r.left - r.width / 2) * 24) / r.width;
        var y = ((e.clientY - r.top - r.height / 2) * 24) / r.height;
        gsap.to(btn, { x: x, y: y, scale: 1.02, duration: 0.4, ease: 'expo.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.45)',
          onComplete: function () {
            gsap.set(btn, { clearProps: 'transform' });
          }
        });
      });
    });
  });

  document.querySelectorAll('[data-404]').forEach(function (el) {
    var text = el.textContent.trim();
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement('span');
      s.className = 'gsap-digit';
      s.style.display = 'inline-block';
      s.style.transformOrigin = '50% 100%';
      s.textContent = text[i];
      frag.appendChild(s);
    }
    el.textContent = '';
    el.appendChild(frag);
    gsap.fromTo(
      el.querySelectorAll('.gsap-digit'),
      { yPercent: 70, autoAlpha: 0, scale: 0.88 },
      { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.2, clearProps: 'transform' }
    );
  });

  var bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText =
    'position:fixed;top:0;left:0;height:3px;width:100%;transform-origin:0 50%;' +
    'background:linear-gradient(90deg,#D4A348,#5B45F5);z-index:80;pointer-events:none;';
  document.body.appendChild(bar);
  gsap.set(bar, { scaleX: 0 });
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
  });

  // Card interactive hover enhancement with GSAP lift, scale, moving gradient glow, and icon/image micro-zoom
  function initCardInteractive() {
    var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var selector = [
      '.bg-card-dark',
      '.bg-white.rounded-xl',
      '.bg-white.rounded-2xl',
      '.bg-albescent-white.rounded-xl',
      '.bg-albescent-white.rounded-2xl',
      '.bg-\\[\\#F5F6F8\\].rounded-2xl',
      '[data-card]'
    ].join(', ');

    var elements = document.querySelectorAll(selector);

    elements.forEach(function (card) {
      // Exclude structural / non-card elements
      if (card.id === 'mobileDrawer' || card.id === 'consultModal' || card.id === 'sitePreloader' || card.id === 'toast') return;
      if (card.tagName === 'TABLE' || card.tagName === 'THEAD' || card.tagName === 'TBODY') return;
      if (card.classList.contains('dash-table-wrap') || card.closest('table')) return;
      if (card.offsetWidth < 120 || card.offsetHeight < 60) return;

      // Ensure base class
      card.classList.add('card-interactive');

      // Inject moving gradient flowing border if missing
      if (!card.querySelector('.card-glow-border')) {
        var border = document.createElement('div');
        border.className = 'card-glow-border';
        card.appendChild(border);
      }

      // Inject spotlight glow sheen if missing
      if (!card.querySelector('.card-spotlight-glow')) {
        var spotlight = document.createElement('div');
        spotlight.className = 'card-spotlight-glow';
        card.appendChild(spotlight);
      }

      if (!isDesktop) return; // Touch devices rely on tactile inward press from CSS

      var glowBorder = card.querySelector('.card-glow-border');
      var spotlight = card.querySelector('.card-spotlight-glow');
      var icon = card.querySelector('.w-10.h-10, .w-12.h-12, .w-14.h-14, .p-3 > svg, .p-2\\.5 > svg') || card.querySelector('svg:not(.card-glow-border svg)');
      var img = card.querySelector('.overflow-hidden img, img.object-cover, img.rounded-t-2xl, img.rounded-xl, img');

      card.addEventListener('mouseenter', function () {
        // Subtle card lift & scale using GSAP (tasteful & restrained: y: -5, scale: 1.015)
        gsap.to(card, {
          y: -5,
          scale: 1.015,
          duration: 0.4,
          ease: 'expo.out',
          overwrite: 'auto'
        });

        // Activate moving gradient glow and ambient highlight
        if (glowBorder) gsap.to(glowBorder, { autoAlpha: 1, duration: 0.35, ease: 'expo.out', overwrite: 'auto' });
        if (spotlight) gsap.to(spotlight, { autoAlpha: 1, duration: 0.35, ease: 'expo.out', overwrite: 'auto' });
        card.classList.add('is-hovered');

        // Subtle icon & image micro-zoom on hover
        if (icon) {
          gsap.to(icon, { scale: 1.08, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
        }
        if (img) {
          gsap.to(img, { scale: 1.035, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
        }
      });

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });

      card.addEventListener('mouseleave', function () {
        // Return card smoothly to resting baseline
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.48,
          ease: 'expo.out',
          overwrite: 'auto',
          clearProps: 'transform'
        });

        // Deactivate moving gradient glow
        if (glowBorder) gsap.to(glowBorder, { autoAlpha: 0, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
        if (spotlight) gsap.to(spotlight, { autoAlpha: 0, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
        card.classList.remove('is-hovered');

        // Reset icon & image zoom
        if (icon) {
          gsap.to(icon, { scale: 1, duration: 0.42, ease: 'expo.out', overwrite: 'auto', clearProps: 'transform' });
        }
        if (img) {
          gsap.to(img, { scale: 1, duration: 0.48, ease: 'expo.out', overwrite: 'auto', clearProps: 'transform' });
        }
      });
    });
  }

  initCardInteractive();

  window.addEventListener('load', function () {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    initCardInteractive();
  });
})();