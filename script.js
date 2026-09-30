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