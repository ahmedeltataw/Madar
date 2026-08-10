// =====================================================
// Trusted clients — dynamic logo marquee
// =====================================================
// -----------------------------------------------------
// Language detection - both languages share the same
// renderers; only the content data switches. Arabic
// pages use lang="ar" (the default), English pages use
// lang="en".
// -----------------------------------------------------
const MADAR_LANG = (document.documentElement.lang || 'ar').toLowerCase();
const isEnglish = MADAR_LANG === 'en';

(function () {
  const track = document.getElementById('clientsTrack');
  const staticList = document.getElementById('clientsStatic');
  if (!track) return;

  // Temporary placeholder — reuse the existing MADAR logo asset. When the
  // real client logos arrive, replace the entries below with { name, logo }.
  // No component or markup changes are needed afterwards.
  const MADAR_LOGO = 'img/logo.png';

  const AR_CLIENTS = [
    { name: 'الجمعيات الخيرية', logo: MADAR_LOGO },
    { name: 'الشركات والمؤسسات', logo: MADAR_LOGO },
    { name: 'المراكز الإسلامية', logo: MADAR_LOGO },
    { name: 'المؤسسات التعليمية', logo: MADAR_LOGO },
    { name: 'مؤسسات الحج والعمرة', logo: MADAR_LOGO },
    { name: 'منظمات الرحلات', logo: MADAR_LOGO },
  ];

  const clients = isEnglish ? [
    { name: 'Charities', logo: MADAR_LOGO },
    { name: 'Companies & Organizations', logo: MADAR_LOGO },
    { name: 'Islamic Centers', logo: MADAR_LOGO },
    { name: 'Educational Institutions', logo: MADAR_LOGO },
    { name: 'Hajj & Umrah Offices', logo: MADAR_LOGO },
    { name: 'Trip Organizers', logo: MADAR_LOGO },
  ] : AR_CLIENTS;

  function itemHTML(c) {
    const alt = isEnglish ? 'Logo of ' + c.name : 'شعار ' + c.name;
    return (
      '<figure class="clientLogo">' +
        '<img src="' + c.logo + '" alt="' + alt + '" loading="lazy">' +
        '<figcaption>' + c.name + '</figcaption>' +
      '</figure>'
    );
  }

  // Render ONE set (TRACK A) and duplicate it (TRACK B) at render time to
  // build the [A][B] infinite loop. The data lives in a single source
  // (`clients`); only the markup is repeated. The CSS translates the combined
  // track by exactly the width of one set, so B takes A's place pixel-for-
  // pixel and the loop is seamless. Adding a client later just works.
  const set = '<div class="clientsSet">' + clients.map(itemHTML).join('') + '</div>';
  track.innerHTML = set + set;

  if (staticList) {
    staticList.innerHTML = clients.map(function (c) {
      return '<li>' + itemHTML(c) + '</li>';
    }).join('');
  }
})();

// Wait for DOM to be ready
// document.addEventListener('DOMContentLoaded', function () {
//   let preloader = document.querySelector('.preLoader');
//   setTimeout(() => {
//     if (preloader) {
//       preloader.style.display = 'none';
//     }
//   }, 1000); // Adjust the timeout value as needed


// });

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
// (function () {
//   const scrollLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));
//   const spySections = document.querySelectorAll('section[id]');
//   const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
//   const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

//   // Mirror the CSS `scroll-margin-top` so the Lenis path and the native
//   // fallback (no-JS) land on the exact same spot.
//   function targetOffset(target) {
//     const value = parseFloat(window.getComputedStyle(target).scrollMarginTop);
//     return Number.isFinite(value) ? value : 0;
//   }

//   function getTarget(hash) {
//     if (!hash || hash.length < 2 || hash.indexOf('#!') === 0) return null;
//     try {
//       return document.querySelector(hash);
//     } catch (e) {
//       return null;
//     }
//   }

//   function scrollToTarget(hash, immediate) {
//     const target = getTarget(hash);
//     if (!target) return;
//     lenis.scrollTo(target, {
//       offset: -targetOffset(target),
//       immediate: immediate || reduceMotion,
//     });
//     return target;
//   }

//   function setActiveNav(hash) {
//     navLinks.forEach((link) => {
//       link.classList.toggle('active', link.getAttribute('href') === hash);
//     });
//   }

//   // 1) Clicking an anchor link → prevent the native jump, push history so
//   //    Back/Forward works, animate with Lenis and close the mobile popover.
//   scrollLinks.forEach((link) => {
//     link.addEventListener('click', (e) => {
//       const hash = link.getAttribute('href');
//       const target = getTarget(hash);
//       if (!target) return; // keep default behaviour for "#", "#!" etc.

//       e.preventDefault();

//       const mobileList = document.getElementById('mobileList');
//       let popoverOpen = false;
//       try {
//         popoverOpen = mobileList.matches(':popover-open');
//       } catch (e) { /* popover API not supported */ }
//       if (mobileList && popoverOpen && typeof mobileList.hidePopover === 'function') {
//         mobileList.hidePopover();
//       }

//       if (window.location.hash !== hash) {
//         window.history.pushState(null, '', hash);
//       }

//       scrollToTarget(hash);

//       // Move focus for keyboard / screen-reader users without causing a jump.
//       target.setAttribute('tabindex', '-1');
//       target.focus({ preventScroll: true });
//     });
//   });

//   // 2) Browser Back/Forward — navigate with the URL hash.
//   window.addEventListener('popstate', () => {
//     if (window.location.hash) {
//       scrollToTarget(window.location.hash);
//     } else {
//       lenis.scrollTo(0);
//     }
//   });

//   // 3) Scrollspy — highlight the section currently in a narrow band near the
//   //    top of the viewport using Intersection Observer (no scroll listener).
//   const spyObserver = 'IntersectionObserver' in window
//     ? new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveNav('#' + entry.target.id);
//           }
//         });
//       }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 })
//     : null;

//   if (spyObserver) {
//     spySections.forEach((section) => {
//       spyObserver.observe(section);
//     });
//   }

//   // 4) Bottom-of-page fallback — keep the last nav item active when the
//   //    viewport band falls below the final section.
//   lenis.on('scroll', () => {
//     const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
//     if (atBottom && spySections.length) {
//       setActiveNav('#' + spySections[spySections.length - 1].id);
//     }
//   });

//   // 5) Page loaded with a hash (e.g. reloaded at #contact) → scroll there
//   //    after the preloader/animations have settled.
//   window.addEventListener('load', () => {
//     if (window.location.hash && getTarget(window.location.hash)) {
//       setTimeout(() => {
//         scrollToTarget(window.location.hash);
//       }, 100);
//     }
//   });
// })();

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
  const panel = document.getElementById('pricingPanel');
  const list = document.querySelector('.pricingSwitch');
  const tabs = Array.prototype.slice.call(document.querySelectorAll('.pricingSwitch-btn'));
  if (!grid || !panel || !list || !tabs.length) return;

  const isRTL = document.documentElement.dir === 'rtl';

  // Single source of truth for the pricing categories. Each key maps to a tab
  // through the matching data-category attribute; the grid renders `plans`.
  // A category with an empty `plans` array shows a clearly marked placeholder
  // card until real data is provided.
  const pricingCategoriesAr = {
    companies: {
      label: 'الشركات الربحية',
      icon: 'fa-solid fa-building',
      plans: [
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
    },
    charities: {
      label: 'الجمعيات الخيرية',
      icon: 'fa-solid fa-hand-holding-heart',
      plans: [
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
    },
    independentOffices: {
      label: 'المكاتب المستقلة',
      icon: 'fa-solid fa-briefcase',
      // ⚠️ PLACEHOLDER — pricing for independent offices has not been provided
      // yet. When the client supplies the packages, fill this array using the
      // same plan shape as the other categories and the grid renders them
      // automatically. No invented prices, trips or features are shown here.
      plans: [],
    },
  };

  const pricingCategoriesEn = {
    companies: {
      label: 'For-profit companies',
      icon: 'fa-solid fa-building',
      plans: [
        {
          name: '3-Month Plan',
          trips: '4 trips',
          desc: 'A flexible starter plan to manage your trips and get familiar with the platform, with the option to add trips or upgrade at any time.',
          amount: '400',
          currency: 'SAR / 3 months',
          features: [
            'Manage multiple trips at the same time',
            'Unique registration link per trip',
            'Automatic attendance and apology system',
            'Export data to Excel',
            'Full technical support',
          ],
          cta: 'Start your trip',
        },
        {
          featured: true,
          badge: 'Most popular',
          name: '6-Month Plan',
          trips: '10 trips',
          desc: 'The most balanced plan for your organization — more trips, greater management capacity, and all features included.',
          amount: '700',
          currency: 'SAR / 6 months',
          features: [
            'Manage multiple trips at the same time',
            'Prevent duplicate registrations',
            'Automatic attendance and apology system',
            'Detailed statistics',
            'Full technical support',
          ],
          cta: 'Choose plan',
        },
        {
          name: '12-Month Plan',
          trips: '22 trips',
          desc: 'A full-season plan with the highest number of trips and the best value for your organization over the long term.',
          amount: '1,200',
          currency: 'SAR / 12 months',
          features: [
            'Manage multiple trips at the same time',
            'Collect participant data easily',
            'Reuse your trips',
            'Comprehensive search and filtering options',
            'Full technical support',
          ],
          cta: 'Subscribe now',
        },
      ],
    },
    charities: {
      label: 'Charities',
      icon: 'fa-solid fa-hand-holding-heart',
      plans: [
        {
          name: '3-Month Plan',
          trips: '4 trips',
          desc: 'A flexible starter plan for charities to manage their trips, with the option to add trips or upgrade at any time.',
          amount: '200',
          currency: 'SAR / 3 months',
          features: [
            'Manage multiple trips at the same time',
            'Unique registration link per trip',
            'Automatic attendance and apology system',
            'Export data to Excel',
            'Full technical support',
          ],
          cta: 'Choose plan',
        },
        {
          featured: true,
          badge: 'For charities',
          name: '6-Month Plan',
          trips: '10 trips',
          desc: 'A balanced plan for charities with more trips, detailed statistics, and everything you need to run your operations.',
          amount: '350',
          currency: 'SAR / 6 months',
          features: [
            'Manage multiple trips at the same time',
            'Prevent duplicate registrations',
            'Automatic attendance and apology system',
            'Detailed statistics',
            'Full technical support',
          ],
          cta: 'Choose plan',
        },
        {
          name: '12-Month Plan',
          trips: '22 trips',
          desc: 'A full-season plan for charities with the highest number of trips at the best value.',
          amount: '600',
          currency: 'SAR / 12 months',
          features: [
            'Manage multiple trips at the same time',
            'Collect participant data easily',
            'Reuse your trips',
            'Comprehensive search and filtering options',
            'Full technical support',
          ],
          cta: 'Subscribe now',
        },
      ],
    },
    independentOffices: {
      label: 'Independent offices',
      icon: 'fa-solid fa-briefcase',
      plans: [],
    },
  };

  const pricingCategories = isEnglish ? pricingCategoriesEn : pricingCategoriesAr;

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

  function placeholderHTML(category) {
    const t = isEnglish ? {
      badge: 'Coming soon',
      title: 'Plans for ',
      status: 'In preparation',
      desc: 'Plans for this category are coming soon. Contact us to set up your subscription as soon as possible.',
      priceNote: 'Price to be agreed',
      cta: 'Contact us',
    } : {
      badge: 'قريباً',
      title: 'باقة ',
      status: 'قيد التجهيز',
      desc: 'سيتم إضافة باقات هذه الفئة قريباً. تواصل معنا لتجهيز اشتراكك في أقرب وقت.',
      priceNote: 'قيمة تبدأ بالاتفاق',
      cta: 'تواصل معنا',
    };
    return (
      '<article class="priceCard priceCard--comingSoon">' +
        '<span class="badge fs-12">' + t.badge + '</span>' +
        '<div class="cardHead">' +
          '<h3 class="fs-24">' + t.title + category.label + '</h3>' +
          '<p class="trips fs-16"><i class="fa-light fa-hourglass-half" aria-hidden="true"></i><span>' + t.status + '</span></p>' +
        '</div>' +
        '<p class="desc fs-16">' +
          t.desc +
        '</p>' +
        '<div class="priceBox">' +
          '<span class="amount fs-48 fw-800">-</span>' +
          '<span class="currency fs-16">' + t.priceNote + '</span>' +
        '</div>' +
        '<a href="https://wa.me/966547164990" class="btn btn-rounded">' +
          t.cta +
          '<i class="fa-solid fa-paper-plane ps-2" aria-hidden="true"></i>' +
        '</a>' +
      '</article>'
    );
  }

  const GRID_CLASSES = {
    1: 'd-grid grid-col-1 gap-10 pricingGrid-center pricingGrid-narrow',
    2: 'd-grid lg:grid-col-2 md:grid-col-2 grid-col-1 gap-10 pricingGrid-center pricingGrid-wide',
    3: 'd-grid lg:grid-col-3 md:grid-col-2 grid-col-1 gap-10',
    4: 'd-grid lg:grid-col-4 md:grid-col-2 grid-col-1 gap-10',
  };

  function render(category) {
    const plans = pricingCategories[category].plans;
    const count = Math.min(4, Math.max(1, plans.length));
    grid.className = GRID_CLASSES[count];
    grid.innerHTML = plans.length ? plans.map(cardHTML).join('') : placeholderHTML(pricingCategories[category]);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  let current = 'companies';
  let activeTab = tabs[0];

  list.style.setProperty('--tab-count', tabs.length);

  // Move the sliding pill onto the active tab. Offsets are measured in physical
  // pixels, so this stays correct in RTL, LTR and with any future tab count.
  // The pill width is also measured so it always matches the active tab exactly
  // instead of assuming equal thirds (tabs resize when fonts load, etc).
  const pill = document.querySelector('.pricingSwitchPill');

  function positionPill(idx) {
    if (!pill) return;
    const tab = tabs[idx];
    pill.style.width = tab.offsetWidth + 'px';
    list.style.setProperty('--ind-x', (tab.offsetLeft - tabs[0].offsetLeft) + 'px');
  }

  // On narrow screens the three tabs can outgrow the viewport, so after the
  // pill moves we bring the freshly-activated tab back into view.
  const scroller = list;
  function revealTab(tab) {
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  // Re-glue the pill after reflows (viewport resize, font load, RTL switch).
  let resizeRaf = 0;
  window.addEventListener('resize', function () {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(function () {
      resizeRaf = 0;
      positionPill(tabs.indexOf(activeTab));
    });
  });

  // Initial placement — tabs may still be measuring with fallback fonts, so
  // reposition again once the page (and its fonts) have finished loading.
  positionPill(0);
  window.addEventListener('load', function () {
    positionPill(tabs.indexOf(activeTab));
  });

  function activate(tab) {
    const category = tab.getAttribute('data-category');
    if (category === current) return;
    current = category;
    activeTab = tab;

    tabs.forEach(function (t) {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
    });

    const idx = tabs.indexOf(tab);
    positionPill(idx);
    panel.setAttribute('aria-labelledby', tab.id);
    revealTab(tab);

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

// =====================================================
// Close the mobile drawer when a navigation link is tapped.
// =====================================================
(function () {
  const drawer = document.getElementById('mobileList');
  if (!drawer || typeof drawer.hidePopover !== 'function') return;

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      try {
        if (drawer.matches(':popover-open')) drawer.hidePopover();
      } catch (e) { /* popover API not supported */ }
    });
  });
})();












