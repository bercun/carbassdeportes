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
    imgElement.src = `../assets/sours/img/coleccionables/${randomImg}`;
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

    btn.addEventListener('click', (e)=>{
      // Verificar si el usuario está autenticado
      const user = firebase.auth().currentUser;
      
      if (!user) {
        // Si no está logueado, redirigir al login
        if (confirm('Debes iniciar sesión para agregar productos al carrito. ¿Ir a iniciar sesión?')) {
          window.location.href = 'login.html';
        }
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
      
      console.info('Añadido al carrito:', title);
    });
  });
}

// Firebase ya está inicializado en firebase-config.js
let db;

// Verificar que Firebase esté disponible
function initializeFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase no está cargado');
    }
    
    db = firebase.firestore();
    console.log('✅ Firestore inicializado en script.js');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando Firestore:', error);
    return false;
  }
}

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
    console.warn('⚠️ Contenedor no encontrado');
    return;
  }

  console.log(`🎨 Renderizando ${articlesArray.length} artículos en contenedor`, containerElement.id);

  containerElement.innerHTML = ''; // Limpiar el contenedor
  
  // Aplicar límite si se especifica
  const articlesToShow = limit ? articlesArray.slice(0, limit) : articlesArray;
  
  if (articlesToShow.length === 0) {
    containerElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No hay artículos disponibles en esta sección.</p>';
    console.log('📭 No hay artículos para mostrar en', containerElement.id);
    return;
  }

  articlesToShow.forEach((article, index) => {
    console.log(`➕ Agregando artículo ${index + 1}: ${article.nombre}`);
    containerElement.innerHTML += createArticleCardHtml(article, isSmallGrid);
  });
  
  console.log(`✅ ${articlesToShow.length} artículos renderizados en ${containerElement.id}`);
  setupAddButtons(); // Re-asociar eventos a los nuevos botones
}
// Función simplificada para cargar y renderizar productos
function loadProducts() {
  if (!initializeFirebase()) {
    showErrorMessage('Error: Firebase no disponible');
    return;
  }
  
  console.log('🔄 Iniciando carga de productos...');
  
  db.collection('articulos').get()
    .then((snapshot) => {
      console.log('✅ Conexión exitosa con Firestore');
      console.log('📄 Documentos encontrados:', snapshot.size);
      
      if (snapshot.empty) {
        console.warn('⚠️ No hay productos en la base de datos');
        showNoProductsMessage();
        return;
      }
      
      // Convertir a array
      const allArticles = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        allArticles.push({
          id: doc.id,
          ...data
        });
        console.log(`📝 Producto cargado: ${data.nombre} (${data.categoria}/${data.estatus})`);
      });

      console.log('✅ Total productos cargados:', allArticles.length);
      
      // Renderizar todas las secciones
      renderAllSections(allArticles);
      
    })
    .catch((error) => {
      console.error('❌ Error cargando productos:', error);
      
      // Manejo específico de errores comunes
      if (error.code === 'permission-denied') {
        console.error('🚫 Error de permisos - verifica las reglas de Firestore');
        showErrorMessage('Error de permisos. Verifica las reglas de Firestore.');
      } else if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.error('🛡️ Solicitud bloqueada por el cliente (posible bloqueador de anuncios)');
        showErrorMessage('Conexión bloqueada. Desactiva bloqueadores de anuncios y recarga la página.');
      } else if (error.message && error.message.includes('Failed to fetch')) {
        console.error('🌐 Error de red - sin conexión a internet');
        showErrorMessage('Sin conexión a internet. Verifica tu conexión y recarga la página.');
      } else {
        console.error('⚠️ Error desconocido:', error.message || error);
        showErrorMessage('Error cargando productos. Verifica tu conexión y recarga la página.');
      }
    });
}

// Función para renderizar todas las secciones
function renderAllSections(allArticles) {
  console.log('🎨 Iniciando renderizado de todas las secciones...');
  
  // Filtrar por categorías
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
  
  console.log('🔍 Productos filtrados:');
  console.log(`- Destacados: ${destacados.length}`);
  console.log(`- Recientes: ${recientes.length}`);
  console.log(`- Ofertas: ${ofertas.length}`);
  console.log(`- Coleccionables: ${coleccionables.length}`);
  console.log(`- Fútbol: ${futbol.length}`);
  console.log(`- Basket: ${basket.length}`);
  console.log(`- Gym: ${gym.length}`);
  
  // RENDERIZADO SOLO SI EL CONTENEDOR EXISTE
  
  // DESTACADOS (index.html)
  const destacadosContainer = document.getElementById('destacados-container');
  if (destacadosContainer) {
    console.log('🌟 Renderizando destacados...');
    renderArticlesToContainer(destacadosContainer, destacados, false, 3);
  }

  // RECIENTES (index.html)
  const recientesContainer = document.getElementById('recientes-container');
  if (recientesContainer) {
    console.log('🆕 Renderizando recientes...');
    renderArticlesToContainer(recientesContainer, recientes, true, 3);
  } else {
    console.log('ℹ️ Contenedor recientes no encontrado (normal en catálogo)');
  }

  // OFERTAS (index.html)  
  const ofertasContainer = document.getElementById('ofertas-container');
  if (ofertasContainer) {
    console.log('💰 Renderizando ofertas...');
    renderArticlesToContainer(ofertasContainer, ofertas, true, 3);
  } else {
    console.log('ℹ️ Contenedor ofertas no encontrado (normal en catálogo)');
  }

  // COLECCIONABLES (index.html y catalogo.html)
  const coleccionablesContainer = document.getElementById('coleccionables-container');
  if (coleccionablesContainer) {
    console.log('🏆 Renderizando coleccionables...');
    // En index: límite 3, en catálogo: todos
    const isIndexPage = document.getElementById('destacados-container') !== null;
    const limit = isIndexPage ? 3 : null;
    renderArticlesToContainer(coleccionablesContainer, coleccionables, false, limit);
  }

  // FÚTBOL (catalogo.html)
  const futbolContainer = document.getElementById('futbol-container');
  if (futbolContainer) {
    console.log('⚽ Renderizando fútbol...');
    renderArticlesToContainer(futbolContainer, futbol, false);
  } else {
    console.log('ℹ️ Contenedor fútbol no encontrado (normal en index)');
  }

  // BASKET (catalogo.html)
  const basketContainer = document.getElementById('basket-container');
  if (basketContainer) {
    console.log('🏀 Renderizando basket...');
    renderArticlesToContainer(basketContainer, basket, false);
  } else {
    console.log('ℹ️ Contenedor basket no encontrado (normal en index)');
  }

  // GYM (catalogo.html)
  const gymContainer = document.getElementById('gym-container');
  if (gymContainer) {
    console.log('💪 Renderizando gym...');
    renderArticlesToContainer(gymContainer, gym, false);
  } else {
    console.log('ℹ️ Contenedor gym no encontrado (normal en index)');
  }

  console.log('✅ Renderizado de todas las secciones completado');
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
  console.log('🚀 Iniciando aplicación...');
  console.log('📄 URL actual:', window.location.pathname);
  
  // Verificar que estamos en la página correcta
  if (window.location.pathname.includes('debug-firebase') || 
      window.location.pathname.includes('test') ||
      window.location.pathname.includes('login.html')) {
    console.log('⏭️ Saltando carga en página de debug/test/login');
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
      console.log(`✅ Contenedor encontrado: ${id}`);
    }
  });
  
  if (containersFound === 0) {
    console.warn('⚠️ No se encontraron contenedores - posible página incorrecta');
    return;
  }
  
  // Determinar el tipo de página
  const isIndex = indexContainers.some(id => document.getElementById(id));
  const isCatalogo = catalogoContainers.some(id => document.getElementById(id));
  
  console.log(`📄 Página detectada: ${isIndex ? 'Index' : ''} ${isCatalogo ? 'Catálogo' : ''}`);
  
  // Cargar productos directamente
  console.log('⏰ Iniciando carga de productos...');
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
