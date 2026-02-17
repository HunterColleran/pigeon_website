const navIntentState = {
  forwardUntil: 0,
};

document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("manifestoScroll");
  if (!scroller) return;

  initProgress(scroller);
  initChapterReveal(scroller);
  initSectionMotion(scroller);
  initTypewriter(scroller);
  initJoinForm();
  initMissionCounter(scroller);
  initInterestTicker(scroller);
  initStormIconFallback();
  initStormInteractions();
  initNotificationSurge(scroller);
  initProductPigeon(scroller);
  initLookUpPigeon(scroller);
  initBlankBreakPigeon(scroller);
  initPigeonWiggle();
  initMoneyRain(scroller);
  initScreenTimeFan(scroller);
  initConsumptionNotifications(scroller);
  initLockscreenFeed();
  initShiftPigeon(scroller);
  initPerchedPigeonArrivals(scroller);
  initChapterAdvance(scroller);
  initChapterCtaReadiness(scroller);
  initReflectionPaint();
  initBuddyChat();
  initReflectionSnake(scroller);
  initPrototypeConceptStack();
  initWaitlistJump(scroller);
});

function initProgress(scroller) {
  const fill = document.querySelector(".progress-fill");
  if (!fill) return;

  const update = () => {
    const max = scroller.scrollHeight - scroller.clientHeight;
    const progress = max > 0 ? scroller.scrollTop / max : 0;
    fill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };

  scroller.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function initChapterReveal(scroller) {
  const chapters = scroller.querySelectorAll("[data-chapter]");
  if (!chapters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("revealed");
      });
    },
    { root: scroller, threshold: 0.45 }
  );

  chapters.forEach((chapter) => observer.observe(chapter));
}

function initSectionMotion(scroller) {
  const chapters = Array.from(scroller.querySelectorAll("[data-chapter]"));
  if (!chapters.length) return;

  let ticking = false;
  let lastStrongestChapter = null;
  let lastScrollTop = scroller.scrollTop;

  const update = () => {
    const center = scroller.clientHeight * 0.5;
    let strongestChapter = null;
    let strongestFocus = -1;

    chapters.forEach((chapter) => {
      const rect = chapter.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const chapterCenter = rect.top - scrollerRect.top + rect.height * 0.5;
      const distance = Math.abs(chapterCenter - center);
      const focus = Math.max(0, 1 - distance / center);
      const rawOffset = (chapterCenter - center) / center;
      const offset = Math.max(-1, Math.min(1, rawOffset));
      chapter.style.setProperty("--focus", focus.toFixed(3));
      chapter.style.setProperty("--offset", offset.toFixed(3));

      if (focus > strongestFocus) {
        strongestFocus = focus;
        strongestChapter = chapter;
      }
    });

    chapters.forEach((chapter) => {
      chapter.classList.toggle("active", chapter === strongestChapter);
    });

    if (strongestChapter && strongestChapter !== lastStrongestChapter) {
      if (lastStrongestChapter) {
        const prevIndex = chapters.indexOf(lastStrongestChapter);
        const nextIndex = chapters.indexOf(strongestChapter);
        if (nextIndex > prevIndex && hasForwardNavIntent()) {
          triggerPerchedPigeonFlyOff(lastStrongestChapter);
        }
      }

      resetPerchedPigeonIfPresent(strongestChapter);
      lastStrongestChapter = strongestChapter;
    }

    ticking = false;
  };

  const requestTick = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  scroller.addEventListener(
    "scroll",
    () => {
      const current = scroller.scrollTop;
      if (current > lastScrollTop + 2) {
        markForwardNavIntent(700);
      }
      lastScrollTop = current;
    },
    { passive: true }
  );
  scroller.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  update();
}

function initTypewriter(scroller) {
  const chapters = Array.from(scroller.querySelectorAll("[data-chapter]"));
  if (!chapters.length) return;

  const lines = Array.from(scroller.querySelectorAll(".type-line[data-text]"));
  reserveTypedLineHeights(lines);

  chapters.forEach((chapter) => {
    chapter.querySelectorAll(".type-line[data-text]").forEach((line) => {
      line.textContent = "";
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const chapter = entry.target;
        if (chapter.dataset.typed === "true") return;
        chapter.dataset.typed = "true";
        playChapterTyping(chapter);
        observer.unobserve(chapter);
      });
    },
    { root: scroller, threshold: 0.55 }
  );

  chapters.forEach((chapter) => observer.observe(chapter));

  // Ensure the opening chapter always types on initial load.
  const firstChapter = chapters[0];
  if (firstChapter && firstChapter.querySelector(".type-line[data-text]")) {
    firstChapter.dataset.typed = "true";
    playChapterTyping(firstChapter);
    observer.unobserve(firstChapter);
  }

  window.addEventListener("resize", () => {
    reserveTypedLineHeights(lines);
  });
}

async function playChapterTyping(chapter) {
  const lines = Array.from(chapter.querySelectorAll(".type-line[data-text]"));
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    await typeLine(line);

    // Product section: let the headline sit for a beat before supporting copy.
    if (chapter.classList.contains("product") && index === 0 && lines.length > 1) {
      await delay(920);
      continue;
    }

    await delay(220);
  }

  if (chapter.classList.contains("logon-intro")) {
    await delay(650);
  }

  revealChapterVisual(chapter);
  revealChapterLogonWord(chapter);
}

function typeLine(el) {
  const text = el.getAttribute("data-text") || "";
  let index = 0;
  el.classList.add("typing");
  const isHeroLine = el.classList.contains("hero");
  const isDeliberateLine = el.classList.contains("deliberate");

  return new Promise((resolve) => {
    const step = () => {
      index += 1;
      el.textContent = text.slice(0, index);

      if (index < text.length) {
        const char = text.charAt(index - 1);
        const baseSpeed = isHeroLine
          ? getHeroTypingDelay(char)
          : isDeliberateLine
            ? getDeliberateTypingDelay(char)
            : (char === "." || char === "," ? 95 : 42);
        const speed = getSectionTypingDelay(baseSpeed, el);
        window.setTimeout(step, speed);
        return;
      }

      el.classList.remove("typing");
      el.classList.add("done");
      resolve();
    };

    step();
  });
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function revealChapterLogonWord(chapter) {
  const logonWord = chapter.querySelector(".logon-word");
  if (!logonWord || logonWord.dataset.animated === "true") return;

  logonWord.dataset.animated = "true";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    logonWord.classList.add("logon-ready");
    return;
  }

  window.setTimeout(() => {
    logonWord.classList.add("logon-ready");
  }, 120);
}

function revealChapterVisual(chapter) {
  if (!chapter) return;
  const hasDeferredVisual =
    chapter.classList.contains("reflection-section") ||
    chapter.classList.contains("reflection-followup-section") ||
    chapter.classList.contains("reflection-intent-section") ||
    chapter.classList.contains("reflection-shift-section");
  if (!hasDeferredVisual) return;
  if (chapter.classList.contains("visual-ready")) return;

  window.setTimeout(() => {
    chapter.classList.add("visual-ready");
  }, 120);
}

function getSectionTypingDelay(baseSpeed, el) {
  const chapter = el.closest(".chapter");
  if (!chapter) return baseSpeed;

  const isDeferredVisualSection =
    chapter.classList.contains("reflection-section") ||
    chapter.classList.contains("reflection-followup-section") ||
    chapter.classList.contains("reflection-intent-section");
  if (!isDeferredVisualSection) return baseSpeed;

  // Slightly slower cadence for Paint, Chat, and Snake narrative lines.
  return Math.round(baseSpeed * 1.22);
}

function reserveTypedLineHeights(lines) {
  lines.forEach((line) => {
    const text = line.getAttribute("data-text") || "";
    if (!text) return;

    const probe = line.cloneNode(false);
    probe.textContent = text;
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    probe.style.left = "-99999px";
    probe.style.top = "0";
    probe.style.width = `${line.getBoundingClientRect().width}px`;
    probe.style.minHeight = "0";

    document.body.appendChild(probe);
    const measuredHeight = probe.getBoundingClientRect().height;
    document.body.removeChild(probe);

    line.style.minHeight = `${Math.ceil(measuredHeight)}px`;
  });
}

function initJoinForm() {
  const form = document.querySelector(".join-form");
  const input = form?.querySelector('input[type="email"]');
  const status = document.querySelector(".join-success");
  const sendButton = form?.querySelector(".prototype-send-btn");
  if (!form || !input || !status) return;

  const setSubmittedGlow = (submitted) => {
    if (!(sendButton instanceof HTMLButtonElement)) return;
    sendButton.classList.toggle("is-submitted", submitted);
  };

  const googleFormAction = form.dataset.googleFormAction?.trim() || "";
  const googleEntryEmail = form.dataset.googleEntryEmail?.trim() || "";
  const hasGoogleFormConfig =
    googleFormAction.startsWith("https://docs.google.com/forms/") &&
    !googleFormAction.includes("YOUR_FORM_ID") &&
    googleEntryEmail.startsWith("entry.") &&
    !googleEntryEmail.includes("YOUR_EMAIL_FIELD_ID");

  const setStatus = (message, tone) => {
    status.textContent = message;
    status.classList.remove("is-success", "is-error");
    if (tone === "success") {
      status.classList.add("is-success");
    } else if (tone === "error") {
      status.classList.add("is-error");
    }
    status.classList.add("show");
  };

  input.addEventListener("input", () => {
    setSubmittedGlow(false);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!input.checkValidity()) {
      setSubmittedGlow(false);
      setStatus("Please enter a valid email address.", "error");
      return;
    }

    const email = input.value.trim();

    try {
      if (!hasGoogleFormConfig) {
        setSubmittedGlow(false);
        setStatus("Waitlist form is not configured yet.", "error");
        return;
      }

      const payload = new URLSearchParams();
      payload.set(googleEntryEmail, email);

      await fetch(googleFormAction, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: payload.toString(),
      });

      setStatus("You are on the list. We will keep you posted.", "success");
      setSubmittedGlow(true);
      form.reset();
    } catch {
      setSubmittedGlow(false);
      setStatus("Could not submit right now. Please try again.", "error");
    }
  });
}

function initPrototypeConceptStack() {
  const stack = document.querySelector(".prototype-concept-stack");
  if (!(stack instanceof HTMLButtonElement)) return;

  stack.addEventListener("click", () => {
    stack.classList.toggle("is-flipped");
  });
}

function initWaitlistJump(scroller) {
  const link = document.querySelector(".waitlist-link");
  const target = document.querySelector(".chapter.prototype-cta-section");
  if (!(link instanceof HTMLAnchorElement) || !(target instanceof HTMLElement)) return;

  link.addEventListener("click", (event) => {
    event.preventDefault();
    scrollChapterToCenter(scroller, target);
  });
}

function initMissionCounter(scroller) {
  const counter = document.getElementById("missionCount");
  const joinChapter = document.querySelector(".chapter.join");
  if (!counter || !joinChapter) return;

  const start = 312;
  const target = 487;
  const digitCount = Number(counter.dataset.digits || 6);
  const odometer = initOdometer(counter, digitCount);
  setOdometerValue(odometer, start, true);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      animateCounter(odometer, start, target, 4200);
      observer.disconnect();
    },
    { root: scroller, threshold: 0.55 }
  );

  observer.observe(joinChapter);
}

function animateCounter(odometer, from, to, duration) {
  if (to <= from) {
    setOdometerValue(odometer, to);
    return;
  }

  const steps = to - from;
  const baseDelay = Math.max(14, duration / steps);
  let current = from;

  const tick = () => {
    current += 1;
    setOdometerValue(odometer, current);
    if (current >= to) return;
    const jitter = Math.random() * 12;
    window.setTimeout(tick, baseDelay + jitter);
  };

  window.setTimeout(tick, baseDelay);
}

function formatCounter(value, digits = 6) {
  return value.toString().padStart(digits, "0");
}

function initOdometer(root, digits) {
  root.innerHTML = "";
  const reels = [];

  for (let i = 0; i < digits; i += 1) {
    const reel = document.createElement("span");
    reel.className = "digit-reel";

    const track = document.createElement("span");
    track.className = "digit-track instant";
    track.style.transitionDuration = `${170 + (digits - i) * 20}ms`;

    for (let n = 0; n < 20; n += 1) {
      const digit = document.createElement("span");
      digit.className = "digit-char";
      digit.textContent = String(n % 10);
      track.appendChild(digit);
    }

    reel.appendChild(track);
    root.appendChild(reel);
    reels.push({ track, value: 0, resetPending: false });
  }

  return { root, reels, digits };
}

function setOdometerValue(odometer, value, instant = false) {
  const text = formatCounter(value, odometer.digits);
  odometer.reels.forEach((reel, index) => {
    setReelDigit(reel, Number(text[index]), instant);
  });
  odometer.root.setAttribute("aria-label", `${text} people waiting`);
}

function setReelDigit(reel, nextDigit, instant) {
  if (reel.resetPending) return;

  if (instant) {
    reel.value = nextDigit;
    reel.track.classList.add("instant");
    reel.track.style.transform = `translateY(-${nextDigit * 5}%)`;
    return;
  }

  if (nextDigit === reel.value) return;

  reel.track.classList.remove("instant");

  if (nextDigit > reel.value) {
    reel.track.style.transform = `translateY(-${nextDigit * 5}%)`;
    reel.value = nextDigit;
    return;
  }

  // Roll through the bottom when crossing 9 -> 0.
  reel.resetPending = true;
  reel.track.style.transform = `translateY(-${(10 + nextDigit) * 5}%)`;

  const onTransitionEnd = () => {
    reel.track.removeEventListener("transitionend", onTransitionEnd);
    reel.track.classList.add("instant");
    reel.track.style.transform = `translateY(-${nextDigit * 5}%)`;
    reel.value = nextDigit;
    reel.resetPending = false;
  };

  reel.track.addEventListener("transitionend", onTransitionEnd);
}

function getHeroTypingDelay(char) {
  // Live-typing cadence: slower characters, noticeable pauses between words.
  if (char === " ") return 320;
  if (char === "." || char === "," || char === "!" || char === "?") return 420;

  // Small jitter keeps it from feeling robotic.
  const base = 126;
  const jitter = Math.floor(Math.random() * 52); // 0-51ms
  return base + jitter;
}

function getDeliberateTypingDelay(char) {
  // Measured cadence for intentional "someone is typing" feel.
  if (char === " ") return 265;
  if (char === "." || char === "," || char === "!" || char === "?") return 430;

  const base = 124;
  const jitter = Math.floor(Math.random() * 18); // 0-17ms
  return base + jitter;
}

function initInterestTicker(scroller) {
  const cityEl = document.getElementById("interestCity");
  const joinChapter = document.querySelector(".chapter.join");
  if (!cityEl || !joinChapter) return;

  const updates = [
    "PHX just joined",
    "NYC just joined",
    "ATL just joined",
    "LDN just joined",
    "SFO just joined",
    "CHI just joined",
  ];

  let index = 0;
  let intervalId = null;

  const startTicker = () => {
    if (intervalId) return;
    intervalId = window.setInterval(() => {
      index = (index + 1) % updates.length;
      cityEl.textContent = updates[index];
    }, 1800);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startTicker();
      }
    },
    { root: scroller, threshold: 0.55 }
  );

  observer.observe(joinChapter);
}

function initStormIconFallback() {
  const items = document.querySelectorAll(".storm-item");
  if (!items.length) return;

  items.forEach((item) => {
    const img = item.querySelector("img");
    if (!img) return;

    img.addEventListener("error", () => {
      item.classList.add("img-failed");
    });
  });
}

function initStormInteractions() {
  const items = document.querySelectorAll(".storm-item");
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((item) => {
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", "Wiggle notification");

    const triggerWiggle = () => {
      if (prefersReducedMotion || typeof item.animate !== "function") return;
      item.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(-7deg)" },
          { transform: "rotate(6deg)" },
          { transform: "rotate(-5deg)" },
          { transform: "rotate(3deg)" },
          { transform: "rotate(0deg)" },
        ],
        {
          duration: 420,
          easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)",
          composite: "add",
        }
      );
    };

    item.addEventListener("click", triggerWiggle);
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      triggerWiggle();
    });
  });
}

function initNotificationSurge(scroller) {
  const chapter = document.querySelector(".chapter.notification-section");
  const items = chapter ? Array.from(chapter.querySelectorAll(".storm-item")) : [];
  if (!chapter || !items.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timerId = null;
  let running = false;
  let index = 0;

  const clearTimer = () => {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  const reset = () => {
    clearTimer();
    running = false;
    index = 0;
    items.forEach((item) => item.classList.remove("live"));
  };

  const playPop = (item) => {
    if (prefersReducedMotion || typeof item.animate !== "function") return;
    item.animate(
      [
        { transform: "scale(0.86)", offset: 0 },
        { transform: "scale(1.06)", offset: 0.55 },
        { transform: "scale(1)", offset: 1 },
      ],
      {
        duration: 280,
        easing: "cubic-bezier(0.22, 1.2, 0.36, 1)",
      }
    );
  };

  const scheduleNext = () => {
    if (!running) return;
    if (index >= items.length) return;

    const item = items[index];
    item.classList.add("live");
    playPop(item);
    index += 1;

    // Start about 2x faster and ramp up aggressively as the storm grows.
    const progress = index / items.length;
    const ramp = Math.pow(progress, 0.58);
    const nextDelay = Math.max(35, Math.round(320 - ramp * 285));
    timerId = window.setTimeout(scheduleNext, nextDelay);
  };

  const start = () => {
    if (running) return;
    reset();
    running = true;
    scheduleNext();
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        start();
        return;
      }
      reset();
    },
    { root: scroller, threshold: 0.55 }
  );

  observer.observe(chapter);
}

function initMoneyRain(scroller) {
  const chapter = document.querySelector(".consumption-prelude-section");
  const shell = document.getElementById("moneyRainShell");
  const canvas = document.getElementById("moneyRainCanvas");
  if (!(chapter instanceof HTMLElement) || !(shell instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  let inView = false;
  let rafId = 0;
  let lastTime = 0;
  let elapsedSeconds = 0;
  let spawnAccumulator = 0;
  let coins = [];
  let dragCoin = null;
  let pointerId = null;
  let pointerX = 0;
  let pointerY = 0;
  let previousPointerX = 0;
  let previousPointerY = 0;
  let maxCoins = 240;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const syncCanvasSize = () => {
    const rect = shell.getBoundingClientRect();
    const width = Math.max(680, Math.round(rect.width));
    const height = Math.round(width * (8 / 14));
    canvas.width = width;
    canvas.height = height;
    maxCoins = Math.max(186, Math.min(320, Math.floor((width * height) / 2250)));
  };

  const world = () => ({
    width: canvas.width,
    height: canvas.height,
    floor: canvas.height - 6,
    left: 8,
    right: canvas.width - 8,
  });

  const createCoin = () => {
    const { width } = world();
    const radius = 13.5 + Math.random() * 6;
    const chuteHalfWidth = Math.max(26, width * 0.075);
    const chuteCenter = width * 0.5;
    const spawnX = clamp(
      chuteCenter + (Math.random() * 2 - 1) * chuteHalfWidth,
      radius + 8,
      width - radius - 8
    );
    return {
      x: spawnX,
      y: -20 - Math.random() * 32,
      vx: (Math.random() - 0.5) * 20,
      vy: 0,
      r: radius,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.5,
      dragging: false,
      sleeping: false,
      restFrames: 0,
    };
  };

  const resolveWorldBounds = (coin) => {
    const { left, right, floor } = world();

    if (coin.x - coin.r < left) {
      coin.x = left + coin.r;
      coin.vx *= -0.35;
    } else if (coin.x + coin.r > right) {
      coin.x = right - coin.r;
      coin.vx *= -0.35;
    }

    if (coin.y + coin.r > floor) {
      coin.y = floor - coin.r;
      coin.vy *= -0.04;
      coin.vx *= 0.84;
      if (Math.abs(coin.vy) < 10) coin.vy = 0;
      if (Math.abs(coin.vx) < 7) coin.vx = 0;
    }
  };

  const resolvePair = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distanceSq = dx * dx + dy * dy;
    const minDistance = a.r + b.r;
    if (distanceSq === 0 || distanceSq >= minDistance * minDistance) return;

    const distance = Math.sqrt(distanceSq);
    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minDistance - distance;

    if (!a.dragging) {
      a.x -= nx * overlap * 0.5;
      a.y -= ny * overlap * 0.5;
    }
    if (!b.dragging) {
      b.x += nx * overlap * 0.5;
      b.y += ny * overlap * 0.5;
    }

    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;
    const separatingVelocity = rvx * nx + rvy * ny;
    if (separatingVelocity > 0) return;

    const restitution = 0.01;
    const impulse = -(1 + restitution) * separatingVelocity * 0.5;
    if (!a.dragging) {
      a.vx -= impulse * nx;
      a.vy -= impulse * ny;
      a.vx *= 0.94;
      a.vy *= 0.94;
    }
    if (!b.dragging) {
      b.vx += impulse * nx;
      b.vy += impulse * ny;
      b.vx *= 0.94;
      b.vy *= 0.94;
    }

    if (Math.abs(separatingVelocity) > 18) {
      a.sleeping = false;
      b.sleeping = false;
      a.restFrames = 0;
      b.restFrames = 0;
    }
  };

  const resolveCoinCollisions = () => {
    const cellSize = 96;
    const buckets = new Map();
    const keyFor = (cx, cy) => `${cx}:${cy}`;

    for (let i = 0; i < coins.length; i += 1) {
      const coin = coins[i];
      const cx = Math.floor(coin.x / cellSize);
      const cy = Math.floor(coin.y / cellSize);
      const key = keyFor(cx, cy);
      const bucket = buckets.get(key) || [];
      bucket.push(i);
      buckets.set(key, bucket);
    }

    for (let i = 0; i < coins.length; i += 1) {
      const a = coins[i];
      const cx = Math.floor(a.x / cellSize);
      const cy = Math.floor(a.y / cellSize);

      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          const neighbor = buckets.get(keyFor(cx + ox, cy + oy));
          if (!neighbor) continue;
          for (let n = 0; n < neighbor.length; n += 1) {
            const j = neighbor[n];
            if (j <= i) continue;
            resolvePair(a, coins[j]);
          }
        }
      }
    }
  };

  const drawCoin = (coin) => {
    context.save();
    context.translate(coin.x, coin.y);
    context.rotate(coin.rotation);

    const edgeGradient = context.createLinearGradient(-coin.r, -coin.r, coin.r, coin.r);
    edgeGradient.addColorStop(0, "#8b7a4a");
    edgeGradient.addColorStop(0.55, "#aa9660");
    edgeGradient.addColorStop(1, "#6f5f36");

    context.fillStyle = edgeGradient;
    context.beginPath();
    context.arc(0, 0, coin.r, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(189, 174, 134, 0.22)";
    context.beginPath();
    context.arc(-coin.r * 0.28, -coin.r * 0.24, coin.r * 0.38, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#4f4531";
    context.font = `700 ${Math.round(coin.r * 1.05)}px "Segoe UI", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("$", 0, 1);
    context.restore();
  };

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#11161c";
    context.fillRect(0, 0, canvas.width, canvas.height);

    coins.forEach(drawCoin);
  };

  const getSpawnIntervalMs = () => Math.max(30, 720 - elapsedSeconds * 120);
  const getGravity = () => Math.min(860, 240 + elapsedSeconds * 38);

  const stepPhysics = (dtSeconds) => {
    const gravity = getGravity();

    spawnAccumulator += dtSeconds * 1000;
    const spawnInterval = getSpawnIntervalMs();
    while (spawnAccumulator >= spawnInterval && coins.length < maxCoins) {
      spawnAccumulator -= spawnInterval;
      coins.push(createCoin());
    }

    for (let i = 0; i < coins.length; i += 1) {
      const coin = coins[i];
      if (coin.dragging || coin.sleeping) continue;

      coin.vy += gravity * dtSeconds;
      coin.x += coin.vx * dtSeconds;
      coin.y += coin.vy * dtSeconds;
      coin.rotation += coin.spin * dtSeconds;
      coin.vx *= 0.994;
      coin.spin *= 0.98;
      resolveWorldBounds(coin);
    }

    for (let i = 0; i < 2; i += 1) {
      resolveCoinCollisions();
      coins.forEach(resolveWorldBounds);
    }

    const { floor } = world();
    for (let i = 0; i < coins.length; i += 1) {
      const coin = coins[i];
      if (coin.dragging) continue;

      const touchingFloor = Math.abs(coin.y + coin.r - floor) < 1.5;
      const speed = Math.hypot(coin.vx, coin.vy);
      if (touchingFloor && speed < 16) {
        coin.restFrames += 1;
        if (coin.restFrames > 12) {
          coin.sleeping = true;
          coin.vx = 0;
          coin.vy = 0;
          coin.spin = 0;
        }
      } else {
        coin.restFrames = 0;
        if (speed > 24) coin.sleeping = false;
      }
    }
  };

  const frame = (time) => {
    if (!inView) {
      rafId = 0;
      return;
    }

    if (!lastTime) lastTime = time;
    const dt = Math.min(0.032, (time - lastTime) / 1000);
    lastTime = time;
    elapsedSeconds += dt;
    stepPhysics(dt);
    draw();
    rafId = window.requestAnimationFrame(frame);
  };

  const start = () => {
    if (rafId) return;
    lastTime = 0;
    rafId = window.requestAnimationFrame(frame);
  };

  const stop = () => {
    if (!rafId) return;
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const toCanvasPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  canvas.addEventListener("pointerdown", (event) => {
    const point = toCanvasPoint(event);
    for (let i = coins.length - 1; i >= 0; i -= 1) {
      const coin = coins[i];
      const dx = point.x - coin.x;
      const dy = point.y - coin.y;
      if (dx * dx + dy * dy > coin.r * coin.r) continue;

      dragCoin = coin;
      dragCoin.dragging = true;
      dragCoin.sleeping = false;
      dragCoin.restFrames = 0;
      pointerId = event.pointerId;
      pointerX = point.x;
      pointerY = point.y;
      previousPointerX = point.x;
      previousPointerY = point.y;
      canvas.classList.add("dragging");
      canvas.setPointerCapture(pointerId);
      break;
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragCoin || pointerId !== event.pointerId) return;
    const point = toCanvasPoint(event);
    const dtMs = 16;
    dragCoin.vx = (point.x - previousPointerX) / (dtMs / 1000);
    dragCoin.vy = (point.y - previousPointerY) / (dtMs / 1000);
    dragCoin.x = point.x;
    dragCoin.y = point.y;
    previousPointerX = point.x;
    previousPointerY = point.y;
    pointerX = point.x;
    pointerY = point.y;
  });

  const releaseDrag = (event) => {
    if (!dragCoin || pointerId !== event.pointerId) return;
    dragCoin.dragging = false;
    dragCoin.sleeping = false;
    dragCoin.restFrames = 0;
    dragCoin = null;
    canvas.classList.remove("dragging");
    canvas.releasePointerCapture(pointerId);
    pointerId = null;
  };

  canvas.addEventListener("pointerup", releaseDrag);
  canvas.addEventListener("pointercancel", releaseDrag);

  const resetSimulation = () => {
    stop();
    coins = [];
    dragCoin = null;
    pointerId = null;
    spawnAccumulator = 0;
    elapsedSeconds = 0;
    canvas.classList.remove("dragging");
    draw();
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        start();
      } else {
        resetSimulation();
      }
    },
    { root: scroller, threshold: 0.52 }
  );

  observer.observe(chapter);
  syncCanvasSize();
  draw();

  window.addEventListener("resize", () => {
    syncCanvasSize();
    draw();
  });
}

function initReflectionPaint() {
  const canvas = document.getElementById("reflectionCanvas");
  const colorButtons = Array.from(document.querySelectorAll(".paint-color"));
  const toolButtons = Array.from(document.querySelectorAll(".paint-tool"));
  const actionButtons = Array.from(document.querySelectorAll(".paint-action"));
  if (!(canvas instanceof HTMLCanvasElement) || !colorButtons.length || !toolButtons.length) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineJoin = "round";
  context.lineCap = "round";

  const brushWidth = 7;
  const eraserWidth = 18;
  const sprayRadius = 10;
  const sprayDensity = 18;
  let activeColor = colorButtons[0].dataset.color || "#000000";
  let activeTool = "brush";
  let drawing = false;
  let startPoint = null;
  let lastPoint = null;
  let snapshot = null;

  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getStrokeColor = () => (activeTool === "eraser" ? "#ffffff" : activeColor);
  const getLineWidth = () => (activeTool === "eraser" ? eraserWidth : brushWidth);

  const drawLine = (from, to) => {
    context.strokeStyle = getStrokeColor();
    context.lineWidth = getLineWidth();
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  };

  const drawSpray = (point) => {
    context.fillStyle = getStrokeColor();
    for (let i = 0; i < sprayDensity; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * sprayRadius;
      const x = point.x + Math.cos(angle) * radius;
      const y = point.y + Math.sin(angle) * radius;
      context.fillRect(x, y, 1.8, 1.8);
    }
  };

  const drawShapePreview = (point) => {
    if (!snapshot || !startPoint) return;
    context.putImageData(snapshot, 0, 0);
    context.strokeStyle = getStrokeColor();
    context.lineWidth = getLineWidth();

    if (activeTool === "line") {
      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      return;
    }

    const left = Math.min(startPoint.x, point.x);
    const top = Math.min(startPoint.y, point.y);
    const width = Math.abs(point.x - startPoint.x);
    const height = Math.abs(point.y - startPoint.y);

    if (activeTool === "ellipse") {
      context.beginPath();
      context.ellipse(left + width / 2, top + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      context.stroke();
    }
  };

  const hexToRgba = (hex) => {
    const normalized = hex.replace("#", "");
    if (normalized.length !== 6) return [0, 0, 0, 255];
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return [r, g, b, 255];
  };

  const colorsMatch = (data, index, target, tolerance = 8) => {
    return (
      Math.abs(data[index] - target[0]) <= tolerance &&
      Math.abs(data[index + 1] - target[1]) <= tolerance &&
      Math.abs(data[index + 2] - target[2]) <= tolerance &&
      Math.abs(data[index + 3] - target[3]) <= tolerance
    );
  };

  const floodFill = (startPointFill) => {
    const startX = Math.max(0, Math.min(canvas.width - 1, Math.floor(startPointFill.x)));
    const startY = Math.max(0, Math.min(canvas.height - 1, Math.floor(startPointFill.y)));
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = image.data;
    const stride = canvas.width * 4;
    const startIndex = startY * stride + startX * 4;
    const targetColor = [data[startIndex], data[startIndex + 1], data[startIndex + 2], data[startIndex + 3]];
    const replacement = hexToRgba(getStrokeColor());

    if (
      targetColor[0] === replacement[0] &&
      targetColor[1] === replacement[1] &&
      targetColor[2] === replacement[2] &&
      targetColor[3] === replacement[3]
    ) {
      return;
    }

    const stack = [[startX, startY]];
    while (stack.length) {
      const current = stack.pop();
      if (!current) continue;
      const [x, y] = current;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

      const index = y * stride + x * 4;
      if (!colorsMatch(data, index, targetColor)) continue;

      data[index] = replacement[0];
      data[index + 1] = replacement[1];
      data[index + 2] = replacement[2];
      data[index + 3] = replacement[3];

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    context.putImageData(image, 0, 0);
  };

  const setActiveColor = (nextColor, button) => {
    activeColor = nextColor;
    colorButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  };

  const setActiveTool = (nextTool, button) => {
    activeTool = nextTool;
    toolButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    canvas.style.cursor = nextTool === "eraser" ? "cell" : "crosshair";
  };

  colorButtons.forEach((button) => {
    const nextColor = button.dataset.color;
    if (!nextColor) return;
    button.addEventListener("click", () => {
      setActiveColor(nextColor, button);
    });
  });

  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const startStroke = (event) => {
    drawing = true;
    const point = getPoint(event);
    startPoint = point;
    lastPoint = point;

    if (activeTool === "fill") {
      floodFill(point);
      drawing = false;
      lastPoint = null;
      startPoint = null;
      snapshot = null;
    } else if (activeTool === "line" || activeTool === "ellipse") {
      snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
    } else if (activeTool === "spray") {
      drawSpray(point);
    } else {
      drawLine(point, point);
    }
    event.preventDefault();
  };

  const moveStroke = (event) => {
    if (!drawing || !lastPoint) return;
    const point = getPoint(event);

    if (activeTool === "line" || activeTool === "ellipse") {
      drawShapePreview(point);
      return;
    }

    if (activeTool === "spray") {
      drawSpray(point);
    } else {
      drawLine(lastPoint, point);
    }
    lastPoint = point;
  };

  const endStroke = () => {
    drawing = false;
    lastPoint = null;
    startPoint = null;
    snapshot = null;
  };

  canvas.addEventListener("mousedown", startStroke);
  canvas.addEventListener("mousemove", moveStroke);
  canvas.addEventListener("mouseup", endStroke);
  canvas.addEventListener("mouseleave", endStroke);

  toolButtons.forEach((button) => {
    const nextTool = button.dataset.tool;
    if (!nextTool) return;
    button.addEventListener("click", () => {
      setActiveTool(nextTool, button);
    });
  });

  actionButtons.forEach((button) => {
    if (button.dataset.action !== "clear") return;
    button.addEventListener("click", () => {
      clearCanvas();
    });
  });
}

function initBuddyChat() {
  const form = document.getElementById("aimChatForm");
  const input = document.getElementById("aimChatInput");
  const log = document.getElementById("aimChatLog");
  if (!(form instanceof HTMLFormElement) || !(input instanceof HTMLInputElement) || !(log instanceof HTMLElement)) return;

  const conversation = [
    { role: "assistant", content: "Hey, you're online. Want to chat?" },
  ];

  const appendMessage = (role, content) => {
    const line = document.createElement("p");
    line.className = `aim-line ${role === "user" ? "aim-line-outgoing" : "aim-line-incoming"}`;

    const name = document.createElement("span");
    name.className = "aim-name";
    name.textContent = role === "user" ? "You:" : "Anthony:";

    const text = document.createElement("span");
    text.className = "aim-text";
    text.textContent = content;

    line.append(name, text);
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  };

  const setPending = (pending) => {
    input.disabled = pending;
    const submit = form.querySelector('button[type="submit"]');
    if (submit instanceof HTMLButtonElement) {
      submit.disabled = pending;
      submit.textContent = pending ? "..." : "Send";
    }
  };

  const getReplyDelayMs = (message) => {
    // Mimic a human response pace: short pause + small read/typing time.
    const contentLength = message.length;
    const readAndType = Math.min(1700, contentLength * 14);
    const base = 700;
    const jitter = Math.floor(Math.random() * 260);
    return base + readAndType + jitter;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    conversation.push({ role: "user", content: text });
    input.value = "";
    setPending(true);

    try {
      const response = await fetch("/api/buddy-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.slice(-12),
        }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat endpoint not found. If deployed, add a backend route at `/api/buddy-chat` (for Vercel, create `api/buddy-chat.js`).");
        }
        const serverMessage = typeof payload?.error === "string" ? payload.error : "Unable to reach chat service.";
        throw new Error(serverMessage);
      }

      const reply = (payload.reply || "").trim();
      if (!reply) {
        throw new Error("Empty response from chat service.");
      }

      await delay(getReplyDelayMs(reply));
      appendMessage("assistant", reply);
      conversation.push({ role: "assistant", content: reply });
    } catch (error) {
      const fallback = error instanceof Error ? error.message : "Buddy Chat is offline right now. Please try again in a moment.";
      await delay(getReplyDelayMs(fallback));
      appendMessage("assistant", fallback);
      conversation.push({ role: "assistant", content: fallback });
    } finally {
      setPending(false);
      input.focus();
    }
  });
}

function initReflectionSnake(scroller) {
  const chapter = document.querySelector(".reflection-intent-section");
  const canvas = document.getElementById("reflectionSnakeCanvas");
  const scoreEl = document.getElementById("reflectionSnakeScore");
  if (!(chapter instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const cols = 40;
  const rows = 24;
  const cell = 18;
  const boardWidth = cols * cell;
  const boardHeight = rows * cell;
  canvas.width = boardWidth;
  canvas.height = boardHeight;

  let snake = [];
  let direction = { x: 1, y: 0 };
  let pendingDirection = { x: 1, y: 0 };
  let food = { x: 30, y: 6 };
  let score = 0;
  let loopId = null;
  let inView = false;

  const updateScore = () => {
    if (scoreEl) {
      scoreEl.textContent = `Score: ${score}`;
    }
  };

  const randomFood = () => {
    let attempts = 0;
    while (attempts < 500) {
      attempts += 1;
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      const blockedBySnake = snake.some((segment) => segment.x === x && segment.y === y);
      if (blockedBySnake) continue;
      return { x, y };
    }
    return { x: 2, y: 2 };
  };

  const resetGame = () => {
    snake = [
      { x: 7, y: 12 },
      { x: 6, y: 12 },
      { x: 5, y: 12 },
      { x: 4, y: 12 },
    ];
    direction = { x: 1, y: 0 };
    pendingDirection = { x: 1, y: 0 };
    score = 0;
    updateScore();
    food = randomFood();
    draw();
  };

  const drawGrid = () => {
    context.fillStyle = "#f7fafc";
    context.fillRect(0, 0, boardWidth, boardHeight);
    context.strokeStyle = "rgba(42, 46, 49, 0.08)";
    context.lineWidth = 1;
    for (let x = 0; x <= cols; x += 1) {
      context.beginPath();
      context.moveTo(x * cell + 0.5, 0);
      context.lineTo(x * cell + 0.5, boardHeight);
      context.stroke();
    }
    for (let y = 0; y <= rows; y += 1) {
      context.beginPath();
      context.moveTo(0, y * cell + 0.5);
      context.lineTo(boardWidth, y * cell + 0.5);
      context.stroke();
    }
  };

  const drawSnake = () => {
    snake.forEach((segment, index) => {
      context.fillStyle = index === 0 ? "#1d5f9e" : "#2f7bc0";
      context.fillRect(segment.x * cell + 1, segment.y * cell + 1, cell - 2, cell - 2);
    });
  };

  const drawFood = () => {
    context.fillStyle = "#e87a2f";
    context.beginPath();
    context.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.32, 0, Math.PI * 2);
    context.fill();
  };

  const draw = () => {
    drawGrid();
    drawFood();
    drawSnake();
  };

  const tick = () => {
    direction = pendingDirection;
    const head = snake[0];
    const wrap = (value, max) => (value + max) % max;
    const next = {
      x: wrap(head.x + direction.x, cols),
      y: wrap(head.y + direction.y, rows),
    };

    const hitSelf = snake.some((segment) => segment.x === next.x && segment.y === next.y);

    if (hitSelf) {
      resetGame();
      return;
    }

    snake.unshift(next);
    if (next.x === food.x && next.y === food.y) {
      score += 1;
      updateScore();
      food = randomFood();
    } else {
      snake.pop();
    }

    draw();
  };

  const setDirection = (x, y) => {
    if (x === -direction.x && y === -direction.y) return;
    pendingDirection = { x, y };
  };

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (!chapter.classList.contains("active")) return;

    if (key === "arrowup" || key === "w") {
      event.preventDefault();
      setDirection(0, -1);
    } else if (key === "arrowdown" || key === "s") {
      event.preventDefault();
      setDirection(0, 1);
    } else if (key === "arrowleft" || key === "a") {
      event.preventDefault();
      setDirection(-1, 0);
    } else if (key === "arrowright" || key === "d") {
      event.preventDefault();
      setDirection(1, 0);
    }
  });

  const isPlayable = () => inView && chapter.classList.contains("active");

  const startLoop = () => {
    if (loopId) return;
    loopId = window.setInterval(tick, 120);
  };

  const stopLoop = () => {
    if (!loopId) return;
    window.clearInterval(loopId);
    loopId = null;
  };

  const syncLoop = () => {
    if (isPlayable()) {
      startLoop();
      return;
    }
    stopLoop();
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      syncLoop();
    },
    { root: scroller, threshold: 0.45 }
  );

  observer.observe(chapter);

  const classObserver = new MutationObserver(() => {
    syncLoop();
  });

  classObserver.observe(chapter, {
    attributes: true,
    attributeFilter: ["class"],
  });

  resetGame();
}

function initScreenTimeFan(scroller) {
  const stacks = Array.from(document.querySelectorAll(".screen-time-stack"));
  if (!stacks.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  stacks.forEach((stack) => {
    const chapter = stack.closest(".chapter");
    let introPlayed = false;
    let buildupPlayed = false;

    const bigTime = stack.querySelector(".big-time");
    const bars = Array.from(stack.querySelectorAll(".week-bars i"));
    const lowBarHeight = 16;
    const targetMinutes = 9 * 60 + 42;
    const targetBarHeights = [72, 82, 78, 88, 86, 96, 90];

    const easeOut = (value) => 1 - Math.pow(1 - value, 3);
    const clamp01 = (value) => Math.max(0, Math.min(1, value));
    const formatTime = (totalMinutes) => {
      const safeMinutes = Math.max(0, Math.round(totalMinutes));
      const hours = Math.floor(safeMinutes / 60);
      const minutes = safeMinutes % 60;
      return `${hours}h ${String(minutes).padStart(2, "0")}m`;
    };

    const applyProgress = (progress) => {
      const safeProgress = clamp01(progress);
      if (bigTime instanceof HTMLElement) {
        bigTime.textContent = formatTime(targetMinutes * safeProgress);
      }

      bars.forEach((bar, index) => {
        const barProgress = clamp01(safeProgress * bars.length - index);
        const eased = easeOut(barProgress);
        const target = targetBarHeights[index] ?? 78;
        const nextHeight = lowBarHeight + (target - lowBarHeight) * eased;
        bar.style.height = `${nextHeight.toFixed(1)}%`;
      });
    };

    const animateBuildup = () => {
      if (buildupPlayed) return;
      buildupPlayed = true;

      if (prefersReducedMotion) {
        applyProgress(1);
        return;
      }

      stack.classList.add("counting-up");
      const duration = 3600;
      const start = performance.now();

      const frame = (now) => {
        const elapsed = now - start;
        const progress = clamp01(elapsed / duration);
        applyProgress(progress);

        if (progress < 1) {
          window.requestAnimationFrame(frame);
          return;
        }

        stack.classList.remove("counting-up");
      };

      window.requestAnimationFrame(frame);
    };

    // Start from zero so the rise-up sequence reads clearly.
    applyProgress(0);

    if (scroller && chapter && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;

          if (!introPlayed) {
            introPlayed = true;

            stack.classList.add("fanned");
            stack.setAttribute("aria-expanded", "true");

            window.setTimeout(() => {
              stack.classList.remove("fanned");
              stack.setAttribute("aria-expanded", "false");
            }, 1250);
          }

          animateBuildup();

          if (introPlayed && buildupPlayed) {
            observer.disconnect();
          }
        },
        { root: scroller, threshold: 0.55 }
      );

      observer.observe(chapter);
    } else {
      applyProgress(1);
    }

    const toggleFan = () => {
      const willExpand = !stack.classList.contains("fanned");
      stack.classList.toggle("fanned", willExpand);
      stack.setAttribute("aria-expanded", willExpand ? "true" : "false");
    };

    stack.addEventListener("click", toggleFan);
    stack.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleFan();
    });
  });
}

function initConsumptionNotifications(scroller) {
  const chapter = document.querySelector(".chapter.consumption-section");
  if (!(chapter instanceof HTMLElement)) return;

  let armed = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || armed) return;
      armed = true;
      chapter.classList.add("notes-live");
      observer.disconnect();
    },
    { root: scroller, threshold: 0.52 }
  );

  observer.observe(chapter);
}

function initLockscreenFeed() {
  const feed = document.querySelector(".consumption-section .lockscreen-notifications");
  if (!(feed instanceof HTMLElement)) return;

  const listNotes = () => Array.from(feed.querySelectorAll(".lockscreen-note"));
  let busy = false;

  const updateTimes = () => {
    listNotes().forEach((note, index) => {
      const time = note.querySelector("time");
      if (!(time instanceof HTMLElement)) return;
      time.textContent = index === 0 ? "now" : `${index}m`;
    });
  };

  const animateShift = (beforeTopByNote) => {
    listNotes().forEach((note) => {
      const previousTop = beforeTopByNote.get(note);
      if (typeof previousTop !== "number") return;
      const nextTop = note.getBoundingClientRect().top;
      const delta = previousTop - nextTop;
      if (Math.abs(delta) < 0.5) return;
      note.animate(
        [
          { transform: `translateY(${delta}px)` },
          { transform: "translateY(0)" },
        ],
        {
          duration: 260,
          easing: "cubic-bezier(0.2, 0.82, 0.24, 1)",
        }
      );
    });
  };

  const recycleNote = (note) => {
    if (busy || !(note instanceof HTMLElement)) return;
    busy = true;

    const beforeTopByNote = new Map(listNotes().map((item) => [item, item.getBoundingClientRect().top]));
    note.classList.add("removing");

    window.setTimeout(() => {
      note.classList.remove("removing");
      feed.appendChild(note);
      animateShift(beforeTopByNote);
      updateTimes();
      busy = false;
    }, 220);
  };

  listNotes().forEach((note) => {
    note.setAttribute("tabindex", "0");
  });

  feed.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const note = target.closest(".lockscreen-note");
    recycleNote(note);
  });

  feed.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const note = target.closest(".lockscreen-note");
    if (!(note instanceof HTMLElement)) return;
    event.preventDefault();
    recycleNote(note);
  });

  updateTimes();
}

function initLookUpPigeon(scroller) {
  const chapter = document.querySelector(".chapter.look-up-break");
  if (!(chapter instanceof HTMLElement)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (chapter.classList.contains("pigeon-arrive")) return;
        chapter.classList.add("pigeon-arrive");
        return;
      }

      chapter.classList.remove("pigeon-arrive");
    },
    { root: scroller, threshold: 0.52 }
  );

  observer.observe(chapter);
}

function initProductPigeon(scroller) {
  const chapter = document.querySelector(".chapter.product");
  if (!(chapter instanceof HTMLElement)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (chapter.classList.contains("product-pigeon-arrive")) return;
        chapter.classList.add("product-pigeon-arrive");
        return;
      }

      chapter.classList.remove("product-pigeon-arrive");
    },
    { root: scroller, threshold: 0.52 }
  );

  observer.observe(chapter);
}

function initBlankBreakPigeon(scroller) {
  const chapter = document.querySelector(".chapter.blank-break");
  if (!(chapter instanceof HTMLElement)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (chapter.classList.contains("pigeon-crossing")) return;
        chapter.classList.add("pigeon-crossing");
        return;
      }
      chapter.classList.remove("pigeon-crossing");
    },
    { root: scroller, threshold: 0.52 }
  );

  observer.observe(chapter);
}

function initShiftPigeon(scroller) {
  const chapter = document.querySelector(".chapter.reflection-shift-section");
  const pigeon = document.getElementById("pixelPigeon");
  if (!(chapter instanceof HTMLElement)) return;

  let inView = false;

  const startIfReady = () => {
    if (!inView) return;
    if (!chapter.classList.contains("visual-ready")) return;
    if (chapter.classList.contains("pigeon-live")) return;
    chapter.classList.add("pigeon-live");
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        startIfReady();
        return;
      }

      // Reset so the sequence can replay on re-entry.
      chapter.classList.remove("pigeon-live");
    },
    { root: scroller, threshold: 0.52 }
  );

  observer.observe(chapter);

  const classObserver = new MutationObserver(() => {
    startIfReady();
  });

  classObserver.observe(chapter, {
    attributes: true,
    attributeFilter: ["class"],
  });

  if (pigeon instanceof HTMLElement) {
    pigeon.addEventListener("animationend", (event) => {
      if (event.animationName === "pigeonFlyOut") {
        chapter.classList.remove("pigeon-live");
      }
    });
  }
}

function initPigeonWiggle() {
  const pigeons = Array.from(document.querySelectorAll(".pixel-pigeon, .perched-pigeon"));
  if (!pigeons.length) return;

  const clearAndReplayWiggle = (pigeon) => {
    pigeon.classList.remove("pigeon-wiggle");
    // Force reflow so rapid clicks can replay the wiggle.
    void pigeon.offsetWidth;
    pigeon.classList.add("pigeon-wiggle");
    window.setTimeout(() => {
      pigeon.classList.remove("pigeon-wiggle");
    }, 360);
  };

  const isBusy = (pigeon) => {
    if (pigeon.classList.contains("is-arriving") || pigeon.classList.contains("fly-off")) {
      return true;
    }

    const lookUp = pigeon.closest(".look-up-break");
    if (pigeon.classList.contains("look-up-pigeon") && lookUp?.classList.contains("pigeon-arrive")) {
      return true;
    }

    const shiftChapter = pigeon.closest(".reflection-shift-section");
    if (pigeon.id === "pixelPigeon" && shiftChapter?.classList.contains("pigeon-live")) {
      return true;
    }

    return false;
  };

  pigeons.forEach((pigeon) => {
    pigeon.addEventListener("click", () => {
      if (isBusy(pigeon)) return;
      clearAndReplayWiggle(pigeon);
    });
  });
}

function initPerchedPigeonArrivals(scroller) {
  const targetSections = [
    ".chapter.reflection-section",
    ".chapter.reflection-followup-section",
    ".chapter.reflection-intent-section",
  ];

  targetSections.forEach((selector) => {
    const chapter = document.querySelector(selector);
    const perched = chapter?.querySelector(".perched-pigeon");
    if (!(chapter instanceof HTMLElement) || !(perched instanceof HTMLElement)) return;

    let inView = false;
    let arrivalTimerId = null;

    const clearArrivalTimer = () => {
      if (!arrivalTimerId) return;
      window.clearTimeout(arrivalTimerId);
      arrivalTimerId = null;
    };

    const triggerArrival = () => {
      if (!inView) return;
      if (!chapter.classList.contains("visual-ready")) return;
      if (arrivalTimerId) return;
      if (perched.classList.contains("is-arriving") || perched.classList.contains("is-landed")) return;
      perched.classList.remove("fly-off");
      // Let the visual settle for a beat before the bird enters.
      arrivalTimerId = window.setTimeout(() => {
        if (!inView) return;
        perched.classList.add("is-arriving");
        arrivalTimerId = null;
      }, 3000);
    };

    perched.addEventListener("animationend", (event) => {
      if (event.animationName === "perchedArrive") {
        perched.classList.remove("is-arriving");
        perched.classList.add("is-landed");
      }
      if (event.animationName === "perchedFlyOff") {
        perched.classList.remove("fly-off");
      }
    });

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          triggerArrival();
          return;
        }

        // Reset state to replay arrival on re-entry.
      clearArrivalTimer();
        perched.classList.remove("is-arriving", "is-landed", "fly-off");
      },
      { root: scroller, threshold: 0.52 }
    );

    viewObserver.observe(chapter);

    const classObserver = new MutationObserver(() => {
      triggerArrival();
    });

    classObserver.observe(chapter, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });
}

function initChapterAdvance(scroller) {
  const chapters = Array.from(scroller.querySelectorAll("[data-chapter]"));
  if (chapters.length < 2) return;

  chapters.forEach((chapter, index) => {
    const nextChapter = chapters[index + 1];
    const existingCta = chapter.querySelector(".chapter-cta");

    if (!nextChapter) {
      existingCta?.remove();
      return;
    }

    const cta = existingCta || buildChapterCta();
    if (!existingCta) {
      chapter.appendChild(cta);
    }

    cta.addEventListener("click", () => {
      if (!chapter.classList.contains("cta-ready")) return;
      markForwardNavIntent();
      scrollChapterToCenter(scroller, nextChapter);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== "NumpadEnter") return;
    if (isEditingField(event.target)) return;

    const activeIndex = chapters.findIndex((chapter) => chapter.classList.contains("active"));
    if (activeIndex < 0) return;
    const activeChapter = chapters[activeIndex];
    if (!activeChapter || !activeChapter.classList.contains("cta-ready")) return;

    const nextChapter = chapters[activeIndex + 1];
    if (!nextChapter) return;

    event.preventDefault();
    markForwardNavIntent();
    scrollChapterToCenter(scroller, nextChapter);
  });
}

function markForwardNavIntent(durationMs = 900) {
  navIntentState.forwardUntil = Date.now() + durationMs;
}

function hasForwardNavIntent() {
  return Date.now() <= navIntentState.forwardUntil;
}

function triggerPerchedPigeonFlyOff(chapter) {
  if (!(chapter instanceof HTMLElement)) return;
  const perched = chapter.querySelector(".perched-pigeon");
  if (!(perched instanceof HTMLElement)) return;
  if (!perched.classList.contains("is-landed")) return;
  perched.classList.remove("is-arriving", "is-landed");
  perched.classList.add("fly-off");
}

function resetPerchedPigeonIfPresent(chapter) {
  if (!(chapter instanceof HTMLElement)) return;
  const perched = chapter.querySelector(".perched-pigeon");
  if (!(perched instanceof HTMLElement)) return;
  perched.classList.remove("fly-off");
}

function initChapterCtaReadiness(scroller) {
  const chapters = Array.from(scroller.querySelectorAll("[data-chapter]"));
  if (chapters.length < 2) return;

  chapters.forEach((chapter, index) => {
    const hasNext = Boolean(chapters[index + 1]);
    if (!hasNext) return;
    setupChapterCtaReadiness(chapter, scroller);
  });
}

const GLOBAL_CTA_BEAT_MS = 460;

function setupChapterCtaReadiness(chapter, scroller) {
  if (!(chapter instanceof HTMLElement)) return;

  let started = false;
  let completed = false;
  let observer = null;

  const runSequence = async () => {
    if (started || completed) return;
    started = true;

    await waitForChapterTyping(chapter);
    const holdMs = getChapterCtaHoldMs(chapter);
    if (holdMs > 0) {
      await delay(holdMs);
    }
    await delay(GLOBAL_CTA_BEAT_MS);

    completed = true;
    chapter.classList.add("cta-ready");
    if (observer) observer.disconnect();
  };

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      runSequence();
    },
    { root: scroller, threshold: 0.5 }
  );

  observer.observe(chapter);
}

function waitForChapterTyping(chapter) {
  const lines = Array.from(chapter.querySelectorAll(".type-line[data-text]"));
  if (!lines.length) return Promise.resolve();

  const isComplete = () => lines.every((line) => line.classList.contains("done"));
  if (isComplete()) return Promise.resolve();

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (!isComplete()) return;
      observer.disconnect();
      resolve();
    });

    lines.forEach((line) => {
      observer.observe(line, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    // Failsafe in case a line was skipped by an interrupted animation.
    window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 12000);
  });
}

function getChapterCtaHoldMs(chapter) {
  if (chapter.classList.contains("notification-section")) {
    const itemCount = chapter.querySelectorAll(".storm-item").length;
    return estimateNotificationSurgeMs(itemCount);
  }

  if (chapter.classList.contains("consumption-section")) {
    const noteCount = chapter.querySelectorAll(".lockscreen-note").length;
    const initialDelay = 120;
    const stepDelay = 340;
    const finalStagger = noteCount > 0 ? initialDelay + (noteCount - 1) * stepDelay : 0;
    const dropDuration = 720;
    return finalStagger + dropDuration + 120;
  }

  if (chapter.classList.contains("consumption-prelude-section")) {
    // Coin rain starts slow and accelerates until the container fills.
    return 8200;
  }

  if (chapter.classList.contains("logon-intro")) {
    return 820;
  }

  if (
    chapter.classList.contains("reflection-section") ||
    chapter.classList.contains("reflection-followup-section") ||
    chapter.classList.contains("reflection-intent-section")
  ) {
    return 760;
  }

  if (chapter.classList.contains("reflection-shift-section")) {
    // Longer dramatic sequence: scan, face viewer, quick turn, then powerful fly-out.
    return 6400;
  }

  if (chapter.classList.contains("look-up-break")) {
    return 1880;
  }

  if (chapter.classList.contains("blank-break")) {
    return 2520;
  }

  if (
    chapter.classList.contains("attention-break") ||
    chapter.classList.contains("monetization-break") ||
    chapter.classList.contains("keep-scrolling-break")
  ) {
    return 420;
  }

  return 220;
}

function estimateNotificationSurgeMs(itemCount) {
  if (!itemCount) return 0;
  let total = 0;

  for (let index = 1; index <= itemCount; index += 1) {
    const progress = index / itemCount;
    const ramp = Math.pow(progress, 0.58);
    const nextDelay = Math.max(35, Math.round(320 - ramp * 285));
    total += nextDelay;
  }

  // Include pop-in settle time for the last card.
  return total + 280;
}

function buildChapterCta() {
  const cta = document.createElement("button");
  cta.type = "button";
  cta.className = "chapter-cta";
  cta.setAttribute("aria-label", "Press Enter to continue");

  const key = document.createElement("span");
  key.className = "logon-key";
  key.textContent = "enter";

  const text = document.createElement("span");
  text.className = "logon-cta-text";
  text.textContent = "to Continue";

  cta.append(key, text);
  return cta;
}

function isEditingField(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function scrollChapterToCenter(scroller, chapter) {
  const chapterTop = chapter.offsetTop;
  const centeredTop = chapterTop - (scroller.clientHeight - chapter.offsetHeight) / 2;
  const maxTop = scroller.scrollHeight - scroller.clientHeight;
  const clampedTop = Math.max(0, Math.min(centeredTop, Math.max(0, maxTop)));

  scroller.scrollTo({
    top: clampedTop,
    behavior: "smooth",
  });
}
