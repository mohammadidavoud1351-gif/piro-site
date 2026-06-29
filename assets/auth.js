/* ===== PIRO Auth — Demo (localStorage)
   در نسخه واقعی: OTP واقعی از طریق Supabase / SMS ارسال می‌شود.
*/
const PiroAuth = {
  _k: 'piro_users',
  _sk: 'piro_session',

  users() { return JSON.parse(localStorage.getItem(this._k) || '[]'); },
  save(u) { localStorage.setItem(this._k, JSON.stringify(u)); },

  current() {
    const id = localStorage.getItem(this._sk);
    if (!id) return null;
    return this.users().find(u => u.email === id || u.mobile === id) || null;
  },
  isLoggedIn() { return !!this.current(); },
  logout() { localStorage.removeItem(this._sk); },

  validNid(code) {
    return /^\d{10}$/.test(code);
  },
  validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); },
  validMobile(m) { return /^09\d{9}$/.test(m); },

  // Register full account
  register({ firstName, lastName, nationalId, contact, password }) {
    if (!firstName?.trim() || !lastName?.trim())
      return { ok: false, msg: 'نام و نام خانوادگی الزامی است.' };
    if (!this.validNid(nationalId))
      return { ok: false, msg: 'کد ملی معتبر نیست (۱۰ رقم).' };
    const isEmail = this.validEmail(contact);
    const isMobile = this.validMobile(contact);
    if (!isEmail && !isMobile)
      return { ok: false, msg: 'موبایل (09xxxxxxxxx) یا ایمیل معتبر وارد کنید.' };
    if (!password || password.length < 6)
      return { ok: false, msg: 'رمز عبور حداقل ۶ کاراکتر باشد.' };
    const all = this.users();
    if (all.some(u => (u.email === contact || u.mobile === contact)))
      return { ok: false, msg: 'این موبایل/ایمیل قبلاً ثبت شده است.' };
    if (all.some(u => u.nationalId === nationalId))
      return { ok: false, msg: 'این کد ملی قبلاً ثبت شده است.' };
    const user = {
      firstName: firstName.trim(), lastName: lastName.trim(),
      nationalId, password,
      email: isEmail ? contact.toLowerCase() : '',
      mobile: isMobile ? contact : '',
      createdAt: new Date().toISOString(),
      orders: [], wishlist: [], addresses: []
    };
    all.push(user); this.save(all);
    localStorage.setItem(this._sk, contact);
    return { ok: true, user };
  },

  // Login with mobile or email + password
  login(contact, password) {
    contact = (contact || '').trim();
    const u = this.users().find(u =>
      (u.email === contact.toLowerCase() || u.mobile === contact) && u.password === password
    );
    if (!u) return { ok: false, msg: 'اطلاعات ورود اشتباه است.' };
    localStorage.setItem(this._sk, contact);
    return { ok: true, user: u };
  },

  // Simulate OTP send (demo)
  sendOtp(contact) {
    if (!this.validEmail(contact) && !this.validMobile(contact))
      return { ok: false, msg: 'موبایل یا ایمیل معتبر وارد کنید.' };
    const code = String(Math.floor(10000 + Math.random() * 90000));
    sessionStorage.setItem('piro_otp', code);
    sessionStorage.setItem('piro_otp_contact', contact);
    console.info(`[PIRO DEMO] کد OTP برای ${contact}: ${code}`);
    // در نسخه واقعی: Supabase Auth signInWithOtp یا SMS gateway
    return { ok: true, code }; // در دمو کد رو برمی‌گردونیم
  },

  verifyOtp(code) {
    const saved = sessionStorage.getItem('piro_otp');
    return saved && saved === String(code).trim();
  },

  faDigits(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }
};

// Update header auth button on every page
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('authBtn');
  if (!btn) return;
  const u = PiroAuth.current();
  if (!u) return; // not logged in → button stays a simple link to account.html

  // Logged in → circular avatar button (no text)
  btn.classList.add('logged');
  btn.removeAttribute('href');
  btn.setAttribute('aria-label', `${u.firstName} ${u.lastName} — منوی کاربری`);
  const initial = (u.firstName[0] || 'P').toUpperCase();
  btn.innerHTML = `<span class="pm-av-initial lat" aria-hidden="true">${initial}</span>`;

  // wrap + dropdown menu
  const wrap = document.createElement('div');
  wrap.className = 'profile-wrap';
  btn.parentNode.insertBefore(wrap, btn);
  wrap.appendChild(btn);

  const contact = u.mobile || u.email || '';
  const fullName = `${u.firstName} ${u.lastName}`.trim();
  const menu = document.createElement('div');
  menu.className = 'profile-menu';
  menu.innerHTML = `
    <div class="pm-head">
      <div class="pm-av lat">${initial}</div>
      <div>
        <span class="pm-name">${fullName}</span>
        <span class="pm-contact">${contact}</span>
      </div>
    </div>
    <a class="pm-item" href="dashboard.html">
      <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><polyline points="16 10 12 14 8 10"/></svg>
      سفارش‌ها
    </a>
    <a class="pm-item" href="dashboard.html">
      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      آدرس‌ها
    </a>
    <a class="pm-item" href="dashboard.html">
      <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      علاقه‌مندی‌ها
    </a>
    <a class="pm-item" href="account.html">
      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      اطلاعات حساب
    </a>
    <div class="pm-sep"></div>
    <div class="pm-item pm-logout" id="pmLogout">
      <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      خروج از حساب کاربری
    </div>`;
  wrap.appendChild(menu);

  btn.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('open'); });
  document.addEventListener('click', () => menu.classList.remove('open'));
  menu.addEventListener('click', e => e.stopPropagation());
  menu.querySelector('#pmLogout').addEventListener('click', () => {
    PiroAuth.logout(); location.href = 'index.html';
  });
});
