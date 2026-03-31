/* ========================================================================
   Kintello GmbH — Website v2 Hybrid — JavaScript
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* === INTRO SCREEN === */
    const intro = document.getElementById('introScreen');
    if (intro) {
        setTimeout(() => intro.classList.add('done'), 1800);
        setTimeout(() => { if (intro.parentNode) intro.remove(); }, 2400);
    }

    /* === SCROLL PROGRESS BAR === */
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                progressBar.style.transform = `scaleX(${scrollTop / docHeight})`;
            }
        }, { passive: true });
    }

    /* === NAV SCROLL DETECTION === */
    const nav = document.getElementById('navbar');
    if (nav) {
        const onScroll = () => {
            if (window.scrollY > 60) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* === FULLSCREEN MENU === */
    const menuBtn = document.getElementById('menuBtn');
    const fsMenu = document.getElementById('fullscreenMenu');
    if (menuBtn && fsMenu) {
        const menuLinks = fsMenu.querySelectorAll('[data-menu-link]');

        const setMenuState = (isOpen) => {
            menuBtn.classList.toggle('active', isOpen);
            menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            fsMenu.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            document.body.classList.toggle('menu-open', isOpen);
            if (nav) {
                nav.classList.toggle('menu-open', isOpen);
            }
        };

        const markActiveMenuLink = () => {
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            const currentHash = window.location.hash || '';

            let hasExactMatch = false;

            menuLinks.forEach((link) => {
                const href = link.getAttribute('href') || '';
                const [rawFile, rawHash] = href.split('#');
                const targetFile = rawFile || 'index.html';
                const targetHash = rawHash ? `#${rawHash}` : '';

                const exactMatch = currentFile === 'index.html'
                    ? targetFile === 'index.html' && targetHash && targetHash === currentHash
                    : targetFile === currentFile && !targetHash;

                if (exactMatch) {
                    hasExactMatch = true;
                }
            });

            menuLinks.forEach((link) => {
                const href = link.getAttribute('href') || '';
                const [rawFile, rawHash] = href.split('#');
                const targetFile = rawFile || 'index.html';
                const targetHash = rawHash ? `#${rawHash}` : '';

                const exactMatch = currentFile === 'index.html'
                    ? targetFile === 'index.html' && targetHash && targetHash === currentHash
                    : targetFile === currentFile && !targetHash;

                const fallbackHome = !hasExactMatch && currentFile === 'index.html' && targetFile === 'index.html' && targetHash === '#services';

                link.classList.toggle('is-current', exactMatch || fallbackHome);
            });
        };

        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.addEventListener('click', () => {
            setMenuState(!fsMenu.classList.contains('open'));
        });
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                setMenuState(false);
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && fsMenu.classList.contains('open')) {
                setMenuState(false);
            }
        });

        markActiveMenuLink();
        window.addEventListener('hashchange', markActiveMenuLink);
    }

    /* === SUBPAGE STICKY CTA === */
    const path = window.location.pathname;
    const isHome = /\/(index\.html)?$/.test(path);
    const isLegalPage = /impressum\.html$|datenschutz\.html$/i.test(path);

    if (!isHome && !isLegalPage) {
        const stickyCta = document.createElement('a');
        stickyCta.href = 'https://outlook.office365.com/book/KintelloGmbH@kintello.de/';
        stickyCta.target = '_blank';
        stickyCta.rel = 'noopener';
        stickyCta.className = 'sticky-consult-cta';
        stickyCta.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
            </svg>
            <span>Kostenlose Erstberatung</span>
        `;
        document.body.appendChild(stickyCta);
    }

    /* === GSAP SCROLL ANIMATIONS === */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Scroll-animate elements — use fromTo so end-state opacity:1 overrides CSS opacity:0
        gsap.utils.toArray('.scroll-animate:not(.service-card):not(.process-step-dark):not(.stat-item)').forEach((el) => {
            gsap.fromTo(el,
                { y: 40, opacity: 0, filter: 'blur(4px)' },
                {
                    y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                    onComplete: () => el.classList.add('in-view')
                }
            );
        });

        // Dark process steps — stepPop with stagger
        const processSteps = gsap.utils.toArray('.process-step-dark');
        if (processSteps.length) {
            gsap.fromTo(processSteps,
                { y: 60, opacity: 0, scale: 0.92, filter: 'blur(6px)' },
                {
                    y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.13, ease: 'back.out(1.4)',
                    scrollTrigger: { trigger: '.process-dark .process-grid', start: 'top 80%', once: true }
                }
            );
        }

        // Service cards stagger
        const serviceCards = gsap.utils.toArray('.service-card');
        if (serviceCards.length) {
            gsap.fromTo(serviceCards,
                { y: 50, opacity: 0, rotateX: 4 },
                {
                    y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true }
                }
            );
        }

        // Hero blobs subtle parallax
        const blob1 = document.querySelector('.hero-blob-1');
        const blob2 = document.querySelector('.hero-blob-2');
        if (blob1 && blob2) {
            gsap.to(blob1, {
                y: -80,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
            gsap.to(blob2, {
                y: -50,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        // Stats counter trigger via GSAP
        const statItems = gsap.utils.toArray('.stat-item');
        if (statItems.length) {
            gsap.fromTo(statItems,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
                    scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true }
                }
            );
        }

    } else {
        // Fallback: IntersectionObserver for scroll-animate
        const scrollEls = document.querySelectorAll('.scroll-animate');
        if (scrollEls.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            scrollEls.forEach(el => observer.observe(el));
        }
    }

    /* === COUNTER ANIMATION === */
    const counters = document.querySelectorAll('[data-target]');
    if (counters.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const isDecimal = el.dataset.display === 'decimal';
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* === TYPEWRITER EFFECT === */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const words = [
            'Unternehmen resilient.',
            'IT ausfallsicher.',
            'Team KI-ready.',
            'Prozesse automatisiert.',
        ];
        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 40;
        const pauseEnd = 2200;
        const pauseStart = 400;

        function typewrite() {
            const current = words[wordIdx];
            if (!isDeleting) {
                typedEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    setTimeout(() => { isDeleting = true; typewrite(); }, pauseEnd);
                    return;
                }
                setTimeout(typewrite, typeSpeed);
            } else {
                typedEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    isDeleting = false;
                    wordIdx = (wordIdx + 1) % words.length;
                    setTimeout(typewrite, pauseStart);
                    return;
                }
                setTimeout(typewrite, deleteSpeed);
            }
        }
        setTimeout(typewrite, 1200);
    }

    /* === FAQ ACCORDION === */
    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
});
