new Swiper(".mySwiper", {
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
document.addEventListener('DOMContentLoaded', function () {
  let preloader = document.querySelector('.preLoader');
  setTimeout(() => {
    if (preloader) {
      preloader.style.display = 'none';
    }
  }, 1000); // Adjust the timeout value as needed


});

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

lenis.on("scroll", () => {
  ScrollTrigger.update(); // This correctly updates all ScrollTriggers
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// =====================================================
// Smooth scroll navigation (Lenis-powered)
// =====================================================
(function () {
  const scrollLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));
  const spySections = document.querySelectorAll('section[id]');
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mirror the CSS `scroll-margin-top` so the Lenis path and the native
  // fallback (no-JS) land on the exact same spot.
  function targetOffset(target) {
    const value = parseFloat(window.getComputedStyle(target).scrollMarginTop);
    return Number.isFinite(value) ? value : 0;
  }

  function getTarget(hash) {
    if (!hash || hash.length < 2 || hash.indexOf('#!') === 0) return null;
    try {
      return document.querySelector(hash);
    } catch (e) {
      return null;
    }
  }

  function scrollToTarget(hash, immediate) {
    const target = getTarget(hash);
    if (!target) return;
    lenis.scrollTo(target, {
      offset: -targetOffset(target),
      immediate: immediate || reduceMotion,
    });
    return target;
  }

  function setActiveNav(hash) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  }

  // 1) Clicking an anchor link → prevent the native jump, push history so
  //    Back/Forward works, animate with Lenis and close the mobile popover.
  scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      const target = getTarget(hash);
      if (!target) return; // keep default behaviour for "#", "#!" etc.

      e.preventDefault();

      const mobileList = document.getElementById('mobileList');
      let popoverOpen = false;
      try {
        popoverOpen = mobileList.matches(':popover-open');
      } catch (e) { /* popover API not supported */ }
      if (mobileList && popoverOpen && typeof mobileList.hidePopover === 'function') {
        mobileList.hidePopover();
      }

      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash);
      }

      scrollToTarget(hash);

      // Move focus for keyboard / screen-reader users without causing a jump.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // 2) Browser Back/Forward — navigate with the URL hash.
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      scrollToTarget(window.location.hash);
    } else {
      lenis.scrollTo(0);
    }
  });

  // 3) Scrollspy — highlight the section currently in a narrow band near the
  //    top of the viewport using Intersection Observer (no scroll listener).
  const spyObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav('#' + entry.target.id);
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 })
    : null;

  if (spyObserver) {
    spySections.forEach((section) => {
      spyObserver.observe(section);
    });
  }

  // 4) Bottom-of-page fallback — keep the last nav item active when the
  //    viewport band falls below the final section.
  lenis.on('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom && spySections.length) {
      setActiveNav('#' + spySections[spySections.length - 1].id);
    }
  });

  // 5) Page loaded with a hash (e.g. reloaded at #contact) → scroll there
  //    after the preloader/animations have settled.
  window.addEventListener('load', () => {
    if (window.location.hash && getTarget(window.location.hash)) {
      setTimeout(() => {
        scrollToTarget(window.location.hash);
      }, 100);
    }
  });
})();

window.addEventListener("load", () => {
  animateSplitText();
  animateFadeIn();
});

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
      }
    });
  });
}

// =====================================================
// Pricing — premium segmented category switcher
// =====================================================
(function () {
  const grid = document.getElementById('pricingGrid');
  const list = document.querySelector('.pricingSwitch');
  const tabs = Array.prototype.slice.call(document.querySelectorAll('.pricingSwitch-btn'));
  if (!grid || !list || !tabs.length) return;

  const isRTL = document.documentElement.dir === 'rtl';

  const PRICING_DATA = {
    companies: [
      {
        name: 'باقة 3 أشهر',
        trips: '4 رحلات',
        desc: 'باقة انطلاق مرنة لإدارة رحلاتك والتعرف على النظام، مع إمكانية إضافة رحلات أو الترقية في أي وقت.',
        amount: '400',
        currency: 'ريال / 3 أشهر',
        features: [
          'إدارة رحلات متعددة بنفس الوقت',
          'رابط فريد لكل مدار',
          'نظام تأكيد حضور واعتذار تلقائي',
          'تصدير البيانات بصيغة Excel',
          'دعم فني متكامل',
        ],
        cta: 'ابدأ رحلتك',
      },
      {
        featured: true,
        badge: 'الأكثر طلباً',
        name: 'باقة 6 أشهر',
        trips: '10 رحلات',
        desc: 'الباقة الأكثر توازناً لمؤسستك، رحلات أكثر وسعة إدارة أكبر مع كامل المزايا.',
        amount: '700',
        currency: 'ريال / 6 أشهر',
        features: [
          'إدارة رحلات متعددة بنفس الوقت',
          'منع تكرار التسجيل',
          'نظام تأكيد حضور واعتذار تلقائي',
          'إحصائيات تفصيلية',
          'دعم فني متكامل',
        ],
        cta: 'اختر الباقة',
      },
      {
        name: 'باقة 12 شهر',
        trips: '22 رحلة',
        desc: 'باقة موسم كامل بأعلى عدد رحلات وأفضل قيمة لمؤسستك على المدى الطويل.',
        amount: '1200',
        currency: 'ريال / 12 شهر',
        features: [
          'إدارة رحلات متعددة بنفس الوقت',
          'جمع بيانات المشاركين بسهولة',
          'إعادة استخدام الرحلات',
          'خيارات بحث وفلترة شاملة',
          'دعم فني متكامل',
        ],
        cta: 'اشترك الآن',
      },
    ],
    charities: [
      {
        name: 'باقة 3 أشهر',
        trips: '4 رحلات',
        desc: 'باقة انطلاق ميسّرة للجمعيات لإدارة رحلاتها والتعرف على النظام، مع إمكانية إضافة رحلات أو الترقية في أي وقت.',
        amount: '200',
        currency: 'ريال / 3 أشهر',
        features: [
          'إدارة رحلات متعددة بنفس الوقت',
          'رابط فريد لكل جمعية',
          'نظام تأكيد حضور واعتذار تلقائي',
          'تصدير البيانات بصيغة Excel',
          'دعم فني متكامل',
        ],
        cta: 'سجّل جمعيتك',
      },
      {
        featured: true,
        badge: 'مفضل الجمعيات',
        name: 'باقة 6 أشهر',
        trips: '10 رحلات',
        desc: 'الباقة الأكثر توازناً للجمعيات، رحلات أكثر وتكلفة مناسبة لميزانيات القطاع غير الربحي.',
        amount: '350',
        currency: 'ريال / 6 أشهر',
        features: [
          'إدارة رحلات متعددة بنفس الوقت',
          'منع تكرار التسجيل',
          'نظام تأكيد حضور واعتذار تلقائي',
          'إحصائيات تفصيلية',
          'دعم فني متكامل',
        ],
        cta: 'اطلب الباقة',
      },
      {
        name: 'باقة 12 شهر',
        trips: '22 رحلة',
        desc: 'باقة موسم كامل بأفضل قيمة لجمعيتك على مدار العام دون قلق من الميزانية.',
        amount: '600',
        currency: 'ريال / 12 شهر',
        features: [
          'إدارة رحلات متعددة بنفس الوقت',
          'جمع بيانات المشاركين بسهولة',
          'إعادة استخدام الرحلات',
          'خيارات بحث وفلترة شاملة',
          'دعم فني متكامل',
        ],
        cta: 'اشترك الآن',
      },
    ],
  };

  function cardHTML(c) {
    return (
      '<article class="priceCard' + (c.featured ? ' featured' : '') + '">' +
        (c.featured ? '<span class="badge fs-12">' + c.badge + '</span>' : '') +
        '<div class="cardHead">' +
          '<h3 class="fs-24">' + c.name + '</h3>' +
          '<p class="trips fs-16"><i class="fa-light fa-route" aria-hidden="true"></i><span>' + c.trips + '</span></p>' +
        '</div>' +
        '<p class="desc fs-16">' + c.desc + '</p>' +
        '<div class="priceBox">' +
          '<span class="amount fs-48 fw-800">' + c.amount + '</span>' +
          '<span class="currency fs-16">' + c.currency + '</span>' +
        '</div>' +
        '<ul class="features">' +
          c.features.map(function (f) {
            return '<li><i class="fa-solid fa-check" aria-hidden="true"></i><span>' + f + '</span></li>';
          }).join('') +
        '</ul>' +
        '<a href="https://wa.me/966547164990" class="btn btn-rounded">' + c.cta +
          '<i class="fa-solid fa-paper-plane ps-2" aria-hidden="true"></i>' +
        '</a>' +
      '</article>'
    );
  }

  function render(category) {
    grid.innerHTML = PRICING_DATA[category].map(cardHTML).join('');
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  let current = 'companies';

  function activate(tab) {
    const category = tab.getAttribute('data-category');
    if (category === current) return;
    current = category;

    tabs.forEach(function (t) {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
    });

    const idx = tabs.indexOf(tab);
    list.style.setProperty('--ind-x', idx === 0 ? '0px' : '-100%');

    grid.querySelectorAll('.priceCard').forEach(function (card) {
      gsap.killTweensOf(card);
    });

    gsap.to(grid, {
      opacity: 0,
      y: 24,
      duration: 0.15,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: function () {
        render(category);
        gsap.fromTo(grid, { opacity: 0, y: 24 }, {
          opacity: 1,
          y: 0,
          duration: 0.32,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      },
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activate(tab);
    });

    tab.addEventListener('keydown', function (e) {
      const idx = tabs.indexOf(tab);
      let next = null;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next = tabs[isRTL ? idx - 1 : idx + 1];
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        next = tabs[isRTL ? idx + 1 : idx - 1];
      } else if (e.key === 'Home') {
        e.preventDefault();
        next = tabs[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        next = tabs[tabs.length - 1];
      }

      if (next) {
        next.focus();
        activate(next);
      }
    });
  });
})();












