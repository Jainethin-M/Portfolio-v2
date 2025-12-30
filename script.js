// Jainethin Portfolio v2 — Vanilla JS
(() => {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  const DATA = {
    name: "Jainethin M",
    email: "jainethin59@gmail.com",
    phone: "+91 88255 78817",
    location: "Coimbatore, Tamil Nadu, India",
    role: "Full‑Stack Developer (MERN)",
    openTo: "Full‑Stack Developer roles — Coimbatore / Bangalore / Hyderabad / Chennai",
    links: {
      linkedin: "https://www.linkedin.com/in/jainethin-m/",
      github: "https://github.com/Jainethin-M",
      codechef: "https://www.codechef.com/users/jainethin123",
      leetcode: "https://leetcode.com/u/lJnsJQILgv/",
      portfolio: "https://jainethin-m.github.io/Portfolio/"
    },

    // Stats: you can update these any time
    stats: [
      { label: "Internships", value: "2" },
      { label: "Projects", value: "6+" },
      { label: "CodeChef solved", value: "367" },   // as of Dec 2025
      { label: "LeetCode solved", value: "180+" }   // as of Dec 2025
    ],

    topSkills: ["React", "Node.js", "MongoDB", "NPM", "JavaScript"],

    quickInfo: [
      { k: "Email", v: "jainethin59@gmail.com" },
      { k: "Location", v: "Coimbatore" },
      { k: "Primary role", v: "Full‑Stack Developer (MERN)" },
      { k: "Interests", v: "Cybersecurity • Cloud • AI" }
    ],

    skills: [
      {
        title: "Web Development",
        items: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB"]
      },
      {
        title: "Frameworks & Tools",
        items: ["Next.js", "NestJS", "Vite", "NPM", "Git", "GitHub", "Postman", "bruno"]
      },
      {
        title: "Languages",
        items: ["C", "C++", "Java", "Python", "Kotlin"]
      },
      {
        title: "Database & Concepts",
        items: ["SQL", "REST APIs", "Authentication (JWT)", "Debugging", "DSA"]
      },
      {
        title: "Currently Learning",
        items: ["Cybersecurity fundamentals", "Cloud basics", "AI tools"]
      },
      {
        title: "Soft Skills",
        items: ["Communication", "Teamwork", "Problem Solving", "Time Management", "Adaptability"]
      }
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
      {
        title: "M.Sc. Computer Science",
        org: "Kathir Arts and Science College",
        meta: "2025 – 2027 (Pursuing)",
        bullets: []
      },
      {
        title: "B.Sc. Computer Science",
        org: "KPR College of Arts Science and Research",
        meta: "2022 – 2025 • 88%",
        bullets: []
      }
    ],

    projects: [
      {
        name: "Event Hoster",
        desc: "A platform to organize and manage events without paper (admin + tracking concept).",
        tags: ["Full‑Stack", "MERN", "Product"],
        links: [
          { label: "Live Demo", url: "https://kpr-event-admin.onrender.com" }
        ]
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
        links: [
          { label: "GitHub", url: "https://github.com/Jainethin-M/Basic-apps-js" }
        ]
      },
      {
        name: "To‑Do List (React)",
        desc: "Task manager for tracking and updating to‑dos (React project).",
        tags: ["React"],
        links: [
          { label: "GitHub", url: "https://github.com/Jainethin-M/To-Do-List-React-Js" }
        ]
      },
      {
        name: "LeetCode Solutions",
        desc: "Problem‑solving repository showcasing consistency (C++).",
        tags: ["DSA", "C++"],
        links: [
          { label: "GitHub", url: "https://github.com/Jainethin-M/Leet-Code" }
        ]
      }
    ],

    community: [
      "Conducted college events and guided juniors on career growth and coding.",
      "Participation: Idea Presentation (Shri Krishna College), Debugging (Hindusthan College)."
    ]
  };

  function setYear() {
    const y = new Date().getFullYear();
    $("#year").textContent = y;
  }

  function renderStats() {
    const wrap = $("#stats");
    wrap.innerHTML = "";
    DATA.stats.forEach(s => {
      const el = document.createElement("div");
      el.className = "stat";
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
      span.className = "chip";
      span.textContent = sk;
      wrap.appendChild(span);
    });
  }

  function renderQuickInfo() {
    const dl = $("#quickInfo");
    dl.innerHTML = "";
    DATA.quickInfo.forEach(({k, v}) => {
      const row = document.createElement("div");
      row.innerHTML = `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`;
      dl.appendChild(row);
    });
  }

  function renderSkills() {
    const grid = $("#skillsGrid");
    grid.innerHTML = "";
    DATA.skills.forEach(group => {
      const card = document.createElement("div");
      card.className = "card skill-card";
      const chips = group.items.map(i => `<span class="chip">${escapeHtml(i)}</span>`).join("");
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
    items.forEach(it => {
      const el = document.createElement("div");
      el.className = "timeline-item";
      const bullets = (it.bullets && it.bullets.length)
        ? `<ul class="timeline-bullets">${it.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";
      el.innerHTML = `
        <div class="timeline-top">
          <div class="timeline-title">${escapeHtml(it.title)} • ${escapeHtml(it.org)}</div>
          <div class="timeline-meta">${escapeHtml(it.meta || "")}</div>
        </div>
        ${bullets}
      `;
      wrap.appendChild(el);
    });
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
      btn.className = "tag-btn" + (tag === activeTag ? " active" : "");
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
      empty.className = "card";
      empty.innerHTML = `<strong>No matching projects.</strong><p class="muted">Try a different search or clear filters.</p>`;
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement("article");
      card.className = "project-card";
      const tags = (p.tags || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("");
      const links = (p.links || []).map(l => `
        <a href="${escapeAttr(l.url)}" target="_blank" rel="noreferrer">${escapeHtml(l.label)}</a>
      `).join("");

      const linkBlock = links
        ? `<div class="project-links">${links}</div>`
        : `<div class="project-links"><span class="muted">Links coming soon</span></div>`;

      card.innerHTML = `
        <div>
          <div class="project-title">${escapeHtml(p.name)}</div>
          <p class="project-desc">${escapeHtml(p.desc)}</p>
        </div>
        <div class="project-tags">${tags}</div>
        ${linkBlock}
      `;
      grid.appendChild(card);
    });
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
      el.className = "contact-card";
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
              btn.textContent = "Copied!";
              setTimeout(() => (btn.textContent = a.text), 1200);
            } catch (e) {
              alert("Copy failed. Please copy manually.");
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
      // default: follow system preference
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      root.setAttribute("data-theme", prefersLight ? "light" : "dark");
    }

    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  function setupMobileNav() {
    const toggle = $(".nav-toggle");
    const links = $("#navLinks");

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when clicking a link (mobile)
    $$("#navLinks a").forEach(a => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      const within = links.contains(e.target) || toggle.contains(e.target);
      if (!within) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupProjectSearch() {
    const input = $("#projectSearch");
    input.addEventListener("input", () => {
      searchText = input.value || "";
      renderProjects();
    });
  }

  function setupResumeButton() {
    const btn = $("#resumeBtn");
    // Try to hide the button if resume.pdf doesn't exist.
    fetch("resume.pdf", { method: "HEAD" })
      .then(res => {
        if (!res.ok) btn.style.display = "none";
      })
      .catch(() => { btn.style.display = "none"; });
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

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function escapeAttr(s) { return escapeHtml(s); }

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
  }

  document.addEventListener("DOMContentLoaded", init);
})();
