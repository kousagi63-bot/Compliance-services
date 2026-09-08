// Interactive functionality for Stackly Landing Page

document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer navigation toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    const svg = mobileMenuBtn.querySelector('svg');
    const hamburgerSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    const closeSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';

    const toggleMenu = (forceState) => {
      const shouldOpen = typeof forceState === 'boolean' ? forceState : mobileDrawer.classList.contains('hidden');
      if (shouldOpen) {
        mobileDrawer.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (svg) svg.innerHTML = closeSvg;

        if (window.gsap) {
          gsap.killTweensOf(mobileDrawer);
          gsap.fromTo(
            mobileDrawer,
            { autoAlpha: 0, y: -10, scale: 0.985 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'expo.out', clearProps: 'transform' }
          );
          const links = mobileDrawer.querySelectorAll('a, button');
          if (links.length) {
            gsap.fromTo(
              links,
              { autoAlpha: 0, y: -6, scale: 0.98 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: 'expo.out', stagger: 0.03, clearProps: 'transform' }
            );
          }
        }
      } else {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (svg) svg.innerHTML = hamburgerSvg;

        if (window.gsap && !mobileDrawer.classList.contains('hidden')) {
          gsap.to(mobileDrawer, {
            autoAlpha: 0,
            y: -6,
            scale: 0.99,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
              mobileDrawer.classList.add('hidden');
              gsap.set(mobileDrawer, { clearProps: 'all' });
            }
          });
        } else {
          mobileDrawer.classList.add('hidden');
        }
      }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close mobile menu on clicking any link or button inside it
    mobileDrawer.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close drawer when tapping outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeConsultModal();
    }
  });

  // Restore active role-based session on page load
  renderSession();
});

const SESSION_KEY = 'stacklySession';

function startSession(role, email) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      role: role === 'admin' ? 'admin' : 'user',
      email: email || '',
      signedInAt: new Date().toISOString()
    })
  );
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function endSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function renderSession() {
  const badge = document.getElementById('sessionBadge');
  const roleEl = document.getElementById('sessionRole');
  const emailEl = document.getElementById('sessionEmail');
  const session = getSession();
  if (!badge || !roleEl || !emailEl) return;
  if (session) {
    roleEl.textContent = session.role === 'admin' ? 'Admin' : 'User';
    emailEl.textContent = session.email ? ` • ${session.email}` : '';
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function handleSignOut() {
  endSession();
  renderSession();
  showToast('Session ended. Signed out of the portal.');
}

// Toast notification helper with subtle scale & premium easing
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);

  if (window.gsap) {
    gsap.killTweensOf(toast);
    gsap.fromTo(
      toast,
      { y: 16, scale: 0.94, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: 'expo.out', clearProps: 'transform' }
    );
    toastTimer = setTimeout(() => {
      gsap.to(toast, {
        y: 12,
        scale: 0.96,
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          toast.classList.add('hidden');
          gsap.set(toast, { clearProps: 'all' });
        }
      });
    }, 4000);
  } else {
    toast.classList.add('animate-fade-in');
    toastTimer = setTimeout(() => {
      toast.classList.remove('animate-fade-in');
      toast.classList.add('hidden');
    }, 4000);
  }
}

// Modal controls with subtle scale transitions & field staggering
function openConsultationModal(customTitle = 'Schedule a Consultation') {
  const modal = document.getElementById('consultModal');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('consultForm');
  const successState = document.getElementById('consultModalSuccess');

  if (modalTitle) modalTitle.textContent = customTitle;
  if (form) form.classList.remove('hidden');
  if (successState) successState.classList.add('hidden');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.gsap) {
      const panel = modal.querySelector('.rounded-2xl, .rounded-xl') || modal.firstElementChild;
      gsap.fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
      if (panel) {
        gsap.fromTo(
          panel,
          { y: 22, scale: 0.96, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'expo.out', clearProps: 'transform' }
        );
        const formEls = panel.querySelectorAll('form > div, button[type="submit"]');
        if (formEls.length) {
          gsap.fromTo(
            formEls,
            { y: 12, autoAlpha: 0, scale: 0.98 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.4,
              ease: 'expo.out',
              stagger: 0.035,
              delay: 0.08,
              clearProps: 'transform'
            }
          );
        }
      }
    }
  }
}

function closeConsultModal() {
  const modal = document.getElementById('consultModal');
  if (!modal) return;
  if (window.gsap) {
    const panel = modal.querySelector('.rounded-2xl, .rounded-xl') || modal.firstElementChild;
    const done = () => {
      modal.classList.add('hidden');
      gsap.set(modal, { clearProps: 'all' });
    };
    if (panel) gsap.to(panel, { y: 14, scale: 0.97, autoAlpha: 0, duration: 0.22, ease: 'power2.in' });
    gsap.to(modal, { autoAlpha: 0, duration: 0.24, ease: 'power2.in', onComplete: done });
  } else {
    modal.classList.add('hidden');
  }
}

function handleConsultSubmit(event) {
  event.preventDefault();
  var form = document.getElementById('consultForm');
  if (!form) { window.location.href = '404.html'; return; }

  var valid = true;
  var focusable = null;
  var inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

  Array.prototype.forEach.call(inputs, function (el, i) {
    el.classList.remove('border-red-500');
    var err = form.querySelector('.consult-error[data-for="' + i + '"]');
    if (err) { err.textContent = ''; err.style.display = 'none'; }

    var value = (el.value || '').trim();
    var ok = value.length > 0;
    if (ok && el.type === 'email') {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (!ok) {
      valid = false;
      el.classList.add('border-red-500');
      if (!focusable) focusable = el;
      if (!err) {
        err = document.createElement('p');
        err.className = 'consult-error block w-full text-[11px] text-red-400 font-mono mt-1.5';
        err.setAttribute('data-for', String(i));
        el.insertAdjacentElement('afterend', err);
      }
      err.textContent = el.type === 'email'
        ? 'Please provide a valid work email.'
        : 'Please provide the required detail.';
      err.style.display = '';
    }
  });

  if (!valid) {
    if (focusable) focusable.focus();
    return;
  }

  window.location.href = '404.html';
}

// Newsletter form handling
document.addEventListener('DOMContentLoaded', function () {
  var nlForms = document.querySelectorAll('form[onsubmit*="handleNewsletter"]');
  Array.prototype.forEach.call(nlForms, function (f) {
    f.setAttribute('novalidate', '');
    var input = f.querySelector('input[type="email"], input[type="text"]');
    if (input) {
      input.addEventListener('input', function () {
        var err = f.querySelector('.nl-error');
        if (err) {
          err.classList.add('hidden');
          err.style.display = 'none';
        }
        input.classList.remove('nl-input-error');
      });
    }
  });

  var consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.setAttribute('novalidate', '');
    Array.prototype.forEach.call(consultForm.querySelectorAll('input, textarea'), function (el) {
      el.addEventListener('input', function () {
        el.classList.remove('border-red-500');
        var idx = Array.prototype.indexOf.call(consultForm.querySelectorAll('input[required], select[required], textarea[required]'), el);
        if (idx >= 0) {
          var err = consultForm.querySelector('.consult-error[data-for="' + idx + '"]');
          if (err) { err.textContent = ''; err.style.display = 'none'; }
        }
      });
    });
  }

  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.setAttribute('novalidate', '');
    Array.prototype.forEach.call(loginForm.querySelectorAll('input'), function (el) {
      el.addEventListener('input', function () {
        el.classList.remove('border-red-500');
        var idx = Array.prototype.indexOf.call(loginForm.querySelectorAll('input[type="email"], input[type="password"]'), el);
        if (idx >= 0) {
          var err = loginForm.querySelector('.login-error[data-for="' + idx + '"]');
          if (err) { err.textContent = ''; err.style.display = 'none'; }
        }
      });
    });
  }
});

function handleNewsletter(event) {
  event.preventDefault();
  var form = event.target;
  var input = form.querySelector('input[type="email"], input[type="text"]');
  if (!input) { window.location.href = '404.html'; return; }

  var value = (input.value || '').trim();
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var error = form.querySelector('.nl-error');
  var success = form.querySelector('#newsletterSuccess') || (form.parentElement && form.parentElement.querySelector('#newsletterSuccess'));

  if (!error) {
    error = document.createElement('p');
    error.className = 'nl-error hidden text-xs text-rose-400 mt-2 font-mono flex items-center gap-1.5'
      + (form.classList.contains('text-center') || form.classList.contains('justify-center') ? ' justify-center' : '');
    error.innerHTML = '<svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span class="nl-error-text"></span>';
    var box = input.closest('.flex') || input.parentElement;
    if (box && box !== form && box.parentElement === form) {
      box.insertAdjacentElement('afterend', error);
    } else {
      form.appendChild(error);
    }
  }

  var textSpan = error.querySelector('.nl-error-text');

  function showNlError(message) {
    if (textSpan) {
      textSpan.textContent = message;
    } else {
      error.textContent = message;
    }
    error.classList.remove('hidden');
    error.style.display = 'flex';
    input.classList.add('nl-input-error');
    if (success) {
      success.classList.add('hidden');
      success.style.display = 'none';
    }
    input.focus();
  }

  if (!value) {
    showNlError('Email is required.');
    return;
  }

  if (!emailRe.test(value)) {
    showNlError('Please enter a valid email address.');
    return;
  }

  // Clear error states
  error.classList.add('hidden');
  error.style.display = 'none';
  input.classList.remove('nl-input-error');

  if (success) {
    success.classList.remove('hidden');
    success.style.display = 'block';
    input.value = '';
    setTimeout(function () {
      window.location.href = '404.html';
    }, 1500);
  } else {
    window.location.href = '404.html';
  }
}

// Interactive helper buttons
function openClientPortal() {
  window.location.href = 'client-login.html';
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  if (btn) {
    const open = input.type === 'text';
    const eyePaths =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' +
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
    const slash = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"/>';
    const svg = btn.querySelector('svg');
    if (svg) svg.innerHTML = open ? eyePaths : eyePaths + slash;
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();

  var form = event.target;
  var emailInput = form.querySelector('input[type="email"]');
  var passInput = form.querySelector('input[type="password"]');

  var valid = true;
  var focusable = null;
  var checks = [
    { el: emailInput, msg: 'Please provide your email address.', test: function (el) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((el.value || '').trim()); } },
    { el: passInput, msg: 'Please provide your password.', test: function (el) { return (el.value || '').length > 0; } }
  ];

  checks.forEach(function (c, i) {
    var el = c.el;
    if (!el) return;
    el.classList.remove('border-red-500');
    var err = form.querySelector('.login-error[data-for="' + i + '"]');
    if (err) { err.textContent = ''; err.style.display = 'none'; }

    if (!c.test(el)) {
      valid = false;
      el.classList.add('border-red-500');
      if (!focusable) focusable = el;
      if (!err) {
        err = document.createElement('p');
        err.className = 'login-error block w-full text-[11px] text-red-500 font-mono mt-1.5';
        err.setAttribute('data-for', String(i));
        el.insertAdjacentElement('afterend', err);
      }
      err.textContent = c.msg;
      err.style.display = '';
    }
  });

  if (!valid) {
    if (focusable) focusable.focus();
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn ? btn.innerHTML : 'Log In to Portal';
  const roleEl = form.querySelector('input[name="loginRole"]:checked');
  const role = roleEl ? roleEl.value : 'user';
  const email = emailInput ? emailInput.value.trim() : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Authenticating...';
  }
  showToast(role === 'admin' ? 'Authenticating admin profile...' : 'Authenticating client profile...');
  setTimeout(() => {
    startSession(role, email);
    renderSession();
    if (btn) {
      btn.innerHTML = 'Access Granted ✓';
      btn.classList.remove('bg-equator', 'hover:bg-equator-hover');
      btn.classList.add('bg-emerald-600', 'text-white');
    }
    if (role === 'admin') {
      showToast('Admin session started. Opening administrator dashboard.');
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 900);
    } else {
      showToast('User session started. Opening client dashboard.');
      setTimeout(() => {
        window.location.href = 'user-dashboard.html';
      }, 900);
    }
  }, 1000);
}

function handleDashboardLogout() {
  endSession();
  showToast('Session ended. Redirecting to login.');
  setTimeout(() => {
    window.location.href = 'client-login.html';
  }, 400);
}

function handleSignUpSubmit(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn ? btn.innerHTML : 'Create Account';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Registering Organization...';
  }
  showToast('Creating enterprise compliance account...');
  setTimeout(() => {
    if (btn) {
      btn.innerHTML = 'Account Created ✓';
      btn.classList.remove('bg-equator', 'hover:bg-equator-hover');
      btn.classList.add('bg-emerald-600', 'text-white');
    }
    showToast('Welcome to Stackly. Confirmation sent to your company email.');
  }, 1200);
}

function handleSSOLogin(provider) {
  showToast(`Initiating ${provider} Single Sign-On authentication...`);
}

function handleForgotPassword() {
  const email = prompt('Enter your registered corporate email for password recovery:');
  if (email && email.includes('@')) {
    showToast(`Password reset link dispatched to ${email}`);
  } else if (email) {
    showToast('Please enter a valid email address.');
  }
}

function downloadGuide() {
  showToast('Downloading: 2024 Compliance Readiness Guide (PDF)...');
}

function viewAllArticles() {
  showToast('Loading full regulatory research archive...');
}

function downloadReport(title) {
  showToast(`Downloading: ${title} (PDF)...`);
}

// Contact page form submission handling
function sanitizePhone(input) {
  input.value = input.value.replace(/[^0-9+\s()-]/g, '');
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contactForm');
  if (!form) return;

  const name = document.getElementById('contactName');
  const email = document.getElementById('contactEmail');
  const company = document.getElementById('contactCompany');
  const phone = document.getElementById('contactPhone');
  const subject = document.getElementById('contactSubject');
  const message = document.getElementById('contactMessage');

  const emailVal = ((email && email.value) || '').trim();
  const emailMsg = !emailVal ? 'Email is required.' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) ? '' : 'Enter a valid email address.');

  const errors = {
    contactName: (name && name.value.trim()) ? '' : 'Full Name is required.',
    contactEmail: emailMsg,
    contactCompany: (company && company.value.trim()) ? '' : 'Company Name is required.',
    contactPhone: (phone && phone.value.trim()) ? '' : 'Phone Number is required.',
    contactSubject: (subject && subject.value) ? '' : 'Please select a subject.',
    contactMessage: (message && message.value.trim()) ? '' : 'Message is required.'
  };

  let allValid = true;
  Object.keys(errors).forEach(function (id) {
    const errorEl = document.getElementById(id + 'Error');
    const msg = errors[id];
    if (errorEl) {
      errorEl.classList.toggle('hidden', !msg);
      const text = errorEl.querySelector('.field-error-text');
      if (text) text.textContent = msg;
    }
    if (msg) allValid = false;
  });

  if (!allValid) {
    showToast('Please fill in all required details.');
    return;
  }

  window.location.href = '404.html';
}

function resetContactForm() {
  const form = document.getElementById('contactForm');
  const successState = document.getElementById('contactFormSuccess');
  if (form && successState) {
    form.reset();
    form.classList.remove('hidden');
    successState.classList.add('hidden');
  }
}

function contactExpert(name, practice) {
  const messageInput = document.getElementById('contactMessage');
  const subjectSelect = document.getElementById('contactSubject');
  const contactSection = document.getElementById('send-message');

  if (subjectSelect && practice) {
    for (let i = 0; i < subjectSelect.options.length; i++) {
      if (subjectSelect.options[i].text.toLowerCase().includes(practice.toLowerCase())) {
        subjectSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (messageInput) {
    messageInput.value = `Attn: ${name}\n\nWe would like to request an initial advisory discussion regarding our upcoming compliance requirements.`;
    messageInput.focus();
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    openConsultationModal(`Consultation with ${name}`);
  }
}
