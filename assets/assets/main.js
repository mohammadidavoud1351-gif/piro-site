/* ===== PIRO — Shared JS ===== */

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Cart helpers =====
function getCart() {
  try { return JSON.parse(localStorage.getItem('piro_cart') || '[]'); } catch(e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('piro_cart', JSON.stringify(cart));
  const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
  localStorage.setItem('piro_cart_count', total);
  refreshCart();
}

function refreshCart() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = total;
}
refreshCart();

async function addCart(ev, productId, variantLabel) {
  if (ev) { ev.stopPropagation(); ev.preventDefault(); }
  const btn = ev ? ev.currentTarget : null;
  if (btn) btn.disabled = true;

  if (window.PIRO?.addToCart) {
    await window.PIRO.addToCart(productId || btn?.dataset.productId, variantLabel || null);
  } else {
    // fallback ساده برای صفحاتی که itemData نمی‌فرستن
    const cart = getCart();
    const id = productId || btn?.dataset.productId || 'unknown';
    const existing = cart.find(i => i.productId === id);
    if (existing) { existing.quantity = (existing.quantity || 1) + 1; }
    else { cart.push({ productId: id, variantLabel: variantLabel || '', quantity: 1 }); }
    saveCart(cart);
  }

  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ اضافه شد';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1500);
  }
}

// Favourite toggle
async function favToggle(ev, btn) {
  ev.stopPropagation(); ev.preventDefault();
  const svg = btn.querySelector('svg');
  const wasActive = svg.style.fill === 'rgb(139, 38, 53)' || svg.style.fill === '#8B2635';

  if (window.PIRO?.toggleWishlist) {
    const productId = btn.dataset.productId;
    const nowActive = await window.PIRO.toggleWishlist(productId);
    svg.style.fill = nowActive ? '#8B2635' : 'none';
    svg.style.stroke = nowActive ? '#8B2635' : '';
  } else {
    svg.style.fill = wasActive ? 'none' : '#8B2635';
    svg.style.stroke = wasActive ? '' : '#8B2635';
  }
}

// ===== Real bilingual toggle (FA <-> EN) =====
// Any element with a data-en attribute gets translated.
// Its original Persian text is preserved automatically in data-fa.
function _toWestern(s){ return s.replace(/[۰-۹]/g, c => String.fromCharCode(c.charCodeAt(0)-0x06F0+0x30)); }
function _toPersian(s){ return s.replace(/[0-9]/g, c => String.fromCharCode(c.charCodeAt(0)-0x30+0x06F0)); }

function applyLang(lang) {
  const toEN = lang === 'en';
  document.querySelectorAll('[data-en]').forEach(el => {
    if (!el.hasAttribute('data-fa')) el.setAttribute('data-fa', el.innerHTML);
    el.innerHTML = toEN ? el.getAttribute('data-en') : el.getAttribute('data-fa');
  });
  // translate placeholders too
  document.querySelectorAll('[data-en-ph]').forEach(el => {
    if (!el.hasAttribute('data-fa-ph')) el.setAttribute('data-fa-ph', el.getAttribute('placeholder') || '');
    el.setAttribute('placeholder', toEN ? el.getAttribute('data-en-ph') : el.getAttribute('data-fa-ph'));
  });
  // convert price numerals: Persian ↔ Western digits (text node only, leaves currency span intact)
  document.querySelectorAll('.pprice').forEach(el => {
    el.childNodes.forEach(node => {
      if (node.nodeType === 3)
        node.textContent = toEN ? _toWestern(node.textContent) : _toPersian(node.textContent);
    });
  });
  document.documentElement.lang = toEN ? 'en' : 'fa';
  document.documentElement.dir = toEN ? 'ltr' : 'rtl';
  localStorage.setItem('piro_lang', lang);
  document.querySelectorAll('.lang-btn').forEach(b => b.textContent = toEN ? 'FA' : 'EN');
}
function toggleLang(btn) {
  const next = (localStorage.getItem('piro_lang') === 'en') ? 'fa' : 'en';
  applyLang(next);
}
// Restore saved language on load
(function(){ const saved = localStorage.getItem('piro_lang'); if (saved === 'en') applyLang('en'); })();

// Mobile drawer
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.querySelector('.burger')?.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.querySelector('.burger')?.setAttribute('aria-expanded', 'false');
}

// Newsletter
async function subscribe(ev) {
  ev.preventDefault();
  const form = ev.target;
  const emailEl = form.querySelector('input[type="email"]');
  const email = emailEl?.value?.trim();
  if (!email) return;

  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  if (window.PIRO?.subscribeNewsletter) {
    const { ok, msg } = await window.PIRO.subscribeNewsletter(email);
    form.innerHTML = `<div style="padding:16px;font-size:15px;color:${ok ? '#8B2635' : '#c00'}" role="status">${ok ? '✓ ' : ''}${msg}</div>`;
  } else {
    form.innerHTML = '<div style="padding:16px;font-size:15px;color:#8B2635" role="status">✓ عضویت شما با موفقیت ثبت شد</div>';
  }
}
