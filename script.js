// Contactos — muda aqui e atualiza o site todo.
const EMAIL = "bandarramedia@gmail.com";
const INSTAGRAM = "bandarra.design"; // ex.: "biancabandarra" (sem @). Enquanto estiver vazio, o Instagram não aparece.

document.documentElement.classList.remove("no-js");

// Menu móvel
const toggle = document.querySelector(".nav-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

// Linha por baixo do cabeçalho ao rolar
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Instagram
document.querySelectorAll("[data-instagram]").forEach((el) => {
  if (!INSTAGRAM) { el.remove(); return; }
  const a = el.querySelector("a") || el;
  a.href = "https://instagram.com/" + INSTAGRAM;
  const label = el.querySelector("[data-instagram-handle]");
  if (label) label.textContent = "@" + INSTAGRAM;
});

// Ano no rodapé
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Formulário: prepara a mensagem para copiar ou abrir no email
const form = document.querySelector("#form-orcamento");
if (form) {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const d = new FormData(form);
    const nome = (d.get("nome") || "").trim();
    const negocio = (d.get("negocio") || "").trim();
    const subject = `Pedido de orçamento${negocio ? " — " + negocio : ""}`;
    const body = [
      `Nome: ${nome}`,
      `Email: ${d.get("email") || ""}`,
      `Negócio / projeto: ${negocio}`,
      `O que procuro: ${d.get("servico") || ""}`,
      "",
      d.get("mensagem") || "",
    ].join("\n");
    let box = form.querySelector(".msg-ready");
    if (!box) {
      box = document.createElement("div");
      box.className = "msg-ready";
      box.innerHTML = `<p>A tua mensagem está pronta. Copia-a e envia para <span class="sel">${EMAIL}</span>, ou abre-a no teu email.</p>
        <pre id="msg-texto"></pre>
        <div class="btn-row"><button type="button" class="btn" id="msg-copiar">Copiar mensagem</button><a class="btn btn--ghost" id="msg-email">Abrir no email</a></div>`;
      form.appendChild(box);
    }
    box.querySelector("#msg-texto").textContent = `Assunto: ${subject}

${body}`;
    box.querySelector("#msg-email").href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const copy = box.querySelector("#msg-copiar");
    copy.onclick = () => {
      const txt = box.querySelector("#msg-texto");
      const done = () => (copy.textContent = "Copiado");
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(txt); const s = getSelection(); s.removeAllRanges(); s.addRange(r); copy.textContent = "Selecionado: usa Ctrl+C"; };
      try { navigator.clipboard.writeText(txt.textContent).then(done, fallback); } catch (e) { fallback(); }
    };
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
