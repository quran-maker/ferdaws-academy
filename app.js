/* =========================================================
   কমন ফাংশন: হেডার/ফুটার, লগইন, এনরোলমেন্ট, আইকন, হেল্পার
   ========================================================= */

/* ---------- হেল্পার ---------- */
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBn = (v) => String(v).replace(/\d/g, (d) => BN_DIGITS[d]);
const fmtNum = (n) => toBn(Number(n).toLocaleString("en-IN"));
const fmtPrice = (n) => (Number(n) === 0 ? "ফ্রি" : "৳ " + fmtNum(n));
const qs = (k) => new URLSearchParams(location.search).get(k);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const getCourse = (id) => COURSES.find((c) => c.id === id);
const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
const ytId = (v) => { const m = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/.exec(String(v || "")); return m ? m[1] : String(v || "").trim(); };
const allLessons = (c) => c.modules.flatMap((m) => m.lessons);

/* ---------- আইকন (SVG) ---------- */
const ICONS = {
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  film: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 12h20M2 7.5h5M2 16.5h5M17 7.5h5M17 16.5h5"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  sparkles: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="M19 3v4M17 5h4"/>',
  table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="m19 3 .6 1.4L21 5l-1.4.6L19 7l-.6-1.4L17 5l1.4-.6z"/>',
  play: '<polygon points="6 4 20 12 6 20 6 4"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chevron: '<polyline points="6 9 12 15 18 9"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  video: '<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  map: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  live: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><path d="M21 12H9"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  whatsapp: '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>'
};
const icon = (name, size = 20, extra = "") =>
  `<svg class="ic ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

/* ---------- স্টোরেজ (ব্রাউজারে সংরক্ষিত ডেমো ডাটাবেস) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const hash = (str) => { // FNV-1a
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36).toUpperCase();
};
const normPhone = (p) => String(p || "").replace(/\D/g, "").replace(/^88/, "");

/* ---------- অ্যাডমিন প্যানেল থেকে সেভ করা কনটেন্ট লোড ---------- */
const DEFAULTS = JSON.parse(JSON.stringify({ site: SITE, categories: CATEGORIES, courses: COURSES, testimonials: TESTIMONIALS, faqs: FAQS }));
function applyContent(c) {
  if (!c || typeof c !== "object") return;
  if (c.site && typeof c.site === "object") {
    const { secret, adminPassHash, ...rest } = c.site;
    for (const [k, v] of Object.entries(rest)) {
      if (v && typeof v === "object" && !Array.isArray(v) && SITE[k] && typeof SITE[k] === "object") SITE[k] = { ...SITE[k], ...v };
      else SITE[k] = v;
    }
  }
  const rep = (arr, v) => { if (Array.isArray(v)) { arr.length = 0; arr.push(...v); } };
  rep(CATEGORIES, c.categories); rep(COURSES, c.courses); rep(TESTIMONIALS, c.testimonials); rep(FAQS, c.faqs);
}
const contentReady = (async () => {
  if (location.protocol === "file:") return;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch("/api/content", { signal: ctl.signal, cache: "no-store" }); clearTimeout(t);
    if (r.ok && (r.headers.get("content-type") || "").includes("json")) applyContent(await r.json());
  } catch {}
})();
function onReady(fn) {
  const go = () => contentReady.then(fn);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go();
}

const unlockCode = (phone, courseId) => hash(normPhone(phone) + "|" + courseId + "|" + SITE.secret).slice(0, 6).padStart(6, "7");

const Auth = {
  users() { return store.get("lms_users", {}); },
  saveUsers(u) { store.set("lms_users", u); },
  current() {
    const id = store.get("lms_session", null);
    return id ? this.users()[id] || null : null;
  },
  signup({ name, phone, password }) {
    const id = normPhone(phone);
    const users = this.users();
    if (users[id]) throw new Error("এই নম্বরে আগেই অ্যাকাউন্ট আছে, লগইন করুন।");
    users[id] = { id, name, phone: id, pass: hash(password + id), joined: Date.now(), enrollments: {} };
    this.saveUsers(users); store.set("lms_session", id);
    return users[id];
  },
  login({ phone, password }) {
    const id = normPhone(phone);
    const u = this.users()[id];
    if (!u || u.pass !== hash(password + id)) throw new Error("মোবাইল নম্বর বা পাসওয়ার্ড ভুল।");
    store.set("lms_session", id); return u;
  },
  logout() { localStorage.removeItem("lms_session"); location.href = "index.html"; },
  update(fn) {
    const users = this.users(); const u = users[store.get("lms_session", null)];
    if (!u) return null; fn(u); this.saveUsers(users); return u;
  },
  require() {
    const u = this.current();
    if (!u) { location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); return null; }
    return u;
  }
};

const Enroll = {
  get(courseId) { const u = Auth.current(); return u ? u.enrollments[courseId] || null : null; },
  status(courseId) { const e = this.get(courseId); return e ? e.status : null; },
  add(courseId, data) {
    return Auth.update((u) => { u.enrollments[courseId] = { status: "pending", date: Date.now(), done: [], ...data }; });
  },
  activate(courseId) { return Auth.update((u) => { if (u.enrollments[courseId]) u.enrollments[courseId].status = "active"; }); },
  tryUnlock(courseId, code) {
    const u = Auth.current(); if (!u) return false;
    if (String(code).trim().toUpperCase() !== unlockCode(u.phone, courseId)) return false;
    this.activate(courseId); return true;
  },
  toggleDone(courseId, lessonId, val) {
    return Auth.update((u) => {
      const e = u.enrollments[courseId]; if (!e) return;
      const s = new Set(e.done || []); val ? s.add(lessonId) : s.delete(lessonId); e.done = [...s];
    });
  },
  progress(courseId) {
    const e = this.get(courseId), c = getCourse(courseId);
    if (!e || !c) return 0;
    const total = allLessons(c).length;
    return total ? Math.round(((e.done || []).length / total) * 100) : 0;
  },
  // অ্যাডমিন প্যানেল থেকে অনুমোদন হলে কোর্স নিজে থেকেই চালু হবে
  async sync() {
    const u = Auth.current(); if (!u) return 0;
    let n = 0;
    for (const [id, e] of Object.entries(u.enrollments)) {
      if (e.status === "active") continue;
      try {
        const r = await fetch(`/api/status?phone=${encodeURIComponent(u.phone)}&course=${encodeURIComponent(id)}`, { cache: "no-store" });
        if (r.ok && (await r.json()).approved) { this.activate(id); n++; }
      } catch {}
    }
    return n;
  }
};

/* ---------- ফর্ম সাবমিট: অ্যাডমিন প্যানেলে (এবং ব্যাকআপ হিসেবে Netlify Forms এ) ---------- */
async function submitNetlify(formName, data) {
  const toApi = fetch("/api/submit", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ form: formName, data }) })
    .then((r) => r.ok).catch(() => false);
  const toForms = fetch("/", { method: "POST", keepalive: true, headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ "form-name": formName, ...data }).toString() })
    .then((r) => r.ok).catch(() => false);
  const [a, b] = await Promise.all([toApi, toForms]);
  return a || b;
}

/* ---------- ট্র্যাকিং: Facebook Pixel + Conversions API + Google Analytics ----------
   Pixel ID / GA4 ID অ্যাডমিন প্যানেল → ট্র্যাকিং থেকে বসানো হয়। CAPI টোকেন শুধু সার্ভারে থাকে। */
const getCookie = (n) => (document.cookie.match("(?:^|; )" + n + "=([^;]*)") || [])[1] || "";
const newEventId = () => Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
function initTracking() {
  const t = SITE.tracking || {};
  if (t.pixelId && /^\d{5,20}$/.test(t.pixelId) && !window.fbq) {
    !function (f, b, e, v, n, t2, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t2 = b.createElement(e); t2.async = !0; t2.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t2, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    const u = Auth.current();
    fbq("init", t.pixelId, u ? { ph: "88" + u.phone, external_id: u.phone } : {});
    fbq("track", "PageView", {}, { eventID: newEventId() });
  }
  if (t.ga4Id && /^G-[A-Z0-9]+$/i.test(t.ga4Id) && !window.gtag) {
    const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + t.ga4Id; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", t.ga4Id);
  }
}
const GA_NAMES = { ViewContent: "view_item", InitiateCheckout: "begin_checkout", AddPaymentInfo: "add_payment_info", CompleteRegistration: "sign_up", Lead: "generate_lead", Contact: "contact" };
// track("ViewContent", { value, currency, content_name, content_ids }, phone?)
function track(event, custom = {}, phone) {
  const eventId = newEventId();
  try { window.fbq && fbq("track", event, custom, { eventID: eventId }); } catch {}
  try { window.gtag && gtag("event", GA_NAMES[event] || event, { value: custom.value, currency: custom.currency, item_name: custom.content_name }); } catch {}
  if ((SITE.tracking || {}).pixelId && location.protocol !== "file:") {
    const u = Auth.current();
    fetch("/api/track", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, eventId, custom, url: location.href, fbp: getCookie("_fbp"), fbc: getCookie("_fbc"), phone: phone || (u && u.phone) || "" }) }).catch(() => {});
  }
}
const courseData = (c) => ({ value: Number(c.price) || 0, currency: "BDT", content_name: c.title, content_ids: [c.id], content_type: "product", content_category: catName(c.category) });

/* ---------- টোস্ট ---------- */
function toast(msg, type = "ok") {
  let box = $("#toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
  const t = document.createElement("div");
  t.className = "toast " + type; t.innerHTML = icon(type === "ok" ? "check" : "x", 18) + "<span>" + esc(msg) + "</span>";
  box.appendChild(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3200);
}

/* ---------- কোর্স কার্ড ---------- */
function thumb(c, big = false) {
  const col = c.colors || ["#164673", "#19a64f"];
  return `<div class="thumb ${big ? "big" : ""} ${c.image ? "has-img" : ""}" style="--c1:${esc(col[0])};--c2:${esc(col[1])}">
    ${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy">` : `<span class="thumb-ic">${icon(c.icon, big ? 64 : 44)}</span>`}
    ${c.type === "live" ? `<span class="badge live">${icon("live", 14)} লাইভ</span>` : `<span class="badge rec">${icon("video", 14)} রেকর্ডেড</span>`}
  </div>`;
}
function courseCard(c) {
  const lessons = allLessons(c).length;
  return `<a class="card course-card" href="course.html?id=${c.id}">
    ${thumb(c)}
    <div class="cc-body">
      <div class="cc-cat">${esc(catName(c.category))}</div>
      <h3>${esc(c.title)}</h3>
      <div class="cc-meta">
        ${c.type === "live" ? `<span>${icon("calendar", 15)} ${esc(c.startDate)}</span><span>${icon("users", 15)} ${toBn(c.seats)} সিট বাকি</span>`
          : `<span>${icon("video", 15)} ${toBn(lessons)} লেসন</span><span>${icon("users", 15)} ${fmtNum(c.students)}</span>`}
      </div>
      <div class="cc-foot">
        <span class="rating">${icon("star", 15, "fill")} ${toBn(Number(c.rating || 0).toFixed(1))}</span>
        <span class="price">${c.oldPrice ? `<s>${fmtPrice(c.oldPrice)}</s>` : ""}<b>${fmtPrice(c.price)}</b></span>
      </div>
    </div>
  </a>`;
}

/* ---------- হেডার ও ফুটার ---------- */
function logoHTML() {
  return `<a href="index.html" class="logo"><img src="${SITE.emblem}" alt="" class="logo-mark"><span class="logo-txt">${esc(SITE.name)}<small>${esc(SITE.nameEn)}</small></span></a>`;
}
function renderHeader() {
  const el = $("#site-header"); if (!el) return;
  const u = Auth.current();
  const page = location.pathname.split("/").pop() || "index.html";
  const link = (href, label) => `<a href="${href}" class="${page === href ? "active" : ""}">${label}</a>`;
  el.innerHTML = `<div class="container nav">
    ${logoHTML()}
    <nav class="nav-links" id="navLinks">
      ${link("index.html", "হোম")}
      ${link("courses.html", "সব কোর্স")}
      <a href="courses.html?type=live">লাইভ কোর্স</a>
      <a href="courses.html?price=free">ফ্রি কোর্স</a>
      <a href="index.html#contact">যোগাযোগ</a>
      <div class="nav-mobile-auth">${u ? `<a href="dashboard.html" class="btn btn-primary">ড্যাশবোর্ড</a>` : `<a href="login.html" class="btn btn-primary">লগইন / সাইন আপ</a>`}</div>
    </nav>
    <div class="nav-right">
      ${u ? `<div class="user-menu">
          <button class="avatar" id="avatarBtn" aria-label="অ্যাকাউন্ট মেনু">${esc(u.name.trim()[0] || "U")}</button>
          <div class="dropdown" id="userDrop">
            <div class="dd-head"><b>${esc(u.name)}</b><small>${toBn(u.phone)}</small></div>
            <a href="dashboard.html">${icon("grid", 16)} আমার ড্যাশবোর্ড</a>
            <button id="logoutBtn">${icon("logout", 16)} লগআউট</button>
          </div></div>`
        : `<a href="login.html" class="btn btn-ghost hide-sm">লগইন</a><a href="login.html?mode=signup" class="btn btn-primary hide-sm">ফ্রি সাইন আপ</a>`}
      <button class="menu-btn" id="menuBtn" aria-label="মেনু">${icon("menu", 24)}</button>
    </div>
  </div>`;
  $("#menuBtn").onclick = () => { el.classList.toggle("open"); $("#menuBtn").innerHTML = icon(el.classList.contains("open") ? "x" : "menu", 24); };
  const ab = $("#avatarBtn");
  if (ab) {
    ab.onclick = (e) => { e.stopPropagation(); $("#userDrop").classList.toggle("show"); };
    document.addEventListener("click", () => $("#userDrop")?.classList.remove("show"));
    $("#logoutBtn").onclick = () => Auth.logout();
  }
  window.addEventListener("scroll", () => el.classList.toggle("scrolled", scrollY > 8), { passive: true });
}
function renderFooter() {
  const el = $("#site-footer"); if (!el) return;
  el.innerHTML = `<div class="container footer-grid">
    <div>
      ${logoHTML()}
      <p class="muted">${esc(SITE.about || SITE.tagline)}</p>
      <div class="socials">
        <a href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="Facebook">f</a>
        <a href="${SITE.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon("play", 14)}</a>
        <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("chat", 15)}</a>
      </div>
    </div>
    <div><h4>কোর্স</h4>${CATEGORIES.slice(0, 5).map((c) => `<a href="courses.html?cat=${c.id}">${c.name}</a>`).join("")}</div>
    <div><h4>লিংক</h4><a href="courses.html">সব কোর্স</a><a href="dashboard.html">ড্যাশবোর্ড</a><a href="index.html#faq">সাধারণ প্রশ্ন</a><a href="login.html">লগইন</a><a href="admin.html">অ্যাডমিন প্যানেল</a></div>
    <div><h4>যোগাযোগ</h4>
      <a href="tel:${SITE.phone}">${icon("phone", 15)} ${toBn(SITE.phone)}</a>
      <a href="mailto:${SITE.email}">${icon("mail", 15)} ${esc(SITE.email)}</a>
      <span>${icon("map", 15)} ${esc(SITE.address)}</span>
    </div>
  </div>
  <div class="container footer-bottom">© ${toBn(new Date().getFullYear())} ${esc(SITE.name)} — সর্বস্বত্ব সংরক্ষিত</div>`;
}
function renderWhatsApp() {
  if ($(".wa-float") || document.body.dataset.nowa !== undefined) return;
  const a = document.createElement("a");
  a.className = "wa-float"; a.href = "https://wa.me/" + SITE.whatsapp; a.target = "_blank"; a.rel = "noopener";
  a.setAttribute("aria-label", "WhatsApp এ মেসেজ দিন"); a.innerHTML = icon("chat", 26);
  document.body.appendChild(a);
}

onReady(() => {
  document.title = document.title.replace("{site}", SITE.name);
  renderHeader(); renderFooter(); renderWhatsApp();
  if (!/admin\.html$/.test(location.pathname)) initTracking();
  // স্ক্রল রিভিল
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  setTimeout(() => $$(".reveal").forEach((el) => io.observe(el)), 30);
});
