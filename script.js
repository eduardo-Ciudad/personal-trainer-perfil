(function () {
    'use strict';

    /* ---- Header scroll effect ---- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ---- Scroll-to-top button ---- */
    const scrollUpBtn = document.getElementById('scrollUp');
    window.addEventListener('scroll', () => {
        scrollUpBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    /* ---- Scroll suave no iOS (fallback para browsers sem suporte nativo) ---- */
    if (!('scrollBehavior' in document.documentElement.style)) {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function (e) {
                const t = document.querySelector(this.getAttribute('href'));
                if (t) { e.preventDefault(); t.scrollIntoView({ block: 'start' }); }
            });
        });
    }

    /* ---- IntersectionObserver: fade-up on scroll ---- */
    /* Threshold menor no mobile para disparar animações mais cedo */
    const isMobile = window.innerWidth < 640;
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                fadeObserver.unobserve(e.target);
            }
        });
    }, { threshold: isMobile ? 0.06 : 0.12, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    /* ---- Animated number counters ---- */
    function animateCount(el, target, ms) {
        const step = target / (ms / 16);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(timer);
        }, 16);
    }

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.done) {
                e.target.dataset.done = '1';
                animateCount(e.target, parseInt(e.target.dataset.target), 1600);
                countObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.count').forEach(el => countObserver.observe(el));

    /* ---- Urgency countdown (persists within session) ---- */
    (function startCountdown() {
        const KEY = 'rc_cta_end';
        let end = parseInt(sessionStorage.getItem(KEY) || '0');
        if (!end || end < Date.now()) {
            end = Date.now() + (23 * 3600 + 59 * 60 + 59) * 1000;
            sessionStorage.setItem(KEY, end);
        }

        const elH = document.getElementById('cd-h');
        const elM = document.getElementById('cd-m');
        const elS = document.getElementById('cd-s');

        function tick() {
            const rem = Math.max(0, end - Date.now());
            const h = Math.floor(rem / 3600000);
            const m = Math.floor((rem % 3600000) / 60000);
            const s = Math.floor((rem % 60000) / 1000);
            elH.textContent = String(h).padStart(2, '0');
            elM.textContent = String(m).padStart(2, '0');
            elS.textContent = String(s).padStart(2, '0');
        }

        tick();
        setInterval(tick, 1000);
    })();

    /* ---- Sticky pill: fade out after 6 s ---- */
    const pill = document.getElementById('sticker-pill');
    if (pill) {
        setTimeout(() => {
            pill.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            pill.style.opacity = '0';
            pill.style.transform = 'translateX(10px)';
            setTimeout(() => pill.remove(), 500);
        }, 6000);
    }

    /* ---- Smooth anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
