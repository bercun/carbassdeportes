<!-- Barra superior sticky para usuario -->
<div class="user-bar">
  <div class="user-bar-content">
    <div class="user-info">
      <span id="user-name" class="user-name"></span>
    </div>
    <div class="user-actions">
      <a href="admin.html" id="admin-link" class="admin-btn <?php echo (isset($isAdminPage) && $isAdminPage) ? 'active' : 'hidden'; ?>" title="Panel Admin">🛠️</a>
      <a href="#" class="carrito" title="Carrito"><?php echo isset($cartIcon) ? $cartIcon : '🛒'; ?></a>
      <button onclick="logout()" class="btn-logout hidden" id="logout-btn">Salir</button>
      <a href="login.html" class="btn-login hidden" id="login-btn">Iniciar Sesión</a>
    </div>
  </div>
</div>
