// Bascule de thème clair / sombre
const themeToggle = document.querySelector('.theme-toggle');
const applyThemeState = (theme) => {
    if (!themeToggle) return;
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
};
applyThemeState(document.documentElement.getAttribute('data-theme') || 'light');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        applyThemeState(next);
    });
}

// Suit le thème système si l'utilisateur n'a jamais choisi manuellement
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
systemThemeQuery.addEventListener('change', (event) => {
    if (localStorage.getItem('theme')) return;
    const next = event.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    applyThemeState(next);
});

// Scroll reveal - cascade échelonnée par groupe (grille de cartes, liste, etc.)
const revealSelectors = '.section-heading, .about-description, .info-item, .about-principles, .skill-category, .learning-strip, .projects-filter, .project-card, .timeline-item, .quality-card, .opportunity-card, .contact-item, .contact-form';
const revealGroupCounts = new Map();
document.querySelectorAll(revealSelectors).forEach(element => {
    const parent = element.parentElement;
    const count = revealGroupCounts.get(parent) || 0;
    element.style.setProperty('--delay', String(Math.min(count * 70, 420)));
    revealGroupCounts.set(parent, count + 1);
});
const revealElements = document.querySelectorAll(revealSelectors);
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
revealElements.forEach(element => revealObserver.observe(element));

// Barre de progression de lecture
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${Math.min(percent, 100)}%`;
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();
}

// Année courante
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Menu mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.getElementById('header');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Ouvrir le menu');
        });
    });
}

// Défilement fluide
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
});

// Effet du header au scroll
const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 80);
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Navigation active selon la section visible
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

// Filtres des projets
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(item => item.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach((card, index) => {
            const matches = filter === 'all' || card.dataset.category === filter;
            if (!matches) {
                card.classList.add('is-hidden');
                return;
            }
            card.classList.remove('is-hidden');
            if (!reduceMotion) {
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = `filterReveal .45s ease ${index * 0.04}s both`;
            }
        });
    });
});

// Parallax léger du Hero - conservé, mais désactivé si l'utilisateur réduit les animations
const hero = document.querySelector('.hero');
if (hero && !reduceMotion) {
    window.addEventListener('scroll', () => {
        const offset = Math.min(window.scrollY * 0.12, 80);
        hero.style.setProperty('--hero-shift', `${offset}px`);
    }, { passive: true });
}

// Curseur personnalisé - conservé sur les appareils qui le permettent
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (cursor && cursorFollower && finePointer && !reduceMotion) {
    document.addEventListener('mousemove', event => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        cursorFollower.style.left = `${event.clientX}px`;
        cursorFollower.style.top = `${event.clientY}px`;
    });
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    document.querySelectorAll('a, button, .project-card, .filter-btn').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('is-hovering');
            cursorFollower.classList.add('is-hovering');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-hovering');
            cursorFollower.classList.remove('is-hovering');
        });
    });
}

// Animation d'introduction du greeting, conservée
const greeting = document.querySelector('.greeting');
if (greeting && !reduceMotion) {
    const originalText = greeting.textContent;
    greeting.textContent = '';
    let index = 0;
    const typeWriter = () => {
        if (index < originalText.length) {
            greeting.textContent += originalText.charAt(index++);
            window.setTimeout(typeWriter, 45);
        }
    };
    window.setTimeout(typeWriter, 700);
}

// Formulaire : envoi réel via Web3Forms + option WhatsApp
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const whatsappBtn = document.getElementById('whatsappSend');
const WHATSAPP_NUMBER = '2290160393906';

const getFormValues = () => ({
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim(),
});

const showStatus = (text, type) => {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = 'form-status ' + type;
};

const setFormLoading = isLoading => {
    if (!contactForm) return;
    contactForm.classList.toggle('is-loading', isLoading);

    contactForm.querySelectorAll('input, textarea, button').forEach(el => {
        el.disabled = isLoading;
    });

    if (isLoading) {
        submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Envoi en cours…';
    } else {
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Envoyer le message';
    }
};

if (contactForm) {
    contactForm.addEventListener('submit', async event => {
        event.preventDefault();
        const { name, email, subject, message } = getFormValues();
        if (!name || !email || !subject || !message) {
            showStatus('Merci de remplir tous les champs.', 'error');
            return;
        }

        const accessKey = contactForm.querySelector('input[name="access_key"]').value;
        if (!accessKey || accessKey === 'VOTRE_CLE_WEB3FORMS_ICI') {
            showStatus('Envoi par e-mail non configuré pour le moment - utilise WhatsApp ou ricardovonoupro@gmail.com en direct.', 'error');
            return;
        }

        setFormLoading(true);
        showStatus('', '');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
            });
            const result = await response.json();
            if (result.success) {
                showStatus('Message envoyé, merci ! Je te réponds au plus vite.', 'success');
                contactForm.reset();
            } else {
                showStatus("Une erreur est survenue. Écris-moi directement à ricardovonoupro@gmail.com.", 'error');
            }
        } catch (error) {
            showStatus("Connexion impossible. Écris-moi directement à ricardovonoupro@gmail.com.", 'error');
        } finally {
            setFormLoading(false);
        }
    });
}

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        const { name, email, subject, message } = getFormValues();
        if (!name || !email || !subject || !message) {
            showStatus('Remplis le formulaire avant d\'envoyer sur WhatsApp.', 'error');
            return;
        }
        const text = `Bonjour Ricardo,\n\nNom : ${name}\nEmail : ${email}\nSujet : ${subject}\n\n${message}`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener');
    });
}

/* ---------------------------------------------------
   Protection des images (clic droit + glisser-déposer)
   --------------------------------------------------- */
const PROTECTED_IMAGE_SELECTOR = 'img, .profile-circle, .logo-pic, .project-img';

document.querySelectorAll(PROTECTED_IMAGE_SELECTOR).forEach(el => {
    if (el.tagName === 'IMG') {
        el.setAttribute('draggable', 'false');
    }
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('dragstart', e => e.preventDefault());
});
