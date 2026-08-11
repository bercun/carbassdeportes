// Verificación simple de recursos
console.log('=== VERIFICANDO RECURSOS ===');

// Verificar que Firebase está cargado
if (typeof firebase !== 'undefined') {
  console.log('✅ Firebase cargado');
} else {
  console.error('❌ Firebase NO cargado');
}

// Verificar CSS
const styles = getComputedStyle(document.body);
if (styles.fontFamily.includes('Inter')) {
  console.log('✅ CSS cargado correctamente');
} else {
  console.warn('⚠️ CSS podría no estar cargando');
}

// Verificar elementos críticos después de 2 segundos
setTimeout(() => {
  const criticalElements = {
    'navbar': '.navbar',
    'destacados': '#destacados-container',
    'recientes': '#recientes-container'
  };
  
  Object.entries(criticalElements).forEach(([name, selector]) => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ ${name} encontrado`);
    } else {
      console.error(`❌ ${name} NO encontrado`);
    }
  });
}, 2000);