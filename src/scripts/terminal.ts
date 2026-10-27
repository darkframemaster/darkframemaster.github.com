/**
 * Client enhancements only: typewriter (I2), clock (I4), restrained rain (I8).
 * Hero copy is already in the server HTML. Reduced motion keeps that copy,
 * skips the rain, and CSS stops blink / prompt breathe / scanline drift.
 */

const MAX_COLUMNS = 18;
const GLYPHS = "01アイウエオﾊｶﾀﾅﾏﾔﾗﾜ$#>_xuehaoML";
const SEQUENCE = [
  { id: "tw-role", ms: 28 },
  { id: "tw-name", ms: 42 },
  { id: "tw-bio", ms: 22 },
] as const;
const PAUSE_MS = 180;

const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

function formatClock(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function startClock(): void {
  const clock = document.getElementById("status-clock");
  if (!clock) return;
  const tick = () => {
    const now = new Date();
    clock.textContent = formatClock(now);
    clock.setAttribute("datetime", now.toISOString());
    clock.removeAttribute("hidden");
  };
  tick();
  window.setInterval(tick, 1000);
}

function startTypewriter(): void {
  const items = SEQUENCE.flatMap((item) => {
    const el = document.getElementById(item.id);
    if (!el) return [];
    return [{ el, text: el.textContent ?? "", ms: item.ms }];
  });

  let timers: number[] = [];

  const fillNow = () => {
    for (const id of timers) window.clearInterval(id);
    timers = [];
    for (const item of items) item.el.textContent = item.text;
  };

  if (motion.matches) return;

  const typeOne = (item: (typeof items)[number]) =>
    new Promise<void>((resolve) => {
      if (motion.matches) {
        item.el.textContent = item.text;
        resolve();
        return;
      }
      let index = 0;
      item.el.textContent = "";
      const timer = window.setInterval(() => {
        if (motion.matches) {
          window.clearInterval(timer);
          item.el.textContent = item.text;
          resolve();
          return;
        }
        index += 1;
        item.el.textContent = item.text.slice(0, index);
        if (index >= item.text.length) {
          window.clearInterval(timer);
          resolve();
        }
      }, item.ms);
      timers.push(timer);
    });

  void (async () => {
    for (const item of items) {
      await typeOne(item);
      if (motion.matches) {
        fillNow();
        return;
      }
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, PAUSE_MS);
      });
    }
  })();

  motion.addEventListener("change", () => {
    if (motion.matches) fillNow();
  });
}

function startRain(): void {
  const canvas = document.getElementById("rain");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  if (motion.matches) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const maxColumns = Math.min(
    MAX_COLUMNS,
    Number(canvas.dataset.maxColumns ?? String(MAX_COLUMNS)) || MAX_COLUMNS,
  );

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops: number[] = [];
  let font = 14;
  let frame = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    font = Math.max(14, Math.floor(width / 70));
    columns = Math.min(maxColumns, Math.max(1, Math.floor(width / (font * 2.2))));
    drops = Array.from({ length: columns }, () => Math.random() * -40);
  };

  const draw = () => {
    context.fillStyle = "rgba(4, 8, 6, 0.07)";
    context.fillRect(0, 0, width, height);
    context.font = `${font}px "IBM Plex Mono", monospace`;
    const gap = width / columns;
    for (let index = 0; index < columns; index += 1) {
      const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0] ?? "0";
      const x = index * gap + gap * 0.3;
      const y = (drops[index] ?? 0) * font;
      context.fillStyle = index % 5 === 0 ? "rgba(51,255,119,0.82)" : "rgba(26,143,74,0.52)";
      context.fillText(glyph, x, y);
      if (y > height && Math.random() > 0.975) drops[index] = 0;
      drops[index] = (drops[index] ?? 0) + 0.55 + Math.random() * 0.35;
    }
  };

  const stop = () => {
    if (!frame) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const loop = () => {
    frame = 0;
    if (motion.matches || document.hidden) return;
    draw();
    frame = window.requestAnimationFrame(loop);
  };

  const play = () => {
    if (motion.matches || document.hidden || frame) return;
    frame = window.requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else play();
  });

  motion.addEventListener("change", () => {
    if (motion.matches) stop();
    else play();
  });

  play();
}

startClock();
startTypewriter();
startRain();
