/* ==========================================================================
   LONDON COURTYARD - APPLICATION JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all site features
  initStickyHeader();
  initMobileNav();
  initScrollSpyAndReveals();
  initHoursCalculator();
  initGalleryFilter();
  initReservationForm();
});

/**
 * 1. Sticky Header
 * Toggles a CSS class when the window is scrolled past 50px.
 */
function initStickyHeader() {
  const header = document.querySelector('.header-wrapper');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check in case of page refresh mid-page
}

/**
 * 2. Mobile Navigation
 * Toggles the drawer menu and icon state.
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    toggleBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  };

  const closeMenu = () => {
    toggleBtn.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * 3. Scroll Spy & Scroll Reveal
 * - Highlights active nav link based on scroll position.
 * - Triggers entrance animations for elements with `.reveal` class.
 */
function initScrollSpyAndReveals() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');

  // Reveal on scroll (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Scroll Spy for active nav highlight
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // offset for nav height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 4. Operating Hours & Real-Time Open/Closed Status
 * Hours:
 * - Mon - Thu: 8:00 AM - 12:00 AM (midnight)
 * - Fri - Sun: 8:00 AM - 1:00 AM (next morning)
 * Note: Uses Pakistan Standard Time (PKT, UTC+5) for accurate calculation
 * if UTC timezone can be inferred, otherwise falls back to local browser time.
 */
function initHoursCalculator() {
  const statusContainer = document.getElementById('store-status');
  if (!statusContainer) return;

  // Let's highlight the current day in the Visit Us hours table
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Calculate local PKT time (UTC+5)
  const getPKTDate = () => {
    const d = new Date();
    // Get UTC milliseconds
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // Add Pakistan offset (+5 hours)
    return new Date(utc + (3600000 * 5));
  };

  const pktDate = getPKTDate();
  const currentDayName = daysOfWeek[pktDate.getDay()];
  const currentHour = pktDate.getHours();
  const currentMinute = pktDate.getMinutes();
  const timeInDecimal = currentHour + currentMinute / 60;

  // Highlight current day row in table
  const tableRows = document.querySelectorAll('.hours-table tbody tr');
  tableRows.forEach(row => {
    const dayCell = row.cells[0]?.textContent.trim();
    if (dayCell) {
      // Check if day matches e.g. "Monday – Thursday" or "Friday – Sunday"
      if ((pktDate.getDay() >= 1 && pktDate.getDay() <= 4 && dayCell.includes('Monday')) ||
          ((pktDate.getDay() === 0 || pktDate.getDay() >= 5) && dayCell.includes('Friday'))) {
        row.classList.add('current-day');
      }
    }
  });

  // Calculate status
  let isOpen = false;
  let nextSchedule = '';

  const day = pktDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Determine opening schedule rules:
  // Mon (1) - Thu (4): 8.00 (8:00 AM) to 24.00 (12:00 AM)
  // Fri (5) - Sun (0): 8.00 (8:00 AM) to 1.00 (1:00 AM of next day)
  
  // To handle hours wrapping past midnight, we need to inspect "today" and "yesterday"
  // For example, if it's Saturday 12:30 AM (timeInDecimal = 0.5), it falls under Friday night hours (closes at 1:00 AM).
  
  // Let's verify if yesterday's shift is still open:
  let yesterdayDay = (day - 1 + 7) % 7;
  let yesterdayOpen = false;

  // Check if yesterday was a weekend day (Fri, Sat, Sun) and it is before 1:00 AM
  if ((yesterdayDay === 5 || yesterdayDay === 6 || yesterdayDay === 0) && timeInDecimal < 1.0) {
    yesterdayOpen = true;
  }
  // Check if yesterday was a weekday (Mon-Thu). It closes at midnight, so no late-night spillover.

  // Check today's normal slot:
  let todayOpen = false;
  if (timeInDecimal >= 8.0) {
    if (day >= 1 && day <= 4) { // Weekdays: Closes at 12:00 AM (24.00)
      if (timeInDecimal < 24.0) todayOpen = true;
    } else { // Weekends: Closes at 1:00 AM next day (spillover checked via yesterday, but for today's portion: it's open up to 24.00)
      todayOpen = true; 
    }
  }

  // Combined status
  if (todayOpen || yesterdayOpen) {
    isOpen = true;
  }

  // Determine closing time descriptive text
  if (isOpen) {
    let closingTime = '12:00 AM';
    if (day === 5 || day === 6 || day === 0 || (day === 1 && timeInDecimal < 1.0)) {
      closingTime = '1:00 AM';
    }
    statusContainer.innerHTML = `
      <span class="status-badge open">Open Now</span>
      <span class="info-detail">Closes at ${closingTime} (PKT)</span>
    `;
  } else {
    statusContainer.innerHTML = `
      <span class="status-badge closed">Closed Now</span>
      <span class="info-detail">Opens at 8:00 AM</span>
    `;
  }
}

/**
 * 5. Gallery Filter
 * Toggles categories in the masonry gallery layout.
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        // Simple animation trigger
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';

        setTimeout(() => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hide');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.classList.add('hide');
          }
        }, 300);
      });
    });
  });
}

/**
 * 6. Reservation Form Handler
 * Validates inputs and generates pre-filled links for WhatsApp or Mailto.
 */
function initReservationForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const size = document.getElementById('booking-size').value;
    const msg = document.getElementById('booking-msg').value.trim();

    if (!name || !phone || !date || !time || !size) {
      alert('Please fill out all required fields.');
      return;
    }

    // Format message
    const emailBody = `Table Reservation Request:
------------------------------------------
Name: ${name}
Phone: ${phone}
Date: ${date}
Time: ${time}
Party Size: ${size} Guests
Message: ${msg || 'None'}
------------------------------------------
Please confirm my booking via reply. Thank you.`;

    const whatsappBody = `Hello London Courtyard, I would like to request a reservation:
*Name:* ${name}
*Phone:* ${phone}
*Date:* ${date}
*Time:* ${time}
*Guests:* ${size}
*Message:* ${msg || 'N/A'}`;

    // Prompt user to choose booking method (WhatsApp or Email)
    const preferWhatsApp = confirm(
      "Would you like to send this reservation request instantly via WhatsApp?\n\n(Click Cancel to send via Email instead.)"
    );

    if (preferWhatsApp) {
      const waUrl = `https://wa.me/923222247111?text=${encodeURIComponent(whatsappBody)}`;
      window.open(waUrl, '_blank');
    } else {
      const mailUrl = `mailto:londoncourtyard1@gmail.com?subject=${encodeURIComponent('London Courtyard Reservation - ' + name)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailUrl;
    }

    form.reset();
  });
}
