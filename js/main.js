/* ============================================================
   SÃO FRANCISCO BARBEARIA — main.js
   Todos os dados de negócio (serviços, preços, equipa, Cal.com,
   WhatsApp) ficam neste único ficheiro, fáceis de editar.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- DADOS: serviços em destaque (secção "Serviços") ---------- */
  var FEATURED_SERVICES = [
    {
      key: 'Corte + Pera e Bigode',
      title: 'Corte + Pera e Bigode',
      desc: 'Corte clássico e bem finalizado, ideal para manter o visual em dia.',
      checklist: ['Contornos precisos', 'Acabamento profissional', 'Visual alinhado'],
      price: 16,
      photo: 'assets/services/pera-bigode.webp',
      icon: 'scissors'
    },
    {
      key: 'Corte Degradê',
      title: 'Corte Degradê',
      desc: 'Acabamento moderno com transição suave de altura, perfeito para um look atual.',
      checklist: ['Degradê personalizado', 'Linha e acabamento no ponto', 'Estilo e simetria'],
      price: 15,
      photo: 'assets/services/degrade.webp',
      icon: 'profile'
    },
    {
      key: 'Corte + Sobrancelha',
      title: 'Corte + Sobrancelha',
      desc: 'Visual completo com corte clássico e alinhamento da sobrancelha.',
      checklist: ['Rosto mais expressivo', 'Acabamento preciso', 'Estilo e harmonia'],
      price: 15,
      photo: 'assets/services/sobrancelha.webp',
      icon: 'eyebrow'
    },
    {
      key: 'Corte + Hidratação',
      title: 'Corte + Hidratação',
      desc: 'Estilo moderno no cabelo e hidratação profunda.',
      checklist: ['Fios mais saudáveis', 'Brilho e maciez', 'Visual impecável por mais tempo'],
      price: 20,
      photo: 'assets/services/hidratacao.webp',
      icon: 'drop'
    },
    {
      key: 'Barba',
      title: 'Barba',
      desc: 'Modelagem e acabamento precisos para realçar seu estilo.',
      checklist: ['Contornos bem definidos', 'Barba alinhada e estilosa', 'Toque de elegância'],
      price: 8,
      photo: 'assets/services/barba.webp',
      icon: 'beard'
    },
    {
      key: 'Corte + Lavagem',
      title: 'Corte + Lavagem',
      desc: 'Corte de sua preferência com lavagem relaxante e finalização impecável.',
      checklist: ['Sensação de frescor', 'Couro cabeludo limpo', 'Acabamento profissional'],
      price: 18,
      photo: 'assets/services/lavagem.webp',
      icon: 'shower'
    },
    {
      key: 'Corte + Barba',
      title: 'Corte + Barba',
      desc: 'Cabelo e barba no mesmo atendimento, garantindo harmonia no visual.',
      checklist: ['Estilo completo', 'Visual mais masculino', 'Praticidade e confiança'],
      price: 18,
      photo: 'assets/services/corte-barba.webp',
      icon: 'scissors-beard'
    },
    {
      key: 'Corte + Madeixas',
      title: 'Corte + Madeixas',
      desc: 'Mechas personalizadas que dão profundidade e movimento ao visual.',
      checklist: ['Técnica personalizada', 'Contraste natural', 'Acabamento de salão'],
      price: 50,
      photo: 'assets/services/corte-madeixas.webp',
      icon: 'strands'
    }
  ];

  /* Duas cartas de destaque usam um nome "resumido" que corresponde a uma
     entrada diferente (mais específica) na lista completa de agendamento. */
  var SHOWCASE_TO_BOOKING_ALIAS = {
    'Corte + Hidratação': 'Corte + Hidratação Profunda',
    'Barba': 'Barba Simples'
  };

  var SERVICE_ICONS = {
    scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><line x1="20" y1="4" x2="8.4" y2="15.6"/><line x1="8.4" y1="8.4" x2="20" y2="20"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 20v-3.2C6.2 15.6 4.5 13 4.5 10a7.5 7.5 0 0 1 15 0c0 2-.7 3.4-2 4.6V20"/><path d="M9 20h6"/></svg>',
    eyebrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10c2-3 6-4 9-4s7 1 9 4"/><circle cx="12" cy="14" r="2.3"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
    beard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4c0 5 0 8 2 11 1.6 2.3 3.4 3.5 5 3.5s3.4-1.2 5-3.5c2-3 2-6 2-11"/><path d="M5 4c2 2 4 2 7 2s5 0 7-2"/></svg>',
    shower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9a6 6 0 0 1 11-3"/><path d="M4 9h16"/><path d="M8 13v2M12 13v3M16 13v2M8 19v.5M12 19v.5M16 19v.5"/></svg>',
    'scissors-beard': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><line x1="19" y1="5" x2="9" y2="14"/><line x1="9" y1="10" x2="19" y2="19"/></svg>',
    strands: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3c-1 4 3 5 2 9s-4 4-3 9"/><path d="M12 3c-1 4 3 5 2 9s-4 4-3 9"/><path d="M18 3c-1 4 3 5 2 9s-4 4-3 9"/></svg>'
  };

  /* ---------- DADOS: lista completa de serviços para marcação ---------- */
  /* Preços em cêntimos, exatamente como na versão original do site. */
  var BOOKING_SERVICES = [
    { name: 'Corte Social', price: 1500 },
    { name: 'Serviço Premium', price: 2500 },
    { name: 'Corte Degradê', price: 1500 },
    { name: 'Corte + Barba', price: 1800 },
    { name: 'Corte + Pêra e Bigode', price: 1600 },
    { name: 'Pêra e Bigode', price: 600 },
    { name: 'Acabamento', price: 500 },
    { name: 'Corte + Sobrancelha', price: 1500 },
    { name: 'Corte + Lavagem', price: 1800 },
    { name: 'Corte + Desenho', price: 1600 },
    { name: 'Corte + Pigmentação', price: 2000 },
    { name: 'Corte + Madeixas', price: 5000 },
    { name: 'Corte + Platinado', price: 5000 },
    { name: 'Corte + Pintura', price: 5000 },
    { name: 'Corte + Hidratação Profunda', price: 2000 },
    { name: 'Barboterapia', price: 1200 },
    { name: 'Barba Simples', price: 800 },
    { name: 'Sobrancelha', price: 500 },
    { name: 'Alisamento', price: 3000 }
  ];

  /* ---------- DADOS: equipa ---------- */
  var TEAM = [
    { name: 'Fabrício', photo: 'assets/team/fabricio.webp', calUsername: 'fabricio-barber', calHost: 'cal.eu' },
    { name: 'Vinícius', photo: 'assets/team/vinicius.webp', calUsername: 'vinicius-barber', calHost: 'cal.eu' },
    { name: 'Ricardo', photo: 'assets/team/ricardo.webp', calUsername: 'ricardo-barber', calHost: 'cal.eu' },
    { name: 'Souza', photo: 'assets/team/souza.webp', calUsername: 'diogo-sousa', calHost: 'cal.com' }
  ];

  /* Nome do serviço (como escrito no site) -> slug do tipo de evento no
     Cal.com. Confirmado em cal.eu/{barbeiro}/{slug} — igual para todos
     os barbeiros. Mantido idêntico à versão original. */
  var SERVICE_SLUGS = {
    'Corte Social': 'corte-social',
    'Serviço Premium': 'servico-premium',
    'Corte Degradê': 'corte-degrade',
    'Corte + Barba': 'corte-barba',
    'Corte + Pêra e Bigode': 'corte-pera-e-bigode',
    'Corte + Pera e Bigode': 'corte-pera-e-bigode',
    'Pêra e Bigode': 'pera-e-bigode',
    'Acabamento': 'acabamento',
    'Corte + Sobrancelha': 'corte-sobrancelha',
    'Corte + Lavagem': 'corte-lavagem',
    'Corte + Desenho': 'corte-desenho',
    'Corte + Pigmentação': 'corte-pigmentacao',
    'Corte + Madeixas': 'corte-madeixas',
    'Corte + Platinado': 'corte-platinado',
    'Corte + Pintura': 'corte-pintura',
    'Corte + Hidratação Profunda': 'corte-hidratacao-profunda',
    'Corte + Hidratação': 'corte-hidratacao-profunda',
    'Barboterapia': 'barboterapia',
    'Barba Simples': 'barba-simples',
    'Barba': 'barba-simples',
    'Sobrancelha': 'sobrancelha',
    'Alisamento': 'alisamento'
  };

  var WHATSAPP_NUMBER = '351938435158';

  function euros(cents) {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €';
  }

  /* ============================================================
     HERO — animação da logo letra a letra (mantida, simplificada)
     ============================================================ */
  (function initHeroLogo() {
    var el = document.getElementById('heroLogo');
    if (!el) return;
    var words = ['SÃO', 'FRANCISCO'];
    el.innerHTML = '';
    var i = 0;
    words.forEach(function (word, wi) {
      var wordWrap = document.createElement('span');
      wordWrap.className = 'word-nowrap';
      word.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'drop-letter';
        span.textContent = ch;
        span.style.animationDelay = (i * 0.045) + 's';
        wordWrap.appendChild(span);
        i++;
      });
      el.appendChild(wordWrap);
      if (wi < words.length - 1) {
        var space = document.createElement('span');
        space.className = 'drop-letter';
        space.textContent = '\u00A0';
        space.style.animationDelay = (i * 0.045) + 's';
        el.appendChild(space);
        i++;
      }
    });
  })();

  /* ============================================================
     NAV — menu mobile
     ============================================================ */
  (function initNav() {
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
  })();

  /* ============================================================
     SERVIÇOS — renderiza os cards reais em HTML/CSS
     ============================================================ */
  function renderServices() {
    var grid = document.getElementById('servicesGrid');
    if (!grid) return;
    var html = FEATURED_SERVICES.map(function (s) {
      var checklist = s.checklist.map(function (item) {
        return '<li>' + item + '</li>';
      }).join('');
      return (
        '<a class="service-card" href="#agendar" data-service-key="' + s.key + '" aria-label="Marcar: ' + s.title + '">' +
          '<div class="service-photo"><img src="' + s.photo + '" alt="' + s.title + '" loading="lazy" width="600" height="800"></div>' +
          '<div class="service-body">' +
            '<div class="service-top">' +
              '<h3>' + s.title + '</h3>' +
              '<span class="service-icon" aria-hidden="true">' + (SERVICE_ICONS[s.icon] || '') + '</span>' +
            '</div>' +
            '<p class="service-desc">' + s.desc + '</p>' +
            '<ul class="service-checklist">' + checklist + '</ul>' +
            '<div class="service-footer">' +
              '<span class="service-price">' + s.price + ' €</span>' +
              '<span class="service-cta">Marcar</span>' +
            '</div>' +
          '</div>' +
        '</a>'
      );
    }).join('');
    grid.innerHTML = html;
  }

  /* ============================================================
     EQUIPA — grid da secção Equipa (mesmos dados do seletor de barbeiro)
     ============================================================ */
  function renderTeamGrid() {
    var grid = document.getElementById('teamGrid');
    if (!grid) return;
    grid.innerHTML = TEAM.map(function (m) {
      return (
        '<a class="team-member" href="#agendar" aria-label="Marcar com ' + m.name + '">' +
          '<div class="team-photo">' +
            '<img src="' + m.photo + '" alt="' + m.name + '" loading="lazy" width="480" height="600">' +
            '<span class="team-photo-scrim"></span>' +
            '<span class="team-photo-caption"><strong>' + m.name + '</strong><em>Barbeiro</em></span>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  /* ============================================================
     AGENDAR — lista real de serviços + seletor de barbeiro + CTAs
     ============================================================ */
  function renderBookingList() {
    var list = document.getElementById('servicePickerList');
    if (!list) return;
    list.innerHTML = BOOKING_SERVICES.map(function (s, i) {
      var id = 'svc-' + i;
      return (
        '<label class="service-option" for="' + id + '">' +
          '<input type="checkbox" id="' + id + '" data-name="' + s.name + '" data-price="' + s.price + '">' +
          '<span class="opt-card">' +
            '<span class="opt-check" aria-hidden="true"></span>' +
            '<span class="opt-name">' + s.name + '</span>' +
            '<span class="opt-price">' + euros(s.price) + '</span>' +
          '</span>' +
        '</label>'
      );
    }).join('');
  }

  function renderBarberPicker() {
    var grid = document.getElementById('barberGrid');
    if (!grid) return;
    grid.innerHTML = TEAM.map(function (m, i) {
      return (
        '<button type="button" class="barber-option" data-barber-index="' + i + '" aria-pressed="false">' +
          '<span class="barber-photo"><img src="' + m.photo + '" alt="' + m.name + '" loading="lazy" width="120" height="120"></span>' +
          '<span class="barber-name">' + m.name + '</span>' +
        '</button>'
      );
    }).join('');
  }

  function initBookingLogic() {
    var checkboxes = function () { return Array.prototype.slice.call(document.querySelectorAll('.service-option input[type="checkbox"]')); };
    var selectedBarberIndex = null;

    var summaryCount = document.getElementById('summaryCount');
    var summaryTotal = document.getElementById('summaryTotal');
    var warning = document.getElementById('agendarWarning');

    function updateSummary() {
      var boxes = checkboxes().filter(function (b) { return b.checked; });
      var total = boxes.reduce(function (sum, b) { return sum + parseInt(b.dataset.price, 10); }, 0);
      summaryCount.textContent = boxes.length + (boxes.length === 1 ? ' serviço selecionado' : ' serviços selecionados');
      summaryTotal.textContent = euros(total);
    }

    document.getElementById('servicePickerList').addEventListener('change', function (e) {
      if (e.target.matches('input[type="checkbox"]')) updateSummary();
    });

    /* Seletor de barbeiro */
    var barberButtons = Array.prototype.slice.call(document.querySelectorAll('.barber-option'));
    barberButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        barberButtons.forEach(function (b) {
          b.classList.remove('is-selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-pressed', 'true');
        selectedBarberIndex = parseInt(btn.dataset.barberIndex, 10);
      });
    });

    function normalize(s) {
      return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }

    function findCheckboxByName(serviceName) {
      var target = normalize(serviceName);
      var boxes = checkboxes();
      for (var i = 0; i < boxes.length; i++) {
        if (normalize(boxes[i].dataset.name) === target) return boxes[i];
      }
      for (var j = 0; j < boxes.length; j++) {
        var name = normalize(boxes[j].dataset.name);
        if (name.indexOf(target) !== -1 || target.indexOf(name) !== -1) return boxes[j];
      }
      return null;
    }

    /* Ligação: clicar num card da secção "Serviços" pré-seleciona o
       serviço correspondente na lista de marcação e leva até lá. */
    document.getElementById('servicesGrid').addEventListener('click', function (e) {
      var card = e.target.closest('[data-service-key]');
      if (!card) return;
      var key = card.dataset.serviceKey;
      var bookingName = SHOWCASE_TO_BOOKING_ALIAS[key] || key;
      var checkbox = findCheckboxByName(bookingName);
      if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        updateSummary();
      }
      if (checkbox) {
        e.preventDefault();
        document.getElementById('agendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function () {
          checkbox.closest('.service-option').scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 500);
      }
    });

    function buildSummary() {
      var boxes = checkboxes().filter(function (b) { return b.checked; });
      if (!boxes.length) return null;
      var names = boxes.map(function (b) { return b.dataset.name; });
      var total = boxes.reduce(function (sum, b) { return sum + parseInt(b.dataset.price, 10); }, 0);
      return { names: names, total: (total / 100).toFixed(2).replace('.', ',') };
    }

    function showWarning(msg) {
      warning.textContent = msg;
      warning.classList.add('is-visible');
    }
    function clearWarning() {
      warning.classList.remove('is-visible');
      warning.textContent = '';
    }

    function handleAction(kind) {
      var summary = buildSummary();
      if (!summary) {
        showWarning('Escolhe pelo menos um serviço antes de continuar.');
        return;
      }
      if (selectedBarberIndex === null) {
        showWarning('Escolhe o profissional antes de continuar.');
        return;
      }
      clearWarning();
      var barber = TEAM[selectedBarberIndex];

      if (kind === 'calcom') {
        if (window.sfInitCal) window.sfInitCal();
        if (summary.names.length > 1) {
          showWarning('Para marcar online, escolhe apenas 1 serviço de cada vez (o calendário só marca um serviço por horário). Para combinar vários serviços, usa o WhatsApp.');
          return;
        }
        var slug = SERVICE_SLUGS[summary.names[0]];
        if (!slug) {
          showWarning('Não consegui encontrar este serviço online. Marca pelo WhatsApp, por favor.');
          return;
        }
        var calLink = barber.calUsername + '/' + slug;
        if (window.Cal) {
          if (barber.calHost === 'cal.com' && window.Cal.ns && window.Cal.ns.us) {
            window.Cal.ns.us('modal', { calLink: calLink });
          } else {
            window.Cal('modal', { calLink: calLink });
          }
        } else {
          window.open('https://www.' + barber.calHost + '/' + calLink, '_blank');
        }
      } else {
        var msg = 'Olá! Quero marcar: ' + summary.names.join(', ') + ' (Total: ' + summary.total + ' €) com o ' + barber.name + '.';
        window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
      }
    }

    var btnCal = document.getElementById('btnCalCom');
    var btnWpp = document.getElementById('btnWhatsApp');
    if (btnCal) btnCal.addEventListener('click', function () { handleAction('calcom'); });
    if (btnWpp) btnWpp.addEventListener('click', function () { handleAction('whatsapp'); });
  }

  /* ============================================================
     CLUBE — toggle Black / Gold
     ============================================================ */
  function initClubToggle() {
    var black = document.getElementById('cardBlack');
    var gold = document.getElementById('cardGold');
    var knob = document.getElementById('switchKnob');
    var track = document.getElementById('planSwitch');
    var labelBlack = document.getElementById('labelBlack');
    var labelGold = document.getElementById('labelGold');
    if (!track) return;
    track.addEventListener('click', function () {
      var isGold = gold.style.display !== 'none';
      if (isGold) {
        gold.style.display = 'none';
        black.style.display = 'block';
        knob.classList.remove('is-right');
        track.classList.remove('is-gold');
        labelBlack.classList.add('is-active');
        labelGold.classList.remove('is-active');
      } else {
        gold.style.display = 'block';
        black.style.display = 'none';
        knob.classList.add('is-right');
        track.classList.add('is-gold');
        labelGold.classList.add('is-active');
        labelBlack.classList.remove('is-active');
      }
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
     MASCOTE — piscar de olhos (a "respiração" e o balanço vêm do CSS)
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

  /* ============================================================
     ENTRY SPLASH — tela de entrada
     Aproveitamos o clique de entrada (interação real do utilizador)
     para só então: 1) carregar o vídeo do hero — igual em qualquer
     ecrã, sem exceção para mobile; 2) inicializar o Cal.com. Nada
     disto pesa no carregamento inicial da página.
     ============================================================ */
  function startHeroVideo() {
    var video = document.getElementById('heroVideo');
    if (!video) return;
    var source = video.querySelector('source[data-src]');
    if (source) {
      source.src = source.getAttribute('data-src');
      video.load();
      video.play().catch(function () { /* autoplay bloqueado pelo browser: fica no fundo escuro */ });
    }
  }

  function initEntrySplash() {
    var splash = document.getElementById('entrySplash');
    var btn = document.getElementById('entryBtn');
    if (!splash || !btn) return;
    document.body.classList.add('entry-locked');
    function enter() {
      splash.classList.add('is-hidden');
      document.body.classList.remove('entry-locked');
      window.setTimeout(function () {
        splash.style.display = 'none';
      }, 650);
      btn.removeEventListener('click', enter);
      startHeroVideo();
      if (window.sfInitCal) window.sfInitCal();

      /* Se o visitante chegou por um link com âncora (ex.: vindo de
         promocoes.html para #agendar), o browser não conseguiu rolar
         porque o scroll estava bloqueado pela tela de entrada.
         Levamo-lo até lá assim que entra. */
      if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        if (target) {
          window.setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    }
    btn.addEventListener('click', enter);
  }

  /* ---------- init ---------- */
  initEntrySplash();
  renderServices();
  renderTeamGrid();
  renderBookingList();
  renderBarberPicker();
  initBookingLogic();
  initClubToggle();
  initNewsletter();
  initMascotBlink();
})();
