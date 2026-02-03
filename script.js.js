// Codigo sin tildes ni caracteres especiales.

const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");

const content = document.getElementById("content");
const footer  = document.getElementById("footer");

const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modalTitle");
const modalText  = document.getElementById("modalText");
const closeBtn   = document.getElementById("closeBtn");

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function openModal(title, text){
  modalTitle.textContent = title;
  modalText.textContent = text;
  overlay.style.display = "grid";
  burstHearts();
}
function closeModal(){ overlay.style.display = "none"; }

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

function burstHearts(){
  const hearts = ["❤","💖","💘","💗","✨"];
  const card = document.querySelector(".modal");
  const r = card.getBoundingClientRect();

  for(let i=0; i<18; i++){
    const s = document.createElement("span");
    s.className = "heart";
    s.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    const x = Math.random() * (r.width - 20) + 10;
    const y = Math.random() * (r.height - 20) + (r.height - 40);
    s.style.left = x + "px";
    s.style.top  = y + "px";
    s.style.animationDuration = (850 + Math.random()*650) + "ms";
    s.style.fontSize = (18 + Math.random()*12) + "px";
    card.appendChild(s);
    setTimeout(() => s.remove(), 1600);
  }
}

yesBtn.addEventListener("click", () => {
  openModal(
    "Bromas ",
    "Solo queria decirte algo...\n\n" +
    "Gracias por estar en mi vida y por compartir otro mes a mi lado. " +
    "Espero que sean muchisimos años mas.\n\n" +
    "Sos el amor de mi vida, la dueña de mi corazon, y quiero hacerte muy feliz. " +
    "Desde que te conoci, soy el hombre mas feliz.\n\n" +
    'Quiero construirlo todo a tu lado. 💖'
  );
});

noBtn.addEventListener("click", () => {
  openModal("Ajaja!", "Yo sabia que en el fondo era un SI ");
});

const config = {
  safeRadius: 320,
  delayMs: 120,
  cooldownMs: 160,
  padding: 16,
  minDistFromYes: 260,
  trollChance: 0.45,
  textChance: 0.35
};


function getBtnCenter(btn){
  const r = btn.getBoundingClientRect();
  return { x: r.left + r.width/2, y: r.top + r.height/2, w: r.width, h: r.height };
}

function getSafeBounds(btnW, btnH){
  const pad = config.padding;

  const c = content.getBoundingClientRect();
  const f = footer.getBoundingClientRect();

  // evita que el NO se meta encima del texto y del footer
  const minX = pad + btnW/2;
  const maxX = window.innerWidth  - pad - btnW/2;

  const minY = (c.bottom + 18) + btnH/2;
  const maxY = (f.top - 18) - btnH/2;

  // si el footer queda muy arriba (pantallas pequenas), al menos deja un rango
  const finalMinY = clamp(minY, pad + btnH/2, window.innerHeight - pad - btnH/2);
  const finalMaxY = clamp(maxY, finalMinY + 10, window.innerHeight - pad - btnH/2);

  return { minX, maxX, minY: finalMinY, maxY: finalMaxY };
}

function setNoCenter(cx, cy){
  const nb = noBtn.getBoundingClientRect();
  const bounds = getSafeBounds(nb.width, nb.height);

  const x = clamp(cx, bounds.minX, bounds.maxX);
  const y = clamp(cy, bounds.minY, bounds.maxY);

  noBtn.style.left = x + "px";
  noBtn.style.top  = y + "px";
}
function randomBetween(min, max){
  return min + Math.random() * (max - min);
}

function teleportNo(){
  const nb = noBtn.getBoundingClientRect();
  const bounds = getSafeBounds(nb.width, nb.height);

  for(let i = 0; i < 40; i++){
    const x = randomBetween(bounds.minX, bounds.maxX);
    const y = randomBetween(bounds.minY, bounds.maxY);

    const yes = getBtnCenter(yesBtn);
    const dYes = Math.hypot(x - yes.x, y - yes.y);

    if (dYes >= config.minDistFromYes){
      setNoCenter(x, y);
      return;
    }
  }

  setNoCenter(bounds.maxX, bounds.maxY);
}

let trollTimer = 0;

function trollEffect(){
  // 1) encoger
  if (Math.random() < config.trollChance){
    noBtn.classList.add("troll-small");
    clearTimeout(trollTimer);
    trollTimer = setTimeout(() => noBtn.classList.remove("troll-small"), 260);
  }

  // 2) flash
  noBtn.classList.add("troll-flash");
  setTimeout(() => noBtn.classList.remove("troll-flash"), 180);

  // 3) texto rapido
  if (Math.random() < config.textChance){
    const old = noBtn.textContent;
    noBtn.textContent = (Math.random() < 0.5) ? "Casi!" : "Si?";
    setTimeout(() => { noBtn.textContent = old; }, 220);
  }
}

function keepAwayFromYes(target){
  const yes = getBtnCenter(yesBtn);
  const dx = target.x - yes.x;
  const dy = target.y - yes.y;
  const d  = Math.hypot(dx, dy);

  if (d >= config.minDistFromYes) return target;

  const ux = (d === 0) ? 1 : dx / d;
  const uy = (d === 0) ? 0 : dy / d;

  return {
    x: yes.x + ux * config.minDistFromYes,
    y: yes.y + uy * config.minDistFromYes
  };
}


function randomBetween(min, max){
  return min + Math.random() * (max - min);
}

function teleportNo(){
  const nb = noBtn.getBoundingClientRect();
  const bounds = getSafeBounds(nb.width, nb.height);

  // busca una posicion alejada del mouse y del boton SI
  for(let i = 0; i < 30; i++){
    const x = randomBetween(bounds.minX, bounds.maxX);
    const y = randomBetween(bounds.minY, bounds.maxY);

    const yes = getBtnCenter(yesBtn);
    const dYes = Math.hypot(x - yes.x, y - yes.y);

    // si esta lo suficientemente lejos del SI, la usamos
    if (dYes >= config.minDistFromYes){
      setNoCenter(x, y);
      return;
    }
  }

  // fallback por si no encuentra rapido
  setNoCenter(bounds.maxX, bounds.maxY);
}

let raf = 0;
let lastRun = 0;
let pending = 0;

function onMouseMove(e){
  if (raf) return;

  raf = requestAnimationFrame(() => {
    raf = 0;

    const now = Date.now();
    if (now - lastRun < config.cooldownMs) return;
    lastRun = now;

    const mx = e.clientX;
    const my = e.clientY;

    const noC = getBtnCenter(noBtn);
    const dist = Math.hypot(noC.x - mx, noC.y - my);

    if (dist < config.safeRadius){
      clearTimeout(pending);
      pending = setTimeout(() => {
        trollEffect();
        teleportNo();
      }, config.delayMs);
    }
  });
}



window.addEventListener("mousemove", onMouseMove);

// Si el mouse logra entrar al NO, empujon extra
noBtn.addEventListener("mouseenter", () => {
  const noC = getBtnCenter(noBtn);
  const target = keepAwayFromYes({ x: noC.x + 110, y: noC.y - 70 });
  setNoCenter(target.x, target.y);
});

// Tactil
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const noC = getBtnCenter(noBtn);
  setNoCenter(noC.x + 140, noC.y - 90);
}, { passive:false });

// Re-encuadre al redimensionar
window.addEventListener("resize", () => {
  const noC = getBtnCenter(noBtn);
  setNoCenter(noC.x, noC.y);
});
