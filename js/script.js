document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════
    //   MOBILE NAV
    // ═══════════════════════════════════════
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('open');
            })
        );
    }

    // ═══════════════════════════════════════
    //   SCROLL REVEAL (IntersectionObserver)
    // ═══════════════════════════════════════
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            entry.target.querySelectorAll('.reveal-child').forEach((child, i) => {
                setTimeout(() => child.classList.add('visible'), 120 * i);
            });
            revealObs.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ═══════════════════════════════════════
    //   STAT COUNTER
    // ═══════════════════════════════════════
    const statNums = document.querySelectorAll('.stat-number[data-target]');
    let counted = false;
    const statsEl = document.getElementById('stats');
    if (statsEl) {
        const sObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    statNums.forEach(num => {
                        const target = +num.dataset.target;
                        const dur = 1600, start = performance.now();
                        const step = (now) => {
                            const p = Math.min((now - start) / dur, 1);
                            const e = 1 - Math.pow(1 - p, 3);
                            num.textContent = Math.floor(e * target);
                            if (p < 1) requestAnimationFrame(step);
                            else { num.textContent = target; num.classList.add('counted'); }
                        };
                        requestAnimationFrame(step);
                    });
                    sObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        sObs.observe(statsEl);
    }

    // ═══════════════════════════════════════
    //   HERO PARALLAX
    // ═══════════════════════════════════════
    const heroFrame = document.querySelector('.hero-frame');
    if (heroFrame) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const sy = window.scrollY;
                    if (sy < window.innerHeight * 1.2) {
                        heroFrame.style.transform = `translateY(${sy * 0.12}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════
    //   NAV SHADOW ON SCROLL
    // ═══════════════════════════════════════
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.style.boxShadow = window.scrollY > 40 ? '0 4px 0 #1A1A1A' : 'none';
        }, { passive: true });
    }

    // ═══════════════════════════════════════
    //   GEOMETRIC CLICK BURST
    // ═══════════════════════════════════════
    const PALETTE = ['#A8DADC', '#F4A261', '#2A9D8F', '#1A1A1A'];

    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('a, button, input, textarea, select, canvas')) return;

        // Expanding square ring
        const ring = document.createElement('div');
        ring.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:12px;height:12px;border:2px solid #1A1A1A;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)`;
        document.body.appendChild(ring);
        ring.animate([
            { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 0.6 },
            { transform: 'translate(-50%,-50%) scale(6) rotate(45deg)', opacity: 0 }
        ], { duration: 500, easing: 'ease-out' }).onfinish = () => ring.remove();

        // Particles
        for (let i = 0; i < 7; i++) {
            const el = document.createElement('div');
            const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            const size = 5 + Math.random() * 8;
            const angle = (360 / 7) * i + (Math.random() * 20 - 10);
            const dist = 30 + Math.random() * 50;
            const rot = Math.random() * 360;
            const rad = angle * Math.PI / 180;
            const dx = Math.cos(rad) * dist, dy = Math.sin(rad) * dist;
            const isCircle = Math.random() < 0.4;
            el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;background:${color};border:1px solid #1A1A1A;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)${isCircle ? ';border-radius:50%' : ''}`;
            document.body.appendChild(el);
            el.animate([
                { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.3) rotate(${rot}deg)`, opacity: 0 }
            ], { duration: 400 + Math.random() * 200, easing: 'cubic-bezier(0,0.8,0.4,1)' }).onfinish = () => el.remove();
        }
    });

    // ═══════════════════════════════════════
    //   TABS SYSTEM
    // ═══════════════════════════════════════
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === target) {
                    panel.classList.add('active');
                    // Re-trigger reveal for newly visible cards
                    panel.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
                }
            });
        });
    });

    // ═══════════════════════════════════════
    //   NETWORK CANVAS
    // ═══════════════════════════════════════
    const canvas = document.getElementById('networkCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const wrap = canvas.parentElement;
        const colors = ['#A8DADC', '#F4A261', '#2A9D8F'];
        const dots = [];
        let W, H;

        function resize() {
            W = wrap.clientWidth;
            H = wrap.clientHeight;
            canvas.width = W * devicePixelRatio;
            canvas.height = H * devicePixelRatio;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }

        function init() {
            resize();
            const count = Math.min(60, Math.floor((W * H) / 8000));
            dots.length = 0;
            for (let i = 0; i < count; i++) {
                dots.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    r: 1.5 + Math.random() * 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    pulse: 0
                });
            }
        }

        const MAX_DIST = 130;
        let animId;
        let isVisible = false;

        function draw() {
            ctx.clearRect(0, 0, W, H);

            // Update positions
            for (const d of dots) {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0) d.x = W;
                if (d.x > W) d.x = 0;
                if (d.y < 0) d.y = H;
                if (d.y > H) d.y = 0;
                if (Math.random() < 0.003) d.pulse = 1;
                if (d.pulse > 0) d.pulse = Math.max(0, d.pulse - 0.015);
            }

            // Lines between nearby dots
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(168, 218, 220, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Draw dots
            for (const d of dots) {
                const r = d.r + d.pulse * 4;
                ctx.beginPath();
                ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
                ctx.globalAlpha = 0.35 + d.pulse * 0.65;
                ctx.fillStyle = d.color;
                ctx.fill();
                if (d.pulse > 0.4) {
                    ctx.strokeStyle = '#1A1A1A';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }

            if (isVisible) animId = requestAnimationFrame(draw);
        }

        // Only animate when in viewport
        const netObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    draw();
                } else {
                    isVisible = false;
                    cancelAnimationFrame(animId);
                }
            });
        }, { threshold: 0.05 });

        init();
        netObs.observe(canvas.parentElement.parentElement);

        // Debounced resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(init, 200);
        });
    }

    // ═══════════════════════════════════════
    //   CONTACT FORM (mailto)
    // ═══════════════════════════════════════
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const toast = document.getElementById('toast');

    function showToast(msg, dur = 3000) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), dur);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const n = form.name.value.trim();
            const em = form.email.value.trim();
            const s = form.subject.value.trim();
            const m = form.message.value.trim();
            if (!n || !em || !s || !m) { showToast('Please fill in all fields.'); return; }
            const body = `Name: ${n}%0AEmail: ${em}%0A%0A${encodeURIComponent(m)}`;
            window.open(`mailto:rayen@bahroun.com?subject=${encodeURIComponent(s)}&body=${body}`, '_blank');
            form.style.display = 'none';
            success.classList.add('show');
            showToast('Opening your email client...');
        });
    }

});
