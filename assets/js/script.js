document.addEventListener("DOMContentLoaded", () => {
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
