// ------------------------------
// Existing code (kept as-is)
// ------------------------------

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
  if (status) status.textContent = 'Thank you — we received your message.';
  e.target.reset();
  return false;
}
window.handleContact = handleContact; // make available for inline onsubmit

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ------------------------------
// Multi-book options (NEW)
// ------------------------------
// How to use (HTML):
// - Optional selector:   <select id="bookSelect"></select>
// - Details container:   <div id="bookDetails"></div>
// - Grid container:      <div id="bookGrid"></div>
// - Optional buttons in grid/cards: <button data-book-select="seeds"></button>

const books = {
  seeds: {
    id: 'seeds',
    title: 'The Seeds of Reality',
    author: 'CT & AT',
    desc: 'A reflective, modern book on clarity, discipline, and living with intention.',
    cover: '/assets/seeds-cover.jpg',
    sample: '/assets/The-Seeds-of-Reality-Sample.pdf',
    buy: 'YOUR_AMAZON_LINK',
    slug: '/books/seeds-of-reality.html'
  },
  wake: {
    id: 'wake',
    title: 'The Wake-Up Call',
    author: 'CT',
    desc: 'A motivational narrative blending story and advice to spark personal growth.',
    cover: '/assets/wake-cover.jpg',
    sample: '/assets/The-Wake-Up-Call-Sample.pdf',
    buy: 'YOUR_AMAZON_LINK_WAKE',
    slug: '/books/the-wake-up-call.html'
  },
  art: {
    id: 'art',
    title: 'The Art of Getting Along',
    author: 'CT',
    desc: 'Practical guidance for building harmony, empathy, and better human relations.',
    cover: '/assets/art-cover.jpg',
    sample: '/assets/The-Art-of-Getting-Along-Sample.pdf',
    buy: 'YOUR_AMAZON_LINK_ART',
    slug: '/books/art-of-getting-along.html'
  }
};

// Grab elements (if they exist)
const bookSelect  = document.getElementById('bookSelect');
const bookDetails = document.getElementById('bookDetails');
const bookGrid    = document.getElementById('bookGrid');

// Helpers
function getInitialBookId() {
  // Priority: ?book=art → hash #book=art → default 'seeds'
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('book') && books[params.get('book')]) return params.get('book');
  } catch {}
  const hash = window.location.hash || '';
  if (hash.startsWith('#book=')) {
    const id = hash.replace('#book=', '');
    if (books[id]) return id;
  }
  return 'seeds';
}

function renderBookDetails(book) {
  if (!bookDetails || !book) return;
  const safeCover = book.cover || '/assets/og-cover.jpg';
  const buyBtn    = book.buy   ? `<a class="btn primary" href="${book.buy}" target="_blank" rel="noopener">Buy on Amazon</a>` : '';
  const sampleBtn = book.sample ? `<a class="btn" href="${book.sample}" target="_blank" rel="noopener">Read a Sample</a>` : '';
  const moreBtn   = book.slug  ? `<a class="btn" href="${book.slug}">Learn more</a>` : '';

  bookDetails.innerHTML = `
    <div style="display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:start;">
      <img src="${safeCover}" alt="${book.title} cover" style="width:120px;height:auto;border-radius:8px;background:#0c1322;">
      <div>
        <h3 class="h" style="margin:.2rem 0 .25rem;">${book.title}</h3>
        <p class="p" style="margin:.25rem 0 .75rem;"><strong>Author:</strong> ${book.author}</p>
        <p class="p" style="margin:.25rem 0 1rem;">${book.desc}</p>
        <div class="hero-ctas" style="display:flex;gap:.5rem;flex-wrap:wrap;">
          ${buyBtn}${sampleBtn}${moreBtn}
        </div>
      </div>
    </div>
  `;
}

function renderBookGrid() {
  if (!bookGrid) return;
  const html = Object.values(books).map(b => {
    const cover = b.cover || '/assets/og-cover.jpg';
    const buy   = b.buy   ? `<a class="btn primary" href="${b.buy}" target="_blank" rel="noopener">Buy</a>` : '';
    const sample= b.sample? `<a class="btn" href="${b.sample}" target="_blank" rel="noopener">Sample</a>` : '';
    const more  = b.slug  ? `<a class="btn" href="${b.slug}">Details</a>` : '';

    return `
      <article class="card" style="overflow:hidden;">
        <div class="cover" style="aspect-ratio:3/4;background:#0c1322;">
          <img src="${cover}" alt="${b.title} cover" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <div class="body" style="padding:12px;">
          <h3 class="h" style="margin:0 0 6px;font-size:18px;">${b.title}</h3>
          <p class="p" style="margin:0 0 10px;color:var(--muted,#a9b9d6);font-size:14px;">by ${b.author}</p>
          <p class="p" style="margin:0 0 10px;color:var(--muted,#a9b9d6);font-size:14px;">${b.desc}</p>
          <div class="hero-ctas" style="display:flex;gap:.5rem;flex-wrap:wrap;">
            ${buy}${sample}${more}
            <button class="btn" type="button" data-book-select="${b.id}">View here</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
  bookGrid.innerHTML = html;

  // Wire "View here" buttons to update details + selector + URL hash
  bookGrid.querySelectorAll('[data-book-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-book-select');
      if (bookSelect) bookSelect.value = id;
      renderBookDetails(books[id]);
      try { history.replaceState(null, '', `#book=${id}`); } catch {}
      document.getElementById('bookDetails')?.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
}

function populateSelector() {
  if (!bookSelect) return;
  bookSelect.innerHTML = Object.values(books)
    .map(b => `<option value="${b.id}">${b.title}</option>`)
    .join('');
}

function initBooks() {
  // If none of the containers exist, skip silently
  if (!bookDetails && !bookSelect && !bookGrid) return;

  // Build selector options if present
  populateSelector();

  // Initial book (from URL or default)
  const initialId = (bookSelect && bookSelect.value) || getInitialBookId();
  if (bookSelect) bookSelect.value = initialId;

  // Render panels
  renderBookDetails(books[initialId]);
  renderBookGrid();

  // Selector change handler
  if (bookSelect) {
    bookSelect.addEventListener('change', () => {
      const id = bookSelect.value;
      renderBookDetails(books[id]);
      try { history.replaceState(null, '', `#book=${id}`); } catch {}
    });
  }

  // Respond to external hash changes (#book=art)
  window.addEventListener('hashchange', () => {
    const id = getInitialBookId();
    if (!books[id]) return;
    if (bookSelect) bookSelect.value = id;
    renderBookDetails(books[id]);
  });
}

document.addEventListener('DOMContentLoaded', initBooks);