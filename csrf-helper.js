/**
 * Utilidad global para manejo de tokens CSRF
 * Importar este archivo antes de otros scripts que hagan peticiones a la API
 */

// Variable global para almacenar el token CSRF
window.csrfToken = null;

/**
 * Obtiene el token CSRF del servidor
 * @returns {Promise<string>} Token CSRF
 */
async function obtenerCsrfToken() {
  try {
    const response = await fetch('api/check_auth.php', {
      credentials: 'include' // Importante para enviar/recibir cookies de sesión
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener token CSRF');
    }
    
    const data = await response.json();
    window.csrfToken = data.csrf_token;
    
    // También devolver datos del usuario si están disponibles
    if (data.logged_in) {
      window.userSession = data.user;
    } else {
      window.userSession = null;
    }
    
    return window.csrfToken;
  } catch (error) {
    console.error('Error al obtener token CSRF:', error);
    return null;
  }
}

/**
 * Realiza una petición fetch con el token CSRF incluido automáticamente
 * @param {string} url URL del endpoint
 * @param {object} options Opciones de fetch (método, headers, body, etc.)
 * @returns {Promise<Response>} Respuesta de la petición
 */
async function fetchWithCsrf(url, options = {}) {
  // Asegurarse de tener el token
  if (!window.csrfToken) {
    await obtenerCsrfToken();
  }
  
  // Si es una petición que modifica datos, agregar el token
  const methodsRequiringCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'];
  const method = (options.method || 'GET').toUpperCase();
  
  if (methodsRequiringCsrf.includes(method)) {
    // Parsear el body si existe para agregar el token
    let body = options.body;
    
    if (typeof body === 'string') {
      try {
        const parsedBody = JSON.parse(body);
        parsedBody.csrf_token = window.csrfToken;
        body = JSON.stringify(parsedBody);
      } catch (e) {
        // Si no es JSON, intentar como FormData u otro formato
        console.warn('No se pudo agregar token CSRF al body no-JSON');
      }
    } else if (typeof body === 'object' && body !== null) {
      body.csrf_token = window.csrfToken;
      body = JSON.stringify(body);
    } else {
      // Si no hay body, crear uno con el token
      body = JSON.stringify({ csrf_token: window.csrfToken });
    }
    
    options.body = body;
    
    // Asegurar headers correctos
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
  }
  
  // Asegurar que se envíen las credenciales (cookies de sesión)
  options.credentials = 'include';
  
  // Realizar la petición
  const response = await fetch(url, options);
  
  // Si la respuesta incluye un nuevo token, actualizarlo
  try {
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();
    if (data.csrf_token) {
      window.csrfToken = data.csrf_token;
    }
  } catch (e) {
    // No es JSON o no tiene token, continuar normalmente
  }
  
  return response;
}

/**
 * Inicializa el token CSRF al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
  obtenerCsrfToken();
});

// También intentar obtener el token inmediatamente
if (document.readyState === 'loading') {
  // Aún cargando, esperar al DOMContentLoaded
} else {
  // DOM ya cargado, obtener token ahora
  obtenerCsrfToken();
}
