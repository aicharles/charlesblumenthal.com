#!/usr/bin/env bun
// Interactive designing channel for charlesblumenthal.com
//
// Spawns the Next.js dev server, proxies it with a click-to-comment overlay,
// and pushes comments straight into Claude Code via a channel. Claude edits the
// React/Tailwind source, Next fast-refreshes, you see it live. No copy-paste.
//
// Launch:  claude --dangerously-load-development-channels server:design
// Then open http://localhost:3333

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const PROXY_PORT = 3333; // what you open in the browser
const NEXT_PORT = 4321; // where we run `next dev`
const WEBSITE_DIR = new URL("../website", import.meta.url).pathname;

// --- Start the Next.js dev server as a subprocess ---------------------------
const next = Bun.spawn(["npm", "run", "dev", "--", "-p", String(NEXT_PORT)], {
  cwd: WEBSITE_DIR,
  stdout: "inherit",
  stderr: "inherit",
});
process.on("exit", () => next.kill());
process.on("SIGINT", () => { next.kill(); process.exit(0); });
process.on("SIGTERM", () => { next.kill(); process.exit(0); });

// --- SSE clients (browser <- Claude status toasts) --------------------------
const sseClients = new Set<ReadableStreamDefaultController>();
function toast(message: string) {
  for (const c of sseClients) {
    try {
      c.enqueue(`data: ${JSON.stringify({ type: "toast", message })}\n\n`);
    } catch {
      sseClients.delete(c);
    }
  }
}

// --- MCP channel (stdio, talks to Claude Code) ------------------------------
const mcp = new Server(
  { name: "design", version: "0.0.1" },
  {
    capabilities: { experimental: { "claude/channel": {} }, tools: {} },
    instructions:
      'Design feedback for charlesblumenthal.com arrives as <channel source="design" ...>. ' +
      "Each message is a comment pinned to a spot on the live site, with a CSS selector and page path. " +
      "Find the matching component under website/src and edit it (Next fast-refreshes automatically). " +
      "Follow CLAUDE.md content/design rules. Use the reply tool to confirm what you changed.",
  },
);

mcp.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "reply",
      description: "Show a short status toast in the design overlay (e.g. 'Updated the hero heading').",
      inputSchema: {
        type: "object" as const,
        properties: { message: { type: "string", description: "Text shown in the overlay" } },
        required: ["message"],
      },
    },
  ],
}));

mcp.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === "reply") {
    toast((req.params.arguments as { message: string }).message);
    return { content: [{ type: "text" as const, text: "sent" }] };
  }
  return { content: [{ type: "text" as const, text: "unknown tool" }] };
});

await mcp.connect(new StdioServerTransport());

// --- Comment overlay injected into proxied HTML -----------------------------
const OVERLAY = `
<script>
(function() {
  if (window.__designOverlay) return; window.__designOverlay = true;
  let commentMode = true;

  const bar = document.createElement('div');
  bar.setAttribute('data-overlay','true');
  bar.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483647;display:flex;gap:8px;font-family:-apple-system,sans-serif;';
  const modeBtn = document.createElement('button');
  modeBtn.textContent = 'Comment mode: on';
  modeBtn.style.cssText = 'padding:8px 14px;border-radius:9999px;border:none;background:#6366f1;color:#fff;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.18);';
  modeBtn.onclick = () => {
    commentMode = !commentMode;
    modeBtn.textContent = 'Comment mode: ' + (commentMode ? 'on' : 'off');
    modeBtn.style.background = commentMode ? '#6366f1' : '#94a3b8';
    document.body.style.cursor = commentMode ? 'crosshair' : '';
  };
  const status = document.createElement('div');
  status.style.cssText = 'padding:8px 14px;border-radius:9999px;background:#0f172a;color:#a5b4fc;font-size:12px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,.18);display:none;align-items:center;';
  bar.appendChild(modeBtn); bar.appendChild(status);
  document.body.appendChild(bar);
  document.body.style.cursor = 'crosshair';

  function selectorFor(el) {
    if (!el || el === document.body || el === document.documentElement) return 'body';
    if (el.id) return '#' + el.id;
    const tag = el.tagName.toLowerCase();
    const txt = (el.textContent || '').trim().replace(/\\s+/g,' ').slice(0,40);
    const p = el.parentElement;
    if (!p) return tag;
    const sibs = Array.from(p.children).filter(c => c.tagName === el.tagName);
    const idx = sibs.indexOf(el) + 1;
    return selectorFor(p) + ' > ' + tag + (sibs.length > 1 ? ':nth-of-type(' + idx + ')' : '') + (txt ? ' /* "' + txt + '" */' : '');
  }

  let n = 0;
  document.addEventListener('click', (e) => {
    if (!commentMode || e.target.closest('[data-overlay]')) return;
    e.preventDefault(); e.stopPropagation();
    const num = ++n;
    const pin = document.createElement('div');
    pin.setAttribute('data-overlay','true');
    pin.textContent = num;
    pin.style.cssText = 'position:absolute;left:'+e.pageX+'px;top:'+e.pageY+'px;width:26px;height:26px;border-radius:50%;background:#ef4444;color:#fff;font:700 12px/26px sans-serif;text-align:center;transform:translate(-50%,-50%);z-index:2147483646;box-shadow:0 2px 6px rgba(0,0,0,.3);';
    document.body.appendChild(pin);

    const pop = document.createElement('div');
    pop.setAttribute('data-overlay','true');
    pop.style.cssText = 'position:absolute;left:'+(e.pageX+18)+'px;top:'+(e.pageY-14)+'px;z-index:2147483647;';
    const input = document.createElement('input');
    input.placeholder = 'What should change here? (Enter to send)';
    input.style.cssText = 'padding:9px 12px;border-radius:10px;border:2px solid #6366f1;font-size:13px;width:300px;outline:none;box-shadow:0 4px 14px rgba(0,0,0,.18);font-family:-apple-system,sans-serif;';
    pop.appendChild(input); document.body.appendChild(pop); input.focus();

    let sent = false;
    function send() {
      if (sent) return; sent = true; pop.remove();
      const text = input.value.trim();
      if (!text) { pin.remove(); return; }
      fetch('/__comment', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ pin:num, path:location.pathname, selector:selectorFor(e.target), comment:text }),
      });
      pin.style.background = '#10b981';
    }
    input.addEventListener('keydown', ev => { if (ev.key==='Enter') send(); if (ev.key==='Escape'){sent=true;pop.remove();pin.remove();} });
    input.addEventListener('blur', send);
  }, true);

  new EventSource('/__events').onmessage = (e) => {
    try { const d = JSON.parse(e.data); if (d.type==='toast') { status.textContent = d.message; status.style.display='flex'; clearTimeout(status._t); status._t = setTimeout(()=>status.style.display='none', 6000); } } catch {}
  };
})();
</script>
`;

// --- Proxy :3333 -> Next dev, injecting the overlay -------------------------
Bun.serve({
  port: PROXY_PORT,
  idleTimeout: 0,
  async fetch(req) {
    const url = new URL(req.url);

    // SSE stream for status toasts
    if (url.pathname === "/__events") {
      return new Response(
        new ReadableStream({
          start(ctrl) {
            ctrl.enqueue(": ok\n\n");
            sseClients.add(ctrl);
            req.signal.addEventListener("abort", () => sseClients.delete(ctrl));
          },
        }),
        { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } },
      );
    }

    // Inbound comments -> Claude
    if (url.pathname === "/__comment" && req.method === "POST") {
      const c = await req.json();
      await mcp.notification({
        method: "notifications/claude/channel",
        params: {
          content: `Pin ${c.pin}: ${c.comment}`,
          meta: { page: c.path, selector: c.selector },
        },
      });
      return new Response("ok");
    }

    // Everything else: proxy to Next dev
    const target = `http://localhost:${NEXT_PORT}${url.pathname}${url.search}`;
    let upstream: Response;
    try {
      upstream = await fetch(target, {
        method: req.method,
        headers: req.headers,
        body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
        redirect: "manual",
      });
    } catch {
      return new Response("Waiting for the dev server to start...", { status: 503 });
    }

    const ct = upstream.headers.get("content-type") || "";
    if (ct.includes("text/html")) {
      let html = await upstream.text();
      html = html.includes("</body>") ? html.replace("</body>", OVERLAY + "</body>") : html + OVERLAY;
      const headers = new Headers(upstream.headers);
      headers.delete("content-length");
      headers.delete("content-encoding");
      return new Response(html, { status: upstream.status, headers });
    }
    // Bun's fetch already decompressed the body, so drop the encoding/length
    // headers - otherwise Chrome tries to gunzip plaintext (ERR_CONTENT_DECODING_FAILED).
    const passHeaders = new Headers(upstream.headers);
    passHeaders.delete("content-encoding");
    passHeaders.delete("content-length");
    return new Response(upstream.body, { status: upstream.status, headers: passHeaders });
  },
});

console.error(`[design] proxy on http://localhost:${PROXY_PORT}  ->  next dev :${NEXT_PORT}`);
