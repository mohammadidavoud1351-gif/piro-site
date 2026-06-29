/* ===== PIRO Chatbot Widget =====
   Self-contained IIFE — injects its own HTML into <body>.
   Calls /api/chat (Netlify function) for AI responses.
================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'piro_chat_history';
  const _isLocal = /^(localhost|127\.)/.test(location.hostname);
  const API_ENDPOINT = _isLocal
    ? '/api/chat'
    : 'https://piro-seven.vercel.app/api/chat';

  // Quick reply definitions
  const QR = [
    { fa: 'قیمت‌ها',       en: 'Prices',        pFa: 'محدوده قیمت محصولات خانه پیرو چقدر است؟',               pEn: 'What is the price range of PIRO products?' },
    { fa: 'نحوه ارسال',    en: 'Delivery',      pFa: 'ارسال و تحویل محصولات چطور کار می‌کند؟',           pEn: 'How does delivery and shipping work?' },
    { fa: 'جنس چوب',       en: 'Wood',          pFa: 'از چه نوع چوبی در محصولات خانه پیرو استفاده می‌شود؟',   pEn: 'What type of wood does PIRO use?' },
    { fa: 'اقساط',          en: 'Installments',  pFa: 'آیا امکان خرید اقساطی وجود دارد؟',                pEn: 'Can I buy on installments?' },
    { fa: 'زمان تحویل',    en: 'Lead Time',     pFa: 'زمان تولید و تحویل سفارش چقدر است؟',               pEn: 'How long is the production and delivery time?' },
    { fa: 'آدرس فروشگاه',  en: 'Showroom',      pFa: 'آدرس و ساعت کاری فروشگاه خانه پیرو کجاست؟',            pEn: 'Where is the PIRO showroom and what are the hours?' },
  ];

  // ── State ──────────────────────────────────────────────────────
  let messages = [];        // [{role, content}] — Persian content sent to API
  let isOpen = false;
  let isBusy = false;
  let typingEl = null;

  // ── DOM refs (set after inject) ─────────────────────────────────
  let btnEl, panelEl, msgsEl, inputEl, sendEl, qrEl;

  // ── Helpers ─────────────────────────────────────────────────────
  function currentLang() {
    return localStorage.getItem('piro_lang') || 'fa';
  }

  function saveSess() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }

  function loadSess() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) messages = JSON.parse(raw);
    } catch {}
  }

  // ── Inject HTML ─────────────────────────────────────────────────
  function inject() {
    const qrHTML = QR.map((q, i) =>
      `<button class="piro-qr-btn" data-idx="${i}" data-fa="${q.fa}" data-en="${q.en}">${q.fa}</button>`
    ).join('');

    document.body.insertAdjacentHTML('beforeend', `
      <!-- PIRO Chatbot Widget -->
      <button id="piro-chat-btn" aria-label="دستیار خانه پیرو — چت">
        <!-- chat icon -->
        <svg class="icon-chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <!-- close icon -->
        <svg class="icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div id="piro-chat-panel" role="dialog" aria-modal="true" aria-label="دستیار خانه پیرو" aria-hidden="true">

        <div class="piro-chat-header">
          <div class="piro-chat-header-info">
            <div class="piro-chat-avatar lat">P</div>
            <div>
              <div class="piro-chat-name" data-fa="دستیار خانه پیرو" data-en="Piro Assistant">دستیار خانه پیرو</div>
              <div class="piro-chat-status" data-fa="آنلاین" data-en="Online">آنلاین</div>
            </div>
          </div>
          <button class="piro-chat-close" id="piro-close-btn" aria-label="بستن چت">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="piro-chat-messages" id="piro-messages" aria-live="polite" aria-atomic="false"></div>

        <div class="piro-quick-replies" id="piro-quick">${qrHTML}</div>

        <div class="piro-chat-footer">
          <textarea id="piro-input" rows="1"
            placeholder="پیام خود را بنویسید..."
            data-en-ph="Type your message..."
            data-fa-ph="پیام خود را بنویسید..."
            aria-label="پیام به دستیار خانه پیرو"></textarea>
          <button id="piro-send" aria-label="ارسال پیام">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

      </div>
    `);

    btnEl  = document.getElementById('piro-chat-btn');
    panelEl = document.getElementById('piro-chat-panel');
    msgsEl  = document.getElementById('piro-messages');
    inputEl = document.getElementById('piro-input');
    sendEl  = document.getElementById('piro-send');
    qrEl    = document.getElementById('piro-quick');
  }

  // ── Open / close ────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    panelEl.classList.add('open');
    panelEl.setAttribute('aria-hidden', 'false');
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-label', 'بستن چت');
    inputEl.focus();
    if (messages.length === 0) {
      let firstName = null;
      try {
        if (typeof PiroAuth !== 'undefined' && PiroAuth.current) {
          const u = PiroAuth.current();
          if (u && u.firstName) firstName = u.firstName;
        }
      } catch {}
      const greetFa = firstName
        ? `سلام ${firstName} جان! خوش اومدی به خانه پیرو.\nچطور می‌تونم کمکت کنم؟`
        : 'سلام! به خانه پیرو خوش آمدید.\nچطور می‌توانم کمکتان کنم؟';
      addBotMsg(greetFa, greetFa);
    }
  }

  function closeChat() {
    isOpen = false;
    panelEl.classList.remove('open');
    panelEl.setAttribute('aria-hidden', 'true');
    btnEl.classList.remove('active');
    btnEl.setAttribute('aria-label', 'دستیار خانه پیرو — چت');
  }

  function toggleChat() { isOpen ? closeChat() : openChat(); }

  // ── Render messages ─────────────────────────────────────────────
  function addMsg(role, textFa, textEn) {
    const lang = currentLang();
    const text = (lang === 'en' && textEn) ? textEn : textFa;

    const div = document.createElement('div');
    div.className = `piro-msg piro-msg--${role}`;
    div.setAttribute('data-fa', textFa);
    div.setAttribute('data-en', textEn || textFa);
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;

    if (role === 'user') {
      messages.push({ role: 'user', content: textFa });
      saveSess();
      // hide quick replies after first user message
      if (qrEl) qrEl.style.display = 'none';
    } else {
      messages.push({ role: 'assistant', content: textFa });
      saveSess();
    }
  }

  function addBotMsg(fa, en) { addMsg('assistant', fa, en || fa); }
  function addUserMsg(fa)    { addMsg('user', fa, null); }

  // ── Typing indicator ────────────────────────────────────────────
  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'piro-typing';
    typingEl.setAttribute('aria-label', 'در حال تایپ...');
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    msgsEl.appendChild(typingEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  // ── Session ID (persistent per browser) ────────────────────────
  function getSessionId() {
    let sid = localStorage.getItem('piro_chat_session');
    if (!sid) {
      sid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
      localStorage.setItem('piro_chat_session', sid);
    }
    return sid;
  }

  // ── API call ────────────────────────────────────────────────────
  async function callAPI() {
    // گرفتن کاربر لاگین‌شده (اگر وجود داشت)
    let currentUser = null;
    try {
      if (typeof PiroAuth !== 'undefined' && PiroAuth.current) {
        const u = PiroAuth.current();
        if (u) {
          currentUser = {
            firstName:  u.firstName  || '',
            lastName:   u.lastName   || '',
            mobile:     u.mobile     || '',
            orderCount: (u.orders || []).length,
          };
        }
      }
    } catch {}

    const _anonKey = typeof SUPABASE_ANON !== 'undefined' ? SUPABASE_ANON : '';
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(_isLocal ? {} : { 'Authorization': `Bearer ${_anonKey}` }),
      },
      body: JSON.stringify({
        messages,
        user: currentUser,
        sessionId: getSessionId(),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.reply || '';
  }

  // ── Send message ────────────────────────────────────────────────
  async function sendMsg() {
    const text = inputEl.value.trim();
    if (!text || isBusy) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    addUserMsg(text);

    isBusy = true;
    sendEl.disabled = true;
    showTyping();

    // پاسخ سلام بدون API — جلوگیری از حدس‌زنی مدل
    if (/^(سلام|درود|hello|hi|hey)[!،.؟\s]*$/i.test(text)) {
      let firstName = '';
      try {
        if (typeof PiroAuth !== 'undefined' && PiroAuth.current) {
          const u = PiroAuth.current();
          if (u) firstName = u.firstName || '';
        }
      } catch {}
      hideTyping();
      const fa = firstName ? `سلام ${firstName}! چطور می‌تونم کمکت کنم؟` : 'سلام! چطور می‌تونم کمکت کنم؟';
      const en = firstName ? `Hi ${firstName}! How can I help you?` : 'Hi! How can I help you?';
      addBotMsg(fa, en);
      isBusy = false;
      sendEl.disabled = false;
      inputEl.focus();
      return;
    }

    try {
      const reply = await callAPI();
      hideTyping();
      addBotMsg(reply, reply);   // Claude replies in correct language; store as-is
    } catch {
      hideTyping();
      addBotMsg(
        'متأسفم، مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا با ما از طریق ۰۲۱-۲۶۷۴-۶۷۲۴ تماس بگیرید.',
        'Sorry, something went wrong. Please try again or call us at 021-2674-6724.'
      );
    } finally {
      isBusy = false;
      sendEl.disabled = false;
      inputEl.focus();
    }
  }

  // ── Quick reply ─────────────────────────────────────────────────
  function doQuickReply(idx) {
    const q = QR[idx];
    const lang = currentLang();
    inputEl.value = (lang === 'en') ? q.pEn : q.pFa;
    sendMsg();
  }

  // ── Language sync ───────────────────────────────────────────────
  function applyLangToChat(lang) {
    const toEN = lang === 'en';
    // header labels
    panelEl.querySelectorAll('[data-fa]').forEach(el => {
      if (el.classList.contains('piro-msg')) {
        // only re-render if we have a distinct EN version
        const fa = el.getAttribute('data-fa');
        const en = el.getAttribute('data-en');
        if (en && en !== fa) el.textContent = toEN ? en : fa;
      } else {
        el.textContent = toEN
          ? (el.getAttribute('data-en') || el.getAttribute('data-fa'))
          : el.getAttribute('data-fa');
      }
    });
    // quick reply pills
    qrEl && qrEl.querySelectorAll('[data-fa]').forEach(el => {
      el.textContent = toEN ? (el.getAttribute('data-en') || el.getAttribute('data-fa')) : el.getAttribute('data-fa');
    });
    // input placeholder
    inputEl.setAttribute('placeholder', toEN ? 'Type your message...' : 'پیام خود را بنویسید...');
    // button aria-label
    btnEl.setAttribute('aria-label', toEN ? (isOpen ? 'Close chat' : 'PIRO Assistant — Chat') : (isOpen ? 'بستن چت' : 'دستیار خانه پیرو — چت'));
  }

  // ── Restore session messages to DOM ─────────────────────────────
  function restoreSession() {
    if (messages.length === 0) return;
    const lang = currentLang();
    messages.forEach(m => {
      const div = document.createElement('div');
      div.className = `piro-msg piro-msg--${m.role}`;
      div.setAttribute('data-fa', m.content);
      div.setAttribute('data-en', m.content);
      div.textContent = m.content;
      msgsEl.appendChild(div);
    });
    qrEl.style.display = 'none';
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    loadSess();
    inject();
    restoreSession();

    // Events
    btnEl.addEventListener('click', toggleChat);
    document.getElementById('piro-close-btn').addEventListener('click', closeChat);
    sendEl.addEventListener('click', sendMsg);

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMsg();
        return;
      }
      // auto-grow textarea
      setTimeout(() => {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      }, 0);
    });

    qrEl.querySelectorAll('.piro-qr-btn').forEach(btn => {
      btn.addEventListener('click', () => doQuickReply(+btn.dataset.idx));
    });

    // Patch site's applyLang to also update chat widget
    const origApplyLang = window.applyLang;
    if (typeof origApplyLang === 'function') {
      window.applyLang = function (lang) {
        origApplyLang(lang);
        applyLangToChat(lang);
      };
    }

    // Sync with current page language
    applyLangToChat(currentLang());

    // Expose minimal global API
    window.PiroChat = { open: openChat, close: closeChat };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
