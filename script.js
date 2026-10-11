'use strict';

const workshops = {
  spring: {name:'Spring Bloom',season:'Spring',date:'2027-04-17',dateLabel:'17 Apr 2027',time:'10:00–12:00',price:450000,image:'LF-S01_SPRING_NO_TEXT',description:'Spring awakens with soft colors, fresh tulips and delicate seasonal blooms. Create a gentle floral arrangement inspired by the first days of spring.',about:'Spring Bloom celebrates the fresh colors and delicate flowers of spring through a relaxed hands-on floral experience. You will explore simple bouquet balance and pastel color pairing, then create an arrangement to bring home.',flowers:[['Tulip','LF-D01-01_Tulip'],['Daffodil','LF-D01-02_Daffodil'],['Lily of the Valley','LF-D01-03_Lily_of_the_Valley'],['Hyacinth','LF-D01-04_Hyacinth']]},
  summer: {name:'Summer Meadow',season:'Summer',date:'2027-06-19',dateLabel:'19 Jun 2027',time:'14:00–16:00',price:480000,image:'LF-S02_SUMMER_NO_TEXT',description:'Bright sunflowers, airy daisies and vivid summer colors come together in a joyful flower workshop.',about:'Summer Meadow brings the energy of sunlit gardens into an easy, hands-on floral session. Discover how to combine bold focal flowers with lighter fillers, and make a bouquet full of warmth and movement.',flowers:[['Sunflower','LF-D02-01_Sunflower'],['Lavender','LF-D02-02_Lavender'],['Hydrangea','LF-D02-03_Hydrangea'],['Chamomile','LF-D02-04_Chamomile']]},
  autumn: {name:'Autumn Garden',season:'Autumn',date:'2026-10-24',dateLabel:'24 Oct 2026',time:'10:00–12:00',price:490000,image:'LF-S03_AUTUMN_NO_TEXT',description:'Discover cozy color stories with warm seasonal blooms, textured leaves and soft earthy tones.',about:'Autumn Garden is inspired by the comforting colors of changing leaves and late-season blossoms. Try layering flower shapes and warm color combinations to make an arrangement that feels personal and seasonal.',flowers:[['Chrysanthemum','LF-D03-01_Chrysanthemum'],['Dahlia','LF-D03-02_Dahlia'],['Cosmos','LF-D03-03_Cosmos'],['Marigold','LF-D03-04_Marigold']]},
  winter: {name:'Winter Bloom',season:'Winter',date:'2026-12-12',dateLabel:'12 Dec 2026',time:'14:00–16:00',price:520000,image:'LF-S04_WINTER_NO_TEXT',description:'Celebrate the quiet beauty of winter with soft petals, festive color accents and thoughtful handmade details.',about:'Winter Bloom explores contrast, gentle structure and seasonal character through cool greens, pale flowers and cheerful red highlights. Complete a balanced winter bouquet to take home as a seasonal keepsake.',flowers:[['Camellia','LF-D04-01_Camellia'],['Hellebore','LF-D04-02_Hellebore'],['Poinsettia','LF-D04-03_Poinsettia'],['Snowdrop','LF-D04-04_Snowdrop']]}
};
const money = value => new Intl.NumberFormat('en-US').format(value) + ' VND';
const modal = document.querySelector('#modal');
const content = document.querySelector('#modal-content');
let returnFocus;
function openModal(markup) {
  if (!modal.open) returnFocus = document.activeElement;
  content.innerHTML = markup;
  if (!modal.open) modal.showModal();
  document.body.classList.add('modal-open');
  modal.scrollTop = 0;
  document.querySelector('.close-modal').focus();
}
function closeModal() { modal.close(); }
modal.addEventListener('close', () => { document.body.classList.remove('modal-open'); returnFocus?.focus(); });
document.querySelector('.close-modal').addEventListener('click',closeModal);
modal.addEventListener('click', event => { if(event.target === modal) { const r=modal.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) closeModal(); }});

function showDetails(key) {
  const w=workshops[key];
  if(!w) return;
  openModal(`<div class="modal-heading"><p class="eyebrow">${w.season} / Seasonal Floral Workshop</p><h2 id="modal-title">${w.name}</h2></div>
    <div class="detail-intro"><div><p>${w.description}</p><button class="button" data-book="${key}">Book This Workshop <span aria-hidden="true">↗</span></button></div><img src="assets/images/${w.image}.webp" alt="${w.season} seasonal floral arrangement" width="1032" height="1135"></div>
    <div class="modal-section"><h3>About the Workshop</h3><p>${w.about}</p></div>
    <div class="modal-section"><h3>What You’ll Experience</h3><div class="experience"><p><strong>Create</strong>Create your own seasonal floral arrangement.</p><p><strong>Learn</strong>Learn basic floral composition and color pairing.</p><p><strong>Take Home</strong>Bring your completed arrangement home.</p></div></div>
    <div class="modal-section"><h3>Flowers of the Season</h3><div class="flower-grid">${w.flowers.map(([name,file])=>`<figure><img src="assets/images/${file}_NO_TEXT.webp" alt="Illustrated ${name} flowers" width="475" height="580" loading="lazy"><figcaption>${name}</figcaption></figure>`).join('')}</div></div>
    <div class="modal-section"><h3>Workshop Information</h3><dl class="facts"><div><dt>Date / time</dt><dd>${w.dateLabel}<br>${w.time}</dd></div><div><dt>Price / guest</dt><dd>${money(w.price)}</dd></div><div><dt>Duration / capacity</dt><dd>2 hours / 12 guests max.</dd></div><div><dt>Location</dt><dd>Ho Chi Minh City, Vietnam (demo)</dd></div><div><dt>Materials</dt><dd>Included</dd></div><div><dt>Level</dt><dd>Beginner friendly</dd></div></dl><p class="form-note">Demo schedule and price for an academic concept. No real reservation or payment.</p><button class="button" data-book="${key}">Book This Workshop <span aria-hidden="true">↗</span></button></div>`);
}
function showBooking(key='spring') {
  if(!workshops[key]) key='spring';
  openModal(`<div class="modal-heading"><p class="eyebrow">Reserve a floral experience</p><h2 id="modal-title">Book Your Workshop</h2><p>Choose your season and reserve your floral experience.</p></div><div class="form-layout"><form id="booking-form"><div class="form-grid">
    <div class="field full"><label for="workshop">Choose Workshop *</label><select id="workshop" name="workshop" required>${Object.entries(workshops).map(([k,w])=>`<option value="${k}" ${k===key?'selected':''}>${w.name}</option>`).join('')}</select></div>
    <div class="field"><label for="date">Select Date *</label><select id="date" name="date" required></select></div><div class="field"><label for="time">Select Time *</label><select id="time" name="time" required></select></div>
    <div class="field full"><label for="guests">Number of Guests *</label><select id="guests" name="guests" required>${[1,2,3,4].map(n=>`<option value="${n}">${n} ${n===1?'guest':'guests'}</option>`).join('')}</select></div>
    <div class="field full"><label for="full-name">Full Name *</label><input id="full-name" name="fullName" autocomplete="name" required maxlength="100" pattern=".*\\S.*"></div>
    <div class="field full"><label for="email">Email Address *</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="150"></div>
    <div class="field full"><label for="phone">Phone Number</label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="30"></div>
    <div class="field full"><label for="note">Special Note</label><textarea id="note" name="note" maxlength="300" placeholder="Anything you’d like us to know? (max. 300 characters)"></textarea></div></div>
    <p class="form-note">This is a demo. No booking, payment or email will be sent. Your details are not stored.</p><button class="button form-submit" type="submit">Confirm Demo Booking <span aria-hidden="true">↗</span></button></form>
    <aside class="summary"><img src="assets/images/LF-F01_Featured_Workshop_and_Booking.webp" alt="Pastel flowers and workshop tools" width="1400" height="1050"><h3>Workshop Summary</h3><div id="summary" aria-live="polite"></div></aside></div>`);
  const form=document.querySelector('#booking-form');
  function updateSummary(){
    const w=workshops[form.elements.workshop.value], guests=Number(form.elements.guests.value);
    form.elements.date.innerHTML=`<option value="${w.date}">${w.dateLabel}</option>`;
    form.elements.time.innerHTML=`<option>${w.time}</option>`;
    document.querySelector('#summary').innerHTML=`<p><strong>${w.name}</strong></p><p>${w.dateLabel} / ${w.time}</p><p>${guests} ${guests===1?'guest':'guests'} / 2 hours</p><p>Materials included</p><p class="total">${money(w.price*guests)}</p><p>Demo price. Maximum 12 guests per session.</p>`;
  }
  form.addEventListener('change',updateSummary); updateSummary();
  form.addEventListener('submit',event=>{
    event.preventDefault(); if(!form.reportValidity()) return;
    const w=workshops[form.elements.workshop.value], guests=Number(form.elements.guests.value);
    openModal(`<div class="success"><p class="eyebrow">Demo confirmation</p><h2 id="modal-title">Your floral experience<br>is ready to imagine!</h2><p>${w.name}<br>${w.dateLabel} / ${w.time}<br>${guests} ${guests===1?'guest':'guests'} / ${money(w.price*guests)}</p><p>Thank you for trying LunaFlora. This demo does not reserve a place, take payment, or send an email.</p><button class="button" data-close>Back to Home</button></div>`);
  });
}
function showStory(){openModal(`<div class="modal-heading"><p class="eyebrow">About LunaFlora</p><h2 id="modal-title">Our Story</h2><p>Every season, a different floral story.</p></div><img class="story-image" src="assets/images/LF-A01_About_Story.webp" alt="Seasonal bouquet, notebook and ribbons" width="1400" height="1050"><div class="story-body"><p>LunaFlora is a seasonal floral studio inspired by the changing beauty of nature. Through flowers, colors, and hands-on workshops, we create a new experience for every season.</p><div class="modal-section"><h3>Flowers Through the Seasons</h3><p>Flowers change throughout the year, and each season brings its own colors, textures, and mood. LunaFlora turns these seasonal changes into creative floral workshops where every arrangement tells a different story.</p></div><div class="modal-section"><h3>A Place to Create & Bloom</h3><p>LunaFlora is designed as a warm and playful space where flowers, creativity, and seasonal inspiration come together.</p></div><p class="form-note">A concept website for academic demonstration.</p><button class="button" data-explore>Explore Workshops <span aria-hidden="true">↗</span></button></div>`);}
function showContact(){
  openModal(`<div class="modal-heading"><p class="eyebrow">Contact LunaFlora</p><h2 id="modal-title">Let’s Bloom Together</h2><p>Have a question about our seasonal workshops? We’d love to hear from you.</p></div><div class="form-layout"><form id="contact-form"><div class="form-grid"><div class="field full"><label for="contact-name">Full Name *</label><input id="contact-name" autocomplete="name" required maxlength="100" pattern=".*\\S.*"></div><div class="field full"><label for="contact-email">Email Address *</label><input id="contact-email" type="email" autocomplete="email" required maxlength="150"></div><div class="field full"><label for="contact-message">Message *</label><textarea id="contact-message" required maxlength="2000"></textarea></div></div><p class="form-note">Demo form. No message is sent or stored.</p><button class="button form-submit">Send Demo Message <span aria-hidden="true">↗</span></button></form><aside><img class="story-image" src="assets/images/LF-C01_Contact_Reuse_Crop_If_Needed.webp" alt="A pastel floral studio illustration" width="1400" height="788"><p class="caption">Ho Chi Minh City, Vietnam<br>Demo studio location.</p></aside></div>`);
  document.querySelector('#contact-message').addEventListener('input',event=>event.target.setCustomValidity(''));
  document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();const message=document.querySelector('#contact-message');message.setCustomValidity(message.value.trim()?'':'Please enter your message.');if(!event.target.reportValidity())return;openModal(`<div class="success"><p class="eyebrow">Demo confirmation</p><h2 id="modal-title">Thank you for<br>reaching out!</h2><p>You’ve completed the contact form demo. No message was sent or stored.</p><button class="button" data-close>Back to Home</button></div>`);});
}
document.addEventListener('click',event=>{
  const target=event.target.closest('[data-details],[data-book],[data-story],[data-contact],[data-close],[data-explore]');
  if(!target)return;
  if(target.hasAttribute('data-details'))showDetails(target.dataset.details);
  else if(target.hasAttribute('data-book'))showBooking(target.dataset.book);
  else if(target.hasAttribute('data-story'))showStory();
  else if(target.hasAttribute('data-contact'))showContact();
  else if(target.hasAttribute('data-explore')){closeModal();document.querySelector('#seasons').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  else closeModal();
});
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');nav.classList.remove('open');}
toggle.addEventListener('click',()=>{const isOpen=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!isOpen));toggle.setAttribute('aria-label',isOpen?'Open navigation':'Close navigation');nav.classList.toggle('open',!isOpen);});
nav.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>document.querySelector('.header').classList.toggle('scrolled',!entries[0].isIntersecting)).observe(document.querySelector('#header-marker'));
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion-ready');const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));}
  const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -60% 0px',threshold:0});document.querySelectorAll('#home,#seasons,#about,#contact').forEach(el=>sectionObserver.observe(el));
}

