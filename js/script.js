/* =============================================
   CGP — College Group Point | script.js v7
   ============================================= */

/* ── 1. PAGE LOADER (3 seconds) ── */
(function () {
  function hideLoader() {
    const l = document.getElementById('page-loader');
    if (l && !l.classList.contains('hidden')) l.classList.add('hidden');
  }
  setTimeout(hideLoader, 3000);
  window.addEventListener('load', function () { setTimeout(hideLoader, 3000); });
})();

/* ── 2. NAVBAR ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));
}
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) link.classList.add('active');
});
const hamburger = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileNav.classList.toggle('open'); });
  mobileNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { hamburger.classList.remove('open'); mobileNav.classList.remove('open'); }));
  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open'); mobileNav.classList.remove('open');
    }
  });
}

/* ── 3. GO TO TOP ── */
const goTopBtn = document.getElementById('go-top');
if (goTopBtn) {
  window.addEventListener('scroll', () => goTopBtn.classList.toggle('visible', window.scrollY > 400));
  goTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 4. SCROLL REVEAL ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollReveal);

/* ── 5. USER PROFILE ── */
function getUser() {
  return {
    firstName:     localStorage.getItem('userFirstName')     || '',
    lastName:      localStorage.getItem('userLastName')      || '',
    email:         localStorage.getItem('userEmail')         || '',
    qualification: localStorage.getItem('userQualification') || '',
    gender:        localStorage.getItem('userGender')        || '',
    city:          localStorage.getItem('userCity')          || '',
    state:         localStorage.getItem('userState')         || '',
    country:       localStorage.getItem('userCountry')       || '',
  };
}
function clearUser() {
  ['userFirstName','userLastName','userEmail','userQualification','userGender','userCity','userState','userCountry']
    .forEach(k => localStorage.removeItem(k));
}
function renderNavUser() {
  const u = getUser();
  const pill      = document.getElementById('nav-user-pill');
  const nameEl    = document.getElementById('nav-user-name');
  const mobileRow = document.getElementById('mobile-user-row');
  const mobileLabel = document.getElementById('mobile-user-name-label');
  if (!pill) return;
  if (u.firstName) {
    pill.style.display = 'flex';
    if (nameEl) nameEl.textContent = u.firstName;
    pill.onclick = openProfileModal;
    if (mobileRow && mobileLabel) {
      mobileRow.style.display = 'flex';
      mobileLabel.textContent = '👤 ' + u.firstName + ' ' + u.lastName;
    }
  } else {
    pill.style.display = 'none';
    if (mobileRow) mobileRow.style.display = 'none';
  }
}

/* ── 6. PROFILE MODAL ── */
function openProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (!modal) return;
  const u = getUser();
  const nameEl  = document.getElementById('profile-modal-name');
  const details = document.getElementById('profile-details');
  if (nameEl) nameEl.textContent = u.firstName + ' ' + u.lastName;
  if (details) {
    const rows = [
      ['Name', u.firstName + ' ' + u.lastName],
      ['Email', u.email],
      ['Qualification', u.qualification],
      ['Gender', u.gender],
    ].filter(([, v]) => v);
    let html = rows.map(([label, val]) =>
      `<div class="profile-detail-row">
         <span class="profile-detail-label">${label}</span>
         <span class="profile-detail-val">${val}</span>
       </div>`).join('');
    const loc = [u.city, u.state, u.country].filter(Boolean).join(', ');
    if (loc) html += `<div class="profile-location-block"><div class="profile-location-label">📍 Location</div><div class="profile-location-val">${loc}</div></div>`;
    details.innerHTML = html;
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modal.onclick = (e) => { if (e.target === modal) closeProfileModal(); };
}
function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}
function openLogoutConfirm() {
  closeProfileModal();
  const m = document.getElementById('logout-modal');
  if (m) { m.style.display = 'flex'; m.onclick = (e) => { if (e.target === m) closeLogoutConfirm(); }; }
}
function closeLogoutConfirm() {
  const m = document.getElementById('logout-modal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}
function logoutUser() { clearUser(); closeLogoutConfirm(); window.location.href = 'form.html'; }
window.openProfileModal  = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.openLogoutConfirm = openLogoutConfirm;
window.closeLogoutConfirm = closeLogoutConfirm;
window.logoutUser        = logoutUser;

/* ── 7. FIRST VISIT CHECK ── */
function checkFirstVisit() {
  const isIndex = ['', 'index.html'].includes(window.location.pathname.split('/').pop());
  if (isIndex && !localStorage.getItem('userFirstName')) window.location.href = 'form.html';
}

/* ── 8. REVIEWS SLIDER ── */
function initReviewSlider() {
  const slides = document.querySelectorAll('.review-slide');
  const dots   = document.querySelectorAll('.review-dot');
  if (!slides.length) return;
  let cur = 0, timer;
  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
  }
  function startAuto() { timer = setInterval(() => show(cur + 1), 4500); }
  function stopAuto()  { clearInterval(timer); }
  const prev = document.getElementById('review-prev');
  const next = document.getElementById('review-next');
  if (prev) prev.addEventListener('click', () => { stopAuto(); show(cur - 1); startAuto(); });
  if (next) next.addEventListener('click', () => { stopAuto(); show(cur + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); show(i); startAuto(); }));
  show(0); startAuto();
}

/* ── 9. WELCOME PAGE ── */
function initWelcomePage() {
  const nameEl = document.getElementById('welcome-name');
  if (!nameEl) return;
  nameEl.textContent = localStorage.getItem('userFirstName') || 'Student';
  const btn = document.getElementById('explore-btn');
  if (btn) btn.addEventListener('click', () => window.location.href = 'index.html');
}

/* ── 10. MULTI-STEP STUDENT FORM ── */
function initStudentForm() {
  const viewport = document.getElementById('sf-viewport');
  if (!viewport) return;
  if (localStorage.getItem('userFirstName')) { window.location.href = 'index.html'; return; }

  const STEP_IDS = ['1','2','3','3b','4','5','6','7','8','9'];
  const totalDisplaySteps = 9;
  let currentStepIndex = 0;
  const progressFill = document.getElementById('sf-progress-fill');
  const stepLabel    = document.getElementById('sf-step-label');
  const backBtn      = document.getElementById('sf-back');
  const nextBtn      = document.getElementById('sf-next');
  let generatedOTP = '', otpVerified = false, otpResendTimer = null;

  function getDisplayStep(idx) {
    const id = STEP_IDS[idx];
    if (id === '3b') return 3;
    const n = parseInt(id);
    return n > 3 ? n - 1 : n;
  }
  function updateProgress() {
    const ds  = getDisplayStep(currentStepIndex);
    const pct = ((ds - 1) / (totalDisplaySteps - 1)) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (stepLabel) stepLabel.textContent = `Step ${ds} of ${totalDisplaySteps}`;
    if (backBtn) backBtn.style.display = currentStepIndex > 0 ? 'inline-flex' : 'none';
    const id = STEP_IDS[currentStepIndex];
    if (nextBtn) {
      if (id === '3')  { nextBtn.style.display = 'none'; }
      else if (id === '9') { nextBtn.textContent = 'Start Exploring'; nextBtn.style.display = 'inline-flex'; }
      else { nextBtn.textContent = 'Continue →'; nextBtn.style.display = 'inline-flex'; }
    }
  }
  function showSlide(idx, back = false) {
    const cur = viewport.querySelector('.sf-slide.active');
    if (cur) cur.classList.remove('active', 'from-back');
    const id = STEP_IDS[idx];
    const newSlide = viewport.querySelector(`.sf-slide[data-step="${id}"]`);
    if (!newSlide) return;
    if (back) newSlide.classList.add('from-back');
    newSlide.classList.add('active');
    updateProgress();
    if (id === '7') {
      const stateName = document.getElementById('sf-state')?.value || 'your state';
      const hint = document.getElementById('sf-state-hint');
      if (hint) hint.textContent = stateName;
    }
    if (id === '9') buildSummary();
    const inp = newSlide.querySelector('.sf-input:not([type="hidden"])');
    if (inp) setTimeout(() => inp.focus(), 200);
  }
  function validateStep(id) {
    const v = {
      '1':  () => document.getElementById('sf-firstName')?.value.trim() ? null : 'Please enter your first name',
      '2':  () => document.getElementById('sf-lastName')?.value.trim()  ? null : 'Please enter your last name',
      '3':  () => null,
      '3b': () => otpVerified ? null : 'Please verify the code first',
      '4':  () => document.getElementById('sf-qualification')?.value ? null : 'Please select your qualification',
      '5':  () => document.getElementById('sf-gender')?.value   ? null : 'Please select your pronouns',
      '6':  () => document.getElementById('sf-state')?.value    ? null : 'Please select your state',
      '7':  () => document.getElementById('sf-city')?.value.trim() ? null : 'Please enter your city',
      '8':  () => document.getElementById('sf-country')?.value.trim() ? null : 'Please enter your country',
      '9':  () => null,
    };
    return v[id] ? v[id]() : null;
  }
  function showError(msg) {
    const slide = viewport.querySelector('.sf-slide.active');
    if (!slide) return;
    let err = slide.querySelector('.sf-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'sf-error';
      err.style.cssText = 'color:#e74c3c;font-size:0.8rem;font-weight:600;margin-top:0.75rem;text-align:center;';
      slide.appendChild(err);
    }
    err.textContent = msg;
    setTimeout(() => { if (err.parentNode) err.remove(); }, 3000);
  }
  function saveStep(id) {
    const map = {
      '1': () => localStorage.setItem('userFirstName', document.getElementById('sf-firstName')?.value.trim()),
      '2': () => localStorage.setItem('userLastName',  document.getElementById('sf-lastName')?.value.trim()),
      '3': () => localStorage.setItem('userEmail',     document.getElementById('sf-email')?.value.trim()),
      '4': () => localStorage.setItem('userQualification', document.getElementById('sf-qualification')?.value),
      '5': () => localStorage.setItem('userGender',    document.getElementById('sf-gender')?.value),
      '6': () => localStorage.setItem('userState',     document.getElementById('sf-state')?.value),
      '7': () => localStorage.setItem('userCity',      document.getElementById('sf-city')?.value.trim()),
      '8': () => localStorage.setItem('userCountry',   document.getElementById('sf-country')?.value.trim()),
    };
    if (map[id]) map[id]();
  }
  function buildSummary() {
    const u  = getUser();
    const el = document.getElementById('sf-summary');
    if (!el) return;
    const pairs = [
      ['Name', u.firstName + ' ' + u.lastName],
      ['Email', u.email + ' ✓'],
      ['Qualification', u.qualification],
      ['Gender', u.gender],
      ['Location', [u.city, u.state, u.country].filter(Boolean).join(', ')],
    ].filter(([, v]) => v);
    el.innerHTML = pairs.map(([l, v]) =>
      `<div class="sf-summary-item"><div class="sf-summary-label">${l}</div><div class="sf-summary-val">${v}</div></div>`
    ).join('');
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    const id = STEP_IDS[currentStepIndex];
    if (id === '9') { window.location.href = 'welcome.html'; return; }
    const err = validateStep(id);
    if (err) { showError(err); return; }
    saveStep(id);
    currentStepIndex++;
    showSlide(currentStepIndex);
  });
  if (backBtn) backBtn.addEventListener('click', () => {
    if (currentStepIndex > 0) { currentStepIndex--; showSlide(currentStepIndex, true); }
  });

  viewport.querySelectorAll('.sf-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      viewport.querySelectorAll(`.sf-choice-btn[data-group="${btn.dataset.group}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const inp = document.getElementById('sf-gender');
      if (inp) inp.value = btn.dataset.val;
    });
  });
  viewport.querySelectorAll('.qual-card').forEach(card => {
    card.addEventListener('click', () => {
      viewport.querySelectorAll('.qual-card[data-group="qual"]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const inp = document.getElementById('sf-qualification');
      if (inp) inp.value = card.dataset.val;
    });
  });
  viewport.querySelectorAll('.sf-input').forEach(input => {
    const tryFloat = () => { if (input.value) input.classList.add('filled'); else input.classList.remove('filled'); };
    input.addEventListener('input', tryFloat);
    input.addEventListener('change', tryFloat);
    tryFloat();
  });

  /* OTP */
  const otpSendBtn  = document.getElementById('otp-send-btn');
  const otpSendText = document.getElementById('otp-send-text');
  const otpStatusEl = document.getElementById('otp-status');
  if (otpSendBtn) {
    otpSendBtn.addEventListener('click', () => {
      const email = document.getElementById('sf-email')?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        otpStatusEl.textContent = 'Please enter a valid email address';
        otpStatusEl.className = 'otp-status error'; return;
      }
      generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
      document.getElementById('sf-otp-actual').value  = generatedOTP;
      document.getElementById('sf-email-verified').value = 'false';
      otpVerified = false;
      otpSendBtn.disabled = true; otpSendText.textContent = 'Sending…';
      otpStatusEl.textContent = ''; otpStatusEl.className = 'otp-status';
      setTimeout(() => {
        otpSendText.textContent = 'Code Sent ✓';
        otpStatusEl.textContent = '✅ Code sent to ' + email;
        otpStatusEl.className   = 'otp-status success';
        localStorage.setItem('userEmail', email);
        saveStep('3');
        currentStepIndex = STEP_IDS.indexOf('3b');
        showSlide(currentStepIndex);
        const hint = document.getElementById('otp-demo-hint');
        if (hint) hint.textContent = 'Demo code: ' + generatedOTP;
        document.getElementById('otp-sent-to-label').textContent = 'Code sent to ' + email;
        startOtpResendTimer();
        setTimeout(() => document.querySelector('.otp-box')?.focus(), 300);
      }, 1200);
    });
  }
  function initOTPBoxes() {
    const boxes = Array.from(document.querySelectorAll('.otp-box'));
    if (!boxes.length) return;
    boxes.forEach((box, i) => {
      box.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        box.value = val ? val[0] : '';
        if (val) { box.classList.add('filled'); if (i < boxes.length - 1) boxes[i + 1].focus(); else checkOTP(boxes); }
        else box.classList.remove('filled');
      });
      box.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus(); });
      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        pasted.split('').slice(0, boxes.length - i).forEach((ch, j) => {
          if (boxes[i + j]) { boxes[i + j].value = ch; boxes[i + j].classList.add('filled'); }
        });
        boxes[Math.min(i + pasted.length, boxes.length - 1)].focus();
        if (i + pasted.length >= boxes.length) checkOTP(boxes);
      });
    });
  }
  function checkOTP(boxes) {
    const entered = boxes.map(b => b.value).join('');
    if (entered.length < 6) return;
    const statusEl = document.getElementById('otp-verify-status');
    if (entered === generatedOTP) {
      boxes.forEach(b => { b.classList.add('success'); b.classList.remove('error', 'filled'); });
      if (statusEl) { statusEl.textContent = '✅ Email verified!'; statusEl.className = 'otp-verify-status success'; }
      document.getElementById('sf-email-verified').value = 'true';
      otpVerified = true;
      if (nextBtn) { nextBtn.style.display = 'inline-flex'; nextBtn.textContent = 'Continue →'; }
    } else {
      boxes.forEach(b => { b.classList.add('error'); b.classList.remove('success', 'filled'); });
      if (statusEl) { statusEl.textContent = '❌ Incorrect code. Try again.'; statusEl.className = 'otp-verify-status error'; }
      otpVerified = false;
      setTimeout(() => { boxes.forEach(b => { b.value = ''; b.classList.remove('error'); }); boxes[0].focus(); }, 1200);
    }
  }
  function startOtpResendTimer() {
    if (otpResendTimer) clearInterval(otpResendTimer);
    let secs = 30;
    const countdown  = document.getElementById('otp-countdown');
    const resendBtn  = document.getElementById('otp-resend-btn');
    const timerLabel = document.getElementById('otp-timer-label');
    if (resendBtn)  resendBtn.disabled = true;
    if (countdown)  countdown.textContent = secs;
    if (timerLabel) timerLabel.style.display = '';
    otpResendTimer = setInterval(() => {
      secs--;
      if (countdown) countdown.textContent = secs;
      if (secs <= 0) {
        clearInterval(otpResendTimer);
        if (resendBtn)  resendBtn.disabled = false;
        if (timerLabel) timerLabel.style.display = 'none';
      }
    }, 1000);
  }
  const resendBtn = document.getElementById('otp-resend-btn');
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
      document.getElementById('sf-otp-actual').value  = generatedOTP;
      document.getElementById('sf-email-verified').value = 'false';
      otpVerified = false;
      document.querySelectorAll('.otp-box').forEach(b => { b.value = ''; b.classList.remove('filled','success','error'); });
      const statusEl = document.getElementById('otp-verify-status');
      if (statusEl) { statusEl.textContent = 'New code sent!'; statusEl.className = 'otp-verify-status success'; }
      if (nextBtn) nextBtn.style.display = 'none';
      const hint = document.getElementById('otp-demo-hint');
      if (hint) hint.textContent = 'Demo code: ' + generatedOTP;
      startOtpResendTimer();
      document.querySelector('.otp-box')?.focus();
    });
  }
  initOTPBoxes();
  showSlide(0);
}

/* ═══════════════════════════════════════════════════════════
   11. COLLEGE FINDER WIZARD v7
   Flow: Step 1 (Education) → Step 2 (State) → Step 3 (Stream) → Step 4 (Results)
   - India only (worldwide removed)
   - No city input
   - Top 10 colleges per state + stream
   - Clean cards: college name + location + Read More button
   - 7-second countdown redirect in "not found" modals
   ═══════════════════════════════════════════════════════════ */

/* ══ College Database ══
   TO ADD MORE COLLEGES: append objects here.
   Each college: id, name, location, state, tag,
                 education[], stream[], website, desc
   ================================================ */
const COLLEGE_DB = [
  // ── MAHARASHTRA ──
  { id:1,  name:"St. Xavier's College",          location:"Mumbai, Maharashtra",    state:"Maharashtra", tag:"Arts & Science",  education:["junior","junior-bachelor","bachelor"], stream:["Science","Commerce","Arts"],                                        website:"https://xaviers.edu",      desc:"Prestigious autonomous college affiliated to Mumbai University." },
  { id:2,  name:"Mithibai College",               location:"Mumbai, Maharashtra",    state:"Maharashtra", tag:"Commerce & Arts", education:["junior","junior-bachelor","bachelor"], stream:["Commerce","Arts","Science"],                                        website:"https://mithibai.ac.in",   desc:"One of Mumbai's most vibrant undergraduate colleges." },
  { id:3,  name:"HNCC College",                   location:"Pune, Maharashtra",      state:"Maharashtra", tag:"Commerce",        education:["junior","bachelor"],                   stream:["Commerce","Arts"],                                                  website:"",                         desc:"Renowned Pune college with strong commerce programs." },
  { id:4,  name:"IIT Bombay",                     location:"Mumbai, Maharashtra",    state:"Maharashtra", tag:"Premier Tech",    education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science"],                    website:"https://iitb.ac.in",       desc:"India's top engineering institute, globally ranked." },
  { id:5,  name:"College of Engineering Pune",    location:"Pune, Maharashtra",      state:"Maharashtra", tag:"Engineering",     education:["bachelor","master"],                   stream:["Engineering","Computer Science"],                                   website:"https://coep.org.in",      desc:"One of Asia's oldest engineering colleges, established 1854." },
  { id:6,  name:"Symbiosis Institute of Business",location:"Pune, Maharashtra",      state:"Maharashtra", tag:"Business",        education:["bachelor","master"],                   stream:["Business Administration","Economics"],                              website:"https://sibmhyd.com",      desc:"Top-ranked business school with industry-aligned MBA programs." },
  { id:7,  name:"Fergusson College",              location:"Pune, Maharashtra",      state:"Maharashtra", tag:"Science & Arts",  education:["junior","bachelor"],                   stream:["Science","Arts","Economics"],                                       website:"https://fergusson.edu",    desc:"Historic college in Pune with strong humanities and science faculty." },
  { id:8,  name:"K.J. Somaiya College",           location:"Mumbai, Maharashtra",    state:"Maharashtra", tag:"Management",      education:["bachelor","master"],                   stream:["Business Administration","Computer Science","Commerce"],            website:"https://kjsomaiya.edu.in", desc:"Leading Mumbai institution offering diverse undergraduate programs." },
  { id:9,  name:"University of Mumbai (Fort)",    location:"Mumbai, Maharashtra",    state:"Maharashtra", tag:"Central University",education:["bachelor","master"],                 stream:["Science","Arts","Commerce","Law","Economics"],                      website:"https://mu.ac.in",         desc:"Affiliating university for hundreds of colleges in Mumbai region." },
  { id:10, name:"DY Patil Medical College",       location:"Pune, Maharashtra",      state:"Maharashtra", tag:"Medical",         education:["bachelor","master"],                   stream:["Medical"],                                                          website:"https://dypatil.edu",      desc:"Premier medical college offering MBBS and specialty postgraduate programs." },
  { id:11, name:"Pune Institute of Computer Tech",location:"Pune, Maharashtra",      state:"Maharashtra", tag:"Computer Science", education:["bachelor","master"],                  stream:["Computer Science","Data Science","Engineering"],                    website:"https://pict.edu",         desc:"Top-ranked IT college in Pune with excellent placement record." },

  // ── DELHI ──
  { id:12, name:"Delhi University (North Campus)",location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"National",        education:["junior","junior-bachelor","bachelor","master"], stream:["Science","Commerce","Arts","Business Administration","Economics","Psychology","Law"], website:"https://du.ac.in", desc:"India's premier central university spanning a wide range of disciplines." },
  { id:13, name:"Jawaharlal Nehru University",    location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Research",        education:["master"],                              stream:["Science","Arts","Economics","Psychology"],                          website:"https://jnu.ac.in",        desc:"Premier research university known for social sciences and international studies." },
  { id:14, name:"IIT Delhi",                      location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Premier Tech",    education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science"],                    website:"https://iitd.ac.in",       desc:"Top-tier IIT known for engineering, research, and innovation." },
  { id:15, name:"AIIMS Delhi",                    location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Medical",         education:["bachelor","master"],                   stream:["Medical"],                                                          website:"https://aiims.edu",        desc:"India's most prestigious medical institution for MBBS and specializations." },
  { id:16, name:"Lady Shri Ram College",          location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Women's College",  education:["junior","bachelor"],                  stream:["Arts","Economics","Psychology","Commerce"],                         website:"https://lsr.edu.in",       desc:"Top women's college under Delhi University with strong humanities faculty." },
  { id:17, name:"Shri Ram College of Commerce",   location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Commerce",        education:["junior","bachelor","master"],           stream:["Commerce","Economics","Business Administration"],                   website:"https://srcc.edu",         desc:"India's most prestigious commerce college with outstanding alumni." },
  { id:18, name:"Miranda House",                  location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Arts & Science",  education:["junior","bachelor"],                   stream:["Arts","Science","Psychology"],                                      website:"https://mirandahouse.ac.in",desc:"Ranked India's #1 college multiple times by NIRF." },
  { id:19, name:"Jamia Millia Islamia",           location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Central University",education:["bachelor","master"],                 stream:["Arts","Engineering","Law","Media Studies"],                         website:"https://jmi.ac.in",        desc:"Central university with strong programs in engineering, arts, and law." },
  { id:20, name:"Delhi Technological University", location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"Technology",      education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science"],                    website:"https://dtu.ac.in",        desc:"Top state technical university formerly known as DCE." },
  { id:21, name:"Indraprastha University",        location:"New Delhi, Delhi",       state:"Delhi (NCT)", tag:"University",      education:["bachelor","master"],                   stream:["Engineering","Law","Medical","Business Administration"],             website:"https://ipu.ac.in",        desc:"State university offering professional and technical programs." },

  // ── KARNATAKA ──
  { id:22, name:"IISc Bangalore",                 location:"Bangalore, Karnataka",  state:"Karnataka",   tag:"Research",        education:["master"],                              stream:["Engineering","Computer Science","Data Science","Science"],          website:"https://iisc.ac.in",       desc:"India's top science and engineering research institution." },
  { id:23, name:"IIT Bangalore (IIIT-B)",         location:"Bangalore, Karnataka",  state:"Karnataka",   tag:"Technology",      education:["bachelor","master"],                   stream:["Computer Science","Data Science"],                                  website:"https://iiitb.ac.in",      desc:"Premier IT institute in Bangalore with strong industry connections." },
  { id:24, name:"Bangalore University",           location:"Bangalore, Karnataka",  state:"Karnataka",   tag:"University",      education:["junior","bachelor","master"],           stream:["Science","Arts","Commerce","Law"],                                  website:"https://bangaloreuniversity.ac.in", desc:"Major affiliating university covering Central Karnataka." },
  { id:25, name:"Christ University",              location:"Bangalore, Karnataka",  state:"Karnataka",   tag:"Liberal Arts",    education:["bachelor","master"],                   stream:["Arts","Commerce","Business Administration","Psychology","Law"],      website:"https://christuniversity.in", desc:"Deemed university known for holistic education and diverse programs." },
  { id:26, name:"Manipal Academy of Higher Edu.", location:"Manipal, Karnataka",    state:"Karnataka",   tag:"Deemed University",education:["bachelor","master"],                  stream:["Medical","Engineering","Business Administration","Computer Science"],website:"https://manipal.edu",      desc:"One of India's largest deemed universities with global recognition." },
  { id:27, name:"PES University",                 location:"Bangalore, Karnataka",  state:"Karnataka",   tag:"Engineering",     education:["bachelor","master"],                   stream:["Engineering","Computer Science","Business Administration"],          website:"https://pes.edu",          desc:"Well-ranked engineering and technology university in Bangalore." },
  { id:28, name:"Mysore University",              location:"Mysore, Karnataka",     state:"Karnataka",   tag:"University",      education:["bachelor","master"],                   stream:["Science","Arts","Commerce","Law"],                                  website:"https://uni-mysore.ac.in", desc:"One of India's oldest universities with strong research traditions." },
  { id:29, name:"RV College of Engineering",      location:"Bangalore, Karnataka",  state:"Karnataka",   tag:"Engineering",     education:["bachelor","master"],                   stream:["Engineering","Computer Science"],                                   website:"https://rvce.edu.in",      desc:"Top-ranked autonomous engineering college affiliated to VTU." },

  // ── TAMIL NADU ──
  { id:30, name:"IIT Madras",                     location:"Chennai, Tamil Nadu",   state:"Tamil Nadu",  tag:"Premier Tech",    education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science"],                    website:"https://iitm.ac.in",       desc:"Consistently ranked India's #1 engineering institution by NIRF." },
  { id:31, name:"Loyola College Chennai",          location:"Chennai, Tamil Nadu",   state:"Tamil Nadu",  tag:"Arts & Science",  education:["bachelor","master"],                   stream:["Science","Arts","Commerce","Economics"],                            website:"https://loyolacollege.edu", desc:"Prestigious autonomous college known for academic excellence." },
  { id:32, name:"University of Madras",           location:"Chennai, Tamil Nadu",   state:"Tamil Nadu",  tag:"University",      education:["bachelor","master"],                   stream:["Science","Arts","Commerce","Law"],                                  website:"https://unom.ac.in",       desc:"One of India's oldest universities, established 1857." },
  { id:33, name:"Vellore Institute of Technology",location:"Vellore, Tamil Nadu",   state:"Tamil Nadu",  tag:"Technology",      education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science","Business Administration"],website:"https://vit.ac.in", desc:"Deemed university with excellent global rankings and placements." },
  { id:34, name:"SRM Institute of Sci & Tech",    location:"Kattankulathur, TN",    state:"Tamil Nadu",  tag:"Technology",      education:["bachelor","master"],                   stream:["Engineering","Computer Science","Medical","Business Administration"],website:"https://srmist.edu.in",    desc:"Major deemed university with world-class facilities and research." },
  { id:35, name:"PSG College of Technology",      location:"Coimbatore, Tamil Nadu",state:"Tamil Nadu",  tag:"Engineering",     education:["bachelor","master"],                   stream:["Engineering","Computer Science"],                                   website:"https://psgtech.edu",      desc:"One of the top autonomous engineering colleges in Tamil Nadu." },
  { id:36, name:"Anna University",                location:"Chennai, Tamil Nadu",   state:"Tamil Nadu",  tag:"State Tech Univ", education:["bachelor","master"],                   stream:["Engineering","Computer Science","Architecture"],                    website:"https://annauniv.edu",     desc:"State technical university offering engineering programs across TN." },

  // ── RAJASTHAN ──
  { id:37, name:"BITS Pilani",                    location:"Pilani, Rajasthan",     state:"Rajasthan",   tag:"Engineering",     education:["bachelor","master"],                   stream:["Engineering","Computer Science","Business Administration"],          website:"https://bits-pilani.ac.in",desc:"Top-ranked private engineering university with strong placements." },
  { id:38, name:"IIT Jodhpur",                    location:"Jodhpur, Rajasthan",    state:"Rajasthan",   tag:"Premier Tech",    education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science"],                    website:"https://iitj.ac.in",       desc:"Young IIT with growing reputation in engineering and research." },
  { id:39, name:"University of Rajasthan",        location:"Jaipur, Rajasthan",     state:"Rajasthan",   tag:"University",      education:["bachelor","master"],                   stream:["Science","Arts","Commerce","Law"],                                  website:"https://uniraj.ac.in",     desc:"State central university offering diverse undergraduate programs." },
  { id:40, name:"Manipal University Jaipur",      location:"Jaipur, Rajasthan",     state:"Rajasthan",   tag:"Technology",      education:["bachelor","master"],                   stream:["Engineering","Computer Science","Business Administration"],          website:"https://jaipur.manipal.edu",desc:"Private university with modern facilities and industry linkages." },

  // ── GUJARAT ──
  { id:41, name:"IIT Gandhinagar",                location:"Gandhinagar, Gujarat",  state:"Gujarat",     tag:"Premier Tech",    education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science"],                    website:"https://iitgn.ac.in",      desc:"Young IIT known for liberal engineering education." },
  { id:42, name:"Gujarat University",             location:"Ahmedabad, Gujarat",    state:"Gujarat",     tag:"University",      education:["bachelor","master"],                   stream:["Science","Arts","Commerce","Law"],                                  website:"https://gujaratuniversity.ac.in", desc:"Major state university covering a wide range of programs." },
  { id:43, name:"PDEU (Pandit Deendayal Energy)", location:"Gandhinagar, Gujarat",  state:"Gujarat",     tag:"Energy & Tech",   education:["bachelor","master"],                   stream:["Engineering","Computer Science","Business Administration"],          website:"https://pdpu.ac.in",       desc:"Specialized university focused on energy, technology and management." },
  { id:44, name:"Nirma University",               location:"Ahmedabad, Gujarat",    state:"Gujarat",     tag:"University",      education:["bachelor","master"],                   stream:["Engineering","Law","Business Administration","Computer Science"],    website:"https://nirmauni.ac.in",   desc:"Well-reputed private university offering professional programs." },

  // ── WEST BENGAL ──
  { id:45, name:"IIT Kharagpur",                  location:"Kharagpur, West Bengal",state:"West Bengal",  tag:"Premier Tech",   education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science","Architecture"],     website:"https://iitkgp.ac.in",     desc:"India's first IIT, consistently ranked among the best globally." },
  { id:46, name:"Jadavpur University",            location:"Kolkata, West Bengal",  state:"West Bengal",  tag:"Engineering",    education:["bachelor","master"],                   stream:["Engineering","Computer Science","Arts","Science"],                  website:"https://jadavpur.edu",     desc:"Premier state university with strong engineering and arts programs." },
  { id:47, name:"University of Calcutta",         location:"Kolkata, West Bengal",  state:"West Bengal",  tag:"University",     education:["bachelor","master"],                   stream:["Science","Arts","Commerce","Law"],                                  website:"https://caluniv.ac.in",    desc:"One of India's oldest universities established in 1857." },
  { id:48, name:"Presidency University",          location:"Kolkata, West Bengal",  state:"West Bengal",  tag:"Liberal Arts",   education:["bachelor","master"],                   stream:["Science","Arts","Economics"],                                       website:"https://presiuniv.ac.in",  desc:"Historic college-turned-university known for academic excellence." },

  // ── UTTAR PRADESH ──
  { id:49, name:"IIT Kanpur",                     location:"Kanpur, Uttar Pradesh", state:"Uttar Pradesh",tag:"Premier Tech",    education:["bachelor","master"],                   stream:["Engineering","Computer Science","Data Science"],                    website:"https://iitk.ac.in",       desc:"One of India's top IITs known for research and innovation." },
  { id:50, name:"IIT BHU Varanasi",               location:"Varanasi, Uttar Pradesh",state:"Uttar Pradesh",tag:"Tech & Science", education:["bachelor","master"],                  stream:["Engineering","Computer Science","Science"],                         website:"https://iitbhu.ac.in",     desc:"Integrated institute within BHU campus with strong technical programs." },
  { id:51, name:"Banaras Hindu University",       location:"Varanasi, Uttar Pradesh",state:"Uttar Pradesh",tag:"Central University",education:["bachelor","master"],                stream:["Science","Arts","Commerce","Law","Medical","Engineering"],           website:"https://bhu.ac.in",        desc:"One of Asia's largest residential universities." },
  { id:52, name:"Aligarh Muslim University",      location:"Aligarh, Uttar Pradesh",state:"Uttar Pradesh",tag:"Central University",education:["bachelor","master"],                 stream:["Science","Arts","Engineering","Law","Medical"],                     website:"https://amu.ac.in",        desc:"Central university known for law, medicine, and liberal arts." },
  { id:53, name:"Amity University Noida",         location:"Noida, Uttar Pradesh",  state:"Uttar Pradesh",tag:"Private University",education:["bachelor","master"],                 stream:["Engineering","Business Administration","Law","Media Studies","Computer Science"],website:"https://amity.edu",desc:"Large private university with extensive programs and campus." },

  // ── TELANGANA ──
  { id:54, name:"University of Hyderabad",        location:"Hyderabad, Telangana",  state:"Telangana",   tag:"Central University",education:["master"],                             stream:["Science","Arts","Economics","Psychology","Computer Science"],       website:"https://uohyd.ac.in",      desc:"Premier central university known for research excellence." },
  { id:55, name:"NALSAR University of Law",       location:"Hyderabad, Telangana",  state:"Telangana",   tag:"Law",             education:["bachelor","master"],                   stream:["Law"],                                                              website:"https://nalsar.ac.in",     desc:"One of the top national law universities in India." },
  { id:56, name:"IIIT Hyderabad",                 location:"Hyderabad, Telangana",  state:"Telangana",   tag:"Technology",      education:["bachelor","master"],                   stream:["Computer Science","Data Science","Engineering"],                    website:"https://iiit.ac.in",       desc:"Specialized IT institute known for research-oriented education." },
  { id:57, name:"Osmania University",             location:"Hyderabad, Telangana",  state:"Telangana",   tag:"State University", education:["bachelor","master"],                   stream:["Science","Arts","Commerce","Law","Engineering"],                    website:"https://osmania.ac.in",    desc:"One of India's oldest state universities." },
];

/* State list for dropdown */
const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi (NCT)",
];

/* Streams by education level */
const STREAMS_BY_EDU = {
  junior: [
    { icon:"🔬", label:"Science" },
    { icon:"📊", label:"Commerce" },
    { icon:"🎨", label:"Arts" },
  ],
  default: [
    { icon:"💻", label:"Computer Science" },
    { icon:"⚙️",  label:"Engineering" },
    { icon:"🩺", label:"Medical" },
    { icon:"📈", label:"Business Administration" },
    { icon:"📉", label:"Economics" },
    { icon:"🤖", label:"Data Science" },
    { icon:"🧠", label:"Psychology" },
    { icon:"⚖️",  label:"Law" },
    { icon:"🏗️", label:"Architecture" },
    { icon:"📺", label:"Media Studies" },
  ],
};

/* Wizard state */
const wiz = { step: null, education: null, state: null, stream: null };
const STEP_ORDER = ['1', '2', '3', '4'];

/* Tracks all displayed results for search */
let allCollegeResults = [];

/* ══ INIT ══ */
function initCollegeWizard() {
  const wizardCard = document.getElementById('wizard-card');
  if (!wizardCard) return;

  buildWizardTracker();
  buildStateDropdown();
  goWizardStep('1');

  /* Education card click → auto-advance to state */
  wizardCard.addEventListener('click', (e) => {
    const card = e.target.closest('.wizard-big-card[data-group="education"]');
    if (!card) return;
    wizardCard.querySelectorAll('.wizard-big-card[data-group="education"]').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    wiz.education = card.dataset.val;
    setTimeout(() => goWizardStep('2'), 300);
  });

  /* Stream box click → auto-advance to results */
  wizardCard.addEventListener('click', (e) => {
    const sbox = e.target.closest('.stream-box');
    if (!sbox) return;
    wizardCard.querySelectorAll('.stream-box').forEach(b => b.classList.remove('selected'));
    sbox.classList.add('selected');
    wiz.stream = sbox.dataset.stream;
    setTimeout(() => { goWizardStep('4'); showCollegeResults(); }, 320);
  });

  /* Back arrow */
  const backBtn = document.getElementById('wizard-back');
  if (backBtn) backBtn.addEventListener('click', wizardBack);

  /* State proceed button */
  const stateProceedBtn = document.getElementById('state-proceed-btn');
  if (stateProceedBtn) stateProceedBtn.addEventListener('click', () => {
    if (!wiz.state) return;
    goWizardStep('3');
  });

  /* College search */
  const searchInput = document.getElementById('college-search-input');
  const searchClear = document.getElementById('college-search-clear');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (searchClear) searchClear.style.display = q ? 'flex' : 'none';
      filterCollegeResults(q);
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      filterCollegeResults('');
    });
  }

  /* No-match modal buttons */
  const modalSearchAgain = document.getElementById('modal-search-again');
  if (modalSearchAgain) modalSearchAgain.addEventListener('click', () => {
    closeModal('no-match-modal');
    renderCollegeCards(allCollegeResults);
  });

  /* College-not-found modal */
  const collegeNfOk = document.getElementById('college-nf-ok');
  if (collegeNfOk) collegeNfOk.addEventListener('click', () => {
    closeModal('college-not-found-modal');
    filterCollegeResults('');
    const searchInput = document.getElementById('college-search-input');
    if (searchInput) searchInput.value = '';
  });
}

/* ── Tracker ── */
function buildWizardTracker() {
  const tracker = document.getElementById('wizard-tracker');
  if (!tracker) return;
  const labels = ['Program', 'State', 'Stream', 'Results'];
  tracker.innerHTML = labels.map((label, i) => `
    <div class="wt-step">
      <div class="wt-dot" id="wt-dot-${i+1}" title="${label}">${i+1}</div>
      ${i < labels.length - 1 ? `<div class="wt-line" id="wt-line-${i+1}"></div>` : ''}
    </div>`).join('');
}

function updateWizardTracker(activeStepId) {
  const activeIdx = STEP_ORDER.indexOf(activeStepId);
  for (let i = 1; i <= 4; i++) {
    const dot  = document.getElementById(`wt-dot-${i}`);
    const line = document.getElementById(`wt-line-${i}`);
    if (dot) {
      dot.classList.remove('active', 'done');
      if (i - 1 < activeIdx)  dot.classList.add('done');
      else if (i - 1 === activeIdx) dot.classList.add('active');
    }
    if (line) line.classList.toggle('done', i - 1 < activeIdx);
  }
}

/* ── Navigate to step ── */
function goWizardStep(stepId, goingBack = false) {
  document.querySelectorAll('.wizard-slide').forEach(s => s.classList.remove('active', 'from-back'));
  const target = document.querySelector(`.wizard-slide[data-wstep="${stepId}"]`);
  if (!target) return;
  if (goingBack) target.classList.add('from-back');
  target.classList.add('active');
  wiz.step = stepId;
  updateWizardTracker(stepId);

  if (stepId === '3') buildStreamGrid();

  /* Back arrow visibility */
  const idx     = STEP_ORDER.indexOf(stepId);
  const backBtn = document.getElementById('wizard-back');
  if (backBtn) backBtn.style.visibility = idx > 0 ? 'visible' : 'hidden';

  /* Scroll wizard card into view */
  const card = document.getElementById('wizard-card');
  if (card) setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
}

function wizardBack() {
  const idx = STEP_ORDER.indexOf(wiz.step);
  if (idx > 0) goWizardStep(STEP_ORDER[idx - 1], true);
}

/* ── State Dropdown ── */
function buildStateDropdown() {
  const list = document.getElementById('state-list');
  if (!list) return;

  function render(filter) {
    const q = (filter || '').toLowerCase().trim();
    const items = q ? INDIA_STATES.filter(s => s.toLowerCase().includes(q)) : INDIA_STATES;
    const sel   = document.getElementById('selected-state')?.value || '';
    list.innerHTML = items.length
      ? items.map(s => `<div class="mdd-item${s === sel ? ' selected' : ''}" data-val="${s}">${s}</div>`).join('')
      : `<div class="mdd-empty">No states match "${filter}"</div>`;
  }

  render('');

  const searchInput = document.getElementById('state-search');
  if (searchInput) searchInput.addEventListener('input', () => render(searchInput.value));

  list.addEventListener('click', (e) => {
    const item = e.target.closest('.mdd-item');
    if (!item) return;
    const val = item.dataset.val;

    /* Store */
    const hidden = document.getElementById('selected-state');
    if (hidden) hidden.value = val;
    wiz.state = val;

    /* Update trigger */
    const wrap = document.getElementById('state-dropdown-wrap');
    if (wrap) wrap.classList.add('has-value');
    const chosenText = document.getElementById('state-chosen-text');
    if (chosenText) chosenText.textContent = val;

    /* Mark selected in list */
    list.querySelectorAll('.mdd-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');

    closeDropdown('state');

    /* Show proceed button */
    const proceedBtn   = document.getElementById('state-proceed-btn');
    const proceedLabel = document.getElementById('state-proceed-label');
    if (proceedBtn)   proceedBtn.style.display = 'flex';
    if (proceedLabel) proceedLabel.textContent  = val;

    /* Scroll proceed button into view */
    setTimeout(() => proceedBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  });

  /* Trigger toggle */
  const trigger = document.getElementById('state-trigger');
  if (trigger) {
    trigger.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown('state'); });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown('state'); }
      if (e.key === 'Escape') closeDropdown('state');
    });
  }
}

/* ── Dropdown helpers ── */
function toggleDropdown(type) {
  const panel   = document.getElementById(`${type}-panel`);
  const trigger = document.getElementById(`${type}-trigger`);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  ['state'].forEach(t => {
    const p  = document.getElementById(`${t}-panel`);
    const tr = document.getElementById(`${t}-trigger`);
    if (p)  p.classList.remove('open');
    if (tr) { tr.classList.remove('is-open'); tr.setAttribute('aria-expanded', 'false'); }
  });
  if (!isOpen) {
    panel.classList.add('open');
    if (trigger) { trigger.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
    setTimeout(() => panel.querySelector('.mdd-search')?.focus(), 60);
  }
}
function closeDropdown(type) {
  const panel   = document.getElementById(`${type}-panel`);
  const trigger = document.getElementById(`${type}-trigger`);
  if (panel)   panel.classList.remove('open');
  if (trigger) { trigger.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }
}
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('state-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown('state');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDropdown('state');
});

/* ── Stream Grid (3-per-row boxes) ── */
function buildStreamGrid() {
  const grid = document.getElementById('stream-grid');
  if (!grid) return;
  const key     = (wiz.education === 'junior' || wiz.education === 'junior-bachelor') ? 'junior' : 'default';
  const streams = STREAMS_BY_EDU[key];
  grid.innerHTML = streams.map(s => `
    <button class="stream-box${wiz.stream === s.label ? ' selected' : ''}" data-stream="${s.label}">
      <span class="stream-box-icon">${s.icon}</span>
      <span class="stream-box-label">${s.label}</span>
    </button>`).join('');
}

/* ── Show College Results (top 10 for state + stream) ── */
function showCollegeResults() {
  const grid = document.getElementById('college-results-grid');
  if (!grid) return;

  /* Update subtitle */
  const subtitle = document.getElementById('results-subtitle');
  if (subtitle) subtitle.textContent = `Top colleges in ${wiz.state} for ${wiz.stream}`;

  grid.innerHTML = `
    <div class="results-loading" style="grid-column:1/-1;">
      <div class="results-loading-dots"><div></div><div></div><div></div></div>
      <p>Finding top colleges in ${wiz.state}…</p>
    </div>`;

  setTimeout(() => {
    /* Filter by education + stream + state, take top 10 */
    let matches = COLLEGE_DB.filter(c => {
      const eduMatch    = !wiz.education || c.education.includes(wiz.education);
      const streamMatch = !wiz.stream   || (c.stream && c.stream.includes(wiz.stream));
      const stateMatch  = !wiz.state    || c.state === wiz.state;
      return eduMatch && streamMatch && stateMatch;
    }).slice(0, 10);

    /* Fallback: state matches, ignore stream */
    if (matches.length === 0) {
      matches = COLLEGE_DB.filter(c =>
        c.state === wiz.state && (!wiz.education || c.education.includes(wiz.education))
      ).slice(0, 10);
    }

    /* Fallback: stream matches, ignore state */
    if (matches.length === 0) {
      matches = COLLEGE_DB.filter(c =>
        c.stream && c.stream.includes(wiz.stream) && (!wiz.education || c.education.includes(wiz.education))
      ).slice(0, 10);
    }

    if (matches.length === 0) {
      showNoMatchModal();
      return;
    }

    allCollegeResults = matches;
    renderCollegeCards(matches);

    /* Add "Start Over" button */
    const header = document.querySelector('#wizard-card .wizard-slide[data-wstep="4"] .wizard-slide-header');
    if (header && !header.querySelector('.reset-btn')) {
      const resetBtn = document.createElement('button');
      resetBtn.className   = 'btn btn-secondary reset-btn';
      resetBtn.style.cssText = 'margin-top:0.75rem;font-size:0.82rem;padding:0.5rem 1.2rem;';
      resetBtn.textContent = '↺ Start Over';
      resetBtn.addEventListener('click', resetWizard);
      header.appendChild(resetBtn);
    }
  }, 700);
}

/* ── Render college cards — name + location + Read More ── */
function renderCollegeCards(list) {
  const grid = document.getElementById('college-results-grid');
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results-inline" style="grid-column:1/-1;">
        <p>No colleges match your search.</p>
        <button class="btn btn-secondary" style="margin-top:0.75rem;" onclick="clearCollegeSearch()">Show All Results</button>
      </div>`;
    return;
  }
  grid.innerHTML = list.map((c, i) => `
    <div class="college-card-v7 reveal" style="transition-delay:${Math.min(i, 8) * 0.06}s;">
      <div class="ccv7-rank">${i + 1}</div>
      <div class="ccv7-body">
        <div class="ccv7-tag">${c.tag}</div>
        <h3 class="ccv7-name">${c.name}</h3>
        <div class="ccv7-location">
          <span class="ccv7-location-dot"></span>
          ${c.location}
        </div>
      </div>
      <div class="ccv7-footer">
        ${c.website
          ? `<a href="${c.website}" target="_blank" rel="noopener noreferrer" class="ccv7-readmore">Read More ↗</a>`
          : `<span class="ccv7-readmore ccv7-readmore--disabled">Info Coming Soon</span>`
        }
      </div>
    </div>`).join('');
  initScrollReveal();
}
window.clearCollegeSearch = function () {
  const inp = document.getElementById('college-search-input');
  if (inp) inp.value = '';
  const clear = document.getElementById('college-search-clear');
  if (clear) clear.style.display = 'none';
  renderCollegeCards(allCollegeResults);
};

/* ── Filter college results by search query ── */
function filterCollegeResults(query) {
  if (!query.trim()) { renderCollegeCards(allCollegeResults); return; }
  const q        = query.toLowerCase();
  const filtered = allCollegeResults.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q) ||
    c.tag.toLowerCase().includes(q)
  );
  if (filtered.length === 0) {
    showCollegeNotFoundModal();
  } else {
    renderCollegeCards(filtered);
  }
}

/* ── Reset wizard ── */
function resetWizard() {
  Object.assign(wiz, { step: null, education: null, state: null, stream: null });
  allCollegeResults = [];

  document.querySelectorAll('.wizard-big-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.stream-box').forEach(b => b.classList.remove('selected'));

  const hidden = document.getElementById('selected-state');
  if (hidden) hidden.value = '';
  const wrap = document.getElementById('state-dropdown-wrap');
  if (wrap) wrap.classList.remove('has-value');
  const chosen = document.getElementById('state-chosen-text');
  if (chosen) chosen.textContent = '';
  closeDropdown('state');
  const srch = document.getElementById('state-search');
  if (srch) srch.value = '';

  const proceedBtn = document.getElementById('state-proceed-btn');
  if (proceedBtn) proceedBtn.style.display = 'none';

  const csi = document.getElementById('college-search-input');
  if (csi) csi.value = '';
  const csc = document.getElementById('college-search-clear');
  if (csc) csc.style.display = 'none';

  document.querySelectorAll('.reset-btn').forEach(b => b.remove());
  goWizardStep('1');
}

/* ── Modal: No matches ── */
let noMatchCountdownTimer = null;
function showNoMatchModal() {
  const modal = document.getElementById('no-match-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modal.onclick = (e) => { if (e.target === modal) { clearNoMatchTimer(); closeModal('no-match-modal'); } };

  let secs = 7;
  const timerEl  = document.getElementById('modal-timer');
  const barEl    = document.getElementById('modal-countdown-bar');
  if (timerEl) timerEl.textContent = `Redirecting in ${secs}s…`;
  if (barEl) { barEl.style.transition = 'none'; barEl.style.width = '100%'; }
  setTimeout(() => { if (barEl) { barEl.style.transition = `width ${secs}s linear`; barEl.style.width = '0%'; } }, 50);

  noMatchCountdownTimer = setInterval(() => {
    secs--;
    if (timerEl) timerEl.textContent = `Redirecting in ${secs}s…`;
    if (secs <= 0) {
      clearNoMatchTimer();
      closeModal('no-match-modal');
      goWizardStep('3', true); // redirect back to stream step
    }
  }, 1000);
}
function clearNoMatchTimer() { if (noMatchCountdownTimer) { clearInterval(noMatchCountdownTimer); noMatchCountdownTimer = null; } }

/* ── Modal: College not found via search ── */
let nfCountdownTimer = null;
function showCollegeNotFoundModal() {
  const modal = document.getElementById('college-not-found-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modal.onclick = (e) => { if (e.target === modal) { clearNfTimer(); closeModal('college-not-found-modal'); renderCollegeCards(allCollegeResults); } };

  let secs = 7;
  const timerEl = document.getElementById('nf-modal-timer');
  const barEl   = document.getElementById('nf-countdown-bar');
  if (timerEl) timerEl.textContent = `Showing all results in ${secs}s…`;
  if (barEl)   { barEl.style.transition = 'none'; barEl.style.width = '100%'; }
  setTimeout(() => { if (barEl) { barEl.style.transition = `width ${secs}s linear`; barEl.style.width = '0%'; } }, 50);

  nfCountdownTimer = setInterval(() => {
    secs--;
    if (timerEl) timerEl.textContent = `Showing all results in ${secs}s…`;
    if (secs <= 0) {
      clearNfTimer();
      closeModal('college-not-found-modal');
      filterCollegeResults('');
      const inp = document.getElementById('college-search-input');
      if (inp) inp.value = '';
      const clr = document.getElementById('college-search-clear');
      if (clr) clr.style.display = 'none';
    }
  }, 1000);
}
function clearNfTimer() { if (nfCountdownTimer) { clearInterval(nfCountdownTimer); nfCountdownTimer = null; } }

/* ── Generic modal close ── */
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}
window.showCollegeNotFoundModal = showCollegeNotFoundModal;

/* ── 12. FAQ ACCORDION ── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── 13. INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  checkFirstVisit();
  renderNavUser();
  initStudentForm();
  initWelcomePage();
  initReviewSlider();
  initCollegeWizard();
  initFAQ();
  initScrollReveal();
});
