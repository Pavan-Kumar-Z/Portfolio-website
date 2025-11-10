// Smooth scroll for internal anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
      // close mobile nav if open
      const navToggle = document.querySelector('.nav-toggle');
      if(navToggle && navToggle.getAttribute('aria-expanded') === 'true'){
        navToggle.setAttribute('aria-expanded','false');
        document.querySelector('.nav').classList.remove('open');
      }
    }
  });
});

// mobile nav toggle (accessible)
const navToggle = document.querySelector('.nav-toggle');
if(navToggle){
  navToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Optional: collapse long experience bullets on small screens
(function(){
  function shouldCollapse() {
    return window.innerWidth <= 480;
  }

  function updateCollapse() {
    document.querySelectorAll('.exp-card').forEach(card => {
      const ul = card.querySelector('.exp-bullets');
      if(!ul) return;
      if(shouldCollapse()) {
        if(!card.querySelector('.exp-toggle')) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'exp-toggle btn btn--outline';
          btn.textContent = 'Details';
          btn.addEventListener('click', () => {
            ul.classList.toggle('hidden');
            btn.textContent = ul.classList.contains('hidden') ? 'Details' : 'Hide';
          });
          card.querySelector('.exp-main').insertBefore(btn, ul);
          ul.classList.add('hidden');
        }
      } else {
        const t = card.querySelector('.exp-toggle');
        if(t) t.remove();
        ul.classList.remove('hidden');
      }
    });
  }

  window.addEventListener('resize', updateCollapse);
  document.addEventListener('DOMContentLoaded', updateCollapse);
})();


// Contact form handler (Netlify-friendly + fetch)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  const resetBtn = document.getElementById('contactFormReset');

  if(!form) return;

  // Helper to serialize form data for fetch
  function encodeFormData(data) {
    return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // simple client-side validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if(!name || !email || !message) {
      status.textContent = 'Please fill all fields.';
      return;
    }

    // honeypot check
    if(form['bot-field'] && form['bot-field'].value) {
      status.textContent = 'Bot detected.';
      return;
    }

    status.textContent = 'Sending…';

    // If using Netlify forms: POST to current page with form name
    const formData = {
      'form-name': form.getAttribute('name'),
      name, email, message
    };

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(formData)
      });

      if(response.ok) {
        status.textContent = 'Thanks — message sent!';
        form.reset();
      } else {
        // fallback to mailto if server returns error
        status.textContent = 'Unable to send — please email me directly.';
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Network error — try emailing directly.';
    }
  });

  if(resetBtn) {
    resetBtn.addEventListener('click', () => { form.reset(); status.textContent = ''; });
  }
});


// Theme toggle: persistent dark / light mode (uses .light-theme on <html>)
(function(){
  const THEME_KEY = 'site-theme'; // value: 'light' or 'dark'
  const root = document.documentElement; // <html>
  const toggle = document.getElementById('themeToggle');

  if(!toggle) return;

  // Apply theme: pass 'light' or 'dark'
  function applyTheme(theme) {
    if(theme === 'light') {
      root.classList.add('light-theme');
      toggle.setAttribute('aria-pressed', 'true');
    } else {
      root.classList.remove('light-theme');
      toggle.setAttribute('aria-pressed', 'false');
    }
  }

  // Decide initial theme: localStorage -> user preference -> default dark
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if(saved === 'light' || saved === 'dark') return saved;
    // respect system preference
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  // initialize
  const initial = getInitialTheme();
  applyTheme(initial);

  // click handler toggles theme
  toggle.addEventListener('click', () => {
    const isLight = root.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // keyboard: allow Space or Enter to toggle when focused
  toggle.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });
})();


// Typing animation for the .accent span (Pavan Kumar)
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.hero-title .accent');
  if (!el) return;

  const fullText = el.textContent.trim(); // "Pavan Kumar"
  const typingDelay = 200;    // ms between characters
  const pauseAfterFull = 10000; // ms to wait after full name displayed (10s)
  const pauseBeforeRestart = 600; // short pause before restarting

  // clear any initial content and prepare
  el.textContent = '';
  el.setAttribute('aria-live', 'polite');

  // helper: sleep
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  async function runTypingLoop() {
    // add caret styling
    el.classList.add('type-caret');

    while (true) {
      // type characters one by one
      for (let i = 1; i <= fullText.length; i++) {
        el.textContent = fullText.slice(0, i);
        await sleep(typingDelay);
      }

      // fully typed — keep it visible for pauseAfterFull
      await sleep(pauseAfterFull);

      // clear instantly (you can choose to animate deletion if you prefer)
      el.textContent = '';

      // small pause before typing again
      await sleep(pauseBeforeRestart);
    }
  }

  runTypingLoop().catch(err => console.error('Typing animation error:', err));
});
