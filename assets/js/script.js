document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bg-canvas");
  const isDarkMode = () => document.body.classList.contains("dark-mode");

  let canvas2D;
  function createCanvas2D() {
    if (!canvas2D) {
      canvas2D = document.createElement("canvas");
      canvas2D.id = "constellation-canvas";
      canvas2D.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;display:none;";
      document.body.insertBefore(canvas2D, document.body.firstChild);
    }
    return canvas2D;
  }

  if (canvas && typeof THREE !== "undefined") {
    let scene,
      camera,
      renderer,
      objects = [];
    let animationId;

    function init3D() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 30;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const geometries = [
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.TetrahedronGeometry(1.3, 0),
        new THREE.TorusGeometry(1, 0.4, 8, 16),
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.DodecahedronGeometry(1.2, 0),
        new THREE.ConeGeometry(0.8, 1.5, 6),
      ];

      const colors = [0x1e293b, 0x334155, 0x475569, 0x64748b];

      for (let i = 0; i < 50; i++) {
        const geometry =
          geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          wireframe: true,
          transparent: true,
          opacity: 0.4 + Math.random() * 0.3,
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 80;
        mesh.position.z = (Math.random() - 0.5) * 50;

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        mesh.userData = {
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015,
          },
          floatSpeed: Math.random() * 0.5 + 0.5,
          floatOffset: Math.random() * Math.PI * 2,
        };

        objects.push(mesh);
        scene.add(mesh);
      }
    }

    function animate3D() {
      if (isDarkMode()) {
        return;
      }

      animationId = requestAnimationFrame(animate3D);
      const time = Date.now() * 0.001;

      objects.forEach((obj) => {
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.position.y +=
          Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) *
          0.01;
      });

      renderer.render(scene, camera);
    }

    let ctx,
      particles = [];

    function initConstellation() {
      const c2d = createCanvas2D();
      ctx = c2d.getContext("2d");
      c2d.width = window.innerWidth;
      c2d.height = window.innerHeight;

      particles = [];
      const numberOfParticles = Math.floor((c2d.width * c2d.height) / 12000);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * c2d.width,
          y: Math.random() * c2d.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    }

    function animateConstellation() {
      if (!isDarkMode()) return;

      const c2d = canvas2D;
      ctx.clearRect(0, 0, c2d.width, c2d.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > c2d.width) p.speedX *= -1;
        if (p.y < 0 || p.y > c2d.height) p.speedY *= -1;

        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(148, 163, 184, ${(1 - dist / 120) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateConstellation);
    }

    function switchMode() {
      if (isDarkMode()) {
        canvas.style.display = "none";
        createCanvas2D().style.display = "block";
        initConstellation();
        animateConstellation();
      } else {
        if (canvas2D) canvas2D.style.display = "none";
        canvas.style.display = "block";
        if (!scene) init3D();
        animate3D();
      }
    }

    window.addEventListener("resize", () => {
      if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      if (isDarkMode()) initConstellation();
    });

    const observer = new MutationObserver(() => switchMode());
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    switchMode();
  }

  const navbarBrand = document.querySelector(".navbar-brand");

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  navbarBrand?.addEventListener("dblclick", (e) => {
    e.preventDefault();
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });

  const navbarToggle = document.getElementById("navbar-toggle");
  const offcanvas = document.getElementById("offcanvas");
  const offcanvasOverlay = document.getElementById("offcanvas-overlay");
  const offcanvasClose = document.getElementById("offcanvas-close");

  function openOffcanvas() {
    offcanvas?.classList.add("active");
    offcanvasOverlay?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeOffcanvas() {
    offcanvas?.classList.remove("active");
    offcanvasOverlay?.classList.remove("active");
    document.body.style.overflow = "";
  }

  navbarToggle?.addEventListener("click", openOffcanvas);
  offcanvasClose?.addEventListener("click", closeOffcanvas);
  offcanvasOverlay?.addEventListener("click", closeOffcanvas);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOffcanvas();
  });

  const typewriterElement = document.querySelector(".typewriter-text");
  const cursorElement = document.querySelector(".typewriter-cursor");

  if (typewriterElement) {
    const roles = ["Frontend Developer", "Web Enthusiast", "Photography"];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        cursorElement?.classList.add("hidden");
        const chars = typewriterElement.querySelectorAll(
          ".char:not(.deleting)"
        );
        if (chars.length > 0) {
          const lastChar = chars[chars.length - 1];
          lastChar.classList.add("deleting");
          setTimeout(() => lastChar.remove(), 300);
        }
        charIndex--;
        typingSpeed = 60;
      } else {
        cursorElement?.classList.remove("hidden");
        if (charIndex < currentRole.length) {
          const char = currentRole[charIndex];
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = char === " " ? "\u00A0" : char;
          typewriterElement.appendChild(span);
          charIndex++;
          typingSpeed = 80;
        }
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(typeWriter, typingSpeed);
    }

    setTimeout(typeWriter, 1000);
  }

  const sidebarLinks = document.querySelectorAll(".sidebar-link");

  function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      e.preventDefault();
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const statNumbers = document.querySelectorAll(".stat-number");
  let hasAnimated = false;

  function animateCounters() {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"));
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;

      const counter = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(counter);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  const aboutSection = document.getElementById("about-me");
  if (aboutSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(aboutSection);
  }

  const carouselCards = document.querySelectorAll(".carousel-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  let currentIndex = 2;

  function updateCarousel() {
    carouselCards.forEach((card, index) => {
      card.classList.remove("active", "adjacent");

      if (index === currentIndex) {
        card.classList.add("active");
      } else if (index === currentIndex - 1 || index === currentIndex + 1) {
        card.classList.add("adjacent");
      }
    });
  }

  if (prevBtn && nextBtn && carouselCards.length > 0) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < carouselCards.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    });

    carouselCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    updateCarousel();
  }
});
