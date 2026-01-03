// Verificación silenciosa de recursos para producción
(function() {
  // Verificar recursos críticos sin generar logs
  if (typeof firebase === 'undefined') {
    // Firebase no disponible
    return;
  }
  
  // Verificar elementos críticos después de carga
  setTimeout(() => {
    const criticalElements = ['.navbar', '#destacados-container'];
    criticalElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        // Elemento crítico faltante
      }
    });
  }, 1000);
})();