const app = document.getElementById('app');

async function mount() {
  try {
    const url = `/.netlify/functions/app?ts=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (!res.ok) throw new Error('로드 실패');
    const html = await res.text();
    app.innerHTML = html;
    app.style.display = 'block';
    app.style.visibility = "visible";
    document.querySelector(".noscript-container").style.visibility = "hidden";
    if (typeof boot === 'function') boot();
    document.getElementById("footer").classList.remove('hidden');
  } catch (err) {
    app.innerHTML = '<p style="color:red;text-align:center">콘텐츠를 불러오지 못했습니다.</p>';
    app.style.display = 'block';
    console.error(err);
  }
}

function boot() {
  const guideBtn     = document.getElementById("guideBtn");
  const popupCard    = document.getElementById("popupCard");
  const noticeSlider = document.getElementById("noticeSlider");
  const toast        = document.getElementById("toast");
  const statusDot    = document.getElementById('status-dot');
  const statusText   = document.getElementById('status-text');
  const statusGuide  = document.getElementById('status-guide');
  const recheckBtn   = document.getElementById('recheck-btn');

  const has = (...els) => els.every(Boolean);

  function generateRandomString(len){
    const chars='abcdefghijklmnopqrstuvwxyz0123456789';
    let out=''; for (let i=0;i<len;i++) out+=chars[Math.floor(Math.random()*chars.length)];
    return out;
  }
  async function checkDnsStatus() {
    if (!has(statusDot, statusText, statusGuide)) return;
    statusDot.className = 'w-4 h-4 rounded-full bg-yellow-500 transition-colors animate-pulse';
    statusText.textContent = '확인 중...';
    statusText.className = 'text-lg font-bold text-yellow-400';
    statusGuide.classList.add('hidden');

    const verificationHost = `${generateRandomString(32)}.t.e.s.t.onetwohour.com`;
    let ok = false;
    try {
      const r = await fetch(`https://${verificationHost}/check`, { cache:'no-store' });
      if (r.ok) {
        const data = await r.json();
        ok = data && data.dns === 'dns.onetwohour.com';
      }
    } catch {}

    statusDot.classList.remove('animate-pulse');
    if (ok) {
      statusDot.className = 'w-4 h-4 rounded-full bg-green-500 transition-colors';
      statusText.textContent = 'Onet DNS 사용 중';
      statusText.className = 'text-lg font-bold text-green-400';
    } else {
      statusDot.className = 'w-4 h-4 rounded-full bg-red-500 transition-colors';
      statusText.textContent = 'Onet DNS 미사용';
      statusText.className = 'text-lg font-bold text-red-400';
      statusGuide.classList.remove('hidden');
    }
  }
  if (recheckBtn) recheckBtn.addEventListener('click', checkDnsStatus);
  checkDnsStatus();

  if (noticeSlider) {
    let currentSlide = 0;
    let slideInterval = null;
    const slides = Array.from(noticeSlider.children);
    const totalSlides = slides.length;
    const container = document.querySelector('#notice-slider-container > .relative');

    function getSlideHeight(i) {
        const slide = slides[i];
        const card = slide?.firstElementChild || slide;
        return Math.round(card?.getBoundingClientRect?.().height || card?.offsetHeight || 0);
    }

    function setContainerHeight(px) {
        if (container) container.style.height = px + 'px';
    }

    function updateSliderPosition() {
        noticeSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        requestAnimationFrame(() => setContainerHeight(getSlideHeight(currentSlide)));
    }

    function slide(direction) {
        currentSlide =
        direction === 'next'
            ? (currentSlide + 1) % totalSlides
            : (currentSlide - 1 + totalSlides) % totalSlides;

        updateSliderPosition();
    }

    function startSlider() {
        stopSlider();
        slideInterval = setInterval(() => slide('next'), 5000);
    }

    function stopSlider() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = null;
    }

    function initHeightsOnce() {
        if (!totalSlides) return;
        setContainerHeight(getSlideHeight(currentSlide));
        requestAnimationFrame(() => {
        if (container) container.classList.add('transition-[height]', 'duration-300');
        });
    }

    const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
        requestAnimationFrame(() => {
        initHeightsOnce();
        updateSliderPosition();
        startSlider();
        });
    });

    slides.forEach(slide => {
        const imgs = slide.querySelectorAll('img');
        imgs.forEach(img => {
        if (img.complete) return;
        img.addEventListener('load', () => {
            if (slides[currentSlide] === slide) setContainerHeight(getSlideHeight(currentSlide));
        });
        });
    });

    let resizeRAF;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeRAF);
        resizeRAF = requestAnimationFrame(() => setContainerHeight(getSlideHeight(currentSlide)));
    });

    const sliderWrap = document.getElementById('notice-slider-container');
    if (sliderWrap) {
        sliderWrap.addEventListener('mouseenter', stopSlider);
        sliderWrap.addEventListener('mouseleave', startSlider);
    }

    window.slide = slide;
  }

  function openPopup(){ if (popupCard) popupCard.style.display = "flex"; }
  function closePopup(){ if (popupCard) popupCard.style.display = "none"; }
  if (guideBtn) guideBtn.addEventListener("click", openPopup);
  window.openPopup = openPopup;
  window.closePopup = closePopup;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.add("hidden"));
      const pane = document.getElementById(btn.dataset.target);
      if (pane) pane.classList.remove("hidden");
    });
  });

  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove("opacity-0","bottom-0");
    toast.classList.add("opacity-100","bottom-8");
    toastTimer = setTimeout(() => {
      toast.classList.remove("opacity-100","bottom-8");
      toast.classList.add("opacity-0","bottom-0");
    }, 2000);
  }
  function handleCopy(el) {
    const textToCopy = el?.dataset?.copy;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('복사됨!');
      const originalContent = el.innerHTML;
      const originalClasses = el.className;
      if (el.tagName === 'BUTTON') {
        el.classList.add('bg-green-500','text-white');
        el.classList.remove('bg-slate-700','hover:bg-slate-600');
        el.disabled = true;
      } else if (el.tagName === 'CODE') {
        el.classList.add('text-sky-400');
        el.classList.remove('text-emerald-400');
      }
      setTimeout(() => {
        el.innerHTML = originalContent;
        el.className = originalClasses;
        if (el.tagName === 'BUTTON') el.disabled = false;
      }, 2000);
    }).catch(err => {
      console.error('복사 실패:', err);
      showToast('복사에 실패했습니다.');
    });
  }
  document.body.addEventListener('click', (event) => {
    const target = event.target.closest('.copy-btn, .copy-btn-text, .copy-dns');
    if (target) handleCopy(target);
  });

  async function checkPing(host, timeout = 5000) {
    const url = `https://${host}/${Math.random().toString(36).slice(2)}`;
    const start = performance.now();
    try {
      await Promise.race([
        fetch(url, { method:'GET', mode:'no-cors', cache:'no-store' }),
        new Promise((_, reject) => setTimeout(reject, timeout, new Error("timeout"))),
      ]);
      return { ok: true,  rtt: performance.now() - start };
    } catch {
      return { ok: false, rtt: performance.now() - start };
    }
  }
  async function updatePingStatus(ms, prefix) {
    const dot  = document.getElementById("ping-dot-" + prefix);
    const text = document.getElementById("ping-state-" + prefix);
    if (!dot || !text) return;
    dot.classList.toggle('bg-green-500', ms.ok);
    dot.classList.toggle('bg-red-500', !ms.ok);
    text.textContent = ms.ok ? "On" : "Off";
  }
  async function pingLoop(prefix) {
    const target = `${prefix}.dns.onetwohour.com`;
    async function loop() {
      const latency = await checkPing(target);
      updatePingStatus(latency, prefix);
      const delay = latency.ok ? 60_000 : 5_000;
      setTimeout(loop, delay);
    }
    loop();
  }
  ["one","two"].forEach(pingLoop);

  function createSpan(ch) {
    if (ch === ".") {
      const dot = document.createElement("span");
      dot.className = "decimal-dot";
      dot.textContent = ".";
      return dot;
    }
    const group = document.createElement("span");
    group.className = "digit-group";
    const stack = document.createElement("span");
    stack.className = "digit-stack";
    for (let n=0;n<10;n++){
      const s = document.createElement("span");
      s.textContent = n;
      stack.appendChild(s);
    }
    group.appendChild(stack);
    return group;
  }
  function updateRollingNumber(el, value, fixed = 1) {
    if (!el) return;
    const isInt = Number(value) % 1 === 0;
    const strValue = isInt ? String(value) : Number(value).toFixed(fixed);
    const chars = [...strValue];
    if (el.children.length !== chars.length) {
      el.innerHTML = "";
      chars.forEach(ch => el.appendChild(createSpan(ch)));
    }
    const digitGroups = el.querySelectorAll(".digit-group");
    const unit = el.querySelector(".digit-stack span")?.getBoundingClientRect().height || 0;
    if (unit === 0) return;
    let i = 0;
    for (const char of chars) {
      if (char === ".") continue;
      if (i < digitGroups.length) {
        const stack = digitGroups[i++].firstElementChild;
        stack.style.transform = `translateY(-${+char * unit}px)`;
      }
    }
  }
  async function updateDnsStats() {
    try {
      const res = await fetch("/.netlify/functions/stats", { cache: "no-store" });
      if (!res.ok) return;
      const { queries, blocked, ratio } = await res.json();
      updateRollingNumber(document.getElementById("dns-total"),   queries);
      updateRollingNumber(document.getElementById("dns-blocked"), blocked);
      updateRollingNumber(document.getElementById("dns-ratio"),   ratio, 1);
    } catch (e) {
      console.error("Failed to fetch DNS stats:", e);
    }
  }
  updateDnsStats();
  setInterval(updateDnsStats, 2000);
}

window.addEventListener('DOMContentLoaded', mount);
