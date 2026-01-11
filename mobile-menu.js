// mobile-menu.js - Control del menú hamburger para móviles

document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navCloseBtn = document.getElementById('nav-close-btn');
  const navOverlay = document.getElementById('nav-overlay');
  const body = document.body;

  // Verificar que los elementos existan
  if (!hamburgerBtn || !navMenu || !navCloseBtn || !navOverlay) {
    console.warn('Elementos del menú móvil no encontrados');
    return;
  }

  // Abrir menú
  function openMenu() {
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    hamburgerBtn.classList.add('active');
    body.style.overflow = 'hidden'; // Prevenir scroll del body
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    console.log('Menú abierto');
  }

  // Cerrar menú
  function closeMenu() {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    body.style.overflow = '';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    console.log('Menú cerrado');
  }

  // Toggle menú
  function toggleMenu() {
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Event listeners
  hamburgerBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  navCloseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  navOverlay.addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
  });

  // Cerrar menú al hacer clic en un enlace (solo en móvil)
  const navLinks = document.querySelectorAll('.navlinks a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Solo cerrar si el menú está activo (móvil)
      if (navMenu.classList.contains('active')) {
        setTimeout(closeMenu, 300); // Pequeño delay para mejor UX
      }
    });
  });

  // Cerrar menú al presionar ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Cerrar menú al cambiar de orientación o redimensionar a desktop
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Si es desktop (>= 1025px), cerrar el menú
      if (window.innerWidth >= 1025 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    }, 250);
  });

  console.log('Mobile menu inicializado correctamente');
});
