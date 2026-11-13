// =========================================================
// ওয়েবসাইটের সার্ভার — Netlify Functions + Netlify Blobs (ফ্রি ডাটাবেস)
// এই কোড ব্রাউজারে যায় না, শুধু Netlify সার্ভারে চলে।
//  - সাইটের সব লেখা/কোর্স/ছবি সংরক্ষণ
//  - ভর্তি, রেজিস্ট্রেশন ও মেসেজ জমা রাখা
//  - অ্যাডমিন লগইন (মোবাইল নম্বর + পাসওয়ার্ড)
// =========================================================
import { getStore } from "@netlify/blobs";
import { createHash, randomBytes } from "node:crypto";

// অ্যাডমিন লগইনের শুরুর তথ্য। প্যানেল থেকে পাসওয়ার্ড বদলালে নতুনটা ডাটাবেসে থাকে,
// তখন নিচের DEFAULT_HASH আর কাজে লাগে না।
const ADMIN_PHONE = "01724649947";
const DEFAULT_HASH = "5fc4483bf506464dadab327ea50764be0622bfc2c26975e5ef5ffa900586e064";

const FORMS = ["enroll", "signup", "contact"];
const GRAPH_VERSION = "v23.0"; // Facebook Graph API ভার্সন
const IMG_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };

const sha256 = (s) => createHash("sha256").update(String(s)).digest("hex");
const normPhone = (p) => String(p || "").replace(/\D/g, "").replace(/^88/, "");
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

export function createApi(storeFor) {
  const db = () => storeFor("lms");
  const subs = () => storeFor("submissions");
  const imgs = () => storeFor("images");

  async function checkAdmin(body) {
    const auth = (await db().get("auth", { type: "json" })) || {};
    const phone = auth.phone || ADMIN_PHONE;
    const hash = auth.hash || DEFAULT_HASH;
    return normPhone(body.phone) === phone && sha256(body.password || "") === hash;
  }

  async function listForm(form) {
    const s = subs();
    const { blobs } = await s.list({ prefix: form + "/" });
    const items = await Promise.all(blobs.map(async (b) => {
      const v = await s.get(b.key, { type: "json" });
      return v ? { key: b.key, date: v.date, data: v.data || {} } : null;
    }));
    return items.filter(Boolean).sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  /* ---------- Facebook Conversions API (সার্ভার সাইড ট্র্যাকিং) ---------- */
  // ফোন নম্বর আন্তর্জাতিক ফরম্যাটে (8801XXXXXXXXX) করে SHA-256 হ্যাশ — Meta এর নিয়ম অনুযায়ী
  const hashPhone = (p) => { const n = normPhone(p); return /^01\d{9}$/.test(n) ? sha256("88" + n) : undefined; };
  async function sendCapi(ev, req) {
    const cfg = (await db().get("tracking-secret", { type: "json" })) || {};
    const content = (await db().get("content", { type: "json" })) || {};
    const pixelId = content.site?.tracking?.pixelId;
    if (!cfg.token || !pixelId) return { skipped: true };
    const h = req?.headers;
    const ip = h ? (h.get("x-nf-client-connection-ip") || (h.get("x-forwarded-for") || "").split(",")[0].trim()) : "";
    const user_data = {
      client_ip_address: ip || ev.ip || undefined,
      client_user_agent: (h && h.get("user-agent")) || ev.ua || undefined,
      fbp: ev.fbp || undefined, fbc: ev.fbc || undefined,
      ph: ev.phone ? [hashPhone(ev.phone)].filter(Boolean) : undefined,
      external_id: ev.phone ? [sha256(normPhone(ev.phone))] : undefined
    };
    const payload = {
      data: [{
        event_name: ev.event, event_time: Math.floor(Date.now() / 1000), event_id: ev.eventId,
        action_source: "website", event_source_url: ev.url || undefined,
        user_data, custom_data: ev.custom || undefined
      }],
      ...(cfg.testCode ? { test_event_code: cfg.testCode } : {})
    };
    const r = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(cfg.token)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true, received: j.events_received } : { ok: false, error: j.error?.message || r.status };
  }
  const CAPI_EVENTS = ["ViewContent", "InitiateCheckout", "AddPaymentInfo", "CompleteRegistration", "Lead", "Contact"];

  return async function handler(req) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "");

    try {
      // ---------- পাবলিক ----------
      if (req.method === "GET" && path === "/api/content") {
        const c = await db().get("content", { type: "json" });
        return json(c || {});
      }

      if (req.method === "GET" && path.startsWith("/api/img/")) {
        const key = decodeURIComponent(path.slice("/api/img/".length));
        const r = await imgs().getWithMetadata(key, { type: "arrayBuffer" });
        if (!r) return new Response("Not found", { status: 404 });
        return new Response(r.data, { headers: { "Content-Type": r.metadata?.type || "image/png", "Cache-Control": "public, max-age=31536000, immutable" } });
      }

      if (req.method === "GET" && path === "/api/status") {
        const key = normPhone(url.searchParams.get("phone")) + "|" + (url.searchParams.get("course") || "");
        const ap = (await db().get("approvals", { type: "json" })) || {};
        return json({ approved: !!ap[key] });
      }

      if (req.method === "POST" && path === "/api/track") {
        const b = await req.json().catch(() => ({}));
        if (!CAPI_EVENTS.includes(b.event) || !b.eventId) return json({ error: "bad" }, 400);
        const custom = {};
        for (const k of ["value", "currency", "content_name", "content_ids", "content_type", "content_category"]) if (b.custom?.[k] != null) custom[k] = b.custom[k];
        const r = await sendCapi({ event: b.event, eventId: String(b.eventId).slice(0, 80), url: String(b.url || "").slice(0, 500), fbp: b.fbp, fbc: b.fbc, phone: b.phone, custom }, req);
        return json(r);
      }

      if (req.method === "POST" && path === "/api/submit") {
        const body = await req.json().catch(() => ({}));
        if (!FORMS.includes(body.form) || typeof body.data !== "object" || !body.data) return json({ error: "bad" }, 400);
        if (body.data["bot-field"]) return json({ ok: true });
        const data = {};
        for (const [k, v] of Object.entries(body.data).slice(0, 20)) data[String(k).slice(0, 40)] = String(v ?? "").slice(0, 1000);
        data._ip = req.headers.get("x-nf-client-connection-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
        data._ua = (req.headers.get("user-agent") || "").slice(0, 400);
        const key = `${body.form}/${Date.now()}-${randomBytes(4).toString("hex")}`;
        await subs().setJSON(key, { date: new Date().toISOString(), data });
        return json({ ok: true });
      }

      // ---------- অ্যাডমিন ----------
      if (req.method === "POST" && path === "/api/admin") {
        const body = await req.json().catch(() => ({}));
        if (!(await checkAdmin(body))) return json({ error: "auth" }, 401);
        const a = body.action;

        if (a === "login") return json({ ok: true });

        if (a === "list") {
          const out = {};
          for (const f of FORMS) out[f] = await listForm(f);
          const approvals = (await db().get("approvals", { type: "json" })) || {};
          return json({ ok: true, subs: out, approvals });
        }

        if (a === "approve") {
          const key = normPhone(body.studentPhone) + "|" + String(body.course || "");
          const ap = (await db().get("approvals", { type: "json" })) || {};
          const wasOn = !!ap[key];
          if (body.on) ap[key] = { date: new Date().toISOString() }; else delete ap[key];
          await db().setJSON("approvals", ap);
          // অনুমোদন = আসল বিক্রি → Facebook এ Purchase ইভেন্ট (সার্ভার থেকে)
          let capi = null;
          if (body.on && !wasOn) {
            capi = await sendCapi({
              event: "Purchase", eventId: "purchase-" + key, phone: body.studentPhone, url: body.siteUrl, fbp: body.fbp, fbc: body.fbc, ua: body.ua, ip: body.ip,
              custom: { value: Number(body.value) || 0, currency: "BDT", content_name: String(body.courseName || ""), content_ids: [String(body.course || "")], content_type: "product" }
            }, null).catch((e) => ({ ok: false, error: String(e.message || e) }));
          }
          return json({ ok: true, approvals: ap, capi });
        }

        if (a === "delete") {
          if (!FORMS.some((f) => String(body.key || "").startsWith(f + "/"))) return json({ error: "bad" }, 400);
          await subs().delete(body.key);
          return json({ ok: true });
        }

        if (a === "save") {
          const c = body.content;
          if (!c || typeof c !== "object") return json({ error: "bad" }, 400);
          if (JSON.stringify(c).length > 2_000_000) return json({ error: "too-big" }, 413);
          c.updated = new Date().toISOString();
          await db().setJSON("content", c);
          return json({ ok: true, updated: c.updated });
        }

        if (a === "reset") {
          await db().delete("content");
          return json({ ok: true });
        }

        if (a === "upload") {
          const ext = IMG_TYPES[body.type];
          if (!ext || typeof body.data !== "string") return json({ error: "type" }, 400);
          const buf = Buffer.from(body.data, "base64");
          if (buf.length > 3 * 1024 * 1024) return json({ error: "too-big" }, 413);
          const key = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
          await imgs().set(key, buf, { metadata: { type: body.type } });
          return json({ ok: true, url: "/api/img/" + key });
        }

        if (a === "tracking-status") {
          const cfg = (await db().get("tracking-secret", { type: "json" })) || {};
          return json({ ok: true, hasToken: !!cfg.token, testCode: cfg.testCode || "" });
        }

        if (a === "tracking-secret") {
          const cfg = (await db().get("tracking-secret", { type: "json" })) || {};
          if (typeof body.token === "string" && body.token.trim()) cfg.token = body.token.trim();
          if (body.clearToken) delete cfg.token;
          if (typeof body.testCode === "string") cfg.testCode = body.testCode.trim();
          await db().setJSON("tracking-secret", cfg);
          return json({ ok: true, hasToken: !!cfg.token, testCode: cfg.testCode || "" });
        }

        if (a === "tracking-test") {
          const r = await sendCapi({ event: "Lead", eventId: "test-" + Date.now(), url: body.siteUrl, ua: body.ua, custom: { content_name: "অ্যাডমিন প্যানেল থেকে টেস্ট" } }, req);
          return json({ ok: true, result: r });
        }

        if (a === "password") {
          const np = String(body.newPassword || "");
          if (np.length < 8) return json({ error: "short" }, 400);
          const phone = normPhone(body.newPhone) || normPhone(body.phone);
          if (!/^01\d{9}$/.test(phone)) return json({ error: "phone" }, 400);
          await db().setJSON("auth", { phone, hash: sha256(np) });
          return json({ ok: true });
        }

        return json({ error: "action" }, 400);
      }

      return json({ error: "not-found" }, 404);
    } catch (e) {
      return json({ error: "server", message: String(e?.message || e) }, 500);
    }
  };
}

const handler = createApi((name) => getStore({ name, consistency: "strong" }));
export default handler;
export const config = { path: "/api/*" };
