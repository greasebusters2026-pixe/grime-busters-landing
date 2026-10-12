'use strict';
(() => {
  const WHATSAPP = '27677214589';
  const EMAIL = 'greasebusters2026@gmail.com';
  document.documentElement.classList.add('has-js');

  // Navigation remains usable with JavaScript disabled.
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.hidden = false;
    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // Calculator uses whole cents. It calculates only a split of an approved total.
  const calculator = document.querySelector('.deposit-calculator');
  const totalInput = document.getElementById('quote-total');
  if (calculator && totalInput) {
    calculator.hidden = false;
    const currency = cents => 'R' + (cents / 100).toLocaleString('en-GB', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    const update = () => {
      const value = Number(totalInput.value);
      const valid = totalInput.value.trim() !== '' && Number.isFinite(value) && value > 0 && value <= 1000000 && totalInput.validity.valid;
      document.getElementById('calc-error').hidden = valid;
      totalInput.setAttribute('aria-invalid', String(!valid));
      if (!valid) {
        document.getElementById('deposit-output').textContent = 'Not set';
        document.getElementById('balance-output').textContent = 'Not set';
        return;
      }
      document.querySelector('.calc-results').dataset.large = String(value >= 10000);
      const cents = Math.round(value * 100);
      const deposit = Math.round(cents * 35 / 100);
      document.getElementById('deposit-output').textContent = currency(deposit);
      document.getElementById('balance-output').textContent = currency(cents - deposit);
    };
    totalInput.addEventListener('input', update);
    update();
  }

  const form = document.getElementById('enquiry-form');
  if (!form) return;
  form.hidden = false;
  const date = document.getElementById('preferred-date');
  // Date requests use Cape Town's calendar date, regardless of a visitor's timezone.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const part = type => parts.find(p => p.type === type).value;
  date.min = `${part('year')}-${part('month')}-${part('day')}`;

  document.querySelectorAll('[data-package]').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('package').value = link.dataset.package;
    });
  });
  document.querySelectorAll('[data-enquiry="event"]').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('package').value = 'Food truck event enquiry';
    });
  });

  const cleanValue = (name) => String(new FormData(form).get(name) || '').trim();
  const message = () => [
    'Hi Grime Busters, I would like to enquire about food truck cleaning.', '',
    'Name: ' + cleanValue('name'),
    'Mobile: ' + cleanValue('phone'),
    ...(cleanValue('email') ? ['Email: ' + cleanValue('email')] : []),
    'Truck location: ' + cleanValue('location'),
    'Package: ' + cleanValue('package'),
    'Preferred date: ' + (cleanValue('date') || 'Flexible'),
    '', 'Cleaning requirements:', cleanValue('requirements'), '',
    'Please confirm the scope, total including the call-out fee, and availability before I pay a deposit.'
  ].join('\n');
  const status = document.getElementById('enquiry-status');
  const fallback = document.getElementById('message-fallback');
  const copyArea = document.getElementById('message-copy');

  // Reject whitespace-only required fields and telephone values without enough digits.
  const nonemptyFields = ['customer-name', 'truck-location', 'requirements'];
  nonemptyFields.forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener('input', () => field.setCustomValidity(''));
  });
  const phoneField = document.getElementById('customer-phone');
  phoneField.addEventListener('input', () => phoneField.setCustomValidity(''));

  // Transparent hand-off, not an automatic submission or a booking confirmation.
  const prepare = (channel) => {
    nonemptyFields.forEach(id => {
      const field = document.getElementById(id);
      field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
    });
    const phoneDigits = phoneField.value.replace(/\D/g, '');
    phoneField.setCustomValidity(phoneDigits.length >= 7 && phoneDigits.length <= 15 ? '' : 'Please enter a valid mobile number.');
    if (!form.reportValidity()) return;
    const body = message();
    const url = channel === 'whatsapp'
      ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(body)}`
      : `mailto:${EMAIL}?subject=${encodeURIComponent('Food truck cleaning enquiry | Grime Busters')}&body=${encodeURIComponent(body)}`;
    copyArea.value = body;
    fallback.hidden = false;
    status.replaceChildren();
    status.hidden = false;
    const notice = document.createElement('p');
    notice.textContent = channel === 'whatsapp'
      ? 'Your message is ready. Review it in WhatsApp and press Send. This is not a confirmed booking.'
      : 'Your email is ready. Review it in your email app and press Send. No email has been sent by this website.';
    const retry = document.createElement('a');
    retry.href = url;
    retry.textContent = channel === 'whatsapp' ? 'Open WhatsApp again' : 'Open your email app';
    if (channel === 'whatsapp') {
      retry.target = '_blank'; retry.rel = 'noopener noreferrer';
    }
    status.append(notice, retry);
    if (channel === 'whatsapp') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const link = document.createElement('a');
      link.href = url; document.body.appendChild(link); link.click(); link.remove();
    }
  };
  form.addEventListener('submit', event => { event.preventDefault(); prepare('whatsapp'); });
  document.getElementById('email-enquiry').addEventListener('click', () => prepare('email'));
  document.getElementById('copy-message').addEventListener('click', async event => {
    const button = event.currentTarget;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(copyArea.value);
      button.textContent = 'Message copied';
    } catch (_) {
      copyArea.focus(); copyArea.select();
      button.textContent = 'Message selected. Copy it now.';
    }
  });

  // Optional external services. Only real HTTPS links on the stated providers are allowed.
  const config = window.GRIME_BUSTERS_CONFIG || {};
  const links = document.getElementById('connected-links');
  const addExternal = (value, hosts, text) => {
    if (!value || !links) return;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || !hosts.includes(url.hostname)) return;
      const link = document.createElement('a');
      link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.className = 'button button-outline'; link.textContent = text;
      links.appendChild(link); links.hidden = false;
    } catch (_) { /* Invalid configuration stays invisible. */ }
  };
  addExternal(config.googleFormUrl, ['docs.google.com', 'forms.gle'], 'Open our Google enquiry form');
  addExternal(config.calendarBookingUrl, ['calendar.google.com', 'calendar.app.google'], 'Request a time in our calendar');
  [['nondzaba', config.nondzabaLogo, 'Nondzaba Foundation logo'],
   ['gugulethu', config.gugulethuLogo, 'Gugulethu Athletic Club logo']].forEach(([key, path, alt]) => {
    if (typeof path !== 'string' || !/^assets\/[a-zA-Z0-9_-]+\.(png|webp|jpg|jpeg)$/.test(path)) return;
    const holder = document.querySelector(`[data-org="${key}"]`);
    if (!holder) return;
    const img = new Image(); img.alt = alt; img.loading = 'lazy';
    img.addEventListener('error', () => img.remove());
    img.src = path; holder.prepend(img);
  });
})();
