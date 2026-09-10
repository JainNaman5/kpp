/* ===================================================
   Kirti Printing Press — main.js
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky nav on scroll ─────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on mobile link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* ── Smooth anchor scroll ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 64;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ── Scroll-reveal via IntersectionObserver ───── */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ── Staggered service card reveal ───────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(serviceCards).indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 40);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    serviceCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      cardObserver.observe(card);
    });
  }

  /* ── Animated counters ──────────────────────── */
  const counterEls = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => countObserver.observe(el));
  }

  /* ── Contact form submit (Instant WhatsApp Inquiry) ── */
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const phone = document.getElementById('form-phone')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const service = document.getElementById('form-service')?.value;
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !message) {
      alert('Please enter your name and message before submitting.');
      return;
    }

    // Build structured inquiry text for WhatsApp
    let text = `*New Printing Inquiry — Kirti Printing Press*\n\n`;
    text += `👤 *Customer Name:* ${name}\n`;
    if (phone) text += `📞 *Phone Number:* ${phone}\n`;
    if (email) text += `✉️ *Email Address:* ${email}\n`;
    if (service) text += `🖨️ *Service Required:* ${service}\n`;
    text += `📝 *Message / Order Details:* ${message}\n\n`;
    text += `📎 *File Attachment Note:* Kindly share any design files, documents, or artwork for printing (PDF, PNG, JPG, AI, CDR, etc.) directly in this chat. Thank you!`;

    const whatsappUrl = `https://wa.me/919826655655?text=${encodeURIComponent(text)}`;

    const btn = contactForm.querySelector('.form-submit');
    const originalContent = btn.innerHTML;

    btn.innerHTML = '💬 &nbsp; Opening WhatsApp…';
    btn.style.background = '#25D366';
    btn.disabled = true;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      btn.innerHTML = '✅ &nbsp; Sent to WhatsApp!';

      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 400);
  });

});
