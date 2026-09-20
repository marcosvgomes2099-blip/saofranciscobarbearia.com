/* ============================================================
   SÃO FRANCISCO BARBEARIA — cart.js
   Carrinho de produtos, partilhado entre index.html e loja.html.
   Estado guardado em localStorage (chave sf_cart_v1) para persistir
   entre páginas e recarregamentos. Não depende de login/conta —
   o cliente apenas indica no carrinho se é membro do Clube São
   Francisco; a confirmação do benefício é feita pelo WhatsApp.
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '351938435158';
  var STORAGE_KEY = 'sf_cart_v1';
  var MEMBER_KEY = 'sf_cart_member_v1';
  var MEMBER_CODE_KEY = 'sf_cart_member_code_v1';

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* ignora se não houver storage */ }
  }
  function loadMember() {
    try { return localStorage.getItem(MEMBER_KEY) === '1'; } catch (e) { return false; }
  }
  function saveMember() {
    try { localStorage.setItem(MEMBER_KEY, isMember ? '1' : '0'); } catch (e) {}
  }
  function loadMemberCode() {
    try { return localStorage.getItem(MEMBER_CODE_KEY) || ''; } catch (e) { return ''; }
  }
  function saveMemberCode() {
    try { localStorage.setItem(MEMBER_CODE_KEY, memberCode); } catch (e) {}
  }

  var cart = loadCart();
  var isMember = loadMember();
  var memberCode = loadMemberCode();
  var overlay = null;
  var drawer = null;

  function findItem(name) {
    for (var i = 0; i < cart.length; i++) { if (cart[i].name === name) return cart[i]; }
    return null;
  }

  function fmt(n) {
    var isInt = Math.round(n * 100) % 100 === 0;
    return (isInt ? n.toFixed(0) : n.toFixed(2).replace('.', ',')) + ' €';
  }

  function unitPrice(item) {
    /* O preço de membro nunca é aplicado automaticamente aqui — é só
       confirmado manualmente pela equipa via WhatsApp, depois de
       verificar o código indicado. O total do carrinho usa sempre
       o preço normal. */
    if (item.tiers && item.tiers.length) {
      var applicable = item.tiers[0].price;
      for (var i = 0; i < item.tiers.length; i++) {
        if (item.qty >= item.tiers[i].min) applicable = item.tiers[i].price;
      }
      return applicable;
    }
    return item.price;
  }
  function totalCount() {
    return cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
  }
  function totalPrice() {
    return cart.reduce(function (sum, i) { return sum + unitPrice(i) * i.qty; }, 0);
  }

  /* ---------- API pública: adicionar produto (chamada por loja.js) ---------- */
  function add(product) {
    var item = findItem(product.name);
    if (item) {
      item.qty += 1;
    } else {
      cart.push({ name: product.name, price: product.price, clubPrice: product.clubPrice || null, tiers: product.tiers || null, qty: 1 });
    }
    saveCart();
    renderDrawer();
    updateBadge();
  }

  function setQty(name, qty) {
    var item = findItem(name);
    if (!item) return;
    if (qty <= 0) { removeItem(name); return; }
    item.qty = qty;
    saveCart();
    renderDrawer();
    updateBadge();
  }

  function removeItem(name) {
    cart = cart.filter(function (i) { return i.name !== name; });
    saveCart();
    renderDrawer();
    updateBadge();
  }

  /* ---------- badge no ícone do header ---------- */
  function updateBadge() {
    var badge = document.getElementById('cartCount');
    if (!badge) return;
    var count = totalCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  /* ---------- painel (drawer) do carrinho ---------- */
  function isOnLojaPage() {
    return window.location.pathname.indexOf('loja.html') !== -1;
  }

  function buildDrawer() {
    if (drawer) return;

    overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.className = 'cart-overlay';

    drawer = document.createElement('aside');
    drawer.id = 'cartDrawer';
    drawer.className = 'cart-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Carrinho de produtos');

    drawer.innerHTML =
      '<div class="cart-drawer-head">' +
        '<h2>O seu carrinho</h2>' +
        '<button type="button" class="cart-close" id="cartClose" aria-label="Fechar carrinho">&times;</button>' +
      '</div>' +
      '<label class="cart-member-toggle">' +
        '<input type="checkbox" id="cartMemberCheck">' +
        '<span>Sou membro do <strong>Clube São Francisco</strong><em>O desconto nas 3 ceras (12€ → 10€) é confirmado pela nossa equipa</em></span>' +
      '</label>' +
      '<div class="cart-member-code" id="cartMemberCodeWrap">' +
        '<label for="cartMemberCodeInput">Código ou identificação de membro</label>' +
        '<input type="text" id="cartMemberCodeInput" placeholder="Ex: número de telemóvel usado na assinatura">' +
      '</div>' +
      '<div class="cart-items" id="cartItems"></div>' +
      '<div class="cart-drawer-foot">' +
        '<div class="cart-total-row"><span>Total</span><strong id="cartTotal">0 €</strong></div>' +
        '<button type="button" class="btn btn-primary btn-block" id="cartCheckout">Finalizar pedido pelo WhatsApp</button>' +
        '<a href="' + (isOnLojaPage() ? '#produtos' : 'loja.html') + '" class="cart-continue" id="cartContinue">Continuar a comprar</a>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.addEventListener('click', close);
    document.getElementById('cartClose').addEventListener('click', close);
    document.getElementById('cartContinue').addEventListener('click', close);
    document.getElementById('cartMemberCheck').addEventListener('change', function (e) {
      isMember = e.target.checked;
      saveMember();
      renderDrawer();
    });
    document.getElementById('cartMemberCodeInput').addEventListener('input', function (e) {
      memberCode = e.target.value;
      saveMemberCode();
    });
    document.getElementById('cartCheckout').addEventListener('click', checkout);
    document.getElementById('cartItems').addEventListener('click', function (e) {
      var row = e.target.closest('[data-name]');
      if (!row) return;
      var name = row.dataset.name;
      var item = findItem(name);
      if (!item) return;
      if (e.target.closest('.cart-qty-minus')) setQty(name, item.qty - 1);
      else if (e.target.closest('.cart-qty-plus')) setQty(name, item.qty + 1);
      else if (e.target.closest('.cart-item-remove')) removeItem(name);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  function renderDrawer() {
    if (!drawer) return;
    var memberCheck = document.getElementById('cartMemberCheck');
    if (memberCheck) memberCheck.checked = isMember;
    var codeWrap = document.getElementById('cartMemberCodeWrap');
    if (codeWrap) codeWrap.style.display = isMember ? 'block' : 'none';
    var codeInput = document.getElementById('cartMemberCodeInput');
    if (codeInput && codeInput.value !== memberCode) codeInput.value = memberCode;

    var itemsEl = document.getElementById('cartItems');
    if (!cart.length) {
      itemsEl.innerHTML = '<p class="cart-empty">O seu carrinho está vazio.</p>';
    } else {
      itemsEl.innerHTML = cart.map(function (item) {
        var price = unitPrice(item);
        var subtotal = price * item.qty;
        var priceHtml = fmt(price);
        var clubNote = (isMember && item.clubPrice)
          ? ('<em class="cart-item-club-note">Preço de membro ' + fmt(item.clubPrice) + ' — a confirmar</em>')
          : '';
        var tierNote = (item.tiers && item.tiers.length > 1)
          ? ('<em class="cart-item-tier-note">Preço por unidade desce conforme a quantidade</em>')
          : '';
        return (
          '<div class="cart-item" data-name="' + item.name + '">' +
            '<div class="cart-item-info">' +
              '<strong>' + item.name + '</strong>' +
              '<span class="cart-item-unit">' + priceHtml + ' / un.</span>' +
              clubNote +
              tierNote +
            '</div>' +
            '<div class="cart-item-qty">' +
              '<button type="button" class="cart-qty-minus" aria-label="Diminuir quantidade de ' + item.name + '">−</button>' +
              '<span>' + item.qty + '</span>' +
              '<button type="button" class="cart-qty-plus" aria-label="Aumentar quantidade de ' + item.name + '">+</button>' +
            '</div>' +
            '<div class="cart-item-subtotal">' + fmt(subtotal) + '</div>' +
            '<button type="button" class="cart-item-remove" aria-label="Remover ' + item.name + '">&times;</button>' +
          '</div>'
        );
      }).join('');
    }

    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = fmt(totalPrice());
    var checkoutBtn = document.getElementById('cartCheckout');
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  }

  function open() {
    buildDrawer();
    renderDrawer();
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
      drawer.classList.add('is-open');
    });
    document.body.classList.add('cart-locked');
  }
  function close() {
    if (!overlay || !drawer) return;
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.classList.remove('cart-locked');
  }

  /* ---------- finalizar pedido pelo WhatsApp (mensagem dinâmica) ---------- */
  function checkout() {
    if (!cart.length) return;
    var lines = ['🛒 NOVO PEDIDO — SÃO FRANCISCO BARBEARIA', ''];
    cart.forEach(function (item) {
      var price = unitPrice(item);
      var subtotal = price * item.qty;
      lines.push(item.name);
      lines.push('Quantidade: ' + item.qty);
      lines.push('Preço unitário: ' + fmt(price));
      lines.push('Subtotal: ' + fmt(subtotal));
      lines.push('');
    });
    lines.push('Cliente declarou ser membro do Clube São Francisco: ' +
      (isMember ? ('SIM (código informado: ' + (memberCode.trim() ? memberCode.trim() : 'não indicado') + ')') : 'NÃO'));
    if (isMember) lines.push('(desconto de membro sujeito a confirmação da equipa São Francisco)');
    lines.push('');
    lines.push('TOTAL: ' + fmt(totalPrice()));
    lines.push('');
    lines.push('Quero finalizar este pedido.');
    var msg = lines.join('\n');
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
  }

  function init() {
    var toggle = document.getElementById('cartToggle');
    if (toggle) toggle.addEventListener('click', open);
    updateBadge();
  }

  /* Exposto para o loja.js poder adicionar produtos ao carrinho */
  window.SFCart = { add: add };

  init();
})();
