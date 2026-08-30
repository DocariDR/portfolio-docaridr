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

// Scroll reveal
const revealElements = document.querySelectorAll('.section-heading, .about-description, .info-item, .about-principles, .skill-category, .learning-strip, .projects-filter, .project-card, .timeline-item, .quality-card, .opportunity-card, .contact-item, .contact-form');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.1 });
revealElements.forEach(element => revealObserver.observe(element));

// Parallax léger du Hero — conservé, mais désactivé si l'utilisateur réduit les animations
const hero = document.querySelector('.hero');
if (hero && !reduceMotion) {
    window.addEventListener('scroll', () => {
        const offset = Math.min(window.scrollY * 0.12, 80);
        hero.style.setProperty('--hero-shift', `${offset}px`);
    }, { passive: true });
}

// Curseur personnalisé — conservé sur les appareils qui le permettent
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

// Formulaire : validation puis ouverture du client email, sans faux succès
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', event => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !subject || !message) {
            event.preventDefault();
        }
    });
}
