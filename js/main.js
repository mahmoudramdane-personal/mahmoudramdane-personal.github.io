import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';

const html = htm.bind(React.createElement);

// ============================================
// DATA — All filler content lives here
// ============================================
const SITE_DATA = {
  name: "Your Name",
  initials: "YN",
  eyebrow: "Developer · Designer · Builder",
  title: "Building things that matter at the intersection of code & design.",
  subtitle: "Independent developer and designer crafting digital experiences, tools, and platforms. Focused on creative technology, computational design, and rapid prototyping.",
  location: "City, Country",
  email: "hello@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
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
// NAV COMPONENT
// ============================================
function Nav() {
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
        <a class="nav-logo" href="#">${SITE_DATA.name}</a>
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
function Hero() {
  return html`
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-avatar">${SITE_DATA.initials}</div>
          <p class="hero-eyebrow">${SITE_DATA.eyebrow}</p>
          <h1 class="hero-title">${SITE_DATA.title}</h1>
          <p class="hero-subtitle">${SITE_DATA.subtitle}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Get in Touch
            </a>
            <a class="btn btn-secondary" href="${SITE_DATA.github}" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
          <div class="hero-meta">
            ${SITE_DATA.stats.map(s => html`
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
function Pillars() {
  return html`
    <section id="about" class="section pillars-section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">What I Do</p>
          <h2 class="section-title">Three pillars that define my work.</h2>
        </div>
        <div class="pillars-grid">
          ${SITE_DATA.pillars.map((p, i) => html`
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
function Clusters({ onProjectClick }) {
  return html`
    <section class="section clusters-section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">All Work</p>
          <h2 class="section-title">Projects grouped by domain.</h2>
        </div>
        ${SITE_DATA.clusters.map(c => html`
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
function ProjectsGrid({ onProjectClick }) {
  return html`
    <section id="projects" class="section projects-section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">Featured</p>
          <h2 class="section-title">Selected projects.</h2>
        </div>
        <div class="grid grid-3">
          ${SITE_DATA.projects.map((p, i) => html`
            <div class="project-card reveal" key=${p.title} style=${{ animationDelay: `${i * 0.08}s` }}
                 onClick=${() => onProjectClick && onProjectClick(p)}>
              <div class="project-media">
                <span class="project-media-placeholder">${p.title}</span>
              </div>
              <div class="project-content">
                <h3 class="project-title">${p.title}</h3>
                <p class="project-subtitle">${p.subtitle}</p>
                <div class="project-tags">
                  ${p.tags.map(t => html`<span class="tag" key=${t}>${t}</span>`)}
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
function Experience() {
  return html`
    <section id="experience" class="section">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-label">Experience</p>
          <h2 class="section-title">Where I've worked.</h2>
        </div>
        <div class="grid grid-2">
          <div>
            <div class="timeline">
              ${SITE_DATA.experience.map((e, i) => html`
                <div class="timeline-item reveal" key=${i}>
                  <span class="timeline-date">${e.date}</span>
                  <h3 class="timeline-role">${e.role}</h3>
                  <p class="timeline-org">${e.org}</p>
                  <p class="timeline-desc">${e.description}</p>
                </div>
              `)}
            </div>
          </div>
          <div class="reveal">
            <div class="section-header" style=${{ marginBottom: 'var(--space-6)' }}>
              <p class="section-label">Tech Stack</p>
            </div>
            <div class="tech-grid">
              ${SITE_DATA.techStack.map(cat => html`
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
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================
// CONTACT COMPONENT
// ============================================
function Contact() {
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
          <a class="contact-link" href="mailto:${SITE_DATA.email}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email
          </a>
          <a class="contact-link" href="${SITE_DATA.github}" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <a class="contact-link" href="${SITE_DATA.linkedin}" target="_blank" rel="noopener">
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
function Footer() {
  return html`
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-links">
          <a class="footer-link" href="${SITE_DATA.github}" target="_blank" rel="noopener">GitHub</a>
          <a class="footer-link" href="${SITE_DATA.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="footer-link" href="mailto:${SITE_DATA.email}">Email</a>
        </div>
        <p class="footer-copy">© ${new Date().getFullYear()} ${SITE_DATA.name}. ${SITE_DATA.location}.</p>
      </div>
    </footer>
  `;
}

// ============================================
// PROJECT MODAL COMPONENT
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

  return html`
    <div class="modal-overlay open" onClick=${(e) => e.target === e.currentTarget && onClose()}>
      <div class="modal-content animate-scale-in">
        <button class="modal-close" onClick=${onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div class="modal-media"></div>
        <div class="modal-body">
          <h2 class="modal-title">${title}</h2>
          <p class="modal-subtitle">${subtitle}</p>
          <p class="modal-description">
            This is placeholder content for the project description. It will be replaced with real details about the project, including process, technologies used, challenges overcome, and outcomes delivered. The modal supports rich content including images, videos, and embedded media.
          </p>
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
  const [selectedProject, setSelectedProject] = useState(null);

  useScrollReveal();

  // Re-run reveal observer when content changes
  useEffect(() => {
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
  });

  return html`
    <${Nav} />
    <${Hero} />
    <${Pillars} />
    <${Clusters} onProjectClick=${setSelectedProject} />
    <${ProjectsGrid} onProjectClick=${setSelectedProject} />
    <${Experience} />
    <${Contact} />
    <${Footer} />
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
