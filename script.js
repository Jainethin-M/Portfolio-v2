// Jainethin Portfolio v3 — Roadmap Journey Theme (Vanilla JS)
(() => {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  const DATA = {
    name: "Jainethin M",
    email: "jainethin59@gmail.com",
    phone: "+91 88255 78817",
    location: "Coimbatore, Tamil Nadu, India",
    role: "Full‑Stack Developer (MERN)",
    links: {
      linkedin: "https://www.linkedin.com/in/jainethin-m/",
      github: "https://github.com/Jainethin-M",
      codechef: "https://www.codechef.com/users/jainethin123",
      leetcode: "https://leetcode.com/u/lJnsJQILgv/",
      portfolio: "https://jainethin-m.github.io/Portfolio/"
    },

    // Stats: update anytime
    stats: [
      { label: "Internships", value: "2" },
      { label: "Projects", value: "6+" },
      { label: "CodeChef solved", value: "367" },
      { label: "LeetCode solved", value: "180+" }
    ],

    topSkills: ["React", "Node.js", "MongoDB", "Next.js", "NestJS", "JavaScript"],

    quickInfo: [
      { k: "Email", v: "jainethin59@gmail.com" },
      { k: "Location", v: "Coimbatore" },
      { k: "Primary role", v: "Full‑Stack Developer (MERN)" },
      { k: "Interests", v: "Cybersecurity • Cloud • AI" }
    ],

    skills: [
      { title: "Web Development", items: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB"] },
      { title: "Frameworks & Tools", items: ["Next.js", "NestJS", "Vite", "NPM", "Git", "GitHub", "Postman"] },
      { title: "Languages", items: ["C", "C++", "Java", "Python", "Kotlin"] },
      { title: "Database & Concepts", items: ["SQL", "REST APIs", "Authentication (JWT)", "Debugging", "DSA"] },
      { title: "Currently Learning", items: ["Cybersecurity fundamentals", "Cloud basics", "AI tools"] },
      { title: "Soft Skills", items: ["Communication", "Teamwork", "Problem Solving", "Time Management", "Adaptability"] }
    ],

    experience: [
      {
        title: "Technical Intern",
        org: "Ellucian",
        meta: "Internship • 2025",
        bullets: [
          "Worked on an education‑focused project and contributed to assigned tasks.",
          "Participated in a hackathon environment and improved speed through iterative debugging.",
          "Helped peers by explaining concepts and unblocking issues when needed."
        ]
      },
      {
        title: "Web Technologies Intern",
        org: "Gateway Software Solutions",
        meta: "Internship",
        bullets: [
          "Strengthened front‑end fundamentals using HTML, CSS, and JavaScript.",
          "Built webpages and small web apps while learning best practices."
        ]
      }
    ],

    education: [
      { title: "M.Sc. Computer Science", org: "Kathir Arts and Science College", meta: "2025 – 2027 (Pursuing)", bullets: [] },
      { title: "B.Sc. Computer Science", org: "KPR College of Arts Science and Research", meta: "2022 – 2025 • 88%", bullets: [] }
    ],

    projects: [
      {
        name: "Event Hoster",
        desc: "A platform to organize and manage events without paper (admin + tracking concept).",
        tags: ["Full‑Stack", "MERN", "Product"],
        links: [{ label: "Live Demo", url: "https://kpr-event-admin.onrender.com" }]
      },
      {
        name: "Freshers Name Picker",
        desc: "Random student name picker that avoids repetition — used in college sessions.",
        tags: ["React", "Utility"],
        links: [
          { label: "Live Demo", url: "https://jainethin-freshers-2.netlify.app" },
          { label: "GitHub", url: "https://github.com/Jainethin-M/Freshers-namepicker-React-js" }
        ]
      },
      {
        name: "Personal OS (WIP)",
        desc: "A platform to host multiple mini‑apps in one place and connect them for better tracking and insights.",
        tags: ["MERN", "Architecture", "WIP"],
        links: []
      },
      {
        name: "Basic Apps (Vanilla JS)",
        desc: "Collection of small apps built with HTML/CSS/JS to strengthen fundamentals.",
        tags: ["JavaScript", "Vanilla", "Fundamentals"],
        links: [{ label: "GitHub", url: "https://github.com/Jainethin-M/Basic-apps-js" }]
      },
      {
        name: "To‑Do List (React)",
        desc: "Task manager for tracking and updating to‑dos (React project).",
        tags: ["React"],
        links: [{ label: "GitHub", url: "https://github.com/Jainethin-M/To-Do-List-React-Js" }]
      },
      {
        name: "LeetCode Solutions",
        desc: "Problem‑solving repository showcasing consistency (C++).",
        tags: ["DSA", "C++"],
        links: [{ label: "GitHub", url: "https://github.com/Jainethin-M/Leet-Code" }]
      }
    ],

    community: [
      "Conducted college events and guided juniors on career growth and coding.",
      "Participation: Idea Presentation (Shri Krishna College), Debugging (Hindusthan College)."
    ]
  };

  const SECTIONS = [
    { id: "journey", label: "Journey", desc: "Roadmap overview" },
    { id: "about", label: "About", desc: "Who I am & how I work" },
    { id: "skills", label: "Skills", desc: "Stack + learning" },
    { id: "experience", label: "Experience", desc: "Internships & work" },
    { id: "education", label: "Education", desc: "Degrees & timeline" },
    { id: "projects", label: "Projects", desc: "Proof of work" },
    { id: "community", label: "Community", desc: "Leadership & guidance" },
    { id: "contact", label: "Contact", desc: "Let’s connect" }
  ];

  let activeSectionId = "journey";

  function setYear() { $("#year").textContent = String(new Date().getFullYear()); }

  function renderStats() {
    const wrap = $("#stats");
    wrap.innerHTML = "";
    DATA.stats.forEach(s => {
      const el = document.createElement("div");
      el.className = "stat magnetic";
      el.innerHTML = `
        <div class="value">${escapeHtml(s.value)}</div>
        <div class="label">${escapeHtml(s.label)}</div>
      `;
      wrap.appendChild(el);
    });
  }

  function renderTopSkills() {
    const wrap = $("#topSkills");
    wrap.innerHTML = "";
    DATA.topSkills.forEach(sk => {
      const span = document.createElement("span");
      span.className = "chip magnetic";
      span.textContent = sk;
      wrap.appendChild(span);
    });
  }

  function renderQuickInfo() {
    const dl = $("#quickInfo");
    dl.innerHTML = "";
    DATA.quickInfo.forEach(({k, v}) => {
      const row = document.createElement("div");
      row.className = "magnetic";
      row.innerHTML = `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`;
      dl.appendChild(row);
    });
  }

  function renderSkills() {
    const grid = $("#skillsGrid");
    grid.innerHTML = "";
    DATA.skills.forEach(group => {
      const card = document.createElement("div");
      card.className = "card skill-card magnetic";
      const chips = group.items.map(i => `<span class="chip magnetic">${escapeHtml(i)}</span>`).join("");
      card.innerHTML = `
        <h3>${escapeHtml(group.title)}</h3>
        <div class="chips">${chips}</div>
      `;
      grid.appendChild(card);
    });
  }

  function renderTimeline(targetId, items) {
    const wrap = $(targetId);
    wrap.innerHTML = "";
    items.forEach((it, idx) => {
      const el = document.createElement("div");
      el.className = "timeline-item magnetic";
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-expanded", "false");

      const bullets = (it.bullets && it.bullets.length)
        ? `<ul class="timeline-bullets">${it.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";

      const hint = it.bullets && it.bullets.length
        ? `<div class="hint">Click to expand <span class="chev" aria-hidden="true">▾</span></div>`
        : "";

      el.innerHTML = `
        <div class="timeline-top">
          <div class="timeline-title">${escapeHtml(it.title)} • ${escapeHtml(it.org)}</div>
          <div class="timeline-meta">${escapeHtml(it.meta || "")}</div>
        </div>
        ${bullets}
        ${hint}
      `;

      // Default open the first item for experience to show content
      const shouldOpen = targetId === "#experienceTimeline" && idx === 0;
      if (shouldOpen && it.bullets && it.bullets.length) {
        el.classList.add("open");
        el.setAttribute("aria-expanded", "true");
      }

      el.addEventListener("click", () => toggleTimeline(el, it));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTimeline(el, it);
        }
      });

      wrap.appendChild(el);
    });
  }

  function toggleTimeline(el, it) {
    if (!it.bullets || !it.bullets.length) return;
    const open = el.classList.toggle("open");
    el.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function uniqueTags(projects) {
    const set = new Set();
    projects.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return ["All", ...Array.from(set).sort((a,b) => a.localeCompare(b))];
  }

  let activeTag = "All";
  let searchText = "";

  function renderTagFilters() {
    const wrap = $("#tagFilters");
    wrap.innerHTML = "";
    uniqueTags(DATA.projects).forEach(tag => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tag-btn magnetic" + (tag === activeTag ? " active" : "");
      btn.textContent = tag;
      btn.addEventListener("click", () => {
        activeTag = tag;
        renderTagFilters();
        renderProjects();
      });
      wrap.appendChild(btn);
    });
  }

  function projectMatches(p) {
    const t = searchText.trim().toLowerCase();
    const hay = [p.name, p.desc, ...(p.tags || [])].join(" ").toLowerCase();
    const tagOk = activeTag === "All" ? true : (p.tags || []).includes(activeTag);
    const searchOk = !t ? true : hay.includes(t);
    return tagOk && searchOk;
  }

  function renderProjects() {
    const grid = $("#projectsGrid");
    grid.innerHTML = "";
    const filtered = DATA.projects.filter(projectMatches);

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "card magnetic";
      empty.innerHTML = `<strong>No matching projects.</strong><p class="muted">Try a different search or clear filters.</p>`;
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement("article");
      card.className = "project-card magnetic";
      const tags = (p.tags || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("");
      const links = (p.links || []).map(l => `
        <a class="magnetic" href="${escapeAttr(l.url)}" target="_blank" rel="noreferrer">${escapeHtml(l.label)}</a>
      `).join("");

      const linkBlock = links
        ? `<div class="project-links">${links}</div>`
        : `<div class="project-links"><span class="muted">Links coming soon</span></div>`;

      const theme = projectCoverTheme(p.tags || []);
      const coverIcon = projectCoverIcon(p.tags || []);

      card.innerHTML = `
        <div class="project-cover" style="--pc1: ${theme.c1}; --pc2: ${theme.c2};">
          <div class="cover-left">
            ${coverIcon}
            <span class="cover-tag">${escapeHtml(theme.label)}</span>
          </div>
          <span class="cover-spark" aria-hidden="true"></span>
        </div>
        <div>
          <div class="project-title">${escapeHtml(p.name)}</div>
          <p class="project-desc">${escapeHtml(p.desc)}</p>
        </div>
        <div class="project-tags">${tags}</div>
        ${linkBlock}
      `;
      grid.appendChild(card);
    });

    // re-bind magnetic after DOM changes
    setupMagnetic();
  }

  function renderCommunity() {
    const ul = $("#communityList");
    ul.innerHTML = "";
    DATA.community.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
  }

  function renderContactCards() {
    const wrap = $("#contactCards");
    wrap.innerHTML = "";

    const cards = [
      {
        label: "Email",
        value: DATA.email,
        actions: [
          { type: "copy", text: "Copy", value: DATA.email },
          { type: "link", text: "Mail", href: `mailto:${DATA.email}` }
        ]
      },
      {
        label: "Phone",
        value: DATA.phone,
        actions: [
          { type: "copy", text: "Copy", value: DATA.phone },
          { type: "link", text: "Call", href: `tel:${DATA.phone.replace(/\s+/g, "")}` }
        ]
      },
      {
        label: "Location",
        value: DATA.location,
        actions: [
          { type: "link", text: "Maps", href: "https://maps.google.com/?q=Coimbatore" }
        ]
      }
    ];

    cards.forEach(c => {
      const el = document.createElement("div");
      el.className = "contact-card magnetic";
      el.innerHTML = `
        <div class="label">${escapeHtml(c.label)}</div>
        <div class="value">${escapeHtml(c.value)}</div>
        <div class="actions"></div>
      `;
      const actions = $(".actions", el);
      c.actions.forEach(a => {
        if (a.type === "copy") {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = a.text;
          btn.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(a.value);
              showToast("Copied to clipboard ✓");
              btn.textContent = "Copied!";
              setTimeout(() => (btn.textContent = a.text), 1200);
            } catch (e) {
              showToast("Copy failed — please copy manually");
            }
          });
          actions.appendChild(btn);
        } else {
          const link = document.createElement("a");
          link.href = a.href;
          link.target = "_blank";
          link.rel = "noreferrer";
          link.textContent = a.text;
          actions.appendChild(link);
        }
      });

      wrap.appendChild(el);
    });
  }

  function setupForm() {
    const form = $("#contactForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const email = (fd.get("email") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();

      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}\n\n— Sent from your portfolio`);
      window.location.href = `mailto:${DATA.email}?subject=${subject}&body=${body}`;
    });
  }

  function setupTheme() {
    const root = document.documentElement;
    const btn = $(".theme-toggle");

    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    } else {
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      root.setAttribute("data-theme", prefersLight ? "light" : "dark");
    }

    if (!btn) return;

    function updateThemeButton(theme) {
      const txt = $(".theme-text", btn);
      const icon = $(".theme-icon", btn);
      const isLight = theme === "light";
      btn.setAttribute("aria-pressed", isLight ? "true" : "false");
      btn.setAttribute("aria-label", `Toggle theme — current: ${theme}`);
      if (txt) txt.textContent = isLight ? "Light" : "Dark";
      if (isLight) btn.classList.add("is-light"); else btn.classList.remove("is-light");
      // Update icon visual (existing .theme-icon styles will react to .is-light)
    }

    // initialize button state
    updateThemeButton(root.getAttribute("data-theme") || "dark");

    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateThemeButton(next);
      showToast(`Theme: ${next}`);
    });
  }

  function setupMobileNav() {
    const toggle = $(".nav-toggle");
    const links = $("#navLinks");
    const themeBtn = $(".theme-toggle");

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    $$("#navLinks a").forEach(a => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      const within = links.contains(e.target) || toggle.contains(e.target);
      if (!within) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Move theme button into the mobile menu on small screens; move back when larger
    const mq = window.matchMedia("(max-width: 920px)");
    function syncThemePlacement() {
      if (!themeBtn) return;
      if (mq.matches) {
        if (!links.contains(themeBtn)) {
          links.appendChild(themeBtn);
          themeBtn.classList.add("in-menu");
        }
      } else {
        // move back to header (end of nav)
        const nav = $(".nav");
        if (nav && !nav.contains(themeBtn)) {
          nav.appendChild(themeBtn);
          themeBtn.classList.remove("in-menu");
        }
      }
    }
    syncThemePlacement();
    if (mq.addEventListener) mq.addEventListener("change", syncThemePlacement);
    else mq.addListener(syncThemePlacement);

    // When theme button is clicked inside the menu, close the menu for immediate feedback
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  function setupProjectSearch() {
    const input = $("#projectSearch");
    input.addEventListener("input", () => {
      searchText = input.value || "";
      renderProjects();
    });
  }

  
  function setupReveal() {
    const els = $$(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => io.observe(el));
  }

  // Cursor glow follows pointer (desktop only)
  function setupCursorGlow() {
    const glow = $("#cursorGlow");
    if (!glow || prefersReduced || !supportsHover) {
      if (glow) glow.style.display = "none";
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y;
    glow.style.opacity = "0.55";

    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = "0.55";
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      glow.style.opacity = "0";
    });
  }

  // Sparkles on click (subtle)
  function setupSparkles() {
    const layer = $("#sparkles");
    if (!layer || prefersReduced || !supportsHover) return;

    window.addEventListener("pointerdown", (e) => {
      const count = 10;
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        const size = 4 + Math.random() * 6;
        const dx = (Math.random() - 0.5) * 120;
        const dy = (Math.random() - 0.5) * 120;
        s.style.cssText = `
          position: absolute;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          box-shadow: 0 0 14px color-mix(in srgb, var(--accent2) 50%, transparent);
          transform: translate(-50%, -50%);
          opacity: 0.9;
          pointer-events: none;
          animation: spark 650ms ease-out forwards;
          --dx: ${dx}px;
          --dy: ${dy}px;
        `;
        layer.appendChild(s);
        setTimeout(() => s.remove(), 700);
      }
    }, { passive: true });

    // Inject keyframes once
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spark {
        to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Magnetic / spotlight hover based on cursor
  function setupMagnetic() {
    const els = $$(".magnetic");
    if (!supportsHover || prefersReduced) return;

    els.forEach(el => {
      let raf = 0;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        el.style.setProperty("--mx", `${mx}px`);
        el.style.setProperty("--my", `${my}px`);

        // Small 3D tilt
        const cx = mx - r.width / 2;
        const cy = my - r.height / 2;
        const ry = (cx / (r.width / 2)) * 6;
        const rx = (-cy / (r.height / 2)) * 4;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translateY(-2px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      }, { passive: true });

      el.addEventListener("pointerleave", () => {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
        el.style.transform = "";
      });
    });
  }

  // Scroll progress bar
  function setupScrollProgress() {
    const bar = $("#scrollProgressBar");
    if (!bar) return;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, scrollTop / max));
      bar.style.transform = `scaleX(${p})`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function buildJourneyRail() {
    const inner = $("#journeyRailInner");
    if (!inner) return;
    inner.innerHTML = "";

    SECTIONS.forEach(s => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "journey-step";
      btn.dataset.target = s.id;
      btn.innerHTML = `<span class="journey-dot" aria-hidden="true"></span><span class="journey-label">${escapeHtml(s.label)}</span>`;
      btn.addEventListener("click", () => {
        scrollToId(s.id);
      });
      inner.appendChild(btn);
    });
  }

  function buildJourneyMap() {
    const map = $("#journeyMap");
    if (!map) return;

    // A shorter visible "roadmap" for the page (5 cards)
    const steps = [
      { id: "about", label: "About", desc: "Mindset & focus", icon: iconUser() },
      { id: "skills", label: "Skills", desc: "Stack & learning", icon: iconTools() },
      { id: "experience", label: "Experience", desc: "Internships", icon: iconBolt() },
      { id: "projects", label: "Projects", desc: "Proof of work", icon: iconCode() },
      { id: "contact", label: "Contact", desc: "Let’s talk", icon: iconMail() }
    ];

    map.innerHTML = "";
    const row = document.createElement("div");
    row.className = "journey-row";

    steps.forEach((s) => {
      const card = document.createElement("div");
      card.className = "journey-card magnetic";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.innerHTML = `
        <div class="journey-icon">${s.icon}</div>
        <p class="t">${escapeHtml(s.label)}</p>
        <p class="d">${escapeHtml(s.desc)}</p>
      `;
      card.addEventListener("click", () => scrollToId(s.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scrollToId(s.id);
        }
      });
      row.appendChild(card);
    });

    map.appendChild(row);
    setupMagnetic();
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  }

  // Nav highlight (scroll spy)
  function setupScrollSpy() {
    const sections = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
    const navLinks = $$('[data-nav]');
    const railButtons = $$("#journeyRailInner .journey-step");

    const setActive = (id) => {
      activeSectionId = id;

      // header nav
      navLinks.forEach(a => {
        const target = a.getAttribute("data-nav");
        a.classList.toggle("active", target === id);
      });

      // rail
      railButtons.forEach(b => {
        b.classList.toggle("active", b.dataset.target === id);
      });

      updateNextCheckpoint();
    };

    const io = new IntersectionObserver((entries) => {
      // pick the most visible
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => (b.intersectionRatio - a.intersectionRatio));
      if (visible.length) setActive(visible[0].target.id);
    }, {
      root: null,
      threshold: [0.12, 0.2, 0.35, 0.5, 0.65],
      rootMargin: "-20% 0px -55% 0px"
    });

    sections.forEach(s => io.observe(s));

    // default
    setActive(activeSectionId);
  }

  function updateNextCheckpoint() {
    const btn = $("#nextCheckpoint");
    if (!btn) return;
    const idx = SECTIONS.findIndex(s => s.id === activeSectionId);
    const next = SECTIONS[idx + 1] || { id: "top", label: "Top" };

    const arrow = $(".nc-arrow", btn);
    const label = $(".nc-label", btn);

    if (next.id === "top") {
      arrow.textContent = "↑";
      label.textContent = "Top";
    } else {
      arrow.textContent = "↓";
      label.textContent = next.label;
    }

    btn.onclick = () => {
      if (next.id === "top") {
        window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      } else {
        scrollToId(next.id);
      }
    };
  }

  // Toast
  let toastTimer = 0;
  function showToast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => t.classList.remove("show"), 1400);
  }

  function setupResumeButton() {
    const btn = $("#resumeBtn");
    fetch("resume.pdf", { method: "HEAD" })
      .then(res => { if (!res.ok) btn.style.display = "none"; })
      .catch(() => { btn.style.display = "none"; });
  }

  function setupButtonsRipple() {
    // Track pointer for buttons to position ripple highlight
    $$(".btn").forEach(btn => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", `${e.clientX - r.left}px`);
        btn.style.setProperty("--my", `${e.clientY - r.top}px`);
      }, { passive: true });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // Small inline icons (SVG)
  function iconUser() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.1 0-8 2.1-8 5v1h16v-1c0-2.9-3.9-5-8-5Z"/></svg>`;
  }
  function iconTools() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 19.6 15.6 13.2a6.3 6.3 0 0 1-2.4 2.4L19.6 22ZM14 7a4 4 0 1 0-5.7 3.6l-6.9 6.9a2 2 0 0 0 2.8 2.8l6.9-6.9A4 4 0 0 0 14 7Z"/></svg>`;
  }
  function iconBolt() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7Z"/></svg>`;
  }
  function iconCode() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.4 16.6-1.4 1.4L2 12l6-6 1.4 1.4L4.8 12Zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6ZM14 3 10 21H8l4-18Z"/></svg>`;
  }
  function iconMail() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z"/></svg>`;
  }

  // Project cover helpers
  function projectCoverTheme(tags = []) {
    const t = new Set(tags);
    if (t.has("MERN") || t.has("Full‑Stack")) return { c1: "var(--accent)", c2: "var(--accent2)", label: "MERN" };
    if (t.has("React")) return { c1: "var(--accent)", c2: "var(--good)", label: "React" };
    if (t.has("JavaScript") || t.has("Vanilla")) return { c1: "var(--good)", c2: "var(--accent)", label: "JS" };
    if (t.has("DSA") || t.has("C++")) return { c1: "var(--accent2)", c2: "var(--accent)", label: "DSA" };
    if (t.has("Architecture")) return { c1: "var(--accent2)", c2: "var(--good)", label: "Architecture" };
    return { c1: "var(--accent)", c2: "var(--accent2)", label: "Build" };
  }

  function projectCoverIcon(tags = []) {
    const t = new Set(tags);
    if (t.has("MERN") || t.has("Full‑Stack")) return iconCode();
    if (t.has("React")) return iconCode();
    if (t.has("JavaScript") || t.has("Vanilla")) return iconBolt();
    if (t.has("DSA") || t.has("C++")) return iconTools();
    if (t.has("Architecture")) return iconTools();
    return iconBolt();
  }

  function init() {
    setYear();
    renderStats();
    renderTopSkills();
    renderQuickInfo();
    renderSkills();
    renderTimeline("#experienceTimeline", DATA.experience);
    renderTimeline("#educationTimeline", DATA.education);
    renderTagFilters();
    renderProjects();
    renderCommunity();
    renderContactCards();

    setupForm();
    setupTheme();
    setupMobileNav();
    setupProjectSearch();
    setupResumeButton();
    setupReveal();

    buildJourneyRail();
    buildJourneyMap();
    setupScrollSpy();

    setupScrollProgress();
    setupButtonsRipple();
    setupCursorGlow();
    setupSparkles();

    setupMagnetic();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
