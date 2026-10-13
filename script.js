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

// Formulário: envia o pedido diretamente para o email (via FormSubmit).
// Na primeira vez, o FormSubmit manda um email de ativação para EMAIL; é preciso confirmar.
const form = document.querySelector("#form-orcamento");
if (form) {
  const status = document.createElement("div");
  status.className = "form-status";
  status.setAttribute("role", "status");
  status.hidden = true;
  form.appendChild(status);

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const d = new FormData(form);
    if (d.get("_honey")) return; // bots
    const nome = (d.get("nome") || "").trim();
    const negocio = (d.get("negocio") || "").trim();
    const subject = `Pedido de orçamento${negocio ? " — " + negocio : ""} (site)`;
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "A enviar…";
    status.hidden = true;

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _captcha: "false",
          Nome: nome,
          email: d.get("email") || "",
          "Negócio / projeto": negocio,
          "O que procura": d.get("servico") || "",
          Mensagem: d.get("mensagem") || "",
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) !== "true") throw new Error(out.message || "erro");
      form.reset();
      status.className = "form-status form-status--ok";
      status.innerHTML = `<b>Obrigada, ${nome.split(" ")[0] || ""}! A tua mensagem foi enviada.</b> Vou ler com atenção e respondo-te pessoalmente para o email que deixaste.`;
    } catch (e) {
      status.className = "form-status form-status--erro";
      status.innerHTML = `<b>Não foi possível enviar agora.</b> Tenta de novo daqui a pouco, ou escreve-me diretamente para <span class="sel">${EMAIL}</span>.`;
    } finally {
      status.hidden = false;
      btn.disabled = false;
      btn.innerHTML = label;
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}
