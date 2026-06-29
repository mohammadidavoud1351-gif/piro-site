/* ===== PIRO Chatbot — Supabase Edge Function (Deno) =====
   Deploy: supabase functions deploy chat --no-verify-jwt
   Env vars needed in Supabase Dashboard → Edge Functions → Secrets:
     ANTHROPIC_API_KEY
     SUPABASE_URL        (auto-provided by Supabase)
     SUPABASE_SERVICE_ROLE_KEY  (auto-provided by Supabase)
========================================================= */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL             = 'claude-haiku-4-5-20251001';
const MAX_TOKENS        = 400;
const MAX_HISTORY       = 10;
const CATALOG_TTL       = 5 * 60 * 1000;

let catalogCache: string | null = null;
let catalogCacheTime = 0;

/* ── Base system prompt ──────────────────────────────────────────── */
const BASE_PROMPT = `تو دستیار خانه پیرو (PIRO Furniture) هستی — برند مبلمان لاکچری با سبک جپندی در تهران.

═══════════════ مهم‌ترین قانون: پاسخ به سلام ═══════════════
وقتی مشتری فقط سلام گفت یا احوال‌پرسی ساده کرد، پاسخ دقیقاً این است:
«سلام! چطور می‌تونم کمکت کنم؟»
هیچ جمله‌ای اضافه نکن. هیچ ✦ پیشنهادی نده. هیچ توضیحی نده. همین یک جمله — تمام.

═══════════════ قانون زبان ═══════════════
زبان پاسخ را بر اساس زبان آخرین پیام مشتری انتخاب کن:
- اگر فارسی نوشت → فارسی پاسخ بده. از کلمات انگلیسی یا فارسی‌سازی‌شده (مثل «فرنچر») پرهیز کن؛ بگو «مبلمان».
- اگر انگلیسی نوشت → کاملاً به انگلیسی پاسخ بده. Natural, professional English.
هرگز دو زبان را در یک پاسخ قاطی نکن. از ایموجی استفاده نکن.

═══════════════ حوزه کاری ═══════════════
فقط درباره خانه پیرو، محصولات، مواد، ارسال، قیمت‌ها و اطلاعات فروشگاه صحبت کن.
اگر سوال خارج از این حوزه بود، با احترام بگو: «متأسفانه در این زمینه اطلاعاتی ندارم. فقط در مورد مبلمان خانه پیرو می‌تونم کمک کنم.»
هرگز برند دیگری معرفی یا مقایسه نکن.

═══════════════ قانون عدم تخمین ═══════════════
اگر مطمئن نیستی، حدس نزن. بگو: «برای پاسخ دقیق با همکارانم تماس بگیرید: ۰۲۱-۲۶۷۴-۶۷۲۴»
این قانون اجباری است برای: موجودی انبار، تخفیف‌های خاص، تاریخ دقیق تحویل، سفارش اختصاصی.

═══════════════ فرمت پاسخ ═══════════════
۱. پاسخ کوتاه و مفید — دقیقاً مرتبط با سوال، بدون زیاده‌گویی
۲. فقط اگر سوال درباره محصول، قیمت یا مشاوره خرید بود، در انتها یک محصول معرفی کن:
   «✦ پیشنهاد من: [نام محصول] — [یک جمله دلیل]»

═══════════════ شخصیت و لحن ═══════════════
- صمیمی، دلسوز، دوستانه — مثل دوستی آگاه که از مبلمان خوب لذت می‌بره
- هرگز فشار فروش نیاور
- وقتی از چوب و کیفیت حرف می‌زنی با علاقه و احساس بگو

═══════════════ اطلاعات برند ═══════════════
نام: خانه پیرو (PIRO Furniture) | سبک: جپندی | فلسفه: «هر قطعه خانه پیرو، داستان یک درخت است»
چوب: راش یکپارچه اروپایی ۱۰۰٪ | پوشش: روغن گیاهی روبیو مونوکوت بلژیک | پارچه: مرغوب ترکیه

═══════════════ ارسال و خرید ═══════════════
تولید: ۶۰ روز کاری | ارسال تهران: رایگان | خارج تهران: با هماهنگی
پرداخت: نقدی یا اقساط ۱۲ ماهه دیجی‌پی

═══════════════ فروشگاه و تماس ═══════════════
آدرس: تهران، سعادت‌آباد، مجتمع دیدا، طبقه دوم
ساعت: شنبه تا پنجشنبه ۱۰ صبح تا ۹ شب
تلفن: ۰۲۱-۲۶۷۴-۶۷۲۴ و ۰۲۱-۲۶۷۴-۶۹۳۴ | اینستاگرام: piro_ir@`;

/* ── Fallback catalog ─────────────────────────────────────────────── */
const FALLBACK_CATALOG = `【 کاناپه و نشیمن 】
کاناپه تهران: تک‌نفره ۷۸M | دونفره ۱۰۵M | سه‌نفره ۱۳۸M | ال‌شکل ۱۴۵M | شزلون ۱۱۵M
کاناپه پالما: تک‌نفره ۶۵.۵M | دونفره ۹۲M | سه‌نفره ۱۱۲.۷M | ال‌شکل ۱۳۵M | شزلون ۱۰۵M
کاناپه هرموسا (جدید): تک‌نفره ۸۵M | دونفره ۱۲۹M | سه‌نفره ۱۶۵M
کاناپه موژه: تک‌نفره ۸۶.۵M | دونفره ۱۳۸M
کاناپه گوردو: تک‌نفره ۶۶M | دونفره ۸۸M | با شزلون ۱۱۵M
کاناپه شیتو: دونفره ۸۸M | سه‌نفره ۱۱۵M | ال‌شکل ۱۳۵M | شزلون ۱۰۵M
کاناپه دیبا: دونفره ۹۸.۵M | سه‌نفره ۱۲۵M
کاناپه هنکا: تک‌نفره ۸۶.۵M
مبل راحتی بلاندو: ۶۱M | نیمکت همدم: ۵۵M | استول بار الف: ۱۴.۵M
【 اتاق خواب 】
تخت نوشا: ۹۰×۲۰۰ ۷۱.۵M | ۱۶۰×۲۰۰ ۷۸M | تخت لیندا ۱۶۰: ۸۵M
تخت ندا (جدید): ۹۰×۲۰۰ ۷۵M | ۱۶۰×۲۰۰ ۸۸M | تخت الارا ۱۶۰: ۱۰۴.۵M
پاتختی مونو | پاتختی مود | دراور مود | رخت‌آویز تانا: ۲۸M
【 میز ناهارخوری 】
ارسباران (جدید): ۶نفره ۱۱۲M | ۸نفره ۱۳۵M | سِرکا: ۴نفره ۷۱.۵M | ۸نفره ۹۵M
کایا ۴نفره: ۷۵.۹M | OX: ۹۵M | تاک: ۸۵M | پیانورا: ۷۸M | سیمپل: ۶۵M
【 میز جلومبلی 】
EMI: ۷۱.۵M | EN: ۲۸M | کازوکو: ۳۸M | سنسیلا: ۲۵M | شونین: ۳۲M
【 کنسول و دکوراسیون 】
سایدبورد مود کوچک: ۶۲M | بزرگ: ۸۸M | کنسول مود: ۱۱۰cm ۳۵M | ۱۳۰cm ۴۵M
شلف شین: ۲طبقه ۳۵M | ۳طبقه ۴۵M | آباژور کیدو: ۱۶.۵M`;

/* ── CORS headers ─────────────────────────────────────────────────── */
const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

/* ── Supabase helpers ─────────────────────────────────────────────── */
function sbHeaders(key: string) {
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

function formatProductCatalog(rows: Record<string, unknown>[]): string {
  const groups: Record<string, { name: string; category: string; variants: string[] }> = {};
  for (const r of rows) {
    const key = (r.var_group as string) || (r.name_fa as string);
    if (!groups[key]) groups[key] = { name: r.name_fa as string, category: r.category as string, variants: [] };
    const label = r.variant_label
      ? `${r.variant_label} ${r.price || ''}`.trim()
      : ((r.price as string) || '');
    if (label) groups[key].variants.push(label);
  }
  const catLabels: Record<string, string> = {
    living: '【 نشیمن 】', bedroom: '【 اتاق خواب 】',
    tables: '【 میزها 】', console: '【 کنسول 】',
  };
  const bycat: Record<string, string[]> = {};
  for (const g of Object.values(groups)) {
    const cat = g.category || 'other';
    if (!bycat[cat]) bycat[cat] = [];
    bycat[cat].push(`${g.name}${g.variants.length ? ': ' + g.variants.join(' | ') : ''}`);
  }
  return Object.entries(bycat)
    .map(([cat, lines]) => `${catLabels[cat] || '【 سایر 】'}\n${lines.join('\n')}`)
    .join('\n');
}

async function fetchProducts(url: string, key: string): Promise<string | null> {
  if (catalogCache && (Date.now() - catalogCacheTime) < CATALOG_TTL) return catalogCache;
  try {
    const res = await fetch(
      `${url}/rest/v1/products?select=name_fa,price,sub,category,variant_label,var_group&is_active=eq.true&order=category,sub,var_group`,
      { headers: sbHeaders(key), signal: AbortSignal.timeout(2000) },
    );
    if (!res.ok) return null;
    const rows = await res.json() as Record<string, unknown>[];
    catalogCache = formatProductCatalog(rows);
    catalogCacheTime = Date.now();
    return catalogCache;
  } catch {
    return null;
  }
}

async function loadSession(url: string, key: string, sessionId: string): Promise<{ role: string; content: string }[] | null> {
  try {
    const res = await fetch(
      `${url}/rest/v1/chat_sessions?session_id=eq.${encodeURIComponent(sessionId)}&select=messages&limit=1`,
      { headers: sbHeaders(key), signal: AbortSignal.timeout(1500) },
    );
    if (!res.ok) return null;
    const rows = await res.json() as { messages?: { role: string; content: string }[] }[];
    if (!rows.length) return null;
    return (rows[0].messages || []).slice(-MAX_HISTORY);
  } catch {
    return null;
  }
}

async function saveSession(
  url: string, key: string, sessionId: string,
  messages: { role: string; content: string }[], reply: string,
): Promise<void> {
  const updated = [...messages.slice(-MAX_HISTORY), { role: 'assistant', content: reply }].slice(-MAX_HISTORY);
  try {
    await fetch(`${url}/rest/v1/chat_sessions`, {
      method: 'POST',
      headers: { ...sbHeaders(key), 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ session_id: sessionId, messages: updated, updated_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(2000),
    });
  } catch { /* non-critical */ }
}

/* ── System prompt builder ────────────────────────────────────────── */
function buildSystemPrompt(catalog: string | null, user: { firstName?: string; lastName?: string; mobile?: string; orderCount?: number } | null): string {
  let userCtx: string;
  if (user && user.firstName) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const orderNote = (user.orderCount || 0) > 0 ? `قبلاً ${user.orderCount} سفارش داشته.` : 'هنوز سفارشی ثبت نکرده.';
    const contact = user.mobile ? ` | موبایل: ${user.mobile}` : '';
    userCtx = `\n═══════════════ مشتری لاگین‌شده ═══════════════\nنام: ${fullName}${contact}\n${orderNote}\nدر مکالمه از اسم کوچکش «${user.firstName}» استفاده کن.\n`;
  } else {
    userCtx = `\n═══════════════ مشتری ناشناس ═══════════════\nمشتری لاگین نکرده. مستقیم و محترمانه باهاش صحبت کن.\n`;
  }
  const catalogSection = `\n═══════════════ کاتالوگ محصولات ═══════════════\n${catalog || FALLBACK_CATALOG}\n`;
  return BASE_PROMPT + userCtx + catalogSection;
}

/* ── Main handler ─────────────────────────────────────────────────── */
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS });
  }

  const SUPABASE_URL      = Deno.env.get('SUPABASE_URL') ?? '';
  const SUPABASE_SVC_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

  let messages: { role: string; content: string }[];
  let user: { firstName?: string; lastName?: string; mobile?: string; orderCount?: number } | null;
  let sessionId: string | null;

  try {
    const body = await req.json();
    messages  = body.messages;
    user      = body.user ?? null;
    sessionId = body.sessionId ?? null;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('invalid');
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers: CORS });
  }

  const sanitized = messages.slice(-MAX_HISTORY).map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content).slice(0, 2000),
  }));

  const [catalog, history] = await Promise.all([
    fetchProducts(SUPABASE_URL, SUPABASE_SVC_KEY),
    sessionId ? loadSession(SUPABASE_URL, SUPABASE_SVC_KEY, sessionId) : Promise.resolve(null),
  ]);

  const systemPrompt = buildSystemPrompt(catalog, user);
  // وقتی history موجود است، پیام جدید کاربر را به آن اضافه کن
  const latestMsg = sanitized[sanitized.length - 1];
  const chatMessages = history ? [...history, latestMsg].slice(-MAX_HISTORY) : sanitized;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system: systemPrompt, messages: chatMessages }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return new Response(JSON.stringify({ error: 'Upstream API error' }), { status: 502, headers: CORS });
    }

    const data  = await response.json() as { content?: { text: string }[] };
    const reply = data.content?.[0]?.text ?? '';

    if (sessionId) {
      // ذخیره session در پس‌زمینه — بدون block کردن پاسخ
      EdgeRuntime.waitUntil(saveSession(SUPABASE_URL, SUPABASE_SVC_KEY, sessionId, chatMessages, reply));
    }

    return new Response(JSON.stringify({ reply }), { status: 200, headers: CORS });

  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: CORS });
  }
});
