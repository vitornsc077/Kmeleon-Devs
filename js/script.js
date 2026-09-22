/**
 * ==========================================================================
 * KMELEON DEVS - JAVASCRIPT PRINCIPAL
 * Baseado no Obsidian Vault (2.agents Kit: ui-ux-pro-max + frontend-design)
 * 
 * Funcionalidades:
 * 1. Gerenciamento de Tema (Claro / Escuro) & Meta Tags
 * 2. Barra de Progresso de Rolagem (Reading Progress Bar)
 * 3. Efeito Spotlight Dinâmico ao Mover o Cursor (Glassmorphism 2.0)
 * 4. Contadores Numéricos Animados (CountUp com IntersectionObserver)
 * 5. Simulador Interativo de Projeto & Montador de Mensagem WhatsApp
 * 6. Vitrine com Filtro por Abas de Categoria
 * 7. Acordeão Interativo de Dúvidas Frequentes (FAQ Acessível)
 * 8. Formulário de Contato Rápido com Validação & WhatsApp Sync
 * 9. Menu Lateral (Drawer) com Suporte a Teclado & ESC
 * 10. ScrollSpy & Destaque Automático de Navegação
 * 11. Otimização de Vídeos via IntersectionObserver
 * 12. Botão Voltar ao Topo & Acessibilidade
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. GERENCIAMENTO DE TEMA (CLARO / ESCURO)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const metaThemeColor = document.getElementById('meta-theme-color');
  const htmlRoot = document.documentElement;

  const THEME_STORAGE_KEY = 'kmeleon_theme_preference';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    htmlRoot.setAttribute('data-theme', theme);
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#070D09' : '#EBF8EB');
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // Inicialização do tema
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme);
  } else {
    applyTheme('light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // --------------------------------------------------------------------------
  // 2. BARRA DE PROGRESSO DE ROLAGEM (READING PROGRESS)
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${scrollPercent}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // --------------------------------------------------------------------------
  // 3. EFEITO SPOTLIGHT DINÂMICO NOS CARDS DE VIDRO (GLASSMORPHISM)
  // --------------------------------------------------------------------------
  const glassCards = document.querySelectorAll('.glass-panel');

  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --------------------------------------------------------------------------
  // 4. CONTADORES NUMÉRICOS ANIMADOS (COUNTUP)
  // --------------------------------------------------------------------------
  const countUpElements = document.querySelectorAll('.count-up');
  let countUpDone = false;

  function runCountUp(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1600; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing suave (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = easeOut * target;

      el.textContent = decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && countUpElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countUpDone) {
          countUpDone = true;
          countUpElements.forEach(el => runCountUp(el));
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // --------------------------------------------------------------------------
  // 5. SIMULADOR DE PROJETOS & ORÇAMENTO INTERATIVO (DEFENSIVO)
  // --------------------------------------------------------------------------
  const simTypeCards = document.querySelectorAll('.sim-option-card[data-type="type"]');
  const simUrgencyCards = document.querySelectorAll('.sim-urgency-card[data-type="urgency"]');
  const simFeatureCheckboxes = document.querySelectorAll('input[name="sim-feature"]');
  
  const sumTypeVal = document.getElementById('sum-type-val');
  const sumFeaturesList = document.getElementById('sum-features-list');
  const sumUrgencyVal = document.getElementById('sum-urgency-val');
  const simWhatsappCta = document.getElementById('sim-whatsapp-cta');

  if (simTypeCards.length > 0) {
    let selectedType = 'Landing Page de Alta Conversão';
    let selectedUrgency = 'Ágil Padrão';

    function updateSimulatorSummary() {
      if (sumTypeVal) sumTypeVal.textContent = selectedType;

      const selectedFeatures = [];
      simFeatureCheckboxes.forEach(cb => {
        const parentLabel = cb.closest('.sim-checkbox-card');
        if (cb.checked) {
          selectedFeatures.push(cb.value);
          if (parentLabel) parentLabel.classList.add('active');
        } else {
          if (parentLabel) parentLabel.classList.remove('active');
        }
      });

      if (sumFeaturesList) {
        sumFeaturesList.innerHTML = '';
        if (selectedFeatures.length === 0) {
          sumFeaturesList.innerHTML = '<li><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Selecione ao menos 1 recurso</li>';
        } else {
          selectedFeatures.forEach(feat => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-check" aria-hidden="true"></i> ${feat}`;
            sumFeaturesList.appendChild(li);
          });
        }
      }

      if (sumUrgencyVal) sumUrgencyVal.textContent = selectedUrgency;

      if (simWhatsappCta) {
        const phone = '5511971689200';
        const featuresText = selectedFeatures.map(f => `  • ${f}`).join('\n');
        const message = `Olá Kmeleon Devs! Montei uma ideia no simulador do site e gostaria de conversar sobre um orçamento:\n\n` +
                        `📌 *Tipo:* ${selectedType}\n` +
                        `⚙️ *Recursos que preciso:*\n${featuresText}\n` +
                        `⏱️ *Previsão de prazo:* ${selectedUrgency}\n\n` +
                        `Podemos conversar?`;

        simWhatsappCta.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      }
    }

    simTypeCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        simTypeCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
        selectedType = card.getAttribute('data-value') || 'Landing Page de Alta Conversão';
        updateSimulatorSummary();
      });
    });

    simFeatureCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        updateSimulatorSummary();
      });
    });

    simUrgencyCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        simUrgencyCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
        selectedUrgency = card.getAttribute('data-value') || 'Ágil Padrão';
        updateSimulatorSummary();
      });
    });

    updateSimulatorSummary();
  }

  // --------------------------------------------------------------------------
  // 6. VITRINE COM FILTROS DE CATEGORIA (SHOWCASE TABS)
  // --------------------------------------------------------------------------
  const filterTabBtns = document.querySelectorAll('.filter-tab-btn');
  const showcaseCards = document.querySelectorAll('.showcase-card');

  filterTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = btn.getAttribute('data-filter');

      // Atualiza estado ativo dos botões
      filterTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filtra os cards
      showcaseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. ACORDEÃO DE PERGUNTAS FREQUENTES (FAQ)
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');

    if (questionBtn) {
      questionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('active');

        // Fecha outros itens para foco limpo
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Alterna item clicado
        if (isOpen) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 8. FORMULÁRIO DE CONTATO RÁPIDO COM INTEGRAÇÃO WHATSAPP
  // --------------------------------------------------------------------------
  const quickContactForm = document.getElementById('quick-contact-form');

  if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const whatsapp = document.getElementById('contact-whatsapp')?.value.trim();
      const solution = document.getElementById('contact-solution')?.value;
      const message = document.getElementById('contact-msg')?.value.trim();

      if (!name || !whatsapp) {
        alert('Por favor, preencha seu nome e WhatsApp para continuar.');
        return;
      }

      const phone = '5511971689200';
      const msgText = `Olá Kmeleon Devs! Meu nome é *${name}* (${whatsapp}).\n` +
                      `Tenho interesse em: *${solution}*.\n` +
                      (message ? `Detalhes: "${message}"\n` : '') +
                      `Gostaria de conversar sobre meu projeto.`;

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msgText)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // --------------------------------------------------------------------------
  // 9. SCROLLSPY (DESTAQUE AUTOMÁTICO DE NAVEGAÇÃO DESKTOP & MOBILE DOCK)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('main section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileTabLinks = document.querySelectorAll('.mobile-tab-bar .mobile-tab-item[href^="#"]');

  function updateActiveNavOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileTabLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
  updateActiveNavOnScroll();

  mobileTabLinks.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetId = tab.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          mobileTabLinks.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. BOTÃO VOLTAR AO TOPO
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
  // 12. OTIMIZAÇÃO INTELIGENTE DE VÍDEOS EM LOOP
  // --------------------------------------------------------------------------
  const allVideos = document.querySelectorAll('video');

  allVideos.forEach(video => {
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

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
    }, { threshold: 0.2 });

    allVideos.forEach(video => {
      videoObserver.observe(video);
    });
  }

  // --------------------------------------------------------------------------
  // 13. ATUALIZAÇÃO DO ANO NO RODAPÉ
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
