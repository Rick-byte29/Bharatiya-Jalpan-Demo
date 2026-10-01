(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('is-loading');

  const loader = document.getElementById('loader');
  const finishLoader = () => {
    loader?.classList.add('is-done');
    document.body.classList.remove('is-loading');
  };
  window.addEventListener('load', () => setTimeout(finishLoader, reduced ? 50 : 1950), { once: true });
  setTimeout(finishLoader, reduced ? 80 : 2800);

  const header = document.querySelector('.site-header');
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
    document.body.style.overflow = !open ? 'hidden' : '';
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
  }));

  const reveals = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const years = Math.max(1, new Date().getFullYear() - 1985);
  const yearsCount = document.getElementById('yearsCount');
  if (yearsCount) yearsCount.textContent = `${years}`;
  const yearNow = document.getElementById('yearNow');
  if (yearNow) yearNow.textContent = new Date().getFullYear();

  document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      document.querySelectorAll('.sweet-card').forEach(card => {
        const cats = (card.dataset.category || '').split(' ');
        card.classList.toggle('is-hidden', filter !== 'all' && !cats.includes(filter));
      });
    });
  });

  document.querySelectorAll('.sweet-image img, .hero-card img, .moments-photo img, .visual-break img').forEach(img => {
    img.addEventListener('error', () => {
      if (!img.dataset.fallbackTried) {
        img.dataset.fallbackTried = '1';
        img.src = 'https://images.pexels.com/photos/18488311/pexels-photo-18488311.jpeg?auto=compress&cs=tinysrgb&w=1400';
        return;
      }
      img.style.display = 'none';
      img.parentElement?.classList.add('image-fallback');
    });
  });

  const pointerFine = window.matchMedia('(pointer:fine)').matches;
  if (!reduced && pointerFine) {
    const glow = document.getElementById('cursorGlow');
    window.addEventListener('pointermove', e => {
      if (glow) {
        glow.style.opacity = '1';
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    }, { passive: true });

    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        const base = card.classList.contains('hero-card-a') ? 'rotate(2.5deg)' : card.classList.contains('hero-card-b') ? 'rotate(-4deg)' : '';
        card.style.transform = `${base} perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .12;
        const y = (e.clientY - r.top - r.height / 2) * .12;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    const visual = document.querySelector('.visual-break img');
    window.addEventListener('scroll', () => {
      if (!visual) return;
      const r = visual.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const amount = (window.innerHeight - r.top) * .035;
        visual.style.transform = `translateY(${Math.min(28, amount)}px) scale(1.03)`;
      }
    }, { passive: true });
  }
})();


/* PREMIUM EXPERIENCE V4 */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // ----- Loader sweet carousel -----
  const loaderSweet = $('#loaderSweetImage');
  const loaderSweetName = $('#loaderSweetName');
  const loaderSlides = [
    ['Jalebi','https://static.toiimg.com/thumb/53099699.cms?height=900&width=1200'],
    ['Kaju Katli','https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_900%2Ch_700%2Cc_fill/FOOD_CATALOG/IMAGES/CMS/2024/4/6/9d12672f-73d0-4954-9781-83f562e9e989_2d6c2034-18e9-43cf-8923-2cfd0a2b5c52.jpg'],
    ['Gulab Jamun','https://prashantcorner.com/cdn/shop/files/DakGulabJamunSR-2.jpg?v=1718083866'],
    ['Motichoor Ladoo','https://lynkfoods.com/cdn/shop/articles/Motichoor_Ladoo_blog_2dd47e82-d240-4dc2-8263-1b103febfe17.jpg?v=1763378898'],
    ['Rasgulla','https://assets.telegraphindia.com/abp/2025/Sep/1757071088_roso.jpg']
  ];
  loaderSlides.slice(1).forEach(([,src]) => { const pre = new Image(); pre.src = src; });
  let loaderIndex = 0;
  let loaderTimer = null;
  if (loaderSweet && loaderSweetName && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loaderTimer = setInterval(() => {
      loaderIndex = (loaderIndex + 1) % loaderSlides.length;
      const [name, src] = loaderSlides[loaderIndex];
      loaderSweet.classList.add('is-changing');
      loaderSweetName.classList.add('is-changing');
      setTimeout(() => {
        loaderSweet.src = src;
        loaderSweetName.textContent = name;
        loaderSweet.classList.remove('is-changing');
        loaderSweetName.classList.remove('is-changing');
      }, 120);
    }, 380);
    const stopLoaderCarousel = () => { if (loaderTimer) clearInterval(loaderTimer); };
    window.addEventListener('load', () => setTimeout(stopLoaderCarousel, 2600), {once:true});
    setTimeout(stopLoaderCarousel, 3400);
  }

  // ----- Seasonal campaign -----
  const seasonal = $('#seasonalBadge');
  if (seasonal) {
    const m = new Date().getMonth();
    const presets = [
      ['Celebration Edit','A sweeter start to the year'],
      ['Wedding Edit','Boxes made for big family moments'],
      ['Spring Edit','Colour, gifting and something sweet'],
      ['Summer Edit','Light gifting for warmer days'],
      ['Family Edit','Bring something sweet home'],
      ['Monsoon Edit','Comfort classics for rainy evenings'],
      ['Celebration Edit','Boxes for gatherings and milestones'],
      ['Festive Preview','Plan larger gifting early'],
      ['Festive Edit','Celebration boxes take centre stage'],
      ['Festive Edit','Diwali & celebration gifting season'],
      ['Wedding Edit','A season for functions and gifting'],
      ['Year-End Edit','Close the year on a sweet note']
    ];
    const [label, copy] = presets[m];
    seasonal.innerHTML = '<span>'+label+'</span><strong>'+copy+'</strong>';
  }

  // ----- Build your box -----
  let boxSize = 4;
  const selected = new Set();
  const cards = $$('.sweet-card');
  const optionWrap = $('#builderOptions');
  const selectionWrap = $('#builderSelection');
  const count = $('#boxCount');
  const limit = $('#boxLimit');
  const progress = $('#builderProgress');
  const wa = $('#builderWhatsApp');
  const toast = $('#siteToast');
  const names = cards.map(c => $('h3', c)?.textContent.trim()).filter(Boolean);

  if (optionWrap && !optionWrap.children.length) {
    names.forEach((name, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'builder-option';
      b.dataset.name = name;
      b.innerHTML = '<small>'+String(i+1).padStart(2,'0')+'</small><strong>'+name+'</strong>';
      optionWrap.append(b);
    });
  }

  let toastTimer;
  function showToast(message, actionLabel) {
    if (!toast) return;
    toast.innerHTML = '<span>'+message+'</span>' + (actionLabel ? '<button type="button">'+actionLabel+'</button>' : '');
    toast.classList.add('is-showing');
    const action = $('button', toast);
    if (action) action.addEventListener('click', () => {
      $('#boxbuilder')?.scrollIntoView({behavior:'smooth', block:'start'});
      toast.classList.remove('is-showing');
    }, {once:true});
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-showing'), 2600);
  }

  function syncBox() {
    if (count) count.textContent = selected.size;
    if (limit) limit.textContent = boxSize;
    if (progress) progress.style.width = Math.min(100, (selected.size / boxSize) * 100) + '%';

    $$('.builder-option').forEach(b => b.classList.toggle('is-selected', selected.has(b.dataset.name)));
    $$('.sweet-card-actions').forEach(actions => {
      const name = actions.dataset.sweet || $('h3', actions.closest('.sweet-card'))?.textContent.trim();
      const add = $('.sweet-add', actions);
      if (!add) return;
      const active = selected.has(name);
      add.classList.toggle('is-added', active);
      add.textContent = active ? 'Added ✓' : 'Add to box';
      add.setAttribute('aria-pressed', String(active));
    });

    if (selectionWrap) {
      selectionWrap.innerHTML = selected.size
        ? [...selected].map(n => '<button class="builder-chip" type="button" data-remove="'+n.replace(/"/g,'&quot;')+'">'+n+' <span aria-hidden="true">×</span></button>').join('')
        : '<span>Your box is waiting.</span>';
    }

    if (wa) {
      const ready = selected.size > 0;
      wa.classList.toggle('is-disabled', !ready);
      wa.setAttribute('aria-disabled', String(!ready));
      const msg = 'Namaste Bharatiya Jalpan, I would like to enquire about a '+boxSize+'-variety mithai box. My selected sweets: '+[...selected].join(', ')+'. Please share availability and options.';
      wa.href = ready ? 'https://wa.me/919101035255?text='+encodeURIComponent(msg) : '#';
    }
  }

  function addSweet(name, {scroll=false}={}) {
    if (!name) return false;
    if (selected.has(name)) {
      showToast(name+' is already in your box.', 'View box');
      if (scroll) $('#boxbuilder')?.scrollIntoView({behavior:'smooth', block:'start'});
      return true;
    }
    if (selected.size >= boxSize) {
      showToast('Your '+boxSize+'-variety box is full.', 'View box');
      if (scroll) $('#boxbuilder')?.scrollIntoView({behavior:'smooth', block:'start'});
      return false;
    }
    selected.add(name);
    syncBox();
    showToast(name+' added to your box.', 'View box');
    if (scroll) $('#boxbuilder')?.scrollIntoView({behavior:'smooth', block:'start'});
    return true;
  }

  function removeSweet(name) {
    if (!selected.has(name)) return;
    selected.delete(name);
    syncBox();
    showToast(name+' removed from your box.');
  }

  // Single delegated click listener: reliable for desktop/mobile and future cards.
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.sweet-add');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = addBtn.closest('.sweet-card');
      const name = card?.querySelector('h3')?.textContent.trim();
      if (selected.has(name)) removeSweet(name); else addSweet(name);
      return;
    }

    const quickBtn = e.target.closest('.sweet-quick');
    if (quickBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = quickBtn.closest('.sweet-card');
      if (card) openDrawer(card);
      return;
    }

    const option = e.target.closest('.builder-option');
    if (option) {
      e.preventDefault();
      const name = option.dataset.name;
      if (selected.has(name)) removeSweet(name); else addSweet(name);
      return;
    }

    const chip = e.target.closest('.builder-chip[data-remove]');
    if (chip) {
      e.preventDefault();
      removeSweet(chip.dataset.remove);
    }
  });

  $$('.box-size').forEach(b => b.addEventListener('click', () => {
    $$('.box-size').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    boxSize = Number(b.dataset.size || 4);
    while (selected.size > boxSize) selected.delete([...selected].pop());
    syncBox();
    showToast('Box size changed to '+boxSize+' varieties.');
  }));

  $('#clearBox')?.addEventListener('click', () => {
    selected.clear();
    syncBox();
    showToast('Your box has been cleared.');
  });

  syncBox();

  // ----- Sweet quick-view drawer -----
  const drawer = $('#sweetDrawer');
  let currentSweet = '';

  function openDrawer(card) {
    if (!drawer || !card) return;
    currentSweet = $('h3', card)?.textContent.trim() || 'Mithai';
    const image = $('img', card);
    const title = $('#drawerTitle');
    const desc = $('#drawerDescription');
    const drawerImg = $('#drawerImage');
    const drawerWa = $('#drawerWhatsApp');

    if (title) title.textContent = currentSweet;
    if (desc) desc.textContent = $('p', card)?.textContent.trim() || '';
    if (drawerImg) {
      drawerImg.src = image?.currentSrc || image?.src || '';
      drawerImg.alt = currentSweet;
    }
    if (drawerWa) drawerWa.href = 'https://wa.me/919101035255?text='+encodeURIComponent('Namaste Bharatiya Jalpan, is '+currentSweet+' available today?');

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    document.body.classList.add('drawer-open');
    $('.drawer-close', drawer)?.focus();
  }

  function closeDrawer() {
    drawer?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden','true');
    document.body.classList.remove('drawer-open');
  }

  $$('[data-drawer-close]').forEach(b => b.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  $('#drawerAddBox')?.addEventListener('click', () => {
    addSweet(currentSweet);
    closeDrawer();
    $('#boxbuilder')?.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // ----- Active nav state -----
  const navLinks = $$('.nav a[href^="#"]').filter(a => a.getAttribute('href') !== '#top');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#'+entry.target.id));
      });
    }, {rootMargin:'-35% 0px -55% 0px', threshold:0});

    navLinks.forEach(a => {
      const target = $(a.getAttribute('href'));
      if (target) sectionObserver.observe(target);
    });
  }

  // ----- Delivery/performance hints -----
  $$('img').forEach((img, i) => {
    img.decoding = 'async';
    if (i > 2 && !img.hasAttribute('loading')) img.loading = 'lazy';
  });
})();
