<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title><?php echo isset($pageTitle) ? $pageTitle . ' — CarbassDeportes' : 'CarbassDeportes — Tienda de Deportes & Coleccionables'; ?></title>
  <link rel="stylesheet" href="styles.css" />
  <?php if(isset($additionalCSS)): ?>
    <?php echo $additionalCSS; ?>
  <?php endif; ?>
  <!-- Script para menú móvil -->
  <script src="mobile-menu.js" defer></script>
</head>
<body>
