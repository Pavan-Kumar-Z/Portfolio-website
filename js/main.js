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
