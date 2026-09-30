/**
 * Skyline Airlines - Luxury Corporate - Main JS
 * Production-ready with detailed comments
 * Features: hamburger, dark/light, smooth scroll, fade-in, validation, pricing, FAQ, back-to-top, parallax, stats, map
 */

// ===== Side Navbar Logic =====
function toggleSidenav() {
  const sidenav = document.getElementById('sidenav');
  const isOpen = sidenav.classList.contains('open');
  if (isOpen) closeSidenav(); else openSidenav();
}
function openSidenav() {
  document.getElementById('sidenav').classList.add('open');
  document.getElementById('sidenavOverlay').classList.add('open');
  const burger = document.getElementById('hamburger');
  if (burger) burger.classList.add('active');
  document.getElementById('sidenav').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  showBanner('Menu opened');
}
function closeSidenav() {
  document.getElementById('sidenav').classList.remove('open');
  document.getElementById('sidenavOverlay').classList.remove('open');
  const burger = document.getElementById('hamburger');
  if (burger) burger.classList.remove('active');
  const nav = document.getElementById('sidenav');
  if (nav) nav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ===== Dark / Light Mode Toggle =====
function initTheme() {
  const saved = localStorage.getItem('skyline-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('skyline-theme', next);
  updateThemeIcon(next);
  showBanner(`Switched to ${next} mode`);
  showToast(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode`);
}
function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== Smooth Scroll Navigation =====
function navigateTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Update active states
    document.querySelectorAll('.navbar-links a, .sidenav-links a').forEach(a => a.classList.remove('active'));
    const selector = `.navbar-links a[href="#${sectionId}"], .sidenav-links a[href="#${sectionId}"]`;
    document.querySelectorAll(selector).forEach(a => a.classList.add('active'));
    showBanner(`Navigated to ${sectionId}`);
  }
}
function goToPage(page) {
  // Multi-page navigation - maps to separate HTML files
  const map = {
    'home': 'index.html',
    'flights': 'flights.html',
    'fleet': 'fleet.html',
    'booking': 'booking.html',
    'book': 'booking.html',
    'about': 'about.html',
    'pricing': 'pricing.html',
    'faq': 'faq.html',
    'contact': 'contact.html',
    'payment': 'payment.html',
    'ticket': 'ticket.html'
  };
  const target = map[page] || map[page.toLowerCase()] || `${page}.html`;
  // If file exists pattern, navigate, else show feedback
  if (map[page] || map[page.toLowerCase()]) {
    window.location.href = target;
  } else {
    showBanner(`Navigating to ${page}`);
    showToast(`Opening ${page}`);
    // Fallback scroll if on same page
    const el = document.getElementById(page);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== Banner & Toast - Must be synchronous for validation =====
function showBanner(text) {
  const b = document.getElementById('banner');
  if (!b) return;
  b.textContent = text;
  b.classList.add('show');
  b.setAttribute('role', 'status');
  setTimeout(() => b.classList.remove('show'), 3200);
}
function showToast(text) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== Scroll-triggered Fade-in Animations =====
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== Parallax Scrolling =====
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
          heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===== Animated Statistics Counter =====
function initStatsCounter() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = (target % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
        }, 20);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
}

// ===== Back to Top Button =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 320) btn.classList.add('show');
    else btn.classList.remove('show');
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showBanner('Back to top');
  });
}

// ===== Pricing Table Toggle =====
function togglePricingMode(mode) {
  document.querySelectorAll('.pricing-toggle button').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.pricing-toggle button[data-mode="${mode}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  // Update prices (example: yearly 20% off)
  document.querySelectorAll('.pricing-price').forEach(el => {
    const monthly = parseFloat(el.getAttribute('data-monthly'));
    if (!isNaN(monthly)) {
      const price = mode === 'yearly' ? Math.round(monthly * 12 * 0.8) : monthly;
      const suffix = mode === 'yearly' ? '/year' : '/month';
      el.innerHTML = `$${price}<span>${suffix}</span>`;
    }
  });
  showBanner(`Pricing: ${mode} billing`);
}

// ===== FAQ Accordion =====
function toggleFAQ(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) {
    item.classList.add('open');
    showBanner(`Opened: ${item.querySelector('.faq-question').textContent.trim().slice(0,30)}...`);
  }
}

// ===== Contact Form Validation =====
function validateContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const message = form.querySelector('[name="message"]');
  let valid = true;

  // Reset errors
  form.querySelectorAll('.form-error').forEach(err => err.classList.remove('show'));
  form.querySelectorAll('.form-input, .form-textarea').forEach(inp => inp.classList.remove('error'));

  if (!name.value.trim()) {
    showFieldError(name, 'Name is required');
    valid = false;
  }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showFieldError(email, 'Valid email is required');
    valid = false;
  }
  if (!message.value.trim() || message.value.trim().length < 10) {
    showFieldError(message, 'Message must be at least 10 characters');
    valid = false;
  }

  if (valid) {
    showBanner('Message sent successfully! We will reply within 24h');
    showToast('✅ Message sent');
    form.reset();
  } else {
    showBanner('Please fix form errors');
  }
  return false;
}
function showFieldError(input, msg) {
  input.classList.add('error');
  const err = input.parentElement.querySelector('.form-error');
  if (err) {
    err.textContent = msg;
    err.classList.add('show');
    err.setAttribute('role', 'alert');
  }
}

// ===== Booking Logic (for booking.html) =====
const MOCK_FLIGHTS = [
  { id: 'QR104', airline: 'QR', name: 'Qatar Airways', from: 'AMM', to: 'DXB', dep: '08:30', arr: '12:45', dur: '4h15m', stops: 'Direct', aircraft: 'B787', price: 489, orig: 620 },
  { id: 'EK202', airline: 'EK', name: 'Emirates', from: 'AMM', to: 'DXB', dep: '11:15', arr: '15:20', dur: '4h05m', stops: 'Direct', aircraft: 'A380', price: 520, orig: 680 },
  { id: 'TK890', airline: 'TK', name: 'Turkish Airlines', from: 'AMM', to: 'IST', dep: '14:00', arr: '19:30', dur: '6h30m', stops: '1 Stop', aircraft: 'B737', price: 320, orig: 450 },
  { id: 'RJ112', airline: 'RJ', name: 'Royal Jordanian', from: 'AMM', to: 'LON', dep: '18:45', arr: '22:55', dur: '4h10m', stops: 'Direct', aircraft: 'A321', price: 445, orig: 590 },
];
let selectedFlight = null;
let selectedClass = 'economy';
function renderFlights(list = MOCK_FLIGHTS) {
  const c = document.getElementById('flightResults');
  if (!c) return;
  c.innerHTML = list.map(f => `
    <div class="boarding-pass fade-in" data-flight="${f.id}" onclick="selectFlight('${f.id}')">
      <div class="boarding-main">
        <div class="airline-badge">${f.airline}</div>
        <div style="min-width:0">
          <div style="font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.from} ${f.dep} → ${f.to} ${f.arr}</div>
          <div style="font-size:12px;color:var(--text-muted)">${f.dur} • ${f.stops} • ${f.aircraft} • ${f.name}</div>
        </div>
      </div>
      <div class="boarding-stub">
        <div style="text-decoration:line-through;font-size:12px;color:var(--text-light)">$${f.orig}</div>
        <div style="font-weight:800;font-size:20px;font-family:var(--font-heading)">$${f.price}</div>
        <button class="btn btn-primary" style="height:36px;padding:0 14px;font-size:12px">Select</button>
      </div>
    </div>
  `).join('');
  const rc = document.getElementById('resultsCount');
  if (rc) rc.textContent = `${list.length} flights found`;
  initFadeIn();
}
function selectFlight(id) {
  selectedFlight = MOCK_FLIGHTS.find(f => f.id === id);
  document.querySelectorAll('.boarding-pass').forEach(el => {
    el.style.borderColor = el.dataset.flight === id ? 'var(--primary)' : 'var(--border)';
    el.style.borderWidth = el.dataset.flight === id ? '2px' : '1px';
  });
  updateSummary();
  showBanner(`Selected flight ${id} - $${selectedFlight.price}`);
  showToast(`✈️ ${id} selected`);
}
function updateSummary() {
  const sum = document.getElementById('bookingSummary');
  if (!sum || !selectedFlight) return;
  const mult = selectedClass === 'business' ? 2.6 : selectedClass === 'first' ? 5 : 1;
  const total = Math.round(selectedFlight.price * mult);
  sum.innerHTML = `
    <h3>Booking Summary</h3>
    <div style="font-size:13px;color:var(--text-muted);margin:8px 0">${selectedFlight.from} → ${selectedFlight.to} • ${selectedFlight.dep} • ${selectedFlight.name}</div>
    <div style="font-size:13px;margin-bottom:12px">Class: <strong style="text-transform:capitalize">${selectedClass}</strong></div>
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <label style="flex:1;border:1px solid var(--border);border-radius:8px;padding:8px;text-align:center;font-size:12px;cursor:pointer"><input type="radio" name="cls" value="economy" ${selectedClass==='economy'?'checked':''} onchange="selectedClass='economy';updateSummary()" style="margin-right:4px">Economy</label>
      <label style="flex:1;border:1px solid var(--border);border-radius:8px;padding:8px;text-align:center;font-size:12px;cursor:pointer"><input type="radio" name="cls" value="business" ${selectedClass==='business'?'checked':''} onchange="selectedClass='business';updateSummary()" style="margin-right:4px">Business</label>
      <label style="flex:1;border:1px solid var(--border);border-radius:8px;padding:8px;text-align:center;font-size:12px;cursor:pointer"><input type="radio" name="cls" value="first" ${selectedClass==='first'?'checked':''} onchange="selectedClass='first';updateSummary()" style="margin-right:4px">First</label>
    </div>
    <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px;display:flex;justify-content:space-between;font-weight:800;font-size:18px"><span>Total</span><span>$${total}</span></div>
    <button class="btn btn-primary" style="width:100%;margin-top:16px;height:48px;font-size:16px" onclick="goToPage('payment')">Continue to Payment →</button>
  `;
}
function filterFlights() {
  const max = parseInt(document.getElementById('priceRange')?.value || 1000);
  const filtered = MOCK_FLIGHTS.filter(f => f.price <= max);
  renderFlights(filtered);
  const pv = document.getElementById('priceVal');
  if (pv) pv.textContent = max;
  showBanner(`Filtered: ${filtered.length} flights under $${max}`);
}
function clearFilters() {
  const pr = document.getElementById('priceRange');
  if (pr) pr.value = 1000;
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  renderFlights(MOCK_FLIGHTS);
  showBanner('Filters cleared - 4 flights');
  showToast('Filters cleared');
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFadeIn();
  initParallax();
  initStatsCounter();
  initBackToTop();
  renderFlights();

  // Close sidenav on Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSidenav();
      document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }
  });

  // Close sidenav when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeSidenav();
  });
});

// Expose globally for inline handlers
window.toggleSidenav = toggleSidenav;
window.openSidenav = openSidenav;
window.closeSidenav = closeSidenav;
window.toggleTheme = toggleTheme;
window.navigateTo = navigateTo;
window.goToPage = goToPage;
window.showBanner = showBanner;
window.showToast = showToast;
window.togglePricingMode = togglePricingMode;
window.toggleFAQ = toggleFAQ;
window.validateContactForm = validateContactForm;
window.selectFlight = selectFlight;
window.filterFlights = filterFlights;
window.clearFilters = clearFilters;
