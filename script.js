
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const music = $("#backgroundMusic");
const musicToggle = $("#musicToggle");
let musicOn = false;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

async function toggleMusic() {
  if (!musicOn) {
    try {
      await music.play();
      musicOn = true;
      musicToggle.classList.add("active");
    } catch {
      showToast("Музыкальный файл пока не добавлен.");
    }
  } else {
    music.pause();
    musicOn = false;
    musicToggle.classList.remove("active");
  }
}

musicToggle.addEventListener("click", toggleMusic);

$("#beginJourney").addEventListener("click", () => {
  if (!musicOn) toggleMusic();
  $("#intro").scrollIntoView({ behavior: "smooth" });
});

/* Плавное появление */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(element => observer.observe(element));

/* Подсветка курсора и движение луны */
const glow = $(".cursor-glow");
window.addEventListener("pointermove", event => {
  glow.style.left = event.clientX + "px";
  glow.style.top = event.clientY + "px";

  const x = (event.clientX / innerWidth - 0.5) * 10;
  const y = (event.clientY / innerHeight - 0.5) * 10;
  $(".moon").style.transform = `translate(${x}px, ${y}px)`;
}, { passive: true });

/* Звёзды */
const canvas = $("#particles");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  stars = Array.from(
    { length: Math.min(100, Math.floor(innerWidth / 12)) },
    () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: Math.random() * 1.4 + 0.25,
      alpha: Math.random() * 0.65 + 0.15,
      speed: Math.random() * 0.007 + 0.002,
      phase: Math.random() * 6.28
    })
  );
}

function drawStars() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  stars.forEach(star => {
    star.phase += star.speed;
    const alpha = star.alpha * (0.65 + Math.sin(star.phase) * 0.35);

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 220, 163, ${alpha})`;
    ctx.shadowBlur = star.radius * 8;
    ctx.shadowColor = "#e6a85c";
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawStars();

/* Падающие листья */
function createLeaf() {
  const leaf = document.createElement("span");
  leaf.className = "petal";
  leaf.textContent = ["🍂", "🍁", "✧"][Math.floor(Math.random() * 3)];
  leaf.style.left = Math.random() * 100 + "vw";
  leaf.style.fontSize = 12 + Math.random() * 13 + "px";
  leaf.style.opacity = 0.35 + Math.random() * 0.5;
  leaf.style.animationDuration = 10 + Math.random() * 10 + "s";
  leaf.style.setProperty("--drift", Math.random() * 180 - 90 + "px");

  document.body.appendChild(leaf);
  setTimeout(() => leaf.remove(), 21000);
}

setInterval(createLeaf, 1050);

/* Двадцать два цветка */
const reasons = [
  "За твою красоту.",
  "За твою нежность.",
  "За твоё чувство юмора.",
  "За то, что с тобой всегда интересно.",
  "За наши бесконечные разговоры.",
  "За посиделки за чаем.",
  "За ночные прогулки.",
  "За Муизу, которая нас сблизила.",
  "За наши странные шутки.",
  "За наши аниме пародии.",
  "За каждое наше «ганбарэ».",
  "За то, как мы смеёмся.",
  "За твою силу и характер.",
  "За твою искренность.",
  "За твои кудряшки.",
  "За то, что мы сразу поймали одну волну.",
  "За наши маленькие традиции.",
  "За все моменты, которые уже стали воспоминаниями.",
  "За то, что рядом с тобой можно быть собой.",
  "За твою неповторимость.",
  "За то, что ты есть в моей жизни.",
  "И просто потому, что это ты."
];

const garden = $("#reasonGarden");

reasons.forEach((reason, index) => {
  const button = document.createElement("button");
  button.className = "reason-flower reveal";
  button.type = "button";
  button.innerHTML = `
    <span class="bloom">${["✿", "❀", "✾", "✽"][index % 4]}</span>
    <small>ЦВЕТОК ${String(index + 1).padStart(2, "0")}</small>
  `;
  button.addEventListener("click", () => showToast(reason));
  garden.appendChild(button);
  observer.observe(button);
});

/* Секрет */
$("#secretSeal").addEventListener("click", () => {
  $("#secretTitle").textContent = "ОХАЕ ДАТТАБАЕ";
  $("#secretSeal").classList.add("active");
});

/* Праздничные листья */
$("#celebrateButton").addEventListener("click", () => {
  for (let i = 0; i < 34; i++) {
    const leaf = document.createElement("span");
    leaf.className = "petal";
    leaf.textContent = ["🍂", "🍁", "✦", "♡"][i % 4];
    leaf.style.left = 10 + Math.random() * 80 + "vw";
    leaf.style.top = 15 + Math.random() * 55 + "vh";
    leaf.style.animationDuration = 2 + Math.random() * 3 + "s";
    leaf.style.fontSize = 14 + Math.random() * 20 + "px";
    leaf.style.setProperty("--drift", Math.random() * 240 - 120 + "px");
    document.body.appendChild(leaf);
    setTimeout(() => leaf.remove(), 5500);
  }
});

/* Плавное появление письма */
const letter = $(".letter-text");
if (letter) {
  const paragraphs = [...letter.children];

  paragraphs.forEach((paragraph, index) => {
    paragraph.style.opacity = "0";
    paragraph.style.transform = "translateY(8px)";
    paragraph.style.transition =
      `opacity .7s ${index * 0.18}s, transform .7s ${index * 0.18}s`;
  });

  const letterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      paragraphs.forEach(paragraph => {
        paragraph.style.opacity = "1";
        paragraph.style.transform = "translateY(0)";
      });
      letterObserver.disconnect();
    }
  }, { threshold: 0.25 });

  letterObserver.observe(letter);
}
