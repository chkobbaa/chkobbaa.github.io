// ============================================
// MODERN CREATIVE PORTFOLIO - SCRIPTS
// ============================================

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksAll = document.querySelectorAll('.nav-links a');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canUseCustomCursor = window.matchMedia('(hover: hover) and (min-width: 768px)').matches && !prefersReducedMotion;

if (canUseCustomCursor) {
    document.body.classList.add('custom-cursor-enabled');
}

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.querySelector('i').classList.toggle('fa-bars');
    hamburger.querySelector('i').classList.toggle('fa-times');
    const isExpanded = navLinks.classList.contains('active');
    hamburger.setAttribute('aria-expanded', String(isExpanded));
    hamburger.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
});

// Close mobile menu when clicking a link
navLinksAll.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.add('fa-bars');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
    });
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.prepend(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// ============================================
// HEADER EFFECTS
// ============================================

const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// ============================================
// MOTION SYSTEM
// ============================================

const motionEasing = (t) => 1 - Math.pow(1 - t, 3);
const MOTION = {
    fast: 200,
    medium: 400,
    slow: 700
};

// ============================================
// SMOOTH SCROLLING (Enhanced with custom easing)
// ============================================

function smoothScrollTo(targetPosition, duration = MOTION.slow) {
    if (prefersReducedMotion) {
        window.scrollTo(0, targetPosition);
        return;
    }
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = motionEasing(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            smoothScrollTo(targetPosition, MOTION.slow);
        }
    });
});

// ============================================
// SCROLL-LINKED REVEAL SYSTEM (rAF)
// ============================================

const revealSections = Array.from(document.querySelectorAll('[data-reveal]'));

revealSections.forEach(section => {
    const children = section.querySelectorAll('[data-reveal-child]');
    children.forEach((child, index) => {
        child.style.setProperty('--i', index);
    });
});

let lastScrollY = -1;
let lastViewportH = -1;

function updateReveals() {
    const vh = window.innerHeight || 0;
    const start = vh * 0.85;
    const end = vh * 0.35;

    revealSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const raw = (start - rect.top) / (start - end);
        const clamped = Math.min(Math.max(raw, 0), 1);
        const eased = motionEasing(clamped);
        section.style.setProperty('--reveal', eased);
    });
}

function scrollLinkedLoop() {
    if (prefersReducedMotion) {
        revealSections.forEach(section => section.style.setProperty('--reveal', '1'));
        return;
    }

    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    const currentVh = window.innerHeight || 0;

    if (currentScroll !== lastScrollY || currentVh !== lastViewportH) {
        lastScrollY = currentScroll;
        lastViewportH = currentVh;
        updateReveals();
    }

    requestAnimationFrame(scrollLinkedLoop);
}

window.addEventListener('load', () => {
    updateReveals();
    requestAnimationFrame(scrollLinkedLoop);
});

// ============================================
// TYPING ANIMATION FOR HERO
// ============================================

const heroTitle = document.querySelector('.hero-text h1 span');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    if (prefersReducedMotion) {
        heroTitle.textContent = originalText;
    } else {
        heroTitle.textContent = '';
        let charIndex = 0;

        function typeText() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, MOTION.fast);
            }
        }

        // Start typing after a small delay
        setTimeout(typeText, MOTION.fast);
    }
}

// ============================================
// MAGNETIC BUTTON EFFECT (Desktop only)
// ============================================

if (window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// CURSOR-AWARE TILT (Desktop only)
// ============================================

if (canUseCustomCursor) {
    const tiltCards = document.querySelectorAll('.project-card, .skill-card');
    const maxTilt = 5;

    tiltCards.forEach(card => {
        let rafId = null;
        let targetX = 0;
        let targetY = 0;

        card.classList.add('tilt-card');

        const updateTilt = () => {
            const rotateX = -targetY * maxTilt;
            const rotateY = targetX * maxTilt;
            card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
            rafId = null;
        };

        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            targetX = Math.max(Math.min(relX, 0.5), -0.5) * 2;
            targetY = Math.max(Math.min(relY, 0.5), -0.5) * 2;

            if (!rafId) {
                rafId = requestAnimationFrame(updateTilt);
            }
        });

        card.addEventListener('pointerleave', () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) {
                rafId = requestAnimationFrame(updateTilt);
            }
        });
    });
}

// ============================================
// FOOTER YEAR
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// CONTACT FORM
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Add loading state to button
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate sending (replace with actual form submission)
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, MOTION.slow);
        }, MOTION.slow);
    });

    // Floating label effect for inputs
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// ============================================
// DARK/LIGHT MODE TOGGLE
// ============================================

const themeToggle = document.querySelector('.theme-toggle');
const icon = themeToggle.querySelector('i');
const text = themeToggle.querySelector('span');

// Check for saved theme preference or use preferred color scheme
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
        text.textContent = 'Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
        text.textContent = 'Dark Mode';
    }
}

// Initialize theme
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    setTheme(true);
}

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
    }
});

// ============================================
// PARALLAX EFFECT FOR HERO (subtle)
// ============================================

const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image img');

if (window.matchMedia('(hover: hover)').matches && heroImage && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// ============================================
// CREATE FLOATING SHAPES IN HERO
// ============================================

function createFloatingShapes() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';

    for (let i = 1; i <= 3; i++) {
        const shape = document.createElement('div');
        shape.className = `shape shape-${i}`;
        shapesContainer.appendChild(shape);
    }

    heroSection.appendChild(shapesContainer);
}
if (!prefersReducedMotion) {
    createFloatingShapes();
}

// ============================================
// PRELOADER (Optional - shows brief loading state)
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Trigger initial animations
    if (!prefersReducedMotion) {
        setTimeout(() => {
            document.querySelectorAll('.hero-text, .hero-image').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, MOTION.fast);
    } else {
        document.querySelectorAll('.hero-text, .hero-image').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
});

// Initial state for hero elements
document.querySelectorAll('.hero-text, .hero-image').forEach(el => {
    if (!prefersReducedMotion) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
});
// ============================================
// CURSOR GLOW EFFECT (Desktop only)
// ============================================

if (canUseCustomCursor) {
    document.body.classList.add('custom-cursor-enabled');
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow with lag for subtle effect
    function animateGlow() {
        const speed = 0.06;

        glowX += (mouseX - glowX) * speed;
        glowY += (mouseY - glowY) * speed;

        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// ============================================
// CUSTOM ANIMATED CURSOR
// ============================================

if (canUseCustomCursor) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Dot follows immediately
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';

            // Ring follows with lag
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .tech-pill, .social-links a');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }
}

// ============================================
// PARALLAX FLOATING ELEMENTS
// ============================================

const parallaxShapes = document.querySelectorAll('.parallax-shape');

if (parallaxShapes.length > 0 && window.matchMedia('(min-width: 768px)').matches && !prefersReducedMotion) {
    const speeds = [0.02, 0.03, 0.015, 0.025, 0.02];

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        parallaxShapes.forEach((shape, index) => {
            const speed = speeds[index] || 0.02;
            const yPos = scrollY * speed * (index % 2 === 0 ? 1 : -1);
            const xPos = scrollY * speed * 0.5 * (index % 2 === 0 ? -1 : 1);

            shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });
}

// ============================================
// ANIMATED STATS COUNTER
// ============================================

const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    if (prefersReducedMotion) {
        element.textContent = target;
        return;
    }
    const duration = MOTION.slow;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Use Intersection Observer to trigger counter when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// SCROLL INDICATOR HIDE ON SCROLL
// ============================================

const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });

    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#stats') || document.querySelector('#about');
        if (aboutSection) {
            smoothScrollTo(aboutSection.offsetTop - 80, MOTION.slow);
        }
    });
}

// ============================================
// MAGNETIC BUTTON EFFECT (Enhanced)
// ============================================

if (window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// TECH PILLS HOVER SOUND (Optional visual feedback)
// ============================================

if (!prefersReducedMotion) {
    document.querySelectorAll('.tech-pill').forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            pill.style.transform = 'translateY(-5px) scale(1.05)';
        });

        pill.addEventListener('mouseleave', () => {
            pill.style.transform = 'translateY(0) scale(1)';
        });
    });
}


// ============================================
// WORD-LEVEL GLITCH EFFECT
// ============================================

function wrapWordsWithGlitch() {
    // Target all text-containing elements (exclude inputs, scripts, etc.)
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li, button, label');

    textElements.forEach(element => {
        // Skip if already processed or has special classes
        if (element.classList.contains('glitch-processed') ||
            element.classList.contains('stat-number') ||
            element.classList.contains('gradient-text') ||
            element.closest('.tech-pill') ||
            element.closest('script') ||
            element.closest('style') ||
            element.closest('.about-text h3') ||
            element.closest('.project-info') ||
            element.closest('.skill-card h3') ||
            element.closest('.contact-info h3') ||
            element.querySelector('img')) {
            return;
        }

        // Get direct text nodes only
        const childNodes = Array.from(element.childNodes);

        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                const words = node.textContent.split(/(\s+)/);
                const fragment = document.createDocumentFragment();

                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.className = 'glitch-word';
                        span.textContent = word;
                        fragment.appendChild(span);
                    } else {
                        fragment.appendChild(document.createTextNode(word));
                    }
                });

                node.parentNode.replaceChild(fragment, node);
            }
        });

        element.classList.add('glitch-processed');
    });
}

if (!prefersReducedMotion) {
    // Initialize word wrapping
    wrapWordsWithGlitch();

    // Add glitch trigger on hover - animation completes even if mouse leaves
    document.addEventListener('mouseenter', (e) => {
        if (e.target.classList.contains('glitch-word') && !e.target.classList.contains('glitching')) {
            e.target.classList.add('glitching');

            // Remove class after animation completes (0.4s)
            setTimeout(() => {
                e.target.classList.remove('glitching');
            }, 400);
        }
    }, true);
}

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
