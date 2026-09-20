/* ============================================================
   PROMOÇÕES DA SEMANA — São Francisco Barbearia
   Dados num único array, usados tanto na secção de destaque da
   página principal (grid pequeno) como na página promocoes.html
   (detalhe completo). Os botões destas promoções levam à secção
   de agendamento do próprio site, não ao WhatsApp.
   ============================================================ */
(function () {
  'use strict';

  var PROMOS = [
    {
      day: 'Segunda',
      slug: 'segunda',
      title: 'Dia do Trabalhador',
      tagline: 'Respeito a quem faz a diferença.',
      benefits: [
        'Polícia — 15% OFF',
        'Bombeiros — 15% OFF',
        'Segurança privada — 15% OFF',
        'Motoristas TVDE / Uber — 10% OFF'
      ]
    },
    {
      day: 'Terça',
      slug: 'terca',
      title: 'Dia do Estudante',
      tagline: 'Investir em ti também é cuidar do teu estilo.',
      benefits: [
        'Estudantes — 20% OFF',
        'Crianças até 12 anos — 15% OFF'
      ]
    },
    {
      day: 'Quarta',
      slug: 'quarta',
      title: 'Dia do Pai e Filho',
      tagline: 'Mais que um corte, momentos que ficam.',
      benefits: [
        'Pai + Filho — 30% OFF no valor total'
      ]
    },
    {
      day: 'Quinta',
      slug: 'quinta',
      title: 'Dia do Amigo',
      tagline: 'Traz um amigo que nunca cortou na barbearia.',
      benefits: [
        'Os dois ganham 4€ de desconto'
      ]
    },
    {
      day: 'Sexta',
      slug: 'sexta',
      title: 'Happy Hour São Francisco',
      tagline: 'O final da semana começa aqui.',
      benefits: [
        '1 Super Bock grátis',
        '20% OFF na hidratação'
      ]
    },
    {
      day: 'Sábado',
      slug: 'sabado',
      title: 'VIP Day',
      tagline: 'Experiências exclusivas para quem é fiel.',
      benefits: [
        '1 Super Bock grátis',
        'Sorteio semanal de 50% OFF para quem cortar neste dia'
      ]
    }
  ];

  var TEASER_DIMS = {
    segunda: [640, 484], terca: [640, 513], quarta: [640, 513],
    quinta: [640, 513], sexta: [640, 513], sabado: [640, 491]
  };
  var FULL_DIMS = {
    segunda: [800, 1200], terca: [800, 1067], quarta: [800, 1067],
    quinta: [800, 1067], sexta: [800, 1067], sabado: [800, 1200]
  };

  /* Validade mostrada em todos os cards. Para mudar a data no futuro,
     basta editar esta linha — o layout não muda. */
  var VALID_UNTIL = '20/10/2026';

  /* Quantas promoções aparecem na home. As restantes continuam todas
     disponíveis em promocoes.html. */
  var HOME_LIMIT = 3;

  /* Os botões das promoções levam à secção "Marcar horário" do próprio
     site (não ao WhatsApp) e não pré-selecionam serviço, profissional
     nem horário — o cliente escolhe tudo normalmente por lá. */
  function bookingLink() {
    var onHome = /(^|\/)(index\.html)?$/.test(window.location.pathname);
    return onHome ? '#agendar' : 'index.html#agendar';
  }

  /* ============================================================
     GRID PEQUENO — usado na página principal (index.html)
     ============================================================ */
  function renderTeaserGrid() {
    var grid = document.getElementById('promoGrid');
    if (!grid) return;
    grid.innerHTML = PROMOS.slice(0, HOME_LIMIT).map(function (p) {
      return (
        '<a class="promo-card" href="promocoes.html#' + p.slug + '">' +
          '<div class="promo-card-media">' +
            '<img src="assets/promo/' + p.slug + '-teaser.webp" alt="' + p.day + ' — ' + p.title + '" loading="lazy" width="' + TEASER_DIMS[p.slug][0] + '" height="' + TEASER_DIMS[p.slug][1] + '">' +
          '</div>' +
          '<div class="promo-card-body">' +
            '<span class="promo-card-day">' + p.day + '</span>' +
            '<h3>' + p.title + '</h3>' +
            '<p>' + p.benefits[0] + '</p>' +
            '<span class="promo-card-link">Saber mais <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
            '<span class="promo-validity">Promoção válida até ' + VALID_UNTIL + '</span>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  /* ============================================================
     DETALHE COMPLETO — usado na página promocoes.html
     ============================================================ */
  function renderDetailList() {
    var list = document.getElementById('promoDetailList');
    if (!list) return;
    list.innerHTML = PROMOS.map(function (p) {
      return (
        '<article class="promo-detail" id="' + p.slug + '">' +
          '<div class="promo-detail-media">' +
            '<img src="assets/promo/' + p.slug + '-full.webp" alt="' + p.day + ' — ' + p.title + '" loading="lazy" width="' + FULL_DIMS[p.slug][0] + '" height="' + FULL_DIMS[p.slug][1] + '">' +
          '</div>' +
          '<div class="promo-detail-body">' +
            '<span class="promo-detail-day">' + p.day + '</span>' +
            '<h2>' + p.title + '</h2>' +
            '<p class="promo-detail-tagline">' + p.tagline + '</p>' +
            '<ul class="promo-detail-benefits">' +
              p.benefits.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
            '</ul>' +
            '<a href="' + bookingLink() + '" class="btn btn-primary promo-book-btn">Agendar agora</a>' +
            '<span class="promo-validity">Promoção válida até ' + VALID_UNTIL + '</span>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  renderTeaserGrid();
  renderDetailList();

  /* Como a lista é montada via JS, o scroll automático do browser
     para a âncora (#segunda, #sabado, etc.) acontece cedo demais —
     o elemento ainda não existe. Repetimos o scroll manualmente
     depois de renderizar. */
  if (window.location.hash) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      requestAnimationFrame(function () {
        target.scrollIntoView({ block: 'start' });
      });
    }
  }
})();
