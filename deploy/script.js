// Imagen aleatoria de coleccionables en el aside
(function(){
  const coleccionables = [
    'banderin-equipo-clasico.jpg',
    'camiseta-epoca-historica.jpg',
    'camiseta-retro-clasica.jpg',
    'jersey-conmemorativo.jpg',
    'jersey-edicion-limitada.jpg'
  ];
  
  const imgElement = document.getElementById('coleccionable-random');
  if(imgElement){
    const randomImg = coleccionables[Math.floor(Math.random() * coleccionables.length)];
    imgElement.src = `sours/img/coleccionables/${randomImg}`;
  }
})();

// Video con reproducción al hacer hover
(function(){
  const video = document.querySelector('.hover-video');
  if(video){
    video.addEventListener('mouseenter', function(){
      this.play();
    });
    video.addEventListener('mouseleave', function(){
      this.pause();
      this.currentTime = 0;
    });
  }
})();

// Carrusel simple: auto-play + controles
(function(){
  const slidesEl = document.getElementById('slides');
  if (!slidesEl) return;
  
  const slidesCount = slidesEl.children.length;
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  let index = 0;
  let interval = null;

  function goTo(i){
    index = (i + slidesCount) % slidesCount;
    slidesEl.style.transform = `translateX(${ -index * 101.6 }%)`;
  }
  function next(){ goTo(index + 1) }
  function prev(){ goTo(index - 1) }

  if(nextBtn) nextBtn.addEventListener('click', ()=>{ next(); resetTimer(); });
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); resetTimer(); });

  function startTimer(){ interval = setInterval(next, 4000); }
  function resetTimer(){ clearInterval(interval); startTimer(); }

  window.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); });

  goTo(0);
  startTimer();

  slidesEl.addEventListener('mouseover', ()=>clearInterval(interval));
  slidesEl.addEventListener('mouseleave', ()=>startTimer());
})();

// Funcionalidad para botones "Agregar al carrito"
function setupAddButtons() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    if(btn.dataset.listener === 'true') return;
    btn.dataset.listener = 'true';

    btn.addEventListener('click', (e)=>{
      const user = firebase.auth().currentUser;
      
      if (!user) {
        if (confirm('Debes iniciar sesión para agregar productos al carrito. ¿Ir a iniciar sesión?')) {
          window.location.href = 'login.html';
        }
        return;
      }
      
      const card = e.target.closest('.card');
      const title = card.querySelector('h4').innerText;
      const originalText = e.target.innerText;
      
      e.target.innerText = 'Añadido ✓';
      e.target.disabled = true;
      
      setTimeout(()=>{ 
        e.target.innerText = originalText; 
        e.target.disabled = false; 
      }, 1400);
    });
  });
}

// Variables globales
let db;

// Verificar que Firebase esté disponible
function initializeFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase no está cargado');
    }
    
    db = firebase.firestore();
    return true;
  } catch (error) {
    return false;
  }
}

// Función auxiliar para crear el HTML de una tarjeta de artículo
function createArticleCardHtml(article) {
  const precio = typeof article.precio === 'number' ? article.precio : parseFloat(article.precio) || 0;
  
  let estatusDisplay = article.estatus || '';
  if (estatusDisplay.toLowerCase() === 'recien agregado') estatusDisplay = 'Nuevo';
  else if (estatusDisplay.toLowerCase() === 'oferta') estatusDisplay = 'Oferta';
  else if (estatusDisplay.toLowerCase() === 'destacado') estatusDisplay = 'Destacado';
  else if (estatusDisplay) estatusDisplay = estatusDisplay.charAt(0).toUpperCase() + estatusDisplay.slice(1);

  return `
    <article class="card">
      <div class="thumb">
        <img src="${article.imagen || 'https://placehold.co/600x400?text=Sin+Imagen'}" alt="${article.nombre}"/>
        ${article.estatus ? `<span class="badge">${estatusDisplay}</span>` : ''}
      </div>
      <div class="card-content">
        <h4>${article.nombre}</h4>
        <p class="description">${article.descripción || ''}</p>
        <div class="meta">
          <span class="price">$${precio.toFixed(2)}</span>
        </div>
        <button class="add-btn">Agregar al Carrito</button>
      </div>
    </article>
  `;
}

// Función para renderizar artículos en un contenedor específico
function renderArticlesToContainer(containerElement, articlesArray, isSmallGrid = false, limit = null) {
  if (!containerElement) return;

  containerElement.innerHTML = '';
  
  const articlesToShow = limit ? articlesArray.slice(0, limit) : articlesArray;
  
  if (articlesToShow.length === 0) {
    containerElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No hay artículos disponibles en esta sección.</p>';
    return;
  }

  articlesToShow.forEach((article) => {
    containerElement.innerHTML += createArticleCardHtml(article);
  });
  
  setupAddButtons();
}

// Función para cargar productos
function loadProducts() {
  if (!initializeFirebase()) {
    showErrorMessage('Error: Firebase no disponible');
    return;
  }
  
  db.collection('articulos').get()
    .then((snapshot) => {
      if (snapshot.empty) {
        showNoProductsMessage();
        return;
      }
      
      const allArticles = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        allArticles.push({
          id: doc.id,
          ...data
        });
      });

      renderAllSections(allArticles);
      
    })
    .catch((error) => {
      if (error.code === 'permission-denied') {
        showErrorMessage('Error de permisos. Verifica las reglas de Firestore.');
      } else if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        showErrorMessage('Conexión bloqueada. Desactiva bloqueadores de anuncios y recarga la página.');
      } else if (error.message && error.message.includes('Failed to fetch')) {
        showErrorMessage('Sin conexión a internet. Verifica tu conexión y recarga la página.');
      } else {
        showErrorMessage('Error cargando productos. Verifica tu conexión y recarga la página.');
      }
    });
}

// Función para renderizar todas las secciones
function renderAllSections(allArticles) {
  const destacados = allArticles.filter(p => 
    p.estatus && p.estatus.toLowerCase() === 'destacado'
  );
  const recientes = allArticles.filter(p => 
    p.estatus && p.estatus.toLowerCase() === 'recien agregado'
  );
  const ofertas = allArticles.filter(p => 
    p.estatus && p.estatus.toLowerCase() === 'oferta'
  );
  const coleccionables = allArticles.filter(p => 
    p.categoria && p.categoria.toLowerCase() === 'coleccionables'
  );
  const futbol = allArticles.filter(p => 
    p.categoria && p.categoria.toLowerCase() === 'futbol'
  );
  const basket = allArticles.filter(p => 
    p.categoria && p.categoria.toLowerCase() === 'basket'
  );
  const gym = allArticles.filter(p => 
    p.categoria && p.categoria.toLowerCase() === 'gym'
  );
  
  // DESTACADOS (index.html)
  const destacadosContainer = document.getElementById('destacados-container');
  if (destacadosContainer) {
    renderArticlesToContainer(destacadosContainer, destacados, false, 3);
  }

  // RECIENTES (index.html)
  const recientesContainer = document.getElementById('recientes-container');
  if (recientesContainer) {
    renderArticlesToContainer(recientesContainer, recientes, true, 3);
  }

  // OFERTAS (index.html)  
  const ofertasContainer = document.getElementById('ofertas-container');
  if (ofertasContainer) {
    renderArticlesToContainer(ofertasContainer, ofertas, true, 3);
  }

  // COLECCIONABLES (index.html y catalogo.html)
  const coleccionablesContainer = document.getElementById('coleccionables-container');
  if (coleccionablesContainer) {
    const isIndexPage = document.getElementById('destacados-container') !== null;
    const limit = isIndexPage ? 3 : null;
    renderArticlesToContainer(coleccionablesContainer, coleccionables, false, limit);
  }

  // FÚTBOL (catalogo.html)
  const futbolContainer = document.getElementById('futbol-container');
  if (futbolContainer) {
    renderArticlesToContainer(futbolContainer, futbol, false);
  }

  // BASKET (catalogo.html)
  const basketContainer = document.getElementById('basket-container');
  if (basketContainer) {
    renderArticlesToContainer(basketContainer, basket, false);
  }

  // GYM (catalogo.html)
  const gymContainer = document.getElementById('gym-container');
  if (gymContainer) {
    renderArticlesToContainer(gymContainer, gym, false);
  }
}

function showNoProductsMessage() {
  const containers = [
    'destacados-container', 'recientes-container', 'ofertas-container',
    'coleccionables-container', 'futbol-container', 'basket-container', 'gym-container'
  ];
  
  containers.forEach(containerId => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: #666;">No hay productos disponibles</p>';
    }
  });
}

function showErrorMessage(message) {
  const containers = [
    'destacados-container', 'recientes-container', 'ofertas-container',
    'coleccionables-container', 'futbol-container', 'basket-container', 'gym-container'
  ];
  
  containers.forEach(containerId => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `<p style="text-align: center; color: #dc3545;">${message}</p>`;
    }
  });
}

// Inicializar aplicación
function initializeApp() {
  if (window.location.pathname.includes('debug') || 
      window.location.pathname.includes('test') ||
      window.location.pathname.includes('login.html')) {
    return;
  }
  
  const containers = [
    'destacados-container', 'recientes-container', 'ofertas-container',
    'futbol-container', 'basket-container', 'gym-container', 'coleccionables-container'
  ];
  
  let containersFound = 0;
  containers.forEach(id => {
    if (document.getElementById(id)) {
      containersFound++;
    }
  });
  
  if (containersFound === 0) {
    return;
  }
  
  loadProducts();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

if (document.readyState !== 'loading') {
  initializeApp();
}

// Navegación suave entre secciones
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// Funcionalidad para los iconos de categorías
(function(){
  const iconCards = document.querySelectorAll('.icon-card');
  iconCards.forEach((card, index) => {
    card.addEventListener('click', function() {
      let targetSection;
      
      switch(index) {
        case 0: // Fútbol
          targetSection = '#futbol-section';
          break;
        case 1: // Basket
          targetSection = '#basket-section';
          break;
        case 2: // Gym
          targetSection = '#gym-section';
          break;
        case 3: // Coleccionables
          targetSection = '#coleccionables';
          break;
        default:
          targetSection = 'catalogo.html';
      }
      
      if (targetSection.startsWith('#')) {
        const target = document.querySelector(targetSection);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } else {
        window.location.href = targetSection;
      }
    });
  });
})();