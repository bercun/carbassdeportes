# 🎯 EJEMPLOS PRÁCTICOS DE RESPONSIVE TESTING

## 1️⃣ Cómo Abrir DevTools en VS Code / Navegador

### En Firefox o Chrome:
```
1. Presiona: F12
2. Haz clic en: Icono de dispositivos (esquina superior izquierda)
3. Selecciona o crea un dispositivo personalizado
```

### Dispositivo Personalizado (Tu Redmi Note 14 5G):
```
Nombre:              Redmi Note 14 5G
Ancho:               412 px
Alto:                915 px
Escala (DPI):        2.75
User Agent:          Mobile
```

---

## 2️⃣ Testeo por Breakpoints

### 🖥️ DESKTOP (1200px+)
**Cómo verlo:**
```
1. Redimensiona la ventana a 1920x1080
2. O selecciona "Desktop" en DevTools
```

**Qué verificar:**
- ✅ Grid de 3 columnas en productos
- ✅ Navbar con menú completo visible
- ✅ Carrito con 2 columnas (items + resumen)
- ✅ Layout con aside visible (240px)
- ✅ Botón hamburger está oculto

---

### 💻 TABLET (768px - 1024px)
**Cómo verlo:**
```
1. Abre DevTools (F12)
2. Selecciona "iPad" o similar
3. O establece manualmente: 800x600
```

**Qué verificar:**
- ✅ Grid de productos pasa a 2 columnas
- ✅ Navbar más compacto
- ✅ Logo menor (3.5rem)
- ✅ Menu items centrados

---

### 📱 MÓVIL (480px - 768px)
**Cómo verlo:**
```
1. Abre DevTools (F12)
2. Selecciona un móvil estándar (Samsung, iPhone)
3. O establece manualmente: 600x800
```

**Qué verificar:**
- ✅ Grid de 1 columna
- ✅ Aside desaparece (layout: 1 columna)
- ✅ Menú hamburger aparece (rojo/verde)
- ✅ Carrito en 1 columna
- ✅ Logo SVG oculto
- ✅ Fuentes legibles

---

### ⭐ REDMI NOTE 14 5G (412px - PERSONALIZADO)
**Cómo verlo:**
```
1. En DevTools
2. Click en "Edit custom devices..." (menú dispositivos)
3. Agrega:
   - Nombre: "Redmi Note 14 5G"
   - Ancho: 412
   - Alto: 915
   - DPI: 2.75
4. Aplica el dispositivo
```

**Qué verificar:**
- ✅ Navbar muy compacto
- ✅ Título de marca (<1.2rem)
- ✅ Menú hamburger funciona
- ✅ Productos en 1 columna
- ✅ Imágenes se ven bien
- ✅ Botones son tocables
- ✅ Spacing es adecuado
- ✅ No hay desbordamiento horizontal

---

### 📱 MÓVIL MUY PEQUEÑO (<480px)
**Cómo verlo:**
```
1. Abre DevTools (F12)
2. Establece manualmente: 320x568 (iPhone SE)
```

**Qué verificar:**
- ✅ Navbar ultra compacto
- ✅ Menú hamburger funciona bien
- ✅ Contenido no se desborda
- ✅ Fuentes legibles
- ✅ Espaciado adecuado

---

## 3️⃣ Patrones a Verificar en Cada Breakpoint

### Patrón 1: Grid de Productos
```
DESKTOP (1200px):    3 columnas
TABLET (980px):      2 columnas
MÓVIL (<768px):      1 columna
```

Dónde verificar en CSS:
```css
/* DESKTOP */
.grid {
  grid-template-columns: repeat(3, 1fr);  /* Línea 453 */
}

/* TABLET */
@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* MÓVIL */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

### Patrón 2: Layout Principal
```
DESKTOP (1200px):    grid 240px + 1fr (2 columnas)
TABLET (<980px):     grid 1fr (1 columna)
MÓVIL:               idem (1 columna)
```

Dónde verificar en CSS:
```css
/* DESKTOP */
.layout {
  grid-template-columns: 240px 1fr;  /* Línea 276 */
}

/* TABLET Y MÓVIL */
@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
```

---

### Patrón 3: Menú Hamburger
```
DESKTOP (1200px):    .hamburger { display: none }
MÓVIL (<768px):      .hamburger { display: flex }
```

Dónde verificar en CSS:
```css
/* DESKTOP */
.hamburger {
  display: none;  /* Línea 265 */
}

/* MÓVIL */
@media (max-width: 767px) {
  .hamburger {
    display: flex;  /* Línea 2338 */
  }
}
```

---

### Patrón 4: Carrito
```
DESKTOP (1200px):    grid 1fr 350px (items + resumen)
MÓVIL (<768px):      grid 1fr (apilados)
```

Dónde verificar en CSS:
```css
/* DESKTOP */
.carrito-contenido {
  grid-template-columns: 1fr 350px;  /* Línea 1570 */
}

/* MÓVIL */
@media (max-width: 768px) {
  .carrito-contenido {
    grid-template-columns: 1fr;  /* Línea 2120 */
  }
}
```

---

## 4️⃣ Checklist de Testing Completo

### Navbar
- [ ] **Desktop**: Logo + título + menú horizontal
- [ ] **Tablet**: Todo visible pero compacto
- [ ] **Móvil**: Hamburger visible, menú oculto
- [ ] **Redmi 412px**: Menú funciona correctamente

### Grid de Productos
- [ ] **Desktop**: 3 columnas bien espaciadas
- [ ] **Tablet**: 2 columnas
- [ ] **Móvil**: 1 columna, ancho completo
- [ ] **Imágenes**: Se cargan correctamente en todos

### Carrito
- [ ] **Desktop**: Items a la izquierda, resumen a la derecha
- [ ] **Tablet**: Verificar comportamiento
- [ ] **Móvil**: Items y resumen apilados
- [ ] **Botones**: Accesibles en todos los tamaños

### Modales
- [ ] **Desktop**: 600px width, centrado
- [ ] **Móvil**: 95% width, sigue siendo visible
- [ ] **Scroll**: Funciona correctamente si contenido es largo

### Footer
- [ ] **Desktop**: 2 columnas
- [ ] **Móvil**: 1 columna, contenido accesible

---

## 5️⃣ Herramientas Recomendadas

### Dentro de VS Code:
1. **Extensión: "Responsive Viewer"**
   - Permite ver múltiples breakpoints simultaneamente

2. **Extensión: "Mobile Simulator"**
   - Simula click, scroll y gestos táctiles

### Navegadores:
1. **Chrome DevTools**
   - Mejor para testing rápido

2. **Firefox Responsive Design Mode**
   - Buena alternativa

3. **Responsive Design Checker Online**
   - responsivedesignchecker.com

---

## 6️⃣ Errores Comunes a Detectar

### ❌ Problema: Contenido se desborda
```
Solución: Revisa max-width, padding, margin
Busca en CSS: overflow, flex-wrap, grid-template-columns
```

### ❌ Problema: Fuentes demasiado grandes
```
Solución: Reduce font-size en media queries
Ejemplo: @media (max-width: 768px) { h1 { font-size: 1.2rem } }
```

### ❌ Problema: Botones no son tocables
```
Solución: Verifica padding, mínimo 44x44px
Busca en CSS: .btn-* { padding, min-width, min-height }
```

### ❌ Problema: Menú hamburger no funciona
```
Verificar en JS que los eventos click estén funcionando
Revisar z-index (debe ser >1000)
```

### ❌ Problema: Carrito no se adapta
```
Busca: .carrito-contenido
Verifica: grid-template-columns en mobile query
```

---

## 7️⃣ Cómo Usar Esto en Tu Workflow

### Flujo Recomendado:
```
1. Haz cambios en CSS
2. Abre DevTools (F12)
3. Activa "Responsive Design Mode"
4. Prueba en: 1920px → 980px → 768px → 412px
5. Si hay problemas:
   a. Identifica el breakpoint
   b. Encuentra la media query correspondiente
   c. Ajusta los valores
   d. Recarga (F5) y verifica
6. Repite para cada componente
```

---

## 8️⃣ Registro de Cambios (Cómo Documentar)

Cuando hagas cambios, anota:

```
FECHA: [2026-01-14]
DISPOSITIVO: Redmi Note 14 5G (412px)
PROBLEMA: El título del navbar es muy grande
CAMBIO HECHO: 
  @media (max-width: 767px) {
    .brand h1 { font-size: 1.2rem; }  /* Línea XXXX */
  }
RESULTADO: ✅ Título se vea bien en móvil
```

---

## 9️⃣ Testing Automatizado (Opcional)

Si quieres ir más allá, puedes usar:

```bash
# Instalar herramienta de testing visual
npm install -g chromatic

# O usar servicios online como:
# - BrowserStack
# - LambdaTest
# - CrossBrowserTesting
```

---

## 🔟 Resumen Rápido

| Tarea | Dónde hacerlo | Línea aprox. |
|------|-----------|---------|
| Cambiar colores | Variables | 1-10 |
| Navbar desktop | .navbar | 200-275 |
| Grid productos | .grid | 408-591 |
| Carrito | .carrito-* | 1500+ |
| Tablet responsive | @media 768-1024px | 2050+ |
| Móvil responsive | @media <768px | 2180+ |

---

**¡Listo para testear! 🚀**

Abre tu Redmi Note 14 5G en DevTools y verifica que todo se vea perfecto.
