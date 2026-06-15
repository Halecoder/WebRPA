/* ============================================================
   WebRPA 官网交互脚本（纯原生 JS，无依赖）
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 导航：滚动加背景 ---------- */
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 12);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('navMobile');
  function closeMenu() {
    if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    if (navMobile) navMobile.classList.remove('open');
  }
  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      var open = navMobile.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 回到顶部 ---------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 滚动揭示 ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          // 同组子元素错落出现
          var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.querySelectorAll(':scope > .reveal')) : [el];
          var idx = siblings.indexOf(el);
          var delay = idx > 0 ? Math.min(idx * 60, 360) : 0;
          setTimeout(function () { el.classList.add('in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 数字滚动 ---------- */
  function animateCount(el) {
    var text = el.getAttribute('data-text');
    if (text) { el.textContent = text; return; }
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var dur = 1500, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  var nums = Array.prototype.slice.call(document.querySelectorAll('.stat__num'));
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io2.observe(el); });
  } else {
    nums.forEach(animateCount);
  }

  /* ---------- 聊天逐条显示 ---------- */
  var chatBody = document.getElementById('chatBody');
  if (chatBody) {
    var msgs = Array.prototype.slice.call(chatBody.querySelectorAll('.msg'));
    var typing = document.querySelector('.chat__type');
    function playChat() {
      msgs.forEach(function (m) { m.classList.remove('show'); });
      if (typing) typing.classList.remove('hide');
      var i = 0;
      function next() {
        if (i >= msgs.length) { if (typing) typing.classList.add('hide'); return; }
        msgs[i].classList.add('show');
        i++;
        setTimeout(next, 1100);
      }
      setTimeout(next, 500);
    }
    if (prefersReduced) {
      msgs.forEach(function (m) { m.classList.add('show'); });
      if (typing) typing.classList.add('hide');
    } else if ('IntersectionObserver' in window) {
      var io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { playChat(); io3.unobserve(e.target); } });
      }, { threshold: 0.4 });
      io3.observe(chatBody);
    } else { playChat(); }
  }

  /* ---------- 界面截图切换 + 自动轮播 ---------- */
  var shot = document.querySelector('.shot');
  if (shot) {
    var imgs = Array.prototype.slice.call(shot.querySelectorAll('.shot__img'));
    var thumbs = Array.prototype.slice.call(shot.querySelectorAll('.shot__thumb'));
    var cur = 0, timer = null;
    function setShot(i) {
      if (i === cur) return;
      cur = i;
      imgs.forEach(function (m, k) { m.classList.toggle('is-active', k === i); });
      thumbs.forEach(function (t, k) { t.classList.toggle('is-active', k === i); });
    }
    function nextShot() { setShot((cur + 1) % imgs.length); }
    function startAuto() { if (!prefersReduced && !timer) timer = setInterval(nextShot, 4200); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () { setShot(parseInt(t.getAttribute('data-i'), 10) || 0); stopAuto(); startAuto(); });
    });
    shot.addEventListener('mouseenter', stopAuto);
    shot.addEventListener('mouseleave', startAuto);
    if ('IntersectionObserver' in window) {
      var io4 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) startAuto(); else stopAuto(); });
      }, { threshold: 0.25 });
      io4.observe(shot);
    } else { startAuto(); }
  }

  /* ---------- 年份兜底（页脚） ---------- */
  // 静态站点，保持简单，无需额外逻辑

})();
