// Smooth scroll for internal anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
      // close mobile nav if open (if you implement one later)
      const navToggle = document.querySelector('.nav-toggle');
      if(navToggle && navToggle.getAttribute('aria-expanded') === 'true'){
        navToggle.setAttribute('aria-expanded','false');
        document.querySelector('.nav').classList.remove('open');
      }
    }
  });
});

// simple mobile nav toggle (keeps ARIA accessible)
const navToggle = document.querySelector('.nav-toggle');
if(navToggle){
  navToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
