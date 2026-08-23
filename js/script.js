/**
 * ==========================================================================
 * KMELEON DEVS - JAVASCRIPT PRINCIPAL
 * Funcionalidades:
 * 1. Gerenciamento de Tema (Claro / Escuro) com persistência em localStorage
 * 2. Menu Lateral (Sidebar / Drawer) responsivo com animação e acessibilidade
 * 3. Scroll suave e ScrollSpy (destaque do link ativo durante a rolagem)
 * 4. Otimização de Vídeos em Loop via IntersectionObserver
 * 5. Botão Voltar ao Topo e micro-interações
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. GERENCIAMENTO DE TEMA (CLARO / ESCURO)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sidebarThemeToggle = document.getElementById('sidebar-theme-toggle');
  const sidebarThemeText = document.getElementById('sidebar-theme-text');
  const metaThemeColor = document.getElementById('meta-theme-color');
  const htmlRoot = document.documentElement;

  const THEME_STORAGE_KEY = 'kmeleon_theme_preference';

  /**
   * Aplica o tema selecionado à página
   * @param {string} theme - 'light' ou 'dark'
   */
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    htmlRoot.setAttribute('data-theme', theme);
    
    // Atualiza a cor da barra de endereço do navegador no mobile
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#070D09' : '#E8F8E8');
    }

    // Atualiza o texto do botão no menu lateral
    if (sidebarThemeText) {
      sidebarThemeText.textContent = isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro';
    }

    // Salva a preferência
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  /**
   * Alterna entre os temas
   */
  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // Inicialização do tema: verifica se há salvo no localStorage
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme);
  } else {
    // Padrão solicitado: Modo claro como padrão
    applyTheme('light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (sidebarThemeToggle) {
    sidebarThemeToggle.addEventListener('click', toggleTheme);
  }

  // --------------------------------------------------------------------------
  // 2. MENU LATERAL (SIDEBAR / DRAWER)
  // --------------------------------------------------------------------------
  const sidebarDrawer = document.getElementById('sidebar-nav');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarOpenBtn = document.getElementById('sidebar-open-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function openSidebar() {
    sidebarDrawer.classList.add('active');
    sidebarOverlay.classList.add('active');
    sidebarDrawer.setAttribute('aria-hidden', 'false');
    sidebarOverlay.setAttribute('aria-hidden', 'false');
    sidebarOpenBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Bloqueia scroll do fundo
  }

  function closeSidebar() {
    sidebarDrawer.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    sidebarDrawer.setAttribute('aria-hidden', 'true');
    sidebarOverlay.setAttribute('aria-hidden', 'true');
    sidebarOpenBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restaura scroll
  }

  if (sidebarOpenBtn) {
    sidebarOpenBtn.addEventListener('click', openSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Fecha o menu lateral ao clicar em qualquer link interno
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarDrawer.classList.contains('active')) {
      closeSidebar();
    }
  });

  // --------------------------------------------------------------------------
  // 3. SCROLLSPY (DESTAQUE AUTOMÁTICO DOS LINKS DE NAVEGAÇÃO)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('main section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Atualiza nav desktop
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Atualiza nav sidebar
        sidebarLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 4. BOTÃO VOLTAR AO TOPO
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTopVisibility() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. CONTROLE INTELIGENTE E OTIMIZADO DE VÍDEOS EM LOOP
  // --------------------------------------------------------------------------
  const allVideos = document.querySelectorAll('video');

  // Garante que todos os vídeos sejam configurados corretamente para autoplay mudo
  allVideos.forEach(video => {
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    // Tentativa inicial de reprodução segura (evita rejeição por política de browser)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay bloqueado pelo navegador; será disparado via IntersectionObserver
      });
    }
  });

  // Pausa vídeos quando estão fora da tela para poupar bateria e performance
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          if (vid.paused) {
            vid.play().catch(() => {});
          }
        } else {
          if (!vid.paused) {
            vid.pause();
          }
        }
      });
    }, {
      threshold: 0.2
    });

    allVideos.forEach(video => {
      videoObserver.observe(video);
    });
  }

  // --------------------------------------------------------------------------
  // 6. ATUALIZAÇÃO AUTOMÁTICA DO ANO NO RODAPÉ
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
