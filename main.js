// main.js
(() => {
  //  NAV RESPONSIVE 
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar el menú al hacer click en un enlace
    menu.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        menu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  //  FILTROS (INICIO + GALERÍA) 
  // Botones con data-filter: .pill y .btn
  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('.grid .item');
  const cards = document.querySelectorAll('.cards .card');

  // Aplica el filtro a items de galería y tarjetas destacadas 
  function applyFilter(cat) {
    // Actualizar estado visual de botones
    document.querySelectorAll('.btn, .pill').forEach(b => b.classList.remove('is-active'));
    document.querySelectorAll(`[data-filter="${cat}"]`).forEach(b => b.classList.add('is-active'));

    // Filtrar galería
    galleryItems.forEach(it => {
      const show = (cat === 'all') || it.dataset.category === cat;
      it.style.display = show ? '' : 'none';
    });

    // Filtrar cards 
    cards.forEach(card => {
      const c = card.dataset.category;
      const show = !c || cat === 'all' || c === cat;
      card.style.display = show ? '' : 'none';
    });
  }

  // Eventos de filtro
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // MODAL DE DETALLE 
  const modal = document.getElementById('detalle');
  const modalDialog = modal?.querySelector('.modal-dialog');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalAuthor = document.getElementById('modal-author');
  const modalClose = document.querySelector('.modal-close');

  // Para devolver el foco al cerrar
  let lastFocusedElement = null;

  function openModal({ src, title, desc, author }) {
    if (!modal) return;
    lastFocusedElement = document.activeElement;

    modalImg.src = src || '';
    modalTitle.textContent = title || 'Proyecto';
    modalDesc.textContent = desc || '';
    modalAuthor.textContent = author ? `Autor: ${author}` : 'Autor: DEV Soluciones';

    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    // Enfocar botón de cerrar para accesibilidad
    requestAnimationFrame(() => modalClose?.focus());
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    // Devolver el foco al elemento que lo tenía
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  // Abrir modal al hacer clic en cualquier .grid .item
  document.querySelectorAll('.grid .item').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = fig.querySelector('img');
      openModal({
        src: img?.src,
        title: fig.dataset.title,
        desc: fig.dataset.desc,
        author: fig.dataset.author
      });
    });
  });

  // Cerrar modal con botón
  modalClose?.addEventListener('click', closeModal);

  // Cerrar modal haciendo click en el fondo
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Cerrar con tecla Esc y atrapar Tab dentro del modal 
  document.addEventListener('keydown', (e) => {
    const isOpen = modal?.getAttribute('aria-hidden') === 'false';
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }

    if (e.key === 'Tab' && modalDialog) {
      // Focus trap minimalista: si focus sale del modal, lo devolvemos
      const focusables = modalDialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // SCROLL SUAVE
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  //  INIT 
  // Mostrar todo al cargar
  applyFilter('all');
})();
