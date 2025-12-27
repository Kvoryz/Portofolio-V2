document.addEventListener("DOMContentLoaded", () => {
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

  // Project Carousel
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
