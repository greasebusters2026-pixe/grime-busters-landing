'use strict';

/* Grease Busters: progressive enhancement only.
   No server submission, tracking, local storage, payment processing or auto-booking.
   The visitor reviews and sends each prepared message in their own app. */
(() => {
  const WHATSAPP = '27677214589';
  const EMAIL = 'greasebusters2026@gmail.com';
  const DEPOSIT_PERCENT = 35;
  const MAX_QUOTE_RAND = 1000000;
  const byId = id => document.getElementById(id);

  function initialiseNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = byId('main-nav');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        const wasMobile = window.innerWidth <= 900;
        closeMenu();
        // Do not strand keyboard focus on a link inside the collapsed menu.
        const href = link.getAttribute('href') || '';
        const target = href.startsWith('#') ? byId(href.slice(1)) : null;
        if (wasMobile && target) {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
        const focusedInNav = nav.contains(document.activeElement);
        closeMenu();
        if (focusedInNav) toggle.focus({ preventScroll: true });
      }
    });
    let wasMobile = window.innerWidth <= 900;
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 900;
      if (isMobile !== wasMobile) {
        const focusedInNav = nav.contains(document.activeElement);
        closeMenu();
        if (isMobile && focusedInNav) toggle.focus({ preventScroll: true });
      }
      wasMobile = isMobile;
    });
    toggle.hidden = false;
    // Only collapse the fallback navigation after its controls are attached.
    document.documentElement.classList.add('has-js');
  }

  function initialiseCalculator() {
    const calculator = document.querySelector('.deposit-calculator');
    const input = byId('quote-total');
    const output = byId('deposit-output');
    const balance = byId('balance-output');
    const error = byId('calc-error');
    const results = document.querySelector('.calc-results');
    if (!calculator || !input || !output || !balance || !error || !results) return;

    const currency = cents => 'R' + (cents / 100).toLocaleString('en-ZA', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    const update = () => {
      const amount = input.valueAsNumber;
      const valid = input.value.trim() !== '' && Number.isFinite(amount) &&
        amount > 0 && amount <= MAX_QUOTE_RAND && input.validity.valid;
      input.setAttribute('aria-invalid', String(!valid));
      error.hidden = valid;
      results.dataset.large = String(valid && amount >= 10000);
      if (!valid) {
        output.textContent = 'Not set';
        balance.textContent = 'Not set';
        return;
      }
      // Work in whole cents; the displayed amounts always add to the quote total.
      const cents = Math.round(amount * 100);
      const deposit = Math.round(cents * DEPOSIT_PERCENT / 100);
      output.textContent = currency(deposit);
      balance.textContent = currency(cents - deposit);
    };
    input.addEventListener('input', update);
    input.addEventListener('change', update);
    update();
    calculator.hidden = false;
  }

  function capeTownDate() {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit'
      }).formatToParts(new Date());
      const value = type => parts.find(part => part.type === type).value;
      return `${value('year')}-${value('month')}-${value('day')}`;
    } catch (_) {
      // Cape Town uses UTC+02:00. Keep the form usable if Intl timezone data is absent.
      return new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }
  }

  function initialiseEnquiry() {
    const form = byId('enquiry-form');
    const requiredIds = ['customer-name', 'customer-phone', 'customer-email', 'truck-location',
      'requirements', 'package', 'preferred-date', 'enquiry-status', 'message-fallback',
      'message-copy', 'copy-message', 'email-enquiry'];
    if (!form || requiredIds.some(id => !byId(id))) return;
    const name = byId('customer-name');
    const phone = byId('customer-phone');
    const email = byId('customer-email');
    const location = byId('truck-location');
    const requirements = byId('requirements');
    const chosenPackage = byId('package');
    const date = byId('preferred-date');
    const status = byId('enquiry-status');
    const fallback = byId('message-fallback');
    const copyArea = byId('message-copy');
    const copyButton = byId('copy-message');
    const nonempty = [name, location, requirements];

    const refreshDate = () => { date.min = capeTownDate(); };
    const clearPreparedMessage = () => {
      // Editing the form invalidates any earlier message, link and copy state.
      status.hidden = true;
      status.replaceChildren();
      fallback.hidden = true;
      copyArea.value = '';
      copyButton.textContent = 'Copy message';
    };
    [name, phone, email, location, requirements, chosenPackage, date].forEach(field => {
      const changed = () => {
        field.setCustomValidity('');
        field.removeAttribute('aria-invalid');
        clearPreparedMessage();
      };
      field.addEventListener('input', changed);
      field.addEventListener('change', changed);
      field.addEventListener('invalid', () => {
        field.setAttribute('aria-invalid', 'true'); clearPreparedMessage();
      });
    });

    const value = field => field.value.trim();
    const buildMessage = () => [
      'Hi Grease Busters, I would like to enquire about food truck cleaning.', '',
      'Name: ' + value(name),
      'Mobile: ' + value(phone),
      ...(value(email) ? ['Email: ' + value(email)] : []),
      'Truck location: ' + value(location),
      'Package: ' + value(chosenPackage),
      'Preferred date: ' + (value(date) || 'Flexible'), '',
      'Cleaning requirements:', value(requirements), '',
      'Please confirm the scope, total including the call-out fee, and availability before I pay a deposit.'
    ].join('\n');

    const prepare = channel => {
      refreshDate();
      nonempty.forEach(field => field.setCustomValidity(value(field) ? '' : 'Please complete this field.'));
      const phoneValue = value(phone);
      const digits = phoneValue.replace(/\D/g, '');
      const phoneValid = /^\+?[0-9 ().-]+$/.test(phoneValue) && digits.length >= 7 && digits.length <= 15;
      phone.setCustomValidity(phoneValid ? '' : 'Use 7 to 15 digits, with an optional + at the beginning.');
      // Trim accidental surrounding spaces without rewriting the customer's address.
      email.value = value(email);
      date.setCustomValidity(date.value && date.value < date.min ? 'Choose today or a later date in Cape Town.' : '');
      clearPreparedMessage();
      if (!form.reportValidity()) return;

      const body = buildMessage();
      const url = channel === 'whatsapp'
        ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(body)}`
        : `mailto:${EMAIL}?subject=${encodeURIComponent('Food truck cleaning enquiry | Grease Busters')}&body=${encodeURIComponent(body)}`;
      copyArea.value = body;
      fallback.hidden = false;
      const notice = document.createElement('p');
      notice.textContent = channel === 'whatsapp'
        ? 'Your message is ready. Review it in WhatsApp and press Send. This is not a confirmed booking.'
        : 'Your email is ready. Review it in your email app and press Send. No email has been sent by this website. If your app cuts the message short, copy the full message below.';
      const retry = document.createElement('a');
      retry.href = url;
      retry.textContent = channel === 'whatsapp' ? 'Open WhatsApp again' : 'Open your email app';
      if (channel === 'whatsapp') { retry.target = '_blank'; retry.rel = 'noopener noreferrer'; }
      status.append(notice, retry);
      status.hidden = false;
      status.focus({ preventScroll: true });
      // Build the fallback FIRST: popup blockers and missing mail clients must not lose the message.
      try {
        if (channel === 'whatsapp') {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          const link = document.createElement('a');
          link.href = url;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      } catch (_) {
        // The visible link and copyable message remain usable.
      }
    };

    // Attach the submit interceptor before revealing a form with personal information.
    form.addEventListener('submit', event => { event.preventDefault(); prepare('whatsapp'); });
    byId('email-enquiry').addEventListener('click', () => prepare('email'));
    form.addEventListener('reset', () => {
      clearPreparedMessage();
      [name, phone, email, location, requirements, chosenPackage, date].forEach(field => {
        field.setCustomValidity(''); field.removeAttribute('aria-invalid');
      });
      refreshDate();
    });
    date.addEventListener('focus', refreshDate);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refreshDate();
    });
    document.querySelectorAll('[data-package]').forEach(link => {
      link.addEventListener('click', () => {
        const option = link.dataset.package;
        if (Array.from(chosenPackage.options).some(item => item.value === option)) chosenPackage.value = option;
        clearPreparedMessage();
      });
    });
    document.querySelectorAll('[data-enquiry="event"]').forEach(link => {
      link.addEventListener('click', () => {
        chosenPackage.value = 'Food truck event enquiry'; clearPreparedMessage();
      });
    });
    copyButton.addEventListener('click', async () => {
      const text = copyArea.value;
      if (!text || fallback.hidden) return;
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        if (!fallback.hidden && copyArea.value === text) copyButton.textContent = 'Message copied';
      } catch (_) {
        if (fallback.hidden || copyArea.value !== text) return;
        copyArea.focus(); copyArea.select();
        copyButton.textContent = 'Message selected. Copy it now.';
      }
    });
    refreshDate();
    form.hidden = false;
    const staticFallback = byId('enquiry-fallback');
    if (staticFallback) staticFallback.hidden = true;
  }

  function initialiseOptionalLinks() {
    const supplied = window.GREASE_BUSTERS_CONFIG;
    const config = supplied && typeof supplied === 'object' ? supplied : {};
    const links = byId('connected-links');
    const addExternal = (value, allowed, text) => {
      if (typeof value !== 'string' || !value.trim() || !links) return;
      try {
        const url = new URL(value.trim());
        if (url.protocol !== 'https:' || url.username || url.password || url.port || !allowed(url)) return;
        const link = document.createElement('a');
        link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.className = 'button button-outline'; link.textContent = text;
        links.appendChild(link); links.hidden = false;
      } catch (_) { /* Invalid or empty public configuration stays hidden. */ }
    };
    addExternal(config.googleFormUrl,
      u => (u.hostname === 'docs.google.com' && u.pathname.startsWith('/forms/')) ||
        (u.hostname === 'forms.gle' && u.pathname.length > 1),
      'Open our Google enquiry form');
    addExternal(config.calendarBookingUrl,
      u => (u.hostname === 'calendar.google.com' && u.pathname.startsWith('/calendar/')) ||
        (u.hostname === 'calendar.app.google' && u.pathname.length > 1),
      'Request a time in our calendar');
    [['nondzaba', config.nondzabaLogo, 'Nondzaba Foundation logo'],
      ['gugulethu', config.gugulethuLogo, 'Gugulethu Athletic Club logo']].forEach(([key, path, alt]) => {
      if (typeof path !== 'string' || !/^assets\/[a-zA-Z0-9_-]+\.(png|webp|jpg|jpeg)$/.test(path)) return;
      const holder = document.querySelector(`[data-org="${key}"]`);
      if (!holder) return;
      const img = new Image(); img.alt = alt; img.loading = 'lazy'; img.decoding = 'async';
      img.addEventListener('error', () => img.remove(), { once: true });
      img.src = path; holder.prepend(img);
    });
  }

  initialiseNavigation();
  initialiseCalculator();
  initialiseEnquiry();
  // Optional configuration is not coupled to the existence of the enquiry form.
  initialiseOptionalLinks();
})();
