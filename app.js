/* ============================================
   BUZBO APP — Main Application Logic
   ============================================ */

'use strict';

// ── App State ──────────────────────────────
const state = {
  role: null,            // 'professional' | 'manager'
  currentScreen: 'splash',
  currentTab: 'connecting',
  obStep: 0,
  editMode: false,
  cardIndex: 0,
  currentChatId: null,
  buzUpCount: 0,
  matchQueue: [],
};

// ── Mock Data ──────────────────────────────

// Avatars using pravatar (stable, consistent photos)
const PROFESSIONAL_CARDS = [
  {
    id: 'p1',
    name: 'Sophie', age: 29, city: 'Amsterdam',
    photo: 'https://i.pravatar.cc/400?img=47',
    jobType: 'Fulltime (payroll)', availability: 'Immediately', workSetting: 'Hybrid',
    intention: ['💼 Fulltime (payroll)', '🚀 More impact', '🌟 Promotion'],
    industry: ['📦 Logistics / Supply chain', '🌱 Social Impact / NGO', '🚀 Scale-up'],
    values: ['🎯 Ambition', '❤️ Empathy', '💡 Innovation'],
    workStyle: ['🔄 Hybrid', '👥 Collaborative', '⚡ Fast-paced'],
    interests: ['🏃 Running', '📚 Reading', '✈️ Travel', '🍷 Wine & dining'],
    milestones: [
      { company: 'Plant BV', role: 'Product Manager', desc: 'New product line launched, +25% revenue.', date: "Nov '21 – Jan '24" },
      { company: 'Logistics BV', role: 'Process Manager', desc: 'Zero findings on the cross-dept audit.', date: "2020" },
      { company: 'Marathon', role: 'Personal', desc: 'Finished marathon and raised €1k.', date: "Oct 2022" }
    ],
    pitch: 'I build bridges between teams and customers. Driven by purpose, results, and a good glass of wine.',
    role: 'professional',
  },
  {
    id: 'p2',
    name: 'Lisa', age: 32, city: 'Rotterdam',
    photo: 'https://i.pravatar.cc/400?img=5',
    jobType: 'Freelance / Self-employed', availability: '1 Month', workSetting: 'Remote',
    intention: ['🔧 Freelance / Self-employed', '👥 Lead a larger team'],
    industry: ['💰 Finance / FinTech', '💻 Tech / SaaS'],
    values: ['🏆 Excellence', '💡 Innovation'],
    workStyle: ['🏠 Remote', '👤 Solo', '📋 Structured'],
    interests: ['🧗 Climbing', '✈️ Travel', '📸 Photography'],
    milestones: [
      { company: 'Moneybird', role: 'Growth Lead', desc: 'Grew MRR by 3x in 18 months.', date: "2021-2023" },
      { company: 'FinTech Startup', role: 'Marketing', desc: 'Acquired 10k users in first month.', date: "2019-2021" },
      { company: 'Volunteering', role: 'Mentor', desc: 'Coached young women in tech careers.', date: "Ongoing" }
    ],
    pitch: 'Data is my language. I turn complex metrics into crystal-clear strategies.',
    role: 'professional',
  },
  {
    id: 'p3',
    name: 'Marc', age: 35, city: 'Den Haag',
    photo: 'https://i.pravatar.cc/400?img=12',
    jobType: 'Collaboration', availability: 'Immediately', workSetting: 'Hybrid',
    intention: ['🤝 Collaboration', '🌍 International'],
    industry: ['🏥 Health & Care', '💻 Tech / SaaS', '🚀 Scale-up'],
    values: ['💡 Innovation', '🕊️ Freedom', '🤝 Collaboration'],
    workStyle: ['🚗 On the road', '🌊 Flexible', '⚡ Fast-paced'],
    interests: ['🚴 Cycling', '🎨 Art & design', '🍳 Cooking'],
    milestones: [
      { company: 'Philips Health', role: 'Sr. Designer', desc: 'Redesigned portal → 60% drop in tickets.', date: "2018-2022" },
      { company: 'Startup', role: 'Founder', desc: 'Built and sold a small health app.', date: "2015-2018" },
      { company: 'Writing', role: 'Blog', desc: 'Published 50+ articles on design.', date: "Ongoing" }
    ],
    pitch: 'I design for real people, not personas. Always asking why before how.',
    role: 'professional',
  }
];

const MANAGER_CARDS = [
  {
    id: 'm1',
    name: 'Thomas', age: 41, city: 'Amsterdam',
    photo: 'https://i.pravatar.cc/400?img=68',
    companyType: 'Scale-up', teamSize: '15-50', hiringUrgency: 'Immediately', workSetting: 'Hybrid',
    intention: ['🤝 Looking for Fulltime (payroll)'],
    industry: ['🚀 Scale-up', '💻 Tech / SaaS', '💰 Finance / FinTech'],
    values: ['💡 Innovation', '❤️ Empathy', '🎯 Ambition'],
    workStyle: ['🔄 Hybrid', '⚡ Fast-paced', '🎯 Result-driven'],
    interests: ['🚴 Cycling', '💼 Entrepreneurship', '🍷 Wine & dining'],
    teamGoals: [
      { goal: 'Launch B2B product in Q2', desc: 'Enter enterprise market with our new platform.' },
      { goal: 'Scale team from 8 → 20', desc: 'Hiring across product, growth, and engineering.' },
      { goal: '€5M ARR by EOY', desc: 'Aggressive but achievable. We have the traction.' },
    ],
    pitch: 'We are building the future of B2B payments. Looking for people who move fast and care about craft.',
    role: 'manager',
  },
  {
    id: 'm2',
    name: 'Karen', age: 38, city: 'Amsterdam',
    photo: 'https://i.pravatar.cc/400?img=44',
    companyType: 'NGO', teamSize: '5-15', hiringUrgency: '1 Month', workSetting: 'Hybrid',
    intention: ['💼 Looking for Fulltime (payroll)'],
    industry: ['🌱 Social Impact / NGO', '♻️ Sustainability'],
    values: ['🌿 Sustainability', '❤️ Empathy', '🎯 Ambition'],
    workStyle: ['🏠 Remote', '👥 Collaborative', '📋 Structured'],
    interests: ['🌱 Volunteering', '📚 Reading', '🏊 Swimming'],
    teamGoals: [
      { goal: 'Double impact programs', desc: 'Running 3 programs in NL — scaling to 6.' },
      { goal: 'Build communications team', desc: 'Growing from 1 to 4 communications specialists.' },
      { goal: 'Community of 10K members', desc: 'Building an engaged movement, not just an audience.' },
    ],
    pitch: 'We do not just talk about impact - we measure it. Join a team that wakes up with purpose.',
    role: 'manager',
  }
];

// Combined chat data
const CHAT_DATA = [
  {
    id: 'c1', name: 'Thomas de Vries', role: 'CEO @ Payflow',
    photo: 'https://i.pravatar.cc/400?img=68',
    unread: 2, lastMsg: 'Looking forward to our call tomorrow!', time: '10:32',
    messages: [
      { from: 'them', text: 'Hey Sophie! Great to match with you on Buzbo 👋', time: '09:15' },
      { from: 'me', text: 'Hi Thomas! Really excited about what you\'re building at Payflow.', time: '09:22' },
      { from: 'them', text: 'Your background in packaging sounds unique but I can see the overlap in supply chain thinking. Would love to learn more!', time: '09:30' },
      { from: 'me', text: 'Absolutely — I\'ve been thinking the same. Would love to jump on a quick call?', time: '09:45' },
      { from: 'them', text: 'Looking forward to our call tomorrow! 🙌', time: '10:32' },
    ]
  },
  {
    id: 'c2', name: 'Karen Smit', role: 'Director @ ChangeNL',
    photo: 'https://i.pravatar.cc/400?img=44',
    unread: 0, lastMsg: 'See you at the event on Thursday?', time: 'Yesterday',
    messages: [
      { from: 'them', text: 'Sophie! I loved your pitch — "social impact through commerce" is exactly our ethos.', time: 'Mon 14:10' },
      { from: 'me', text: 'Karen, I\'ve been following ChangeNL for months! This feels meant to be 😄', time: 'Mon 14:25' },
      { from: 'them', text: 'We have a team drinks event this Thursday in Amsterdam, would you want to join and meet the team informally?', time: 'Mon 15:00' },
      { from: 'me', text: 'Yes absolutely! Would love that.', time: 'Mon 15:05' },
      { from: 'them', text: 'See you at the event on Thursday? 🎉', time: 'Mon 16:00' },
    ]
  },
  {
    id: 'c3', name: 'Pieter van Dijk', role: 'MD @ PackGroup',
    photo: 'https://i.pravatar.cc/400?img=70',
    unread: 0, lastMsg: 'Thanks for your application Sophie!', time: 'Tue',
    messages: [
      { from: 'them', text: 'Hi Sophie, your experience at Plant BV is exactly what we\'re looking for.', time: 'Tue 11:00' },
      { from: 'me', text: 'Hi Pieter! Yes — 3 years in sustainable packaging at scale. Happy to share more.', time: 'Tue 11:30' },
      { from: 'them', text: 'Thanks for your application Sophie! We\'ll be in touch.', time: 'Tue 12:00' },
    ]
  },
];

// ── NEW MATCHES (for the avatars row) ───────
const NEW_MATCHES = [
  { name: 'Thomas', photo: 'https://i.pravatar.cc/400?img=68', chatId: 'c1' },
  { name: 'Karen', photo: 'https://i.pravatar.cc/400?img=44', chatId: 'c2' },
  { name: 'Lisa', photo: 'https://i.pravatar.cc/400?img=5', chatId: null },
  { name: 'Marc', photo: 'https://i.pravatar.cc/400?img=12', chatId: null },
];

// Onboarding steps config
const OB_STEPS_PRO = [
  { title: 'Basic info', subtitle: 'Tell us a bit about yourself.', type: 'basic' },
  { title: 'Intention', subtitle: 'What kind of collaboration are you looking for?', type: 'intention' },
  { title: 'Industries', subtitle: 'Which industries excite you? Select up to 5.', type: 'industries' },
  { title: 'Values', subtitle: 'What drives you at work? Choose up to 4.', type: 'values' },
  { title: 'Work Style', subtitle: 'How do you work best? Choose up to 4.', type: 'work-style' },
  { title: 'Interests', subtitle: 'What do you love? Choose up to 5.', type: 'interests' },
  { title: 'Proud Work', subtitle: 'Share 3 key milestones — projects or achievements you are proud of.', type: 'milestones' },
  { title: 'Your Pitch', subtitle: 'One short paragraph — who are you and what do you stand for?', type: 'pitch' },
  { title: 'Your photo', subtitle: 'Show yourself. First impressions count.', type: 'photo' },
];

const OB_STEPS_MGR = [
  { title: 'Basic info', subtitle: 'Tell us about yourself.', type: 'basic' },
  { title: 'Your company', subtitle: 'What kind of company do you represent?', type: 'company-prefs' },
  { title: 'Industry', subtitle: 'What is your industry focus?', type: 'industries' },
  { title: 'Team Values', subtitle: 'What values define your team culture?', type: 'values' },
  { title: 'Work Style', subtitle: 'How does your team work best?', type: 'work-style' },
  { title: 'Team Interests', subtitle: 'What does your team love?', type: 'interests' },
  { title: 'Team Goals', subtitle: 'Share 3 current priorities for your team or company.', type: 'team-goals' },
  { title: 'Your Pitch', subtitle: 'What makes working with you special?', type: 'pitch' },
  { title: 'Your photo', subtitle: 'Managers with photos get 3x more connections.', type: 'photo' },
];

// ═══════════════════════════════════════════
// SCREEN ROUTER
// ═══════════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) {
    el.classList.add('active');
    state.currentScreen = id;
  }
}

// ═══════════════════════════════════════════
// SPLASH → ROLE SELECT
// ═══════════════════════════════════════════

let splashDone = false;
function goToRole() {
  if (splashDone) return;
  splashDone = true;
  showScreen('role');
}

// Auto-transition after 2.2s
setTimeout(goToRole, 2200);

// Also allow tap/click to skip splash
document.getElementById('screen-splash').addEventListener('click', goToRole);

// ═══════════════════════════════════════════
// ROLE SELECTION
// ═══════════════════════════════════════════

function selectRole(role) {
  state.role = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  const id = role === 'professional' ? 'role-pro' : 'role-mgr';
  document.getElementById(id).classList.add('selected');
  const btn = document.getElementById('role-next-btn');
  btn.style.opacity = '1';
  btn.style.pointerEvents = 'auto';
}

function goToOnboarding() {
  if (!state.role) return;
  state.obStep = 0;
  buildOnboardingStep();
  showScreen('onboarding');
}

// ═══════════════════════════════════════════
// ONBOARDING FLOW
// ═══════════════════════════════════════════

function getObSteps() {
  return state.role === 'professional' ? OB_STEPS_PRO : OB_STEPS_MGR;
}

function buildOnboardingStep() {
  const steps = getObSteps();
  const step = steps[state.obStep];
  const total = steps.length;

  // Update header
  document.getElementById('onboarding-title').textContent = step.title;
  document.getElementById('onboarding-subtitle').textContent = step.subtitle;

  // Progress dots
  const prog = document.getElementById('onboarding-progress');
  prog.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot' + (i < state.obStep ? ' done' : i === state.obStep ? ' active' : '');
    prog.appendChild(dot);
  }

  // Back button visibility
  document.getElementById('ob-back-btn').style.visibility = state.obStep === 0 ? 'hidden' : 'visible';

  // Render body
  const body = document.getElementById('onboarding-body');
  body.innerHTML = renderObStep(step.type);

  // Animate
  body.style.opacity = '0';
  body.style.transform = 'translateX(20px)';
  requestAnimationFrame(() => {
    body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    body.style.opacity = '1';
    body.style.transform = 'translateX(0)';
  });
}

function renderObStep(type) {
  switch (type) {
    case 'photo':
      return `
        <div style="text-align:center;padding:16px 0;">
          <div class="photo-upload" onclick="changePhoto()" id="ob-photo-upload">
            <span class="photo-icon">📷</span>
            <span>Add photo</span>
          </div>
          <p style="font-size:13px;color:var(--text-light);margin-top:8px;">Profiles with photos get 5× more BuzUps</p>
        </div>
      `;
    case 'basic':
      return `
        <div class="form-group">
          <label class="form-label">First name</label>
          <input class="form-input" type="text" placeholder="Your first name" id="ob-name">
        </div>
        <div class="form-group">
          <label class="form-label">Last initial</label>
          <input class="form-input" type="text" placeholder="e.g. K." id="ob-last" maxlength="3">
        </div>
        <div class="form-group">
          <label class="form-label">Age</label>
          <input class="form-input" type="number" placeholder="Your age" id="ob-age">
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <input class="form-input" type="text" placeholder="e.g. Amsterdam" id="ob-city">
        </div>
      `;
    case 'intention':
      return buildTagStep([
        { label: 'Type of collaboration', note: 'What are you looking for?', tags: ['💼 Fulltime (payroll)', '🔧 Freelance / Self-employed', '🤝 Collaboration', '🌐 Network', '🎓 Internship / Traineeship', '❓ Open to options'] },
        { label: 'Next step', note: 'What is your ambition?', tags: ['⬆️ Promotion', '👥 Lead a larger team', '🔄 Switch industry', '🚀 More impact', '🌍 International', '🔀 Career switch', '❓ Still exploring'] },
      ]);
    case 'work-prefs':
      return buildTagStep([
        { label: 'Job Type', note: 'Select all that apply', tags: ['💼 Fulltime (payroll)', '🔧 Freelance / Self-employed', '🤝 Collaboration', '🌐 Network', '🎓 Internship / Traineeship'] },
        { label: 'Availability', note: 'When can you start?', tags: ['⚡ Immediately', '📅 1 Month', '📅 2-3 Months', '📅 6+ Months'] },
        { label: 'Work Setting', note: '', tags: ['🏢 In-office', '🔄 Hybrid', '💻 Remote', '🚗 On the road'] },
      ]);
    case 'company-prefs':
      return buildTagStep([
        { label: 'Company Type', note: '', tags: ['🚀 Scale-up', '💡 Startup', '🏢 Corporate', '🏭 SME', '🌍 NGO'] },
        { label: 'Team Size', note: '', tags: ['👤 1-5', '👥 5-15', '🏃 15-50', '🏟️ 50+'] },
        { label: 'Hiring Urgency', note: '', tags: ['⚡ ASAP', '📅 1 Month', '📅 3 Months', '📅 6+ Months'] },
        { label: 'Work Setting Offered', note: '', tags: ['🏢 In-office', '🏠 Hybrid', '💻 Remote'] },
      ]);
    case 'industries':
      return buildTagStep([
        { label: 'Industry', note: 'Select up to 5', tags: ['🛒 Retail / FMCG', '💻 Tech / SaaS', '🏗️ Construction / Real estate', '💰 Finance / FinTech', '🏥 Health & Care', '🌱 Social Impact / NGO', '♻️ Sustainability', '🎨 Creative / Media', '📦 Logistics / Supply chain', '🛍️ E-commerce', '🏭 Manufacturing', '🚀 Scale-up', '🍔 Food & Beverage', '🎓 Education', '⚡ Energy'] },
      ]);
    case 'values':
      return buildTagStep([
        { label: 'Values', note: 'Choose up to 4 that resonate most', tags: ['🎯 Ambition', '🤝 Collaboration', '💡 Innovation', '🌿 Sustainability', '🔒 Integrity', '⚡ Energy', '📚 Learning', '🏆 Excellence', '❤️ Empathy', '🕊️ Freedom', '🌍 Diversity', '🎨 Creativity', '🔥 Courage', '🧩 Curiosity'] },
      ]);
    case 'work-style':
      return buildTagStep([
        { label: 'Work Style', note: 'How do you work best? Choose up to 4', tags: ['🏠 Remote', '🏢 In-office', '🔄 Hybrid', '🚗 On the road', '👤 Solo', '👥 Collaborative', '⚡ Fast-paced', '🔍 Thorough', '📋 Structured', '🌊 Flexible', '🎯 Result-driven'] },
      ]);
    case 'interests':
      return buildTagStep([
        { label: 'Sport & Movement', note: '', tags: ['🏃 Running', '⚽ Football', '🏸 Tennis', '🚴 Cycling', '🏊 Swimming', '🧘 Yoga', '🏋️ Fitness', '⛷️ Skiing', '🏄 Water sports', '🥊 Martial arts', '🧗 Climbing', '⛳ Golf'] },
        { label: 'Culture & Lifestyle', note: '', tags: ['🎨 Art & design', '📚 Reading', '🎵 Music', '🎬 Film & series', '✈️ Travel', '🍳 Cooking', '📸 Photography', '🎭 Theatre', '🎮 Gaming', '🍷 Wine & dining'] },
        { label: 'Growth & Social', note: '', tags: ['💼 Entrepreneurship', '📈 Investing', '🌱 Volunteering', '🗣️ Public speaking', '✍️ Writing', '🧠 Mindfulness', '🌿 Nature'] },
      ]);
    case 'passions':
      return buildTagStep([
        { label: 'Interests', note: 'What do you love?', tags: ['🏃 Running', '⚽ Football', '🚴 Cycling', '🧘 Yoga', '📚 Reading', '🎵 Music', '✈️ Travel', '🎨 Art & design', '🎬 Film & series', '🍳 Cooking', '📸 Photography', '🍷 Wine & dining'] },
      ]);
    case 'milestones':
      return `
        <p style="font-size:13px;color:var(--text-mid);margin-bottom:20px;line-height:1.5;">These can be professional projects, personal achievements, or anything you're proud of.</p>
        ${[1,2,3].map(n => `
          <div class="milestone-card">
            <div class="milestone-number">Milestone ${n}</div>
            <div class="form-group" style="margin-bottom:8px;">
              <input class="form-input" type="text" placeholder="Company / Organisation / Project" id="ob-m${n}-company">
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <input class="form-input" type="text" placeholder="Your role or what you did" id="ob-m${n}-role">
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <textarea class="form-textarea" placeholder="What did you achieve? Keep it short and punchy." style="min-height:70px;" id="ob-m${n}-desc"></textarea>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <input class="form-input" type="text" placeholder="Date period (e.g. Jan '22 – Mar '23)" id="ob-m${n}-date">
            </div>
          </div>
        `).join('')}
      `;
    case 'team-goals':
      return `
        <p style="font-size:13px;color:var(--text-mid);margin-bottom:20px;line-height:1.5;">Share 3 current priorities or goals for your team. This helps professionals understand where you're headed.</p>
        ${[1,2,3].map(n => `
          <div class="milestone-card">
            <div class="milestone-number">Goal ${n}</div>
            <div class="form-group" style="margin-bottom:8px;">
              <input class="form-input" type="text" placeholder="Goal title (short & punchy)" id="ob-g${n}-title">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <textarea class="form-textarea" placeholder="What does success look like?" style="min-height:70px;" id="ob-g${n}-desc"></textarea>
            </div>
          </div>
        `).join('')}
      `;
    case 'pitch':
      return `
        <div class="form-group">
          <label class="form-label">Your Pitch</label>
          <textarea class="form-textarea" placeholder="${state.role === 'professional' ? 'Who are you, what drives you, and what kind of role or team are you looking for? Write in first person — keep it human.' : 'What makes your team special? What are you building and why would someone want to be part of it?'}" style="min-height:150px;" id="ob-pitch"></textarea>
        </div>
        <div style="font-size:12px;color:var(--text-light);line-height:1.5;">💡 Tip: Be personal and specific. Passion is more interesting than jargon.</div>
      `;
    default:
      return '<p>Step content</p>';
  }
}

function buildTagStep(groups) {
  return groups.map(group => `
    <div class="tag-group">
      <span class="tag-group-label">${group.label}</span>
      ${group.note ? `<span class="tag-group-note">${group.note}</span>` : ''}
      <div class="tags-grid">
        ${group.tags.map(t => `<div class="tag-pill" onclick="toggleTag(this)">${t}</div>`).join('')}
      </div>
    </div>
  `).join('');
}

function obNext() {
  const steps = getObSteps();
  if (state.obStep < steps.length - 1) {
    state.obStep++;
    buildOnboardingStep();
  } else {
    // Done! Enter main app
    enterMainApp();
  }
}

function obPrev() {
  if (state.obStep > 0) {
    state.obStep--;
    buildOnboardingStep();
  }
}

function obSkip() {
  obNext();
}

function toggleTag(el) {
  el.classList.toggle('selected');
}

function enterMainApp() {
  initConnecting();
  initChat();
  showScreen('connecting');
  state.currentTab = 'connecting';
}

// ═══════════════════════════════════════════
// TAB NAVIGATION
// ═══════════════════════════════════════════

function showTab(tab) {
  state.currentTab = tab;

  // Update all tab items across all tab bars
  document.querySelectorAll('.tab-item').forEach(item => {
    item.classList.remove('active');
  });

  const tabMap = {
    connecting: ['tab-connecting', 'tab-connecting-p', 'tab-connecting-c', 'tab-connecting-pr'],
    profile: ['tab-profile', 'tab-profile-p', 'tab-profile-c', 'tab-profile-pr'],
    chat: ['tab-chat', 'tab-chat-p', 'tab-chat-c', 'tab-chat-pr'],
    premium: ['tab-premium', 'tab-premium-p', 'tab-premium-c', 'tab-premium-pr'],
  };

  (tabMap[tab] || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  });

  showScreen(tab);
}

// ═══════════════════════════════════════════
// CONNECTING / SWIPE SYSTEM
// ═══════════════════════════════════════════

let activeCards = [];
let isDragging = false;
let dragCard = null;
let startX = 0, startY = 0;
let currentDeltaX = 0, currentDeltaY = 0;

function initConnecting() {
  const cards = state.role === 'professional' ? MANAGER_CARDS : PROFESSIONAL_CARDS;
  activeCards = [...cards];
  state.cardIndex = 0;
  renderCardStack();
}

function renderCardStack() {
  const stack = document.getElementById('card-stack');
  stack.innerHTML = '';

  // Render top 3 cards (only top is interactive)
  const slice = activeCards.slice(state.cardIndex, state.cardIndex + 3).reverse();

  slice.forEach((card, i) => {
    const isTop = i === slice.length - 1;
    const el = createCardEl(card, isTop);
    stack.appendChild(el);
  });

  if (activeCards.slice(state.cardIndex).length === 0) {
    renderEmptyDeck();
  }
}

function createCardEl(card, isTop) {
  const div = document.createElement('div');
  div.className = 'profile-card';
  div.dataset.id = card.id;

  const isManager = card.role === 'manager';
  
  // Generating tag pills (no forced emojis, rely on the Excel data string)
  const intentionTags = Array.isArray(card.intention) ? card.intention.map(t => `<span class="intent-pill">${t}</span>`).join('') : '';
  const industryTags = card.industry.map(t => `<span class="intent-pill">${t}</span>`).join('');
  const valueTagsHtml = card.values.map(t => `<span class="block-tag">${t}</span>`).join('');
  const styleTagsHtml = (card.workStyle || []).map(t => `<span class="block-tag">${t}</span>`).join('');
  const interestTagsHtml = (card.interests || []).map(t => `<span style="padding:6px 14px;border-radius:100px;background:#FEF0E0;color:#C06020;font-size:12px;font-weight:500;">${t}</span>`).join('');

  const milestoneHtml = isManager && card.teamGoals ? 
    card.teamGoals.map(m => `
      <div class="proud-work-item">
        <div class="pw-role">${m.goal}</div>
        <div class="pw-desc">${m.desc}</div>
      </div>
    `).join('') : 
    (card.milestones || [card.milestone]).filter(Boolean).map(m => `
      <div class="proud-work-item">
        <div class="pw-company">${m.company}</div>
        <div class="pw-role">${m.role}</div>
        <div class="pw-desc">${m.desc}</div>
        <div class="pw-date">${m.date || ''}</div>
      </div>
    `).join('');

  div.innerHTML = `
    <div class="card-photo">
      <img src="${card.photo}" alt="${card.name}" onerror="this.src='https://i.pravatar.cc/400'">
      <div class="card-photo-gradient"></div>
      <div class="card-role-badge">${isManager ? '🏢 Manager' : '🙋 Professional'}</div>
    </div>
    <div class="buzup-indicator" id="buzup-ind-${card.id}">BUZUP ⬆️</div>
    <div class="buzdown-indicator" id="buzdown-ind-${card.id}">BUZDOWN ⬇️</div>
    
    <div class="card-content">
      <div class="card-name-row">
        <span class="card-name">${card.name}</span>
        <span class="card-age">· ${isManager ? card.teamSize + ' team' : card.age}</span>
      </div>
      <div class="card-meta" style="margin-bottom:16px;">
        <span class="card-meta-item">📍 ${card.city}</span>
        <span class="card-meta-item">· ${card.workSetting}</span>
        ${isManager ? '' : `<span class="card-meta-item">· ${card.jobType}</span>`}
      </div>

      <div class="profile-section">
        <div class="section-label">Intention & Industry</div>
        <div class="intent-pills">${intentionTags}${industryTags}</div>
      </div>

      <div class="divider"></div>

      <div class="section-label" style="margin-bottom:12px;">${isManager ? 'Team Goals' : 'Proud Work'}</div>
      <div class="proud-work-grid">
        ${milestoneHtml}
      </div>

      <div class="prompt-item" style="margin-top:16px; margin-bottom:24px;">
        <div class="prompt-q">${isManager ? 'Our team is unique because...' : 'My superpower at work is…'}</div>
        <div class="prompt-a">${card.pitch}</div>
      </div>

      <div class="profile-block values-block">
        <div class="profile-block-title">Values</div>
        <div class="profile-block-tags">${valueTagsHtml}</div>
      </div>

      <div class="profile-block work-block">
        <div class="profile-block-title">Work Style</div>
        <div class="profile-block-tags">${styleTagsHtml || '<span class="block-tag">🔄 Hybrid</span><span class="block-tag">⚡ Fast-paced</span>'}</div>
      </div>

      <div class="profile-section" style="margin-top:16px;">
        <div class="section-label">Interests</div>
        <div class="profile-block-tags" style="display:flex;flex-wrap:wrap;gap:8px;">
          ${interestTagsHtml || '<span style="padding:6px 14px;border-radius:100px;background:#FEF0E0;color:#C06020;font-size:12px;font-weight:500;">🏃 Running</span>'}
        </div>
      </div>

      <div class="prompt-item" style="margin-top:24px; margin-bottom:12px;">
        <div class="prompt-q">${isManager ? 'We are looking for someone who...' : 'I am looking for a team that…'}</div>
        <div class="prompt-a">Has a clear purpose and is not afraid to challenge the status quo.</div>
      </div>

      <div style="height:24px;"></div>

    </div>
  `;

  if (isTop) {
    addSwipeListeners(div.querySelector('.card-photo'));
  }

  return div;
}

function renderEmptyDeck() {
  const stack = document.getElementById('card-stack');
  stack.innerHTML = `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:var(--white);border-radius:var(--radius-xl);box-shadow:var(--shadow-md);z-index:10;">
      <div style="font-size:52px;">🎉</div>
      <div style="font-family:var(--font-head);font-size:20px;color:var(--text-dark);">You've seen everyone!</div>
      <div style="font-size:14px;color:var(--text-mid);text-align:center;padding:0 24px;line-height:1.6;">Check back later or boost your profile to see more connections.</div>
      <button class="btn btn-primary btn-sm" onclick="resetDeck()" style="width:auto;padding:12px 32px;">Start over</button>
    </div>
  `;
}

function resetDeck() {
  state.cardIndex = 0;
  renderCardStack();
}

// ── Swipe gesture handling ──

function addSwipeListeners(card) {
  // Touch
  card.addEventListener('touchstart', onDragStart, { passive: true });
  card.addEventListener('touchmove', onDragMove, { passive: false });
  card.addEventListener('touchend', onDragEnd);
  // Mouse
  card.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
}

function getCoords(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function onDragStart(e) {
  isDragging = true;
  const coords = getCoords(e);
  startX = coords.x;
  startY = coords.y;
  dragCard = e.currentTarget.closest ? e.currentTarget.closest('.profile-card') : document.querySelector('.profile-card');
  if (dragCard) dragCard.classList.add('dragging');
}

function onDragMove(e) {
  if (!isDragging || !dragCard) return;
  if (e.cancelable) e.preventDefault();

  const coords = getCoords(e);
  currentDeltaX = coords.x - startX;
  currentDeltaY = coords.y - startY;

  const rotate = currentDeltaX * 0.06;
  dragCard.style.transform = `translate(${currentDeltaX}px, ${currentDeltaY}px) rotate(${rotate}deg)`;

  // Show indicators
  const cardId = dragCard.dataset.id;
  const upInd = document.getElementById('buzup-ind-' + cardId);
  const downInd = document.getElementById('buzdown-ind-' + cardId);

  // Up = negative Y (dragging up), Down = positive Y
  if (currentDeltaY < -40) {
    if (upInd) upInd.style.opacity = Math.min(1, Math.abs(currentDeltaY) / 100);
    if (downInd) downInd.style.opacity = 0;
  } else if (currentDeltaY > 40) {
    if (downInd) downInd.style.opacity = Math.min(1, Math.abs(currentDeltaY) / 100);
    if (upInd) upInd.style.opacity = 0;
  } else {
    if (upInd) upInd.style.opacity = 0;
    if (downInd) downInd.style.opacity = 0;
  }
}

function onDragEnd(e) {
  if (!isDragging || !dragCard) return;
  isDragging = false;
  dragCard.classList.remove('dragging');

  const THRESHOLD = 80;

  if (currentDeltaY < -THRESHOLD) {
    // BuzUp (dragged up)
    executeSwipe('up', dragCard);
  } else if (currentDeltaY > THRESHOLD) {
    // BuzDown (dragged down)
    executeSwipe('down', dragCard);
  } else {
    // Snap back
    dragCard.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    dragCard.style.transform = 'translate(0, 0) rotate(0deg)';
    setTimeout(() => {
      if (dragCard) dragCard.style.transition = '';
    }, 350);

    // Reset indicators
    const cardId = dragCard.dataset.id;
    const upInd = document.getElementById('buzup-ind-' + cardId);
    const downInd = document.getElementById('buzdown-ind-' + cardId);
    if (upInd) upInd.style.opacity = 0;
    if (downInd) downInd.style.opacity = 0;
  }

  dragCard = null;
  currentDeltaX = 0;
  currentDeltaY = 0;

  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
}

function doSwipe(direction) {
  const topCard = document.querySelector('#card-stack .profile-card');
  if (!topCard) return;
  topCard.style.transition = 'transform 0.2s ease';
  if (direction === 'up') {
    topCard.style.transform = 'translateY(-30px)';
  } else {
    topCard.style.transform = 'translateY(30px)';
  }
  setTimeout(() => executeSwipe(direction, topCard), 150);
}

function addToFavorite() {
  const topCard = document.querySelector('#card-stack .profile-card');
  if (!topCard) return;
  topCard.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
  topCard.style.transform = 'translateY(-30px) scale(0.95)';
  topCard.style.opacity = '0';
  setTimeout(() => {
    state.cardIndex++;
    renderCardStack();
  }, 200);
}

function executeSwipe(direction, card) {
  const cardId = card.dataset.id;

  if (direction === 'up') {
    card.classList.add('fly-up');
    state.buzUpCount++;

    // 40% chance of match on BuzUp
    if (Math.random() < 0.4) {
      setTimeout(() => triggerMatch(cardId), 500);
    }
  } else {
    card.classList.add('fly-down');
  }

  setTimeout(() => {
    state.cardIndex++;
    renderCardStack();
  }, 450);
}

function triggerMatch(cardId) {
  const allCards = [...PROFESSIONAL_CARDS, ...MANAGER_CARDS];
  const matchedCard = allCards.find(c => c.id === cardId);
  if (!matchedCard) return;

  document.getElementById('match-name').textContent = matchedCard.name;
  document.getElementById('match-avatar-me').src = 'https://i.pravatar.cc/400?img=47';
  document.getElementById('match-avatar-them').src = matchedCard.photo;

  document.getElementById('match-overlay').classList.add('show');
  startConfetti();
}

function closeMatch() {
  document.getElementById('match-overlay').classList.remove('show');
  stopConfetti();
}

function openMatchChat() {
  closeMatch();
  showTab('chat');
}

// ─── Confetti ───
let confettiAnim;
let confettiCtx;

function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  confettiCtx = ctx;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    size: 6 + Math.random() * 8,
    color: ['#8B1A2F', '#F5E6D0', '#D4742A', '#FFFFFF', '#FFD700'][Math.floor(Math.random() * 5)],
    speed: 2 + Math.random() * 4,
    swing: (Math.random() - 0.5) * 3,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 6,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      p.x += p.swing * Math.sin(p.y / 30);
      p.rot += p.rotSpeed;
      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });
    confettiAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopConfetti() {
  if (confettiAnim) cancelAnimationFrame(confettiAnim);
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && confettiCtx) confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
}

// ═══════════════════════════════════════════
// PROFILE TAB
// ═══════════════════════════════════════════

function toggleEditMode() {
  state.editMode = !state.editMode;
  const viewEl = document.getElementById('profile-view-mode');
  const editEl = document.getElementById('profile-edit-mode');
  const btn = document.getElementById('edit-toggle-btn');

  if (state.editMode) {
    viewEl.classList.add('hidden');
    editEl.classList.remove('hidden');
    btn.textContent = '✅ Done';
  } else {
    viewEl.classList.remove('hidden');
    editEl.classList.add('hidden');
    btn.textContent = '✏️ Edit';
  }
}

function saveProfile() {
  toggleEditMode();
  // Toast
  showToast('Profile saved! ✅');
}

function changePhoto() {
  // Simulate photo change
  showToast('📷 Photo upload coming soon');
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:absolute; bottom:100px; left:50%; transform:translateX(-50%);
      background:rgba(0,0,0,0.85); color:#fff; padding:10px 20px;
      border-radius:100px; font-size:13px; font-weight:600;
      z-index:999; white-space:nowrap; opacity:0; transition:opacity 0.3s;
      pointer-events:none;
    `;
    document.getElementById('app').appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2200);
}

// ═══════════════════════════════════════════
// CHAT TAB
// ═══════════════════════════════════════════

function initChat() {
  // New matches row
  const matchRow = document.getElementById('new-matches-row');
  matchRow.innerHTML = NEW_MATCHES.map(m => `
    <div class="match-avatar-item" onclick="openConversation('${m.chatId || ''}', '${m.name}', '${m.photo}')">
      <div class="match-avatar-ring">
        <img src="${m.photo}" alt="${m.name}">
      </div>
      <span class="match-avatar-name">${m.name}</span>
    </div>
  `).join('');

  // Chat list
  const chatList = document.getElementById('chat-list');
  chatList.innerHTML = CHAT_DATA.map(chat => `
    <div class="chat-list-item" onclick="openConversation('${chat.id}', '${chat.name}', '${chat.photo}')">
      <img class="chat-list-avatar" src="${chat.photo}" alt="${chat.name}">
      <div class="chat-list-info">
        <div class="chat-list-name">${chat.name}</div>
        <div class="chat-list-preview">${chat.lastMsg}</div>
      </div>
      <div class="chat-list-meta">
        <span class="chat-list-time">${chat.time}</span>
        ${chat.unread > 0 ? `<span class="chat-unread">${chat.unread}</span>` : ''}
      </div>
    </div>
  `).join('');
}

function openConversation(chatId, name, photo) {
  if (!chatId) {
    showToast('Start the conversation with ' + name + ' from the deck!');
    return;
  }

  state.currentChatId = chatId;
  const chat = CHAT_DATA.find(c => c.id === chatId);
  if (!chat) return;

  document.getElementById('convo-name').textContent = chat.name;
  document.getElementById('convo-avatar').src = chat.photo;

  const msgEl = document.getElementById('convo-messages');
  msgEl.innerHTML = '';

  // Add date label
  const dateLabel = document.createElement('div');
  dateLabel.className = 'message-date-label';
  dateLabel.textContent = 'Today';
  msgEl.appendChild(dateLabel);

  chat.messages.forEach(msg => {
    const row = document.createElement('div');
    row.className = 'message-row ' + msg.from;

    if (msg.from === 'them') {
      row.innerHTML = `
        <img class="message-avatar-sm" src="${chat.photo}" alt="">
        <div>
          <div class="bubble received">${msg.text}</div>
          <div class="bubble-time">${msg.time}</div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div style="text-align:right;">
          <div class="bubble sent">${msg.text}</div>
          <div class="bubble-time" style="text-align:right;">${msg.time}</div>
        </div>
        <img class="message-avatar-sm" src="https://i.pravatar.cc/400?img=47" alt="">
      `;
    }
    msgEl.appendChild(row);
  });

  // Scroll to bottom
  setTimeout(() => { msgEl.scrollTop = msgEl.scrollHeight; }, 50);

  showScreen('conversation');
}

function closeConversation() {
  showScreen('chat');
}

function sendMessage() {
  const input = document.getElementById('convo-input');
  const text = input.value.trim();
  if (!text) return;

  const msgEl = document.getElementById('convo-messages');
  const row = document.createElement('div');
  row.className = 'message-row sent';
  row.innerHTML = `
    <div style="text-align:right;">
      <div class="bubble sent">${text}</div>
      <div class="bubble-time" style="text-align:right;">Just now</div>
    </div>
    <img class="message-avatar-sm" src="https://i.pravatar.cc/400?img=47" alt="">
  `;
  msgEl.appendChild(row);
  input.value = '';
  input.style.height = 'auto';
  msgEl.scrollTop = msgEl.scrollHeight;

  // Simulate reply after delay
  const chat = CHAT_DATA.find(c => c.id === state.currentChatId);
  if (chat) {
    const replies = [
      'Great! When works for you? ☕',
      'Absolutely, let\'s make it happen 🙌',
      'That sounds perfect. Looking forward to it!',
      'I\'ll send you a calendar invite.',
      'Amazing — will share more details soon!',
    ];
    setTimeout(() => {
      const replyRow = document.createElement('div');
      replyRow.className = 'message-row';
      replyRow.innerHTML = `
        <img class="message-avatar-sm" src="${chat.photo}" alt="">
        <div>
          <div class="bubble received">${replies[Math.floor(Math.random() * replies.length)]}</div>
          <div class="bubble-time">Just now</div>
        </div>
      `;
      msgEl.appendChild(replyRow);
      msgEl.scrollTop = msgEl.scrollHeight;
    }, 1200 + Math.random() * 800);
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ── Enter key to send ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && state.currentScreen === 'conversation') {
    e.preventDefault();
    sendMessage();
  }
});

// ═══════════════════════════════════════════
// PREMIUM
// ═══════════════════════════════════════════

function selectPlan(card) {
  document.querySelectorAll('.pricing-card').forEach(c => c.classList.remove('popular'));
  card.classList.add('popular');
  showToast('🚀 Buzbo Boost — coming soon!');
}

// ═══════════════════════════════════════════
// MISC
// ═══════════════════════════════════════════

function showFilters() { showToast('🔧 Filters coming in v2!'); }
function showNotifs() { showToast('🔔 1 new match notification'); }
function showCardDetail() {
  const cards = state.role === 'professional' ? MANAGER_CARDS : PROFESSIONAL_CARDS;
  const card = cards[state.cardIndex];
  if (card) showToast('📋 ' + card.name + ' · ' + card.city);
}
