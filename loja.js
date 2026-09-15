/* ============================================================
   LOJA SÃO FRANCISCO — loja.js
   Dados dos produtos ficam aqui, num único array fácil de editar
   depois com fotos, descrições e preços reais.
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '351938435158';

  /* ---------- DADOS: produtos ----------
     "photo" fica por preencher (placeholder visível no card) até
     as fotos oficiais serem fornecidas. "price" e "desc" idem —
     nada aqui foi inventado. */
  var PRODUCTS = [
    { name: 'Cera em Pó', photo: 'assets/products/cera-em-po.webp', price: 12, clubPrice: 10, desc: 'Volume, textura e efeito natural.' },
    { name: 'Cera Matte', photo: 'assets/products/cera-matte.webp', price: 12, clubPrice: 10, desc: 'Fixação forte com acabamento sem brilho.' },
    { name: 'Cera Efeito Brilho', photo: 'assets/products/cera-efeito-brilho.webp', price: 12, clubPrice: 10, desc: 'Fixação e brilho para um acabamento elegante.' },
    { name: 'Espuma para Cabelo', photo: 'assets/products/espuma-cabelo.webp', price: 5, desc: 'Volume e definição com leveza.' },
    { name: 'Máscara de Hidratação', photo: 'assets/products/mascara-hidratacao.webp', price: 6, desc: 'Hidratação intensa para cabelos macios e saudáveis.' },
    { name: 'Máscara de Matização Roxa', photo: 'assets/products/mascara-matizacao-roxa.webp', price: 10, desc: 'Neutraliza tons amarelados e realça o loiro.' },
    { name: 'Máscara de Matização Cinza', photo: 'assets/products/mascara-matizacao-cinza.webp', price: 10, desc: 'Neutraliza tons quentes e intensifica tons frios.' }
  ];

  var PLACEHOLDER_ICON = '<svg class="ph-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="14" rx="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5.5-5-5 5-2.5-2L3 17"/></svg>';

  /* ---------- DESTAQUE: Minoxidil Kirkland ----------
     Produto isolado (não faz parte do array PRODUCTS nem do
     grid automático) para não alterar o funcionamento dos
     restantes produtos. Preço por quantidade: quanto mais
     unidades, menor o preço unitário (ver "tiers"). */
  var MINOX_PRODUCT = {
    name: 'Minoxidil Kirkland',
    price: 35,
    clubPrice: null,
    tiers: [
      { min: 1, price: 35 },
      { min: 2, price: 30 },
      { min: 3, price: 25 }
    ]
  };

  /* ============================================================
     RENDER — grade de produtos
     ============================================================ */
  function renderProducts() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(function (p) {
      var photoBlock = p.photo
        ? '<div class="product-photo"><img src="' + p.photo + '" alt="' + p.name + ' — São Francisco (mockup conceitual)" loading="lazy" width="800" height="1000"></div>'
        : ('<div class="product-photo-placeholder"><div>' + PLACEHOLDER_ICON + '<strong>Foto do produto</strong><small>Substituir por foto oficial</small></div></div>');

      var clubBadge = p.clubPrice
        ? (
            '<div class="club-benefit-tag">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3l2.4 6.5L21 10l-5 4.6L17.4 22 12 18.3 6.6 22 8 14.6 3 10l6.6-.5z"/></svg>' +
              '<div><strong>Benefício Clube São Francisco</strong><span>' + p.clubPrice + ' € para membros ativos</span></div>' +
            '</div>'
          )
        : '';

      var priceBlock = p.clubPrice
        ? ('<span class="product-price"><s>' + p.price + ' €</s> <strong class="price-club">' + p.clubPrice + ' €</strong></span>')
        : ('<span class="product-price">' + p.price + ' €</span>');

      return (
        '<div class="product-card">' +
          photoBlock +
          '<div class="product-body">' +
            '<h3>' + p.name + '</h3>' +
            (p.desc
              ? '<p class="product-desc">' + p.desc + '</p>'
              : '<p class="product-desc-placeholder">Descrição do produto — adicionar depois.</p>') +
            clubBadge +
            '<div class="product-footer">' +
              priceBlock +
              '<button type="button" class="btn btn-primary product-buy-btn" data-product="' + p.name + '">Adicionar ao carrinho</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* ============================================================
     ADICIONAR AO CARRINHO — usa o módulo partilhado js/cart.js.
     A finalização do pedido (com quantidade, benefício de membro
     e total) acontece no painel do carrinho, via WhatsApp.
     ============================================================ */
  function showToast(msg) {
    var toast = document.getElementById('shopToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'shopToast';
      toast.className = 'shop-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function findProduct(name) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].name === name) return PRODUCTS[i];
    }
    return null;
  }

  function handleBuyClick(productName) {
    var product = findProduct(productName);
    if (!product || !window.SFCart) return;
    window.SFCart.add(product);
    showToast('Adicionado ao carrinho: ' + productName);
  }

  function initBuyButtons() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.product-buy-btn');
      if (!btn) return;
      handleBuyClick(btn.dataset.product);
    });
  }

  /* ---------- Botão "Comprar agora" do destaque Minoxidil ---------- */
  function initMinoxButton() {
    var btn = document.getElementById('minoxBuyBtn');
    if (!btn || !window.SFCart) return;
    btn.addEventListener('click', function () {
      window.SFCart.add(MINOX_PRODUCT);
      showToast('Adicionado ao carrinho: ' + MINOX_PRODUCT.name);
    });
  }

  /* ============================================================
     NAV — menu mobile (igual ao site principal)
     ============================================================ */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileNav');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     NEWSLETTER — front-end apenas (sem backend ligado)
     ============================================================ */
  function initNewsletter() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('newsletterMsg');
      msg.textContent = 'Obrigado pelo interesse! A newsletter fica ativa muito em breve.';
      msg.classList.add('is-visible');
      form.reset();
    });
  }

  /* ============================================================
     MASCOTE — piscar de olhos
     ============================================================ */
  function initMascotBlink() {
    var eyes = document.querySelectorAll('.mascot-eye');
    if (!eyes.length) return;
    function blink() {
      eyes.forEach(function (e) { e.style.transition = 'transform .08s'; e.style.transform = 'scaleY(0.12)'; });
      setTimeout(function () {
        eyes.forEach(function (e) { e.style.transform = 'scaleY(1)'; });
      }, 90);
      setTimeout(blink, 2000 + Math.random() * 3000);
    }
    setTimeout(blink, 1500);
  }

  /* ---------- init ---------- */
  renderProducts();
  initBuyButtons();
  initMinoxButton();
  initNav();
  initNewsletter();
  initMascotBlink();
})();
