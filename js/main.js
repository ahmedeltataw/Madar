var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  let preloader = document.querySelector('.preLoader');
  setTimeout(() => {
    if(preloader){
      preloader.style.display = 'none';
    }
  }, 1000); // Adjust the timeout value as needed
  

});
// intro gsap
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

lenis.on("scroll", () => {
  ScrollTrigger.update(); // This correctly updates all ScrollTriggers
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.addEventListener("load", () => {
  const introTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "main",
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: true,
      markers: false,
      
      onLeave: () => {
        // ✅ Now init the SplitText animation AFTER intro scroll finishes
        animateSplitText();
        animateImages();
        animateFadeIn();
      }
    }
  });

  introTimeline
    .to(".intro img", {
      scale: 2,
      z: 400,
      transformOrigin: "center 20%",
      autoAlpha: 0,
    })
    .to(".intro", {
      autoAlpha: 0,
      
      ease: "power3.out",
    })

    
    .to(".hero", {
      scale: 1.01,
      transformOrigin: "center center",
      autoAlpha: 1,
      duration: 1,
      ease: "power3.out",
    })
});

// 👇 This is the  preloader animation


// 👇 This function sets up the SplitText animation
function animateSplitText() {
  const splitElements = document.querySelectorAll(".split-text");

  splitElements.forEach((el) => {
    const split = new SplitText(el, { type: "lines,words" });

    gsap.from(split.words, {
      opacity: 0,
      x: 20,
      stagger: 0.05,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
      autoAlpha: 0,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 40%",
        toggleActions: "play none none reverse",
        markers: false, // Set to true for debugging
      }
    });
  });
}
function animateImages() {
  gsap.utils.toArray('.imgDownUp').forEach(img => {
    gsap.to(img, {
      opacity: 1,
      clipPath: 'inset(0 0 0 0)',
      y: 0,
      duration: .7,
      ease: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      scrollTrigger: {
        trigger: img,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });
  });

  gsap.utils.toArray('.imgUpDown').forEach(img => {
    gsap.to(img, {
      opacity: 1,
      clipPath: 'inset(0 0 0 0)',
      y: 0,
      duration: .7,
      ease: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      scrollTrigger: {
        trigger: img,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });
  });
}

function animateFadeIn() {
  gsap.utils.toArray('.fadeIn').forEach(fade => {
    gsap.fromTo(fade, { opacity: 0, y: 50 }, {
      opacity: 1,
      y: 0,
      duration: .9,
      scrollTrigger: {
        trigger: fade,
        start: "top 90%",
        end: "bottom center",
        toggleActions: "play none none reverse",
        // markers: true // Remove this after debugging
      }
    });
  });
}












