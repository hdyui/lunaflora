'use strict';

const workshops = {
  spring: {name:'Spring Bloom',season:'Spring',date:'2027-04-17',dateLabel:'17 Apr 2027',time:'10:00–12:00',price:450000,seats:10,image:'LF-S01_SPRING_NO_TEXT',tagline:'Soft pastels, first petals, a fresh start.',description:'Spring awakens with soft colors, fresh tulips and delicate seasonal blooms. Create a gentle floral arrangement inspired by the first days of spring.',about:'Spring Bloom celebrates the fresh colors and delicate flowers of spring through a relaxed hands-on floral experience. You will explore simple bouquet balance and pastel color pairing, then create an arrangement to bring home.',flowers:[['Tulip','LF-D01-01_Tulip','Cup-shaped blooms in candy pinks.'],['Daffodil','LF-D01-02_Daffodil','Sunny trumpets that announce the season.'],['Lily of the Valley','LF-D01-03_Lily_of_the_Valley','Tiny white bells with a sweet scent.'],['Hyacinth','LF-D01-04_Hyacinth','Dense, fragrant clusters in soft blue.']]},
  summer: {name:'Summer Meadow',season:'Summer',date:'2027-06-19',dateLabel:'19 Jun 2027',time:'14:00–16:00',price:480000,seats:12,image:'LF-S02_SUMMER_NO_TEXT',tagline:'Sunlit gardens, bold color, easy movement.',description:'Bright sunflowers, airy daisies and vivid summer colors come together in a joyful flower workshop.',about:'Summer Meadow brings the energy of sunlit gardens into an easy, hands-on floral session. Discover how to combine bold focal flowers with lighter fillers, and make a bouquet full of warmth and movement.',flowers:[['Sunflower','LF-D02-01_Sunflower','Big golden faces for a cheerful focal point.'],['Lavender','LF-D02-02_Lavender','Soft purple spikes that add height.'],['Hydrangea','LF-D02-03_Hydrangea','Cloud-like blue clusters that fill space.'],['Chamomile','LF-D02-04_Chamomile','Little white daisies with golden hearts.']]},
  autumn: {name:'Autumn Garden',season:'Autumn',date:'2026-10-24',dateLabel:'24 Oct 2026',time:'10:00–12:00',price:490000,seats:5,image:'LF-S03_AUTUMN_NO_TEXT',tagline:'Cozy layers, warm tones, falling leaves.',description:'Discover cozy color stories with warm seasonal blooms, textured leaves and soft earthy tones.',about:'Autumn Garden is inspired by the comforting colors of changing leaves and late-season blossoms. Try layering flower shapes and warm color combinations to make an arrangement that feels personal and seasonal.',flowers:[['Chrysanthemum','LF-D03-01_Chrysanthemum','Layered petals in rich autumn shades.'],['Dahlia','LF-D03-02_Dahlia','Sculptural blooms with a warm glow.'],['Cosmos','LF-D03-03_Cosmos','Light, papery petals on slender stems.'],['Marigold','LF-D03-04_Marigold','Golden-orange pom-poms full of cheer.']]},
  winter: {name:'Winter Bloom',season:'Winter',date:'2026-12-12',dateLabel:'12 Dec 2026',time:'14:00–16:00',price:520000,seats:8,image:'LF-S04_WINTER_NO_TEXT',tagline:'Quiet beauty, cool greens, a touch of red.',description:'Celebrate the quiet beauty of winter with soft petals, festive color accents and thoughtful handmade details.',about:'Winter Bloom explores contrast, gentle structure and seasonal character through cool greens, pale flowers and cheerful red highlights. Complete a balanced winter bouquet to take home as a seasonal keepsake.',flowers:[['Camellia','LF-D04-01_Camellia','Elegant rose-like blooms in winter pink.'],['Hellebore','LF-D04-02_Hellebore','Nodding, muted petals with quiet charm.'],['Poinsettia','LF-D04-03_Poinsettia','Festive red bracts for a bright accent.'],['Snowdrop','LF-D04-04_Snowdrop','Delicate white drops that greet the cold.']]}
};
const byDate = Object.keys(workshops).sort((a,b)=>workshops[a].date.localeCompare(workshops[b].date));
const money = value => new Intl.NumberFormat('en-US').format(value) + ' VND';
const plural = n => `${n} ${n===1?'guest':'guests'}`;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const arrow = '<span aria-hidden="true">↗</span>';

/* ---------- Modal + deep links (#workshop-spring, #book-spring, #story, #message) ---------- */
const modal = document.querySelector('#modal');
const content = document.querySelector('#modal-content');
let returnFocus;
function openModal(markup, hash, accent) {
  if (!modal.open) returnFocus = document.activeElement;
  content.innerHTML = markup;
  modal.dataset.season = accent || '';
  if (!modal.open) modal.showModal();
  document.body.classList.add('modal-open');
  modal.scrollTop = 0;
  document.querySelector('.close-modal').focus();
  if (hash && location.hash !== hash) history.pushState(null, '', hash);
}
function closeModal() { if (modal.open) modal.close(); }
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (/^#(workshop|book|story|message)/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
  returnFocus?.focus();
});
document.querySelector('.close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) { const r = modal.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeModal(); } });

function route() {
  const hash = location.hash;
  let m;
  if ((m = hash.match(/^#workshop-(\w+)$/)) && workshops[m[1]]) showDetails(m[1], false);
  else if ((m = hash.match(/^#book(?:-(\w+))?$/))) showBooking(m[1], false);
  else if (hash === '#story') showStory(false);
  else if (hash === '#message') showContact(false);
  else closeModal();
}
window.addEventListener('popstate', route);

/* ---------- Form helpers ---------- */
const errorBanner = 'Please complete the required fields before confirming your booking.';
function validate(form, banner) {
  let first;
  form.querySelectorAll('input,select,textarea').forEach(el => {
    if (el.type === 'text' && el.required) el.setCustomValidity(el.value.trim() ? '' : 'Required');
    if (el.id === 'contact-message') el.setCustomValidity(el.value.trim() ? '' : 'Required');
    const bad = !el.checkValidity();
    el.setAttribute('aria-invalid', bad);
    if (bad && !first) first = el;
  });
  banner.hidden = !first;
  if (first) first.focus();
  return !first;
}
function liveClear(form) {
  form.addEventListener('input', event => { if (event.target.matches('[aria-invalid=true]') && event.target.checkValidity()) event.target.setAttribute('aria-invalid', 'false'); });
}

/* ---------- Workshop details ---------- */
function showDetails(key, push = true) {
  const w = workshops[key];
  if (!w) return;
  const others = Object.keys(workshops).filter(k => k !== key);
  openModal(`<div class="modal-heading"><p class="eyebrow">${w.season} / Seasonal Floral Workshop</p><h2 id="modal-title">${w.name}</h2><p class="tagline">${w.tagline}</p></div>
    <div class="detail-intro"><div><p>${w.description}</p><ul class="chips"><li>${w.dateLabel}</li><li>${w.time}</li><li>${money(w.price)} / guest</li></ul><button class="button" data-book="${key}">Book This Workshop ${arrow}</button></div><img src="assets/images/${w.image}.webp" alt="${w.season} seasonal floral arrangement" width="1032" height="1135"></div>
    <div class="modal-section"><h3>About the Workshop</h3><p>${w.about}</p></div>
    <div class="modal-section"><h3>What You’ll Experience</h3><div class="experience"><p><svg aria-hidden="true"><use href="#i-scissors"/></svg><strong>Create</strong>Create your own seasonal floral arrangement.</p><p><svg aria-hidden="true"><use href="#i-book"/></svg><strong>Learn</strong>Learn basic floral composition and color pairing.</p><p><svg aria-hidden="true"><use href="#i-gift"/></svg><strong>Take Home</strong>Bring your completed arrangement home.</p></div></div>
    <div class="modal-section"><h3>Flowers of the Season</h3><div class="flower-grid">${w.flowers.map(([name, file, note]) => `<figure><img src="assets/images/${file}_NO_TEXT.webp" alt="Illustrated ${name} flowers" width="475" height="580" loading="lazy"><figcaption><strong>${name}</strong>${note}</figcaption></figure>`).join('')}</div></div>
    <div class="modal-section"><h3>Workshop Information</h3><dl class="facts"><div><dt>Date</dt><dd>${w.dateLabel}</dd></div><div><dt>Time</dt><dd>${w.time}</dd></div><div><dt>Duration</dt><dd>2 hours</dd></div><div><dt>Location</dt><dd>Ho Chi Minh City, Vietnam (demo)</dd></div><div><dt>Price</dt><dd>${money(w.price)} / guest</dd></div><div><dt>Capacity</dt><dd>12 guests max. · ${w.seats} seats left (demo)</dd></div><div><dt>Materials included</dt><dd>Flowers, greenery, wrapping &amp; tools</dd></div><div><dt>Level</dt><dd>Beginner friendly</dd></div></dl><p class="form-note">Demo schedule and price for an academic concept. No real reservation or payment.</p><button class="button" data-book="${key}">Book This Workshop ${arrow}</button></div>
    <div class="modal-section"><h3>Explore Another Season</h3><div class="related">${others.map(k => `<button class="related-card" data-details="${k}"><img src="assets/images/${workshops[k].image}.webp" alt="" width="1032" height="1135" loading="lazy"><span><strong>${workshops[k].name}</strong>${workshops[k].dateLabel}</span></button>`).join('')}</div></div>`,
    push ? `#workshop-${key}` : null, key);
}

/* ---------- Booking ---------- */
function showBooking(key, push = true) {
  if (!workshops[key]) key = byDate[0];
  openModal(`<div class="modal-heading"><p class="eyebrow">Reserve a floral experience</p><h2 id="modal-title">Book Your Workshop</h2><p>Choose your season and reserve your floral experience.</p></div><div class="form-layout"><form id="booking-form" novalidate><p class="form-error" role="alert" hidden>${errorBanner}</p><div class="form-grid">
    <div class="field full"><label for="workshop">Choose Workshop *</label><select id="workshop" name="workshop" required>${Object.entries(workshops).map(([k, w]) => `<option value="${k}" ${k === key ? 'selected' : ''}>${w.name}</option>`).join('')}</select></div>
    <div class="field"><label for="date">Select Date *</label><select id="date" name="date" required></select></div><div class="field"><label for="time">Select Time *</label><select id="time" name="time" required></select></div>
    <div class="field full"><span class="label" id="guests-label">Number of Guests *</span><div class="stepper" role="group" aria-labelledby="guests-label"><button type="button" data-step="-1" aria-label="Fewer guests">−</button><output id="guests-out" aria-live="polite">1</output><button type="button" data-step="1" aria-label="More guests">+</button><input type="hidden" id="guests" name="guests" value="1"><small id="seat-note"></small></div></div>
    <div class="field full"><label for="full-name">Full Name *</label><input id="full-name" name="fullName" type="text" autocomplete="name" required maxlength="100"></div>
    <div class="field full"><label for="email">Email Address *</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="150"></div>
    <div class="field full"><label for="phone">Phone Number <em>(optional)</em></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="30"></div>
    <div class="field full"><label for="note">Special Note <em>(optional)</em></label><textarea id="note" name="note" maxlength="300" placeholder="Anything you’d like us to know?"></textarea><small id="note-count">0 / 300</small></div></div>
    <p class="form-note">This is a demo. No booking, payment or email will be sent. Your details are not stored.</p><button class="button form-submit" type="submit">Confirm Booking ${arrow}</button></form>
    <aside class="summary"><img src="assets/images/LF-F01_Featured_Workshop_and_Booking.webp" alt="Pastel flowers and workshop tools" width="1400" height="1050"><h3>Workshop Summary</h3><div id="summary" aria-live="polite"></div></aside></div>`,
    push ? `#book-${key}` : null, key);
  const form = document.querySelector('#booking-form');
  const guestsInput = form.elements.guests;
  const setGuests = n => { const max = Math.min(4, workshops[form.elements.workshop.value].seats); n = Math.max(1, Math.min(max, n)); guestsInput.value = n; document.querySelector('#guests-out').textContent = n; };
  function updateSummary() {
    const k = form.elements.workshop.value, w = workshops[k];
    form.elements.date.innerHTML = `<option value="${w.date}">${w.dateLabel}</option>`;
    form.elements.time.innerHTML = `<option>${w.time}</option>`;
    setGuests(Number(guestsInput.value));
    const guests = Number(guestsInput.value);
    document.querySelector('#seat-note').textContent = `Up to ${Math.min(4, w.seats)} per booking · ${w.seats} seats left (demo)`;
    modal.dataset.season = k;
    document.querySelector('#summary').innerHTML = `<p><strong>${w.name}</strong></p><p>${w.dateLabel} / ${w.time}</p><p>${plural(guests)} / 2 hours</p><p>Materials included</p><p class="total">${money(w.price * guests)}</p><p>Demo price. Maximum 12 guests per session.</p>`;
  }
  form.addEventListener('change', updateSummary);
  form.addEventListener('click', event => { const b = event.target.closest('[data-step]'); if (b) { setGuests(Number(guestsInput.value) + Number(b.dataset.step)); updateSummary(); } });
  form.elements.note.addEventListener('input', event => { document.querySelector('#note-count').textContent = `${event.target.value.length} / 300`; });
  liveClear(form); updateSummary();
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate(form, form.querySelector('.form-error'))) return;
    const w = workshops[form.elements.workshop.value], guests = Number(guestsInput.value);
    openModal(`<div class="success"><svg class="success-icon" aria-hidden="true"><use href="#i-flower"/></svg><p class="eyebrow">Demo confirmation</p><h2 id="modal-title">Your floral experience<br>is reserved!</h2><p>Thank you for booking with LunaFlora. We look forward to creating something beautiful with you.</p><div class="receipt"><p><strong>${w.name}</strong></p><p>${w.dateLabel} / ${w.time}</p><p>${plural(guests)} / ${money(w.price * guests)}</p></div><p class="form-note">This is a concept demo. No place was reserved, no payment was taken and no email was sent.</p><button class="button" data-close>Back to Home</button></div>`, null, form.elements.workshop.value);
  });
}

/* ---------- About ---------- */
function showStory(push = true) {
  openModal(`<div class="modal-heading"><p class="eyebrow">About LunaFlora</p><h2 id="modal-title">Our Story</h2><p>Every season, a different floral story.</p></div><img class="story-image" src="assets/images/LF-A01_About_Story.webp" alt="Seasonal bouquet, notebook and ribbons" width="1400" height="1050"><div class="story-body"><p>LunaFlora is a seasonal floral studio inspired by the changing beauty of nature. Through flowers, colors, and hands-on workshops, we create a new experience for every season.</p>
    <div class="modal-section"><h3>Flowers Through the Seasons</h3><p>Flowers change throughout the year, and each season brings its own colors, textures, and mood. LunaFlora turns these seasonal changes into creative floral workshops where every arrangement tells a different story.</p></div>
    <div class="modal-section"><h3>Why Seasonal Flowers?</h3><div class="experience"><p><svg aria-hidden="true"><use href="#i-flower"/></svg><strong>Seasonal Beauty</strong>Discover flowers at their most expressive time of year.</p><p><svg aria-hidden="true"><use href="#i-scissors"/></svg><strong>Creative Moments</strong>Explore color, composition, and floral arranging through hands-on making.</p><p><svg aria-hidden="true"><use href="#i-gift"/></svg><strong>Something to Remember</strong>Take home your own arrangement as a little memory of the season.</p></div></div>
    <p class="story-quote">Every season, a different way to bloom.</p>
    <div class="modal-section"><h3>A Place to Create &amp; Bloom</h3><p>LunaFlora is designed as a warm and playful space where flowers, creativity, and seasonal inspiration come together.</p></div>
    <p class="form-note">A concept website for academic demonstration.</p><button class="button" data-explore>Explore Workshops ${arrow}</button></div>`, push ? '#story' : null);
}

/* ---------- Contact ---------- */
function showContact(push = true) {
  openModal(`<div class="modal-heading"><p class="eyebrow">Contact LunaFlora</p><h2 id="modal-title">Let’s Bloom Together</h2><p>Have a question about our seasonal workshops? We’d love to hear from you.</p></div><div class="form-layout"><form id="contact-form" novalidate><p class="form-error" role="alert" hidden>Please complete the required fields before sending your message.</p><div class="form-grid"><div class="field full"><label for="contact-name">Full Name *</label><input id="contact-name" type="text" autocomplete="name" required maxlength="100"></div><div class="field full"><label for="contact-email">Email Address *</label><input id="contact-email" type="email" autocomplete="email" required maxlength="150"></div><div class="field full"><label for="contact-message">Message *</label><textarea id="contact-message" required maxlength="2000"></textarea></div></div><p class="form-note">Demo form. No message is sent or stored.</p><button class="button form-submit" type="submit">Send Message ${arrow}</button></form>
    <aside><img class="story-image" src="assets/images/LF-C01_Contact_Reuse_Crop_If_Needed.webp" alt="A pastel floral studio illustration" width="1400" height="788"><ul class="contact-list compact"><li><svg aria-hidden="true"><use href="#i-mail"/></svg><div><span>Email</span>hello@lunaflora.example</div></li><li><svg aria-hidden="true"><use href="#i-insta"/></svg><div><span>Instagram</span>@lunaflora.demo</div></li><li><svg aria-hidden="true"><use href="#i-pin"/></svg><div><span>Studio</span>Ho Chi Minh City, Vietnam</div></li><li><svg aria-hidden="true"><use href="#i-clock"/></svg><div><span>Hours</span>Sat – Sun | 09:00–18:00</div></li></ul><p class="caption">Demo contact information.</p></aside></div>`, push ? '#message' : null);
  const form = document.querySelector('#contact-form');
  liveClear(form);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate(form, form.querySelector('.form-error'))) return;
    openModal(`<div class="success"><svg class="success-icon" aria-hidden="true"><use href="#i-flower"/></svg><p class="eyebrow">Demo confirmation</p><h2 id="modal-title">Your message<br>has been sent!</h2><p>Thank you for reaching out. We’ll get back to you soon.</p><p class="form-note">This is a concept demo. No message was actually sent or stored.</p><button class="button" data-close>Back to Home</button></div>`);
  });
}

/* ---------- Page rendering ---------- */
document.querySelector('#schedule-list').innerHTML = byDate.map(k => {
  const w = workshops[k], [, month, day] = w.date.split('-');
  const left = w.seats <= 5 ? `<span class="low">Only ${w.seats} seats left</span>` : `${w.seats} seats left`;
  return `<li class="schedule-row ${k} reveal"><time datetime="${w.date}"><span class="day">${day}</span><span class="mon">${w.dateLabel.split(' ')[1]} ${w.dateLabel.split(' ')[2]}</span></time><div class="sch-main"><h3>${w.name}</h3><p>${w.time} · 2 hours · ${left}</p></div><p class="sch-price">${money(w.price)}<small>per guest</small></p><div class="sch-actions"><button class="text-link" data-details="${k}">Details</button><button class="button small" data-book="${k}">Book ${arrow}</button></div></li>`;
}).join('');
const flowerTiles = Object.entries(workshops).flatMap(([k, w]) => w.flowers.map(([name, file]) => `<button class="tile ${k}" data-details="${k}" aria-label="${name}, ${w.name} workshop"><img src="assets/images/${file}_NO_TEXT.webp" alt="" width="475" height="580" loading="lazy"><span>${name}</span></button>`)).join('');
document.querySelector('#strip-track').innerHTML = `<div class="strip-inner">${flowerTiles}</div><div class="strip-inner" aria-hidden="true">${flowerTiles.replace(/<button /g, '<button tabindex="-1" ')}</div>`;

/* ---------- Click routing ---------- */
document.addEventListener('click', event => {
  const target = event.target.closest('[data-details],[data-book],[data-story],[data-contact],[data-close],[data-explore],[data-schedule]');
  if (!target) return;
  if (target.hasAttribute('data-details')) showDetails(target.dataset.details);
  else if (target.hasAttribute('data-book')) showBooking(target.dataset.book);
  else if (target.hasAttribute('data-story')) showStory();
  else if (target.hasAttribute('data-contact')) showContact();
  else if (target.hasAttribute('data-explore') || target.hasAttribute('data-schedule')) {
    const to = target.hasAttribute('data-schedule') ? '#schedule' : '#seasons';
    closeModal();
    document.querySelector(to).scrollIntoView({behavior: reducedMotion ? 'instant' : 'smooth'});
  } else closeModal();
});

/* ---------- Nav, header, reveal ---------- */
const toggle = document.querySelector('.menu-toggle'), nav = document.querySelector('#navigation');
function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); nav.classList.remove('open'); }
toggle.addEventListener('click', () => { const isOpen = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!isOpen)); toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation'); nav.classList.toggle('open', !isOpen); });
nav.addEventListener('click', event => { if (event.target.closest('a,button')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => document.querySelector('.header').classList.toggle('scrolled', !entries[0].isIntersecting)).observe(document.querySelector('#header-marker'));
  if (!reducedMotion) {
    document.body.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), {threshold: .08});
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
  const sectionObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { nav.querySelectorAll('a').forEach(a => { const active = a.hash === `#${entry.target.id}`; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); } }); }, {rootMargin: '-15% 0px -60% 0px', threshold: 0});
  document.querySelectorAll('#home,#seasons,#about,#contact').forEach(el => sectionObserver.observe(el));
}
if (location.hash) route();
