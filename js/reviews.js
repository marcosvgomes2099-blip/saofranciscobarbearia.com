/* ============================================================
   AVALIAÇÕES GOOGLE — São Francisco Barbearia
   Dados 100% reais, fornecidos pelo cliente a partir da própria
   ficha do Google (capturas de ecrã, 20/09/2026): nome do cliente,
   nota e texto do comentário. Duas avaliações (Andréa Gomes e Aline
   Lahelia) estavam truncadas pelo próprio Google ("... Mais") — o
   "…" no fim mantém-se para não inventar nem alterar o sentido do
   que não foi mostrado.
   NÃO adicionar avaliações fictícias nem alterar nomes/comentários.
   ============================================================ */
(function () {
  'use strict';

  var REVIEWS = [
    { name: 'Vitor Machado', text: 'Local muito bom, atendimento perfeito e bons profissionais! Recomendo muito!' },
    { name: 'Andréa Gomes', text: 'Excelente, perfeito atendimento, maravilhada…' },
    { name: 'Aline Lahelia', text: 'Atendimento excepcional, sem comparação, com certeza os melhores…' },
    { name: 'Rodrigo Oliveira', text: 'Barbearia com um ótimo atendimento e excelentes barbeiros.' },
    { name: 'Israel Diniz', text: 'Melhor experiência que já tive tanto no atendimento quanto na qualidade do corte.' }
  ];

  var track = document.getElementById('reviewsTrack');
  var dotsWrap = document.getElementById('reviewsDots');
  var prevBtn = document.getElementById('reviewsPrev');
  var nextBtn = document.getElementById('reviewsNext');
  var carousel = document.getElementById('reviewsCarousel');
  if (!track || !dotsWrap || !prevBtn || !nextBtn || !carousel) return;

  function initials(name) {
    var parts = name.trim().split(/\s+/);
    var first = parts[0] ? parts[0].charAt(0) : '';
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  track.innerHTML = REVIEWS.map(function (r) {
    return (
      '<article class="review-card">' +
        '<div class="review-card-top">' +
          '<span class="review-avatar">' + initials(r.name) + '</span>' +
          '<div>' +
            '<p class="review-name">' + r.name + '</p>' +
            '<span class="review-stars">★★★★★</span>' +
          '</div>' +
        '</div>' +
        '<p class="review-text">“' + r.text + '”</p>' +
        '<span class="review-source">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.26a12 12 0 0 0 0 10.75l4.01-3.11Z"/><path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4.01 3.1C6.22 6.86 8.87 4.75 12 4.75Z"/></svg>' +
          'Google' +
        '</span>' +
      '</article>'
    );
  }).join('');

  var cards = Array.prototype.slice.call(track.children);
  var index = 0;
  var visible = 3;
  var autoplayTimer = null;
  var pointerStartX = null;

  function getVisibleCount() {
    var w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 980) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visible);
  }

  function renderDots() {
    var count = maxIndex() + 1;
    dotsWrap.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'review-dot' + (i === index ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ir para avaliação ' + (i + 1));
      (function (i) {
        dot.addEventListener('click', function () { goTo(i); stopAutoplay(); });
      })(i);
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    var cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 0;
    var gap = 24;
    track.style.transform = 'translateX(-' + (index * (cardWidth + gap)) + 'px)';
    renderDots();
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, maxIndex()));
    update();
  }

  function next() {
    index = index >= maxIndex() ? 0 : index + 1;
    update();
  }

  function prev() {
    index = index <= 0 ? maxIndex() : index - 1;
    update();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(next, 5500);
  }

  function stopAutoplay() {
    if (autoplayTimer) { window.clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  function handleResize() {
    var v = getVisibleCount();
    if (v !== visible) {
      visible = v;
      Array.prototype.forEach.call(cards, function (c) {
        c.style.flexBasis = 'calc(' + (100 / visible) + '% - ' + (24 * (visible - 1) / visible) + 'px)';
      });
      index = Math.min(index, maxIndex());
    }
    update();
  }

  nextBtn.addEventListener('click', function () { next(); stopAutoplay(); });
  prevBtn.addEventListener('click', function () { prev(); stopAutoplay(); });
  carousel.addEventListener('mouseenter', stopAutoplay);

  carousel.addEventListener('touchstart', function (e) {
    pointerStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  carousel.addEventListener('touchend', function (e) {
    if (pointerStartX === null) return;
    var delta = e.changedTouches[0].clientX - pointerStartX;
    if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
    pointerStartX = null;
  }, { passive: true });

  window.addEventListener('resize', handleResize);
  handleResize();
  startAutoplay();

  /* Animação de entrada discreta quando a secção aparece no ecrã —
     dispara uma vez, depois deixa de observar. */
  var section = document.getElementById('avaliacoes');
  if (section && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(section);
  } else if (section) {
    section.classList.add('is-visible');
  }
})();
