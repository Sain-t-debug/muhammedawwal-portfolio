(function () {
  'use strict';
  var root = document.documentElement;
  
// Mobile hamburger menu
var menuToggle = document.getElementById('menuToggle');
var mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    function closeMenu() {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('open');

        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
    }

    menuToggle.addEventListener('click', function () {
        var isOpen = mainNav.classList.toggle('open');

        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute(
            'aria-label',
            isOpen ? 'Close navigation menu' : 'Open navigation menu'
        );
    });

    // Close the menu after selecting a navigation link
    mainNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Close with Escape
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMenu();
            menuToggle.focus();
        }
    });

    // Reset mobile menu when returning to desktop layout
    window.addEventListener('resize', function () {
        if (window.innerWidth > 820) {
            closeMenu();
        }
    });
}


  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Theme toggle (remembers your choice)
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}
  document.getElementById('themeBtn').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Copy email button
  document.getElementById('copyBtn').addEventListener('click', function () {
    var email = document.getElementById('mailBtn').textContent.trim();
    var msg = document.getElementById('copyMsg');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () {
        msg.textContent = 'Email copied to clipboard';
      }, function () { msg.textContent = 'Copy failed. Please copy it manually.'; });
    } else {
      msg.textContent = 'Copy is not supported here. Please copy it manually.';
    }
  });

  // Scroll progress bar
  var bar = document.getElementById('progress');
  var ticking = false;
  function updateBar() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = 'scaleX(' + pct + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
  }, { passive: true });
  updateBar();

  // Staggered reveal for cards, skills, timeline items, etc.
  var sections = document.querySelectorAll('.fade');
  sections.forEach(function (sec) {
    sec.querySelectorAll('.skill,.value,.card,.timeline li,.facts,.contact-box').forEach(function (el, i) {
      el.classList.add('rv');
      el.style.setProperty('--d', (i * 90) + 'ms');
    });
  });

  function settle(sec) {
    // After the entrance finishes, drop the reveal class so hover effects feel instant
    setTimeout(function () {
      sec.querySelectorAll('.rv').forEach(function (el) {
        el.classList.remove('rv');
        el.style.removeProperty('--d');
      });
    }, 1800);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          settle(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    sections.forEach(function (s) { io.observe(s); });

    // Highlight the nav link of the section in view
    var links = document.querySelectorAll('nav a[href^="#"]');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) {
            a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add('in'); settle(s); });
  }
})();
