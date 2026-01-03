<div class="site">
  <header class="navbar">
    <div class="brand">
      <img class="logo-svg" src="sours/img/logos/logo_carbass.png" alt="CarbassDeportes Logo" />
      <h1>CarbassDeportes</h1>
    </div>

    <nav>
      <ul class="navlinks">
        <?php
        // Navegación por defecto (puede ser sobrescrita por $customNav)
        if(isset($customNav) && $customNav):
          echo $customNav;
        else:
          $navItems = isset($navItems) ? $navItems : [
            'index.html' => ['Home', '#home'],
            'categorias' => ['Categorías', '#categorias'],
            'coleccionables' => ['Coleccionables', '#coleccionables'],
            'ofertas' => ['Ofertas', '#ofertas'],
            'catalogo.html' => ['Catálogo', 'catalogo.html'],
            'nosotros' => ['Nosotros', '#sobre-nosotros']
          ];
          
          foreach($navItems as $key => $item):
            $isActive = (isset($activePage) && $activePage === $key) ? 'class="active"' : '';
            if(is_array($item)):
              echo '<li><a href="'.$item[1].'" '.$isActive.'>'.$item[0].'</a></li>';
            endif;
          endforeach;
        endif;
        ?>
      </ul>
    </nav>
  </header>
