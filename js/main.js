/**
 * EVEREST ENTERPRISES — CLIENT INTERACTIVITY & UI LOGIC
 * Engineering • Electrical • Infrastructure
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const copyGstinBtns = document.querySelectorAll('.btn-copy-gstin');
  const contactForm = document.getElementById('corporate-inquiry-form');
  const formToast = document.getElementById('form-feedback-toast');
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  const currentYearSpan = document.getElementById('current-year');

  // Modal elements
  const boomLiftModal = document.getElementById('boom-lift-modal');
  const openModalBtns = document.querySelectorAll('[data-open-modal="boom-lift"]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  // Set current year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------
     1. STICKY HEADER & SCROLL STATE
     ---------------------------------------------------- */
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ----------------------------------------------------
     2. MOBILE MENU DRAWER
     ---------------------------------------------------- */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on navigation link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------
     3. SCROLL SPY (ACTIVE NAV LINK)
     ---------------------------------------------------- */
  const spySections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && spySections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    });

    spySections.forEach(section => navObserver.observe(section));
  }

  /* ----------------------------------------------------
     4. COPY GSTIN TO CLIPBOARD
     ---------------------------------------------------- */
  const gstinNumber = '33GPXPS4036E1ZG';
  copyGstinBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(gstinNumber);
        const originalContent = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalContent;
        }, 2000);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  });

  /* ----------------------------------------------------
     5. SERVICE ANCHOR AUTO-SELECTION
     ---------------------------------------------------- */
  document.querySelectorAll('[data-select-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-select-service');
      const serviceSelect = document.getElementById('client-service');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
              serviceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      const nameInput = document.getElementById('client-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 600);
      }
    });
  });

  /* ----------------------------------------------------
     6. STATIC ENQUIRY FORM & WHATSAPP DISPATCH (+91 9841600999)
     ---------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('client-name');
      const phoneEl = document.getElementById('client-phone');
      const emailEl = document.getElementById('client-email');
      const serviceEl = document.getElementById('client-service');
      const messageEl = document.getElementById('client-message');

      const name = nameEl ? nameEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const service = serviceEl ? serviceEl.value : '';
      const message = messageEl ? messageEl.value.trim() : '';

      if (!name || !phone || !email || !message) {
        if (formToast) {
          formToast.className = 'form-toast error';
          formToast.innerHTML = 'Please fill in all required fields (Name, Phone, Email, Message).';
          formToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Build structured WhatsApp inquiry message
      let waText = `*PROJECT ENQUIRY — EVEREST ENTERPRISES*\n`;
      waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waText += `*Name / Firm:* ${name}\n`;
      waText += `*Phone:* ${phone}\n`;
      waText += `*Email:* ${email}\n`;
      waText += `*Service Category:* ${service || 'General Contracting Inquiry'}\n`;
      waText += `*Scope / Message:* ${message}\n`;
      waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waText += `_Dispatched via official portal (GSTIN: 33GPXPS4036E1ZG)_`;

      const whatsappUrl = `https://wa.me/919841600999?text=${encodeURIComponent(waText)}`;

      // Present clean feedback
      if (formToast) {
        formToast.className = 'form-toast success';
        formToast.innerHTML = `
          <div>
            <strong>Enquiry Ready to Connect!</strong><br>
            Thank you <strong>${name}</strong>. Opening direct WhatsApp line (+91 9841600999) to transmit your specifications.
            <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="min-height:38px; padding:6px 14px; font-size:0.8125rem;">
                Open WhatsApp Now
              </a>
              <a href="tel:9841600999" class="btn btn-primary" style="min-height:38px; padding:6px 14px; font-size:0.8125rem;">
                Call 9841600999
              </a>
            </div>
          </div>
        `;
        formToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Launch WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
    });
  }

  /* ----------------------------------------------------
     7. BOOM LIFT MODAL CONTROLLER
     ---------------------------------------------------- */
  if (boomLiftModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        boomLiftModal.hidden = false;
        setTimeout(() => boomLiftModal.classList.add('open'), 10);
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      boomLiftModal.classList.remove('open');
      setTimeout(() => {
        boomLiftModal.hidden = true;
      }, 300);
      document.body.style.overflow = '';
    };

    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    boomLiftModal.addEventListener('click', (e) => {
      if (e.target === boomLiftModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && boomLiftModal.classList.contains('open')) {
        closeModal();
      }
    });

    if (modalWaBtn) {
      modalWaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const loc = document.getElementById('modal-site-location')?.value.trim() || '';
        const dur = document.getElementById('modal-rental-duration')?.value || '';

        if (!loc) {
          alert('Please specify your site location.');
          return;
        }

        let msg = `*11M BOOM LIFT DEPLOYMENT INQUIRY*\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `*Site Location:* ${loc}\n`;
        msg += `*Estimated Duration:* ${dur}\n`;
        msg += `*Company:* Everest Enterprises (Kancheepuram)\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━━`;

        window.open(`https://wa.me/919841600999?text=${encodeURIComponent(msg)}`, '_blank');
        closeModal();
      });
    }
  }

  /* ----------------------------------------------------
     8. BACK TO TOP SCROLL
     ---------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------
     9. SCROLL REVEAL (INTERSECTION OBSERVER)
     ---------------------------------------------------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.service-card, .why-card, .process-stage-item, .contact-info-card');
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      scrollObserver.observe(el);
    });
  }
});
