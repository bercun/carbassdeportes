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
  if (!slidesEl) return; // Salir si no existe el carrusel
  
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

  // keyboard navigation
  window.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); });

  // init
  goTo(0);
  startTimer();

  // tiny accessibility: pause on focus
  slidesEl.addEventListener('mouseover', ()=>clearInterval(interval));
  slidesEl.addEventListener('mouseleave', ()=>startTimer());
})();

// Funcionalidad para botones "Agregar al carrito"
function setupAddButtons() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    // Evita asociar el evento múltiples veces
    if(btn.dataset.listener === 'true') return;
    btn.dataset.listener = 'true';

    btn.addEventListener('click', async (e)=>{
      // Verificar si el usuario está autenticado
      try {
        const response = await fetch('api/check_auth.php');
        const data = await response.json();
        
        if (!data.logged_in) {
          // Si no está logueado, redirigir al login
          if (confirm('Debes iniciar sesión para agregar productos al carrito. ¿Ir a iniciar sesión?')) {
            window.location.href = 'login.html';
          }
          return;
        }
      } catch (error) {
        return;
      }
      
      // Usuario autenticado: agregar al carrito
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

// API PHP en lugar de Firebase
const API_BASE_URL = 'api/';

// Función auxiliar para crear el HTML de una tarjeta de artículo
function createArticleCardHtml(article, isSmallGrid = false) {
  const precio = typeof article.precio === 'number' ? article.precio : parseFloat(article.precio) || 0;
  
  // Formatear el estatus para que se vea mejor
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
  if (!containerElement) {
    return;
  }

  containerElement.innerHTML = ''; // Limpiar el contenedor
  
  // Aplicar límite si se especifica
  const articlesToShow = limit ? articlesArray.slice(0, limit) : articlesArray;
  
  if (articlesToShow.length === 0) {
    containerElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No hay artículos disponibles en esta sección.</p>';
    return;
  }

  articlesToShow.forEach((article, index) => {
    containerElement.innerHTML += createArticleCardHtml(article, isSmallGrid);
  });
  
  setupAddButtons(); // Re-asociar eventos a los nuevos botones
}
// Función simplificada para cargar y renderizar productos
async function loadProducts() {
  try {
    const response = await fetch(API_BASE_URL + 'productos.php');
    
    if (!response.ok) {
      throw new Error('Error al cargar productos');
    }
    
    const allArticles = await response.json();
    
    if (allArticles.length === 0) {
      showNoProductsMessage();
      return;
    }
    
    // Adaptar campos de MySQL a la estructura esperada
    const adaptedArticles = allArticles.map(product => ({
      id: product.id,
      nombre: product.nombre,
      descripción: product.descripcion,
      precio: parseFloat(product.precio),
      imagen: product.imagen_url || 'https://placehold.co/600x400?text=Sin+Imagen',
      categoria: product.categoria_nombre || 'general',
      categoria_id: product.categoria_id,
      estatus: product.destacado == 1 ? 'destacado' : 'normal',
      destacado: product.destacado
    }));
    
    // Renderizar todas las secciones
    renderAllSections(adaptedArticles);
    
  } catch (error) {
    showErrorMessage('Error cargando productos. Verifica tu conexión y recarga la página.');
  }
}

// Función auxiliar para normalizar nombres de categoría
function normalizarCategoria(categoria) {
  if (!categoria) return 'general';
  const cat = categoria.toLowerCase().trim();
  // Normalizar nombres comunes
  if (cat.includes('fútbol') || cat.includes('futbol') || cat.includes('soccer')) return 'futbol';
  if (cat.includes('basket') || cat.includes('baloncesto')) return 'basket';
  if (cat.includes('gym') || cat.includes('gimnasio') || cat.includes('fitness')) return 'gym';
  if (cat.includes('coleccionable')) return 'coleccionables';
  return cat;
}

// Función para renderizar todas las secciones
function renderAllSections(allArticles) {
  // Filtrar por categorías
  const destacados = allArticles.filter(p => 
    p.destacado == 1 || (p.estatus && p.estatus.toLowerCase() === 'destacado')
  );
  
  // Si no hay destacados, usar los primeros 3 productos
  if (destacados.length === 0) {
    destacados.push(...allArticles.slice(0, 3));
  }
  
  const recientes = allArticles.slice(0, 3); // Los 3 más recientes
  const ofertas = allArticles.filter(p => 
    p.estatus && p.estatus.toLowerCase() === 'oferta'
  );
  
  // Si no hay ofertas, mostrar productos aleatorios
  if (ofertas.length === 0) {
    ofertas.push(...allArticles.slice(3, 6));
  }
  
  const coleccionables = allArticles.filter(p => {
    const cat = normalizarCategoria(p.categoria);
    return cat === 'coleccionables';
  });
  const futbol = allArticles.filter(p => {
    const cat = normalizarCategoria(p.categoria);
    return cat === 'futbol';
  });
  const basket = allArticles.filter(p => {
    const cat = normalizarCategoria(p.categoria);
    return cat === 'basket';
  });
  const gym = allArticles.filter(p => {
    const cat = normalizarCategoria(p.categoria);
    return cat === 'gym';
  });
  
  // RENDERIZADO SOLO SI EL CONTENEDOR EXISTE
  
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
    // En index: límite 3, en catálogo: todos
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

// Función genérica para renderizar cualquier sección
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

// Inicializar cuando el DOM esté listo
function initializeApp() {
  // Verificar que estamos en la página correcta
  if (window.location.pathname.includes('debug-firebase') || 
      window.location.pathname.includes('test') ||
      window.location.pathname.includes('login.html')) {
    return;
  }
  
  // Verificar que los contenedores existen (para index.html o catalogo.html)
  const indexContainers = [
    'destacados-container',
    'recientes-container', 
    'ofertas-container'
  ];
  
  const catalogoContainers = [
    'futbol-container',
    'basket-container',
    'gym-container'
  ];
  
  const sharedContainers = [
    'coleccionables-container'
  ];
  
  let containersFound = 0;
  [...indexContainers, ...catalogoContainers, ...sharedContainers].forEach(id => {
    if (document.getElementById(id)) {
      containersFound++;
    }
  });
  
  if (containersFound === 0) {
    return;
  }
  
  // Cargar productos directamente
  loadProducts();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

// Backup en caso de que DOMContentLoaded ya haya pasado
if (document.readyState !== 'loading') {
  initializeApp();
}

// Navegación suave entre secciones
(function(){
  // Agregar smooth scroll para todos los enlaces internos
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
  iconCards.forEach(card => {
    card.addEventListener('click', function(){
      const categoryText = this.querySelector('div').textContent.toLowerCase();
      let targetSection = '';
      
      switch(categoryText) {
        case 'fútbol':
          targetSection = 'catalogo.html#futbol-section';
          break;
        case 'basket':
          targetSection = 'catalogo.html#basket-section';
          break;
        case 'gym':
          targetSection = 'catalogo.html#gym-section';
          break;
        case 'coleccionables':
          targetSection = '#coleccionables';
          break;
        default:
          targetSection = 'catalogo.html';
      }
      
      if (targetSection.startsWith('#')) {
        // Scroll interno en la misma página
        const target = document.querySelector(targetSection);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } else {
        // Navegar a otra página
        window.location.href = targetSection;
      }
    });
  });
})();
