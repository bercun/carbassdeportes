// ===== SCRIPT.JS SIMPLIFICADO =====
console.log('🚀 Script simplificado iniciado');

// Variables globales
let db;

// Inicializar Firebase
function initFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase no está disponible');
            return false;
        }
        
        db = firebase.firestore();
        console.log('✅ Firebase inicializado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        return false;
    }
}

// Función simple para crear el HTML de un producto
function createProductHTML(product) {
    const precio = product.precio || 0;
    
    return `
        <article class="card">
            <div class="thumb">
                <img src="${product.imagen || 'https://via.placeholder.com/300x200'}" alt="${product.nombre}"/>
            </div>
            <div class="card-content">
                <h4>${product.nombre}</h4>
                <p class="description">${product.descripción || 'Sin descripción'}</p>
                <div class="meta">
                    <span class="price">$${precio}</span>
                </div>
                <button class="add-btn">Agregar al Carrito</button>
            </div>
        </article>
    `;
}

// Función para mostrar productos en un contenedor
function showProducts(containerId, products, sectionName) {
    console.log(`📦 Mostrando ${products.length} productos en ${sectionName}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ No se encontró el contenedor: ${containerId}`);
        return;
    }
    
    if (products.length === 0) {
        container.innerHTML = `<p>No hay productos en ${sectionName}</p>`;
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += createProductHTML(product);
        console.log(`✅ Agregando: ${product.nombre}`);
    });
    
    container.innerHTML = html;
    console.log(`✅ ${sectionName} renderizado exitosamente`);
}

// Función principal para cargar productos
function loadAllProducts() {
    console.log('🔄 Iniciando carga de productos...');
    
    if (!initFirebase()) {
        console.error('❌ No se pudo inicializar Firebase');
        return;
    }
    
    // Cargar productos de Firestore
    db.collection('articulos').get()
        .then((snapshot) => {
            console.log(`📊 Productos encontrados en Firestore: ${snapshot.size}`);
            
            if (snapshot.empty) {
                console.warn('⚠️ No hay productos en la base de datos');
                return;
            }
            
            // Convertir a array
            const allProducts = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                allProducts.push({
                    id: doc.id,
                    ...data
                });
                console.log(`📝 Producto cargado: ${data.nombre} (${data.categoria}/${data.estatus})`);
            });
            
            console.log(`✅ Total productos cargados: ${allProducts.length}`);
            
            // Filtrar por categorías
            const destacados = allProducts.filter(p => 
                p.estatus && p.estatus.toLowerCase() === 'destacado'
            );
            const recientes = allProducts.filter(p => 
                p.estatus && p.estatus.toLowerCase() === 'recien agregado'
            );
            const ofertas = allProducts.filter(p => 
                p.estatus && p.estatus.toLowerCase() === 'oferta'
            );
            const coleccionables = allProducts.filter(p => 
                p.categoria && p.categoria.toLowerCase() === 'coleccionables'
            );
            
            console.log('🔍 Productos filtrados:');
            console.log(`- Destacados: ${destacados.length}`);
            console.log(`- Recientes: ${recientes.length}`);
            console.log(`- Ofertas: ${ofertas.length}`);
            console.log(`- Coleccionables: ${coleccionables.length}`);
            
            // Mostrar en cada sección
            showProducts('destacados-container', destacados.slice(0, 3), 'Destacados');
            showProducts('recientes-container', recientes.slice(0, 3), 'Recientes');
            showProducts('ofertas-container', ofertas.slice(0, 3), 'Ofertas');
            showProducts('coleccionables-container', coleccionables.slice(0, 3), 'Coleccionables');
            
            console.log('🎉 ¡Proceso completado exitosamente!');
        })
        .catch((error) => {
            console.error('❌ Error cargando productos:', error);
        });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM listo, iniciando aplicación...');
    loadAllProducts();
});

// Backup en caso de que DOMContentLoaded ya haya pasado
if (document.readyState !== 'loading') {
    console.log('🌐 DOM ya estaba listo, iniciando aplicación...');
    loadAllProducts();
}

console.log('📋 Script simplificado cargado completamente');