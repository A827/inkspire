// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });
}

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Fake contact handler (replace with your backend or form service)
function handleContact(e){
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.textContent = 'Thank you — we received your message.';
  e.target.reset();
  return false;
}

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();