// =====================================================
// VISION MOTION PICTURES
// Main JavaScript
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  // Sticky Header
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 60) {
      header.style.background = "rgba(0,0,0,0.85)";
    } else {
      header.style.background = "rgba(0,0,0,0.45)";
    }
  });

  // Fade-up Animation
  const items = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.15
  });

  items.forEach(item => observer.observe(item));

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

      const id = this.getAttribute("href");

      if (id.length > 1) {

        e.preventDefault();

        const target = document.querySelector(id);

        if (target) {

          target.scrollIntoView({

            behavior: "smooth"

          });

        }

      }

    });

  });

});

// Back To Top Button

const backTop = document.createElement("button");

backTop.innerHTML = "↑";

backTop.id = "backToTop";

Object.assign(backTop.style, {

  position: "fixed",

  right: "20px",

  bottom: "20px",

  width: "50px",

  height: "50px",

  borderRadius: "50%",

  border: "none",

  background: "#c9a227",

  color: "#000",

  fontSize: "22px",

  cursor: "pointer",

  display: "none",

  zIndex: "9999"

});

document.body.appendChild(backTop);

window.addEventListener("scroll", () => {

  backTop.style.display = window.scrollY > 500 ? "block" : "none";

});

backTop.addEventListener("click", () => {

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

});
/* ========================================================= */
/* PREMIUM PRELOADER */
/* ========================================================= */

window.addEventListener("load",()=>{

const loader=document.getElementById("preloader");

setTimeout(()=>{

loader.style.opacity="0";

loader.style.visibility="hidden";

},2500);

});
