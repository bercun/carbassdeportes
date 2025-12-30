// Script simple para probar renderizado de productos
console.log('🧪 Script de prueba cargado');

// Esperar a que todo esté listo
setTimeout(() => {
    console.log('🚀 Iniciando prueba de renderizado...');
    
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase no disponible');
        return;
    }
    
    const db = firebase.firestore();
    
    // Buscar contenedores
    const destacadosContainer = document.getElementById('destacados-container');
    console.log('📦 Contenedor destacados:', !!destacadosContainer);
    
    if (!destacadosContainer) {
        console.error('❌ No se encontró contenedor destacados');
        return;
    }
    
    // Cargar y mostrar productos
    db.collection('articulos').where('estatus', '==', 'destacado').limit(3).get()
        .then(snapshot => {
            console.log('✅ Productos destacados encontrados:', snapshot.size);
            
            if (snapshot.empty) {
                destacadosContainer.innerHTML = '<p>No hay productos destacados</p>';
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                console.log('📦 Renderizando:', data.nombre);
                
                html += `
                    <article class="card">
                        <div class="thumb">
                            <img src="${data.imagen || 'https://placehold.co/600x400'}" alt="${data.nombre}"/>
                            <span class="badge">Destacado</span>
                        </div>
                        <div class="card-content">
                            <h4>${data.nombre}</h4>
                            <p class="description">${data.descripción || ''}</p>
                            <div class="meta">
                                <span class="price">$${data.precio}</span>
                            </div>
                            <button class="add-btn">Agregar al Carrito</button>
                        </div>
                    </article>
                `;
            });
            
            destacadosContainer.innerHTML = html;
            console.log('✅ HTML insertado en destacados');
            
        })
        .catch(error => {
            console.error('❌ Error cargando productos:', error);
            destacadosContainer.innerHTML = '<p style="color: red;">Error cargando productos</p>';
        });
        
}, 2000);