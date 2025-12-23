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
const db = firebase.firestore();



// Función auxiliar para crear el HTML de una tarjeta de artículo
function createArticleCardHtml(article, isSmallGrid = false) {
  const precio = typeof article.precio === 'number' ? article.precio : parseFloat(article.precio) || 0;
  if (isSmallGrid) {
    return `
      <div class="card">
        <div class="thumb">
          <img src="${article.imagen || 'https://placehold.co/400x260?text=Sin+Imagen'}" alt="${article.nombre}"/>
        </div>
        <h4>${article.nombre}</h4>
        <p class="meta" style="margin-top:5px;">
          <span class="price" style="font-size:0.9em">$${precio.toFixed(2)}</span>
          ${article.estatus ? `<span class="badge" style="font-size:0.7em; padding:4px;">${article.estatus}</span>` : ''}
        </p>
      </div>
    `;
  } else {
    return `
      <article class="card">
        <div class="thumb">
          <img src="${article.imagen || 'https://placehold.co/600x400?text=Sin+Imagen'}" alt="${article.nombre}"/>
        </div>
        <h4>${article.nombre}</h4>
        <p class="meta">
          <span class="price">$${precio.toFixed(2)}</span>
          ${article.estatus ? `<span class="badge">${article.estatus}</span>` : ''}
        </p>
        <p>${article.descripción || ''}</p>
        <button class="add-btn">Agregar al carrito</button>
      </article>
    `;
  }
}

// Función para renderizar artículos en un contenedor específico
function renderArticlesToContainer(containerElement, articlesArray, isSmallGrid = false, limit = null) {
  if (!containerElement) return; // Asegurarse de que el contenedor existe

  containerElement.innerHTML = ''; // Limpiar el contenedor
  
  // Aplicar límite si se especifica
  const articlesToShow = limit ? articlesArray.slice(0, limit) : articlesArray;
  
  if (articlesToShow.length === 0) {
    containerElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay artículos disponibles en esta sección.</p>';
    return;
  }

  articlesToShow.forEach(article => {
    containerElement.innerHTML += createArticleCardHtml(article, isSmallGrid);
  });
  setupAddButtons(); // Re-asociar eventos a los nuevos botones
}

// Cargar artículos desde Firebase Firestore y distribuirlos por secciones
db.collection('articulos').onSnapshot((snapshot) => {
  const allArticles = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log('Artículos cargados desde Firestore:', allArticles.length); // Debug

  // Obtener referencias a los contenedores
  const destacadosContainer = document.getElementById('destacados-container');
  const recientesContainer = document.getElementById('recientes-container');
  const ofertasContainer = document.getElementById('ofertas-container');
  const futbolContainer = document.getElementById('futbol-container');
  const basketContainer = document.getElementById('basket-container');
  const gymContainer = document.getElementById('gym-container');
  const coleccionablesContainer = document.getElementById('coleccionables-container');

  // Filtrar artículos
  const destacados = allArticles.filter(article => article.estatus && article.estatus.toLowerCase() === 'destacado');
  const recientes = allArticles.filter(article => article.estatus && article.estatus.toLowerCase() === 'recien agregado');
  const ofertas = allArticles.filter(article => article.estatus && article.estatus.toLowerCase() === 'oferta');
  
  const futbolArticles = allArticles.filter(article => article.categoria && article.categoria.toLowerCase() === 'futbol');
  const basketArticles = allArticles.filter(article => article.categoria && article.categoria.toLowerCase() === 'basket');
  const gymArticles = allArticles.filter(article => article.categoria && article.categoria.toLowerCase() === 'gym');
  const coleccionablesArticles = allArticles.filter(article => article.categoria && article.categoria.toLowerCase() === 'coleccionables');

  // Detectar si estamos en la página principal o en el catálogo
  const isCatalogPage = window.location.pathname.includes('catalogo.html');
  
  if (isCatalogPage) {
    // Página de catálogo: mostrar todos los artículos por categoría
    renderArticlesToContainer(futbolContainer, futbolArticles, false);
    renderArticlesToContainer(basketContainer, basketArticles, false);
    renderArticlesToContainer(gymContainer, gymArticles, false);
    renderArticlesToContainer(coleccionablesContainer, coleccionablesArticles, false);
  } else {
    // Página principal: mostrar máximo 3 artículos por sección
    renderArticlesToContainer(destacadosContainer, destacados, false, 3);
    renderArticlesToContainer(recientesContainer, recientes, true, 3);
    renderArticlesToContainer(ofertasContainer, ofertas, true, 3);
    renderArticlesToContainer(futbolContainer, futbolArticles, false, 3);
    renderArticlesToContainer(basketContainer, basketArticles, false, 3);
    renderArticlesToContainer(gymContainer, gymArticles, false, 3);
    renderArticlesToContainer(coleccionablesContainer, coleccionablesArticles, false, 3);
  }
});
