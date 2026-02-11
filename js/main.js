import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { loadSiteData, renderRichText, getYouTubeId } from './contentful.js';

const html = htm.bind(React.createElement);

// ============================================
// FALLBACK DATA — Used when Contentful is
// unavailable or empty
// ============================================
const FALLBACK_DATA = {
    name: "Mahmoud Ramdane",
    initials: "MR",
    eyebrow: "Developer · Designer · Builder",
    title: "Building things that matter at the intersection of code & design.",
    subtitle: "Independent developer and designer crafting digital experiences, tools, and platforms. Focused on creative technology, computational design, and rapid prototyping.",
    location: "City, Country",
    email: "hello@example.com",
    instagram: "https://www.instagram.com/mahmoud.ramdane",
    linkedin: "https://www.linkedin.com/in/mahmoudramdane/",
    stats: [
        { label: "Years Active", value: "5+" },
        { label: "Projects Shipped", value: "30+" },
        { label: "Based In", value: "City, Country" },
    ],
    pillars: [
        {
            icon: "⚡",
            title: "Creative Technology",
            tagline: "Turning ideas into interactive experiences",
            description: "Building custom tools, visualizations, and interactive installations that push the boundaries of what's possible on the web and beyond.",
            keywords: ["WebGL", "Three.js", "Canvas", "Shaders", "Generative Art"],
        },
        {
            icon: "🏗️",
            title: "Computational Design",
            tagline: "Algorithms that shape the physical world",
            description: "Applying parametric and algorithmic approaches to architecture, product design, and fabrication workflows. From concept to production.",
            keywords: ["Rhino", "Grasshopper", "Python", "Parametric", "BIM"],
        },
        {
            icon: "🚀",
            title: "Rapid Prototyping",
            tagline: "From zero to working product, fast",
            description: "Full-stack development with a bias toward shipping. Building MVPs, dashboards, and internal tools that solve real problems quickly.",
            keywords: ["React", "Node.js", "Python", "APIs", "Databases"],
        },
    ],
    clusters: [
        {
            name: "Web Applications",
            color: "var(--color-accent-1)",
            projects: ["Dashboard Platform", "Data Visualizer", "Client Portal", "Analytics Tool"],
        },
        {
            name: "Design Tools",
            color: "var(--color-accent-2)",
            projects: ["Parametric Generator", "Shape Grammar Engine", "Layout Optimizer", "Material Explorer"],
        },
        {
            name: "Experiments",
            color: "var(--color-accent-3)",
            projects: ["Particle System", "Audio Visualizer", "Procedural City", "Neural Canvas"],
        },
    ],
    projects: [
        {
            title: "Project Alpha",
            subtitle: "A full-stack platform for managing design workflows and collaboration.",
            tags: ["React", "Node.js", "PostgreSQL"],
            year: "2025",
        },
        {
            title: "Project Beta",
            subtitle: "Interactive data visualization dashboard for urban planning analysis.",
            tags: ["D3.js", "Python", "GIS"],
            year: "2024",
        },
        {
            title: "Project Gamma",
            subtitle: "Parametric design tool for generating architectural facades from algorithms.",
            tags: ["Rhino", "Grasshopper", "C#"],
            year: "2024",
        },
        {
            title: "Project Delta",
            subtitle: "Real-time 3D configurator for custom furniture with fabrication output.",
            tags: ["Three.js", "WebGL", "CAD"],
            year: "2023",
        },
        {
            title: "Project Epsilon",
            subtitle: "AI-powered analysis tool for automating repetitive design tasks.",
            tags: ["Python", "ML", "FastAPI"],
            year: "2023",
        },
        {
            title: "Project Zeta",
            subtitle: "Mobile-first portfolio builder with drag-and-drop layout editing.",
            tags: ["React", "Firebase", "PWA"],
            year: "2022",
        },
    ],
    experience: [
        {
            date: "2024 — Present",
            role: "Senior Developer",
            org: "Studio Name",
            description: "Leading development of digital products and internal tools for design workflows.",
        },
        {
            date: "2022 — 2024",
            role: "Computational Designer",
            org: "Architecture Firm",
            description: "Developed custom Rhino/Grasshopper plugins and automated BIM pipelines.",
        },
        {
            date: "2020 — 2022",
            role: "Full-Stack Developer",
            org: "Tech Startup",
            description: "Built and shipped web applications from concept to production.",
        },
        {
            date: "2018 — 2020",
            role: "Junior Developer",
            org: "Digital Agency",
            description: "Frontend development, prototyping, and client-facing dashboard projects.",
        },
    ],
    techStack: [
        {
            category: "Languages",
            color: "var(--color-accent-1)",
            items: ["JavaScript", "TypeScript", "Python", "C#", "HTML/CSS"],
        },
        {
            category: "Frameworks",
            color: "var(--color-accent-2)",
            items: ["React", "Next.js", "Node.js", "FastAPI", "Express"],
        },
        {
            category: "Design Tools",
            color: "var(--color-accent-4)",
            items: ["Rhino 3D", "Grasshopper", "Figma", "Blender", "AutoCAD"],
        },
        {
            category: "Data & Infra",
            color: "var(--color-accent-3)",
            items: ["PostgreSQL", "MongoDB", "Docker", "AWS", "Git"],
        },
    ],
};

// ============================================
// SCROLL REVEAL HOOK
// ============================================
function useScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}

// ============================================
// LOADING COMPONENT
// ============================================
function LoadingScreen() {
    return html`
    <div class="loading-screen">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>
  `;
}

// ============================================
// NAV COMPONENT
// ============================================
function Nav({ data }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = useCallback((id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    }, []);

    return html`
    <nav class="nav ${scrolled ? 'scrolled' : ''}">
      <div class="container nav-inner">
        <a class="nav-logo" href="#">${data.name}</a>
        <button class="nav-menu-btn" onClick=${() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${menuOpen
            ? html`<path d="M18 6L6 18M6 6l12 12"/>`
            : html`<path d="M3 12h18M3 6h18M3 18h18"/>`
        }
          </svg>
        </button>
        <div class="nav-links ${menuOpen ? 'open' : ''}">
          <button class="nav-link" onClick=${() => scrollTo('about')}>About</button>
          <button class="nav-link" onClick=${() => scrollTo('projects')}>Projects</button>
          <button class="nav-link" onClick=${() => scrollTo('experience')}>Experience</button>
          <button class="nav-link" onClick=${() => scrollTo('contact')}>Contact</button>
        </div>
      </div>
    </nav>
  `;
}

// ============================================
// HERO COMPONENT
// ============================================
function Hero({ data }) {
    return html`
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-avatar">${data.initials}</div>
          <p class="hero-eyebrow">${data.eyebrow}</p>
          <h1 class="hero-title">${data.title}</h1>
          <p class="hero-subtitle">${data.subtitle}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Get in Touch
            </a>
            <a class="btn btn-secondary" href="${data.instagram}" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </a>
          </div>
          <div class="hero-meta">
            ${data.stats.map(s => html`
              <div class="hero-stat" key=${s.label}>
                <span class="hero-stat-label">${s.label}</span>
                <span class="hero-stat-value">${s.value}</span>
              </div>
            `)}
          </div>
        </div>
      </div>
      <div class="hero-scroll scroll-indicator" onClick=${() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  `;
}

// ============================================
// PILLARS COMPONENT
// ============================================
function Pillars({ data }) {
    if (!data.pillars || data.pillars.length === 0) return null;

    return html`
    <section id="about" class="section pillars-section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">What I Do</p>
          <h2 class="section-title">Three pillars that define my work.</h2>
        </div>
        <div class="pillars-grid">
          ${data.pillars.map((p, i) => html`
            <div class="pillar-card reveal" style=${{ animationDelay: `${i * 0.1}s` }} key=${p.title}>
              <div class="pillar-header">
                <div class="pillar-icon">${p.icon}</div>
                <span class="pillar-title">${p.title}</span>
              </div>
              <h3 class="pillar-tagline">${p.tagline}</h3>
              <p class="pillar-description">${p.description}</p>
              <div class="pillar-keywords">
                ${p.keywords.map(k => html`<span class="tag" key=${k}>${k}</span>`)}
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
}

// ============================================
// CLUSTERS COMPONENT (Bubble chips)
// ============================================
function Clusters({ data, onProjectClick }) {
    if (!data.clusters || data.clusters.length === 0) return null;

    return html`
    <section class="section clusters-section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">All Work</p>
          <h2 class="section-title">Projects grouped by domain.</h2>
        </div>
        ${data.clusters.map(c => html`
          <div class="cluster reveal" key=${c.name}>
            <div class="cluster-header">
              <div class="cluster-indicator" style=${{ backgroundColor: c.color }}></div>
              <span class="cluster-name">${c.name}</span>
              <span class="cluster-count">${c.projects.length}</span>
            </div>
            <div class="bubble-container">
              ${c.projects.map(p => html`
                <button class="bubble" key=${p} onClick=${() => onProjectClick && onProjectClick(p)}>
                  ${p}
                </button>
              `)}
            </div>
          </div>
        `)}
      </div>
    </section>
  `;
}

// ============================================
// PROJECTS GRID COMPONENT
// ============================================
function ProjectsGrid({ data, onProjectClick }) {
    if (!data.projects || data.projects.length === 0) return null;

    return html`
    <section id="projects" class="section projects-section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">Featured</p>
          <h2 class="section-title">Selected projects.</h2>
        </div>
        <div class="grid grid-3">
          ${data.projects.map((p, i) => html`
            <div class="project-card reveal" key=${p.title} style=${{ animationDelay: `${i * 0.08}s` }}
                 onClick=${() => onProjectClick && onProjectClick(p)}>
              <div class="project-media">
                ${p.media && p.media.url
            ? html`<img src="${p.media.url}" alt="${p.title}" loading="lazy" />`
            : html`<span class="project-media-placeholder">${p.title}</span>`
        }
              </div>
              <div class="project-content">
                <h3 class="project-title">${p.title}</h3>
                <p class="project-subtitle">${p.subtitle}</p>
                <div class="project-tags">
                  ${(p.tags || []).map(t => html`<span class="tag" key=${t}>${t}</span>`)}
                </div>
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
}

// ============================================
// EXPERIENCE COMPONENT
// ============================================
function Experience({ data }) {
    const hasExperience = data.experience && data.experience.length > 0;
    const hasTech = data.techStack && data.techStack.length > 0;
    if (!hasExperience && !hasTech) return null;

    return html`
    <section id="experience" class="section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">Experience</p>
          <h2 class="section-title">Where I've worked.</h2>
        </div>
        <div class="grid grid-2">
          <div>
            ${hasExperience && html`
            <div class="timeline">
              ${data.experience.map((e, i) => html`
                <div class="timeline-item reveal" key=${i}>
                  <span class="timeline-date">${e.date}</span>
                  <h3 class="timeline-role">${e.role}</h3>
                  <p class="timeline-org">${e.org}</p>
                  <p class="timeline-desc">${e.description}</p>
                </div>
              `)}
            </div>
            `}
          </div>
          <div class="reveal">
            ${hasTech && html`
            <div class="section-header" style=${{ marginBottom: 'var(--space-6)' }}>
              <p class="section-label">Tech Stack</p>
            </div>
            <div class="tech-grid">
              ${data.techStack.map(cat => html`
                <div class="tech-category" key=${cat.category}>
                  <div class="tech-category-header">
                    <div class="tech-category-dot" style=${{ backgroundColor: cat.color }}></div>
                    <span class="tech-category-name">${cat.category}</span>
                  </div>
                  <div class="tech-items">
                    ${cat.items.map(item => html`
                      <span class="tech-item" key=${item}>${item}</span>
                    `)}
                  </div>
                </div>
              `)}
            </div>
            `}
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================
// CONTACT COMPONENT
// ============================================
function Contact({ data }) {
    return html`
    <section id="contact" class="section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">Contact</p>
          <h2 class="section-title">Let's work together.</h2>
        </div>
        <p class="reveal" style=${{ color: 'var(--color-text-muted)', maxWidth: '500px', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
          I'm always open to interesting projects, collaborations, and conversations. Drop me a line or find me on any of these platforms.
        </p>
        <div class="contact-links reveal">
          <a class="contact-link" href="mailto:${data.email}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email
          </a>
          <a class="contact-link" href="${data.instagram}" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </a>
          <a class="contact-link" href="${data.linkedin}" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  `;
}

// ============================================
// FOOTER COMPONENT
// ============================================
function Footer({ data }) {
    return html`
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-links">
          <a class="footer-link" href="${data.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a class="footer-link" href="${data.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="footer-link" href="mailto:${data.email}">Email</a>
        </div>
        <p class="footer-copy">© ${new Date().getFullYear()} ${data.name}. ${data.location}.</p>
      </div>
    </footer>
  `;
}

// ============================================
// PROJECT MODAL COMPONENT
// With rich text, YouTube embeds, and media
// ============================================
function ProjectModal({ project, onClose }) {
    if (!project) return null;

    // Handle ESC key
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const isString = typeof project === 'string';
    const title = isString ? project : project.title;
    const subtitle = isString ? 'A project in this category.' : project.subtitle;
    const tags = isString ? [] : (project.tags || []);
    const media = isString ? null : (project.media || null);
    const youtubeUrl = isString ? null : (project.youtubeUrl || null);
    const richDescription = isString ? null : (project.description || null);
    const youtubeId = getYouTubeId(youtubeUrl);

    // Render rich text if available, otherwise show placeholder
    const descriptionHtml = richDescription && typeof richDescription === 'object'
        ? renderRichText(richDescription)
        : null;

    return html`
    <div class="modal-overlay open" onClick=${(e) => e.target === e.currentTarget && onClose()}>
      <div class="modal-content animate-scale-in">
        <button class="modal-close" onClick=${onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        ${youtubeId ? html`
          <div class="modal-media">
            <div class="youtube-embed">
              <iframe
                src="https://www.youtube-nocookie.com/embed/${youtubeId}"
                title="YouTube video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        ` : media && media.url ? html`
          <div class="modal-media">
            <img src="${media.url}" alt="${title}" loading="lazy" />
          </div>
        ` : html`
          <div class="modal-media"></div>
        `}

        <div class="modal-body">
          <h2 class="modal-title">${title}</h2>
          <p class="modal-subtitle">${subtitle}</p>

          ${descriptionHtml
            ? html`<div class="modal-rich-text" dangerouslySetInnerHTML=${{ __html: descriptionHtml }}></div>`
            : html`<p class="modal-description">
                This is placeholder content for the project description. It will be replaced with real details about the project, including process, technologies used, challenges overcome, and outcomes delivered.
              </p>`
        }

          ${tags.length > 0 && html`
            <div class="modal-tags">
              ${tags.map(t => html`<span class="tag" key=${t}>${t}</span>`)}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// ============================================
// APP COMPONENT
// ============================================
function App() {
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);

    // Fetch data from Contentful on mount
    useEffect(() => {
        async function init() {
            const data = await loadSiteData();
            setSiteData(data || FALLBACK_DATA);
            setLoading(false);
        }
        init();
    }, []);

    useScrollReveal();

    // Re-run reveal observer when content loads
    useEffect(() => {
        if (loading) return;
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
            );
            document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
            return () => observer.disconnect();
        }, 100);
        return () => clearTimeout(timer);
    }, [loading]);

    if (loading) {
        return html`<${LoadingScreen} />`;
    }

    const data = siteData;

    return html`
    <${Nav} data=${data} />
    <${Hero} data=${data} />
    <${Pillars} data=${data} />
    <${Clusters} data=${data} onProjectClick=${setSelectedProject} />
    <${ProjectsGrid} data=${data} onProjectClick=${setSelectedProject} />
    <${Experience} data=${data} />
    <${Contact} data=${data} />
    <${Footer} data=${data} />
    ${selectedProject && html`
      <${ProjectModal} project=${selectedProject} onClose=${() => setSelectedProject(null)} />
    `}
  `;
}

// ============================================
// MOUNT
// ============================================
const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
