const G = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const CAN = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
  'AB+': G,
  'AB-': ['A-', 'B-', 'AB-', 'O-']
};
const AREAS = [
  'Asadgate', 'Azimpur', 'Badda', 'Banani', 'Dhanmondi', 'Farmgate', 
  'Gulshan', 'Jatrabari', 'Jigatola', 'Kallyanpur', 'Khilgaon', 'Khilkhet', 
  'Malibagh', 'Mirpur 1', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Mirpur 12', 
  'Mirpur 13', 'Mirpur 14', 'Mohammadpur', 'Motijheel', 'Old Dhaka', 'Rampura', 
  'Savar', 'Shyamoli', 'Tejgaon', 'Uttara'
];
const HOSP = [
  'Ad-din Women’s Medical College Hospital', 'Ahsania Mission Cancer Hospital', 
  'Anwer Khan Modern Medical College Hospital', 'Bangabandhu Sheikh Mujib Medical University (BSMMU)', 
  'Bangladesh Eye Hospital', 'Bangladesh Medical College Hospital', 'Bangladesh Shishu Hospital & Institute', 
  'Bangladesh Specialized Hospital', 'BIRDEM General Hospital', 'Central Hospital', 
  'Combined Military Hospital (CMH) Dhaka', 'Dhaka Community Hospital', 'Dhaka Medical College Hospital', 
  'Evercare Hospital Dhaka (Apollo)', 'Holy Family Red Crescent Medical College Hospital', 
  'Ibn Sina Hospital', 'Ibrahim Cardiac Hospital & Research Institute', 'Islami Bank Hospital', 
  'Kidney Foundation Hospital', 'Kurmitola General Hospital', 'Labaid Specialized Hospital', 
  'Mugda Medical College Hospital', 'National Institute of Cancer Research & Hospital', 
  'National Institute of Cardiovascular Diseases (NICVD)', 'National Institute of Kidney Diseases & Urology', 
  'National Institute of Neurosciences & Hospital', 'National Institute of Ophthalmology & Hospital', 
  'NITOR (Orthopaedic Hospital)', 'Popular Medical College Hospital', 'Samorita Hospital', 
  'Shaheed Suhrawardy Medical College Hospital', 'Sheikh Russel National Gastroliver Institute', 
  'Sir Salimullah Medical College (Mitford) Hospital', 'Square Hospitals', 'United Hospital', 
  'Uttara Adhunik Medical College Hospital'
].sort((a, b) => a.localeCompare(b));

const fd = iso => iso ? String(iso).split('-').reverse().join('/') : '';
const td = s => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s).trim());
  if (!m) return null;
  const iso = m[3] + '-' + m[2] + '-' + m[1], d = new Date(iso);
  return !isNaN(d) && d.toISOString().slice(0, 10) === iso ? iso : null;
};
const dfield = (name, req, val, min, max) => `<div class="dtf"><input type="text" class="dti" name="${name}" inputmode="numeric" placeholder="dd/mm/yyyy" maxlength="10" autocomplete="off" ${req ? 'required' : ''} value="${fd(val)}" data-min="${min || ''}" data-max="${max || ''}"><button type="button" class="s g dtb" data-act="cal" aria-label="Pick a date">📅</button><input type="date" class="dtp" tabindex="-1" aria-hidden="true" min="${min || ''}" max="${max || ''}"></div>`;
const inD = d => !d.loc || AREAS.includes(d.loc);
const PIN = '1234', GAP = 90, $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const dig = p => String(p).replace(/\D/g, ''), today = () => new Date().toISOString().slice(0, 10);
const days = d => Math.floor((Date.now() - new Date(d)) / 864e5);
const addD = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};
const opts = (a, v) => a.map(x => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('');

let mem = null, me = null, admin = false, tab = 'donors';

const SEED_D = [
  ['Sadhan Sarkar', 'O+', '01795925081', '', 0, 0, 1], ['Nahid Hasan', 'B+', '01402148744', '', 0, 0, 1],
  ['Dhirendra Chakma', 'B+', '01613778948', '', 0, 0, 1], ['Md. Saharia Nafiz', 'O+', '01621720045', '', 0, 0, 1],
  ['Salman Rahman', 'O-', '01000000001', 'Banani', 0, 1, 1], ['Rima Jahan', 'B+', '01000000002', 'Jigatola', 0, 0, 1],
  ['Habib Biswas', 'AB-', '01000000003', 'Mirpur 1', 45, 1, 1], ['Anika Yasmin', 'AB-', '01000000004', 'Mirpur 13', 0, 1, 1],
  ['Tuhin Howlader', 'AB-', '01000000005', 'Rampura', 0, 0, 1], ['Kona Akter', 'O+', '01000000006', 'Asadgate', 130, 1, 1],
  ['Ripon Howlader', 'B-', '01000000007', 'Farmgate', 0, 1, 1], ['Mim Khatun', 'O+', '01000000008', 'Khilgaon', 20, 0, 0],
  ['Kamal Sikder', 'O+', '01000000009', 'Mirpur 10', 0, 1, 1], ['Tithi Khatun', 'B-', '01000000010', 'Mohammadpur', 0, 1, 1],
  ['Rahim Barua', 'A+', '01000000011', 'Shyamoli', 75, 0, 1], ['Ayesha Rani', 'AB-', '01000000012', 'Badda', 0, 1, 1],
  ['Masud Hossain', 'AB+', '01000000013', 'Jatrabari', 0, 1, 1], ['Jannat Nahar', 'O+', '01000000014', 'Malibagh', 0, 0, 1],
  ['Mamun Mia', 'O+', '01000000015', 'Mirpur 12', 45, 1, 1], ['Shapla Khatun', 'AB-', '01000000016', 'Old Dhaka', 0, 1, 1],
  ['Sohel Uddin', 'A-', '01000000017', 'Uttara', 0, 0, 1], ['Nusrat Roy', 'A+', '01000000018', 'Dhanmondi', 130, 1, 0],
  ['Rafi Barua', 'A+', '01000000019', 'Kallyanpur', 0, 1, 1], ['Nilufa Nahar', 'O-', '01000000020', 'Mirpur 2', 20, 0, 1],
  ['Alamin Rahman', 'AB+', '01000000021', 'Mirpur 14', 0, 1, 1], ['Puja Rani', 'O+', '01000000022', 'Savar', 0, 1, 1],
  ['Sajib Mondal', 'O-', '01000000023', 'Azimpur', 75, 0, 1], ['Tasnim Akter', 'AB+', '01000000024', 'Gulshan', 0, 1, 1],
  ['Zahid Das', 'AB+', '01000000025', 'Khilkhet', 0, 1, 1], ['Nadia Rani', 'O-', '01000000026', 'Mirpur 11', 0, 0, 1],
  ['Karim Islam', 'A-', '01000000027', 'Motijheel', 45, 1, 1], ['Rokeya Jahan', 'O-', '01000000028', 'Tejgaon', 0, 1, 0],
  ['Fahim Sikder', 'AB-', '01000000029', 'Banani', 0, 0, 1], ['Laila Nahar', 'A+', '01000000030', 'Jigatola', 130, 1, 1],
  ['Sourav Rahman', 'B-', '01000000031', 'Mirpur 1', 0, 1, 1], ['Mitu Jahan', 'B-', '01000000032', 'Mirpur 13', 20, 0, 1],
  ['Shuvo Biswas', 'A-', '01000000033', 'Rampura', 0, 1, 1], ['Afsana Yasmin', 'O-', '01000000034', 'Asadgate', 0, 1, 1],
  ['Arif Talukder', 'O+', '01000000035', 'Farmgate', 75, 0, 1], ['Tania Nahar', 'B+', '01000000036', 'Khilgaon', 0, 1, 1],
  ['Tanvir Islam', 'A-', '01000000037', 'Mirpur 10', 0, 1, 1], ['Mou Chowdhury', 'B-', '01000000038', 'Mohammadpur', 0, 0, 0],
  ['Nayeem Ahmed', 'A+', '01000000039', 'Shyamoli', 45, 1, 1], ['Priya Jahan', 'B+', '01000000040', 'Badda', 0, 1, 1],
  ['Shakil Uddin', 'B+', '01000000041', 'Jatrabari', 0, 0, 1], ['Farhana Yasmin', 'O-', '01000000042', 'Malibagh', 130, 1, 1],
  ['Anik Islam', 'AB+', '01000000043', 'Mirpur 12', 0, 1, 1], ['Runa Akter', 'A+', '01000000044', 'Old Dhaka', 20, 0, 1],
  ['Mehedi Hossain', 'B-', '01000000045', 'Uttara', 0, 1, 1], ['Sadia Rani', 'O+', '01000000046', 'Dhanmondi', 0, 1, 1],
  ['Rubel Uddin', 'B-', '01000000047', 'Kallyanpur', 75, 0, 1], ['Mahfuza Jahan', 'A+', '01000000048', 'Mirpur 2', 0, 1, 0],
  ['Foysal Islam', 'A-', '01000000049', 'Mirpur 14', 0, 1, 1], ['Shirin Akter', 'B+', '01000000050', 'Savar', 0, 0, 1],
  ['Jewel Roy', 'A+', '01000000051', 'Azimpur', 45, 1, 1], ['Sabina Parvin', 'AB+', '01000000052', 'Gulshan', 0, 1, 1],
  ['Jamal Biswas', 'A-', '01000000053', 'Khilkhet', 0, 0, 1], ['Dola Roy', 'A+', '01000000054', 'Mirpur 11', 130, 1, 1],
  ['Imran Ahmed', 'B+', '01000000055', 'Motijheel', 0, 1, 1], ['Sharmin Khatun', 'A+', '01000000056', 'Tejgaon', 20, 0, 1],
  ['Sabbir Howlader', 'AB+', '01000000057', 'Banani', 0, 1, 1], ['Rumana Roy', 'B+', '01000000058', 'Jigatola', 0, 1, 0],
  ['Rakib Ahmed', 'AB-', '01000000059', 'Mirpur 1', 75, 0, 1], ['Sumaiya Chowdhury', 'B+', '01000000060', 'Mirpur 13', 0, 1, 1],
  ['Faisal Uddin', 'O-', '01000000061', 'Rampura', 0, 1, 1], ['Lipi Sultana', 'AB+', '01000000062', 'Asadgate', 0, 0, 1],
  ['Nasir Das', 'A-', '01000000063', 'Farmgate', 45, 1, 1]
];

const mk = r => ({
  id: uid(), name: r[0], group: r[1], phone: r[2], loc: r[3], avail: r[6],
  last: r[4] ? addD(today(), -r[4]) : '', verified: r[5],
  hist: r[4] ? [{ date: addD(today(), -r[4]), place: 'Previous donation' }] : [],
  created: today()
});

let newDonor = null;

const SEED_R = [
  ['Abdul Karim', 'O+', 2, 'Dhaka Medical College Hospital', 'Old Dhaka', 0, '01000010001', 'Urgent', 1],
  ['Shahana Begum', 'A+', 1, 'Square Hospitals', 'Farmgate', 1, '01000010002', 'Urgent', 1],
  ['Mizanur Rahman', 'B+', 3, 'United Hospital', 'Gulshan', 2, '01000010003', 'Within 3 days', 0],
  ['Rokeya Khatun', 'AB+', 1, 'Evercare Hospital Dhaka (Apollo)', 'Badda', 3, '01000010004', 'Within 3 days', 1],
  ['Jahangir Alam', 'O-', 2, 'Labaid Specialized Hospital', 'Dhanmondi', 4, '01000010005', 'Within 7 days', 1],
  ['Salma Akter', 'A-', 1, 'Bangabandhu Sheikh Mujib Medical University (BSMMU)', 'Farmgate', 5, '01000010006', 'Within 7 days', 0],
  ['Nurul Islam', 'B-', 2, 'Kurmitola General Hospital', 'Uttara', 6, '01000010007', 'Within 7 days', 1],
  ['Rehana Parvin', 'AB-', 1, 'Mugda Medical College Hospital', 'Khilgaon', 7, '01000010008', 'Planned', 0]
];

const mkR = r => ({
  id: uid(), patient: r[0], group: r[1], units: r[2], hospital: r[3],
  loc: r[4], date: addD(today(), r[5]), phone: r[6], urgency: r[7],
  status: 'Open', verified: r[8], created: today()
});

const SEED_H = [
  ['Hasina Begum', 'O+', 2, 'Dhaka Medical College Hospital', 'Old Dhaka', 12, 'Fulfilled', 'Urgent'],
  ['Anwar Hossain', 'O+', 3, 'Square Hospitals', 'Farmgate', 20, 'Fulfilled', 'Urgent'],
  ['Selina Akter', 'O+', 1, 'Labaid Specialized Hospital', 'Dhanmondi', 31, 'Closed', 'Within 3 days'],
  ['Kabir Ahmed', 'A+', 2, 'United Hospital', 'Gulshan', 9, 'Fulfilled', 'Urgent'],
  ['Parveen Sultana', 'A+', 1, 'Holy Family Red Crescent Medical College Hospital', 'Malibagh', 26, 'Fulfilled', 'Within 7 days'],
  ['Delwar Hossain', 'B+', 2, 'Evercare Hospital Dhaka (Apollo)', 'Badda', 15, 'Fulfilled', 'Within 3 days'],
  ['Monira Khatun', 'B+', 1, 'Mugda Medical College Hospital', 'Khilgaon', 40, 'Closed', 'Planned'],
  ['Faruk Mia', 'O-', 2, 'Kurmitola General Hospital', 'Uttara', 6, 'Fulfilled', 'Urgent'],
  ['Nasima Yasmin', 'O-', 1, 'Sir Salimullah Medical College (Mitford) Hospital', 'Old Dhaka', 22, 'Fulfilled', 'Urgent'],
  ['Shafiqul Alam', 'AB+', 1, 'National Institute of Cardiovascular Diseases (NICVD)', 'Shyamoli', 18, 'Fulfilled', 'Within 3 days'],
  ['Rubina Akter', 'A-', 2, 'Ibn Sina Hospital', 'Dhanmondi', 28, 'Fulfilled', 'Within 7 days'],
  ['Mahbub Alam', 'B-', 1, 'Bangladesh Specialized Hospital', 'Uttara', 35, 'Fulfilled', 'Planned']
];

const mkH = (r, i) => ({
  id: uid(), patient: r[0], group: r[1], units: r[2], hospital: r[3],
  loc: r[4], date: addD(today(), -r[5]), phone: '0100002' + (1001 + i),
  urgency: r[7], status: r[6], verified: 1, created: addD(today(), -r[5] - 2)
});

function seed() {
  return {
    seedV: 2, seedR: 1, seedH: 1,
    donors: SEED_D.map(mk),
    reqs: SEED_R.map(mkR).concat(SEED_H.map(mkH))
  };
}

function load() {
  try {
    const s = localStorage.getItem('bloodlinkDhaka1');
    if (s) return JSON.parse(s);
  } catch (e) {}
  return mem || seed();
}

let db = load();

if (db.seedV !== 2) {
  db.donors = db.donors.filter(d => !/^0171100000/.test(String(d.phone)));
  SEED_D.map(mk).forEach(s => {
    if (!db.donors.some(d => dig(d.phone) === dig(s.phone))) db.donors.push(s);
  });
  db.seedV = 2;
  mem = db;
  try { localStorage.setItem('bloodlinkDhaka1', JSON.stringify(db)); } catch (e) {}
}

db.donors.forEach(d => { if (d.loc === 'Mirpur') d.loc = 'Mirpur 10'; });
db.reqs.forEach(r => { if (r.loc === 'Mirpur') r.loc = 'Mirpur 10'; });

if (db.seedR !== 1) {
  db.reqs = db.reqs.filter(r => r.phone !== '01811000001' && !/^010000100/.test(String(r.phone)));
  SEED_R.map(mkR).forEach(s => {
    if (!db.reqs.some(r => dig(r.phone) === dig(s.phone))) db.reqs.push(s);
  });
  db.seedR = 1;
  mem = db;
  try { localStorage.setItem('bloodlinkDhaka1', JSON.stringify(db)); } catch (e) {}
}

if (db.seedH !== 1) {
  SEED_H.map(mkH).forEach(s => {
    if (!db.reqs.some(r => dig(r.phone) === dig(s.phone))) db.reqs.push(s);
  });
  db.seedH = 1;
  mem = db;
  try { localStorage.setItem('bloodlinkDhaka1', JSON.stringify(db)); } catch (e) {}
}

function save() {
  mem = db;
  try { localStorage.setItem('bloodlinkDhaka1', JSON.stringify(db)); } catch (e) {}
}

function toast(m, ms, c) {
  const t = $('#toast');
  t.textContent = m;
  t.className = c || '';
  t.style.display = 'block';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.display = 'none', ms || 2600);
}

const elig = d => !d.last || days(d.last) >= GAP;
const status = d => !d.avail ? ['Unavailable', 'mu'] : !elig(d) ? ['Eligible from ' + fd(addD(d.last, GAP)), 'wn'] : ['Available', 'ok'];
const badge = d => `<span class="b">${esc(d.group)}</span>`;
const ver = v => v ? '<span class="t ok">Verified by admin</span>' : '<span class="t mu">Unverified</span>';
const val = { phone: p => /^\+?\d{8,15}$/.test(String(p).replace(/[\s-]/g, '')) };
const R = ['home', 'summary', 'donors', 'record', 'search', 'register', 'request', 'reqrec', 'profile', 'admin'];

const AMB = `<span class="amb"><svg viewBox="-30 0 150 64" aria-hidden="true"><g class="spg"><line class="sp" x1="-28" y1="18" x2="-8" y2="18"/><line class="sp" x1="-24" y1="30" x2="-2" y2="30" style="animation-delay:.15s"/><line class="sp" x1="-26" y1="42" x2="-6" y2="42" style="animation-delay:.3s"/></g><g class="bd"><rect x="6" y="8" width="66" height="36" rx="4" fill="#fff" stroke="#e3e6ea"/><path d="M72 12h20q4 0 7 3l13 15q3 3 3 8v6H72z" fill="#fff" stroke="#e3e6ea"/><rect x="6" y="30" width="109" height="5" fill="#d62828"/><rect x="6" y="38" width="66" height="6" fill="#d62828"/><circle cx="26" cy="19" r="9" fill="#d62828"/><path d="M26 14v10M21 19h10" stroke="#fff" stroke-width="4"/><rect x="42" y="12" width="12" height="15" rx="2" fill="#a8d4f5"/><path d="M77 14h15l9 12H77z" fill="#a8d4f5"/><rect class="s1" x="72" y="5" width="10" height="5" rx="1" fill="#ff2d2d"/><rect class="s2" x="84" y="5" width="10" height="5" rx="1" fill="#ffb300"/><rect x="111" y="34" width="5" height="7" rx="1" fill="#ffc928"/><rect x="3" y="35" width="3" height="6" rx="1" fill="#ff9f1c"/><rect x="4" y="44" width="114" height="6" rx="2" fill="#2b2d3a"/></g><g transform="translate(26 51)"><g class="wh"><circle r="9" fill="#2b2d3a"/><circle r="4.5" fill="#e6e9ee"/><path d="M-4.5 0h9M0-4.5v9" stroke="#9aa3ad" stroke-width="1.5"/></g></g><g transform="translate(90 51)"><g class="wh"><circle r="9" fill="#2b2d3a"/><circle r="4.5" fill="#e6e9ee"/><path d="M-4.5 0h9M0-4.5v9" stroke="#9aa3ad" stroke-width="1.5"/></g></g></svg></span>`;

function route() {
  showReq = false;
  let h = location.hash.slice(1);
  if (!R.includes(h)) h = 'home';
  if (me && h !== 'profile') { lockWarn(); location.replace('#profile'); return; }
  if (h !== 'admin') { admin = false; tab = 'donors'; }
  if (h !== 'donors') newDonor = null;
  document.body.classList.toggle('home', h === 'home');
  ph(h);
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.hash === '#' + h));
  document.querySelectorAll('.amb').forEach(x => x.remove());
  {
    const on = document.querySelector('nav a.on');
    if (on) on.insertAdjacentHTML('beforeend', AMB);
  }
  V[h]();
  window.scrollTo(0, 0);
}

const V = {};
const PT = {
  search: ['Find a Blood Donor in Dhaka', 'Search available donors by blood group and area.'],
  register: ['Become a Blood Donor', 'Register in a minute and help save a life in Dhaka.'],
  request: ['Emergency Blood Request', 'Post a request so donors in Dhaka can reach you quickly.'],
  profile: ['My Donor Profile', 'Update your details, availability and donation history.'],
  admin: ['Admin Dashboard', 'Manage donors and requests, verify information and view reports.']
};

function ph(h) { $('#ph').innerHTML = ''; }

let pre = null;

V.home = () => {
  const c = g => db.donors.filter(d => d.group === g && d.avail && elig(d) && inD(d)).length;
  $('#app').innerHTML = `<section class="hero"><h1>Efficiently Connect with Blood Donors: Saving Lives Made Simpler and Faster</h1><div class="sbar"><select id="hg" required><option value="">Select Blood Group</option>${opts(G)}</select><select disabled><option>Inside Dhaka</option></select><select id="hl"><option value="">None</option>${opts(AREAS)}</select><button data-act="hs">🔍 SEARCH</button></div></section>
  <div class="wrap"><div class="two"><a class="c1" href="#register"><h3>Register Now</h3><p>Become a donor and help save a life in Dhaka.</p></a><a class="c2" href="#profile"><h3>Already Donated?</h3><p>Update your availability and donation history.</p></a></div>
  <h2 class="ct">Available Blood Donors</h2><div class="grid">${G.map(g => `<a class="bg" href="#search" data-g="${g}"><b>🩸 ${g}</b><span>(${c(g)})</span></a>`).join('')}</div>${cellsHtml()}</div>`;
};

V.donors = () => {
  $('#app').innerHTML = `<div class="card"><h2>All Donors (${db.donors.length})</h2><div class="row"><div><label>Blood group</label><select id="dg"><option value="">All</option>${opts(G)}</select></div><div><label>Area</label><select id="da"><option value="">None</option>${opts(AREAS)}</select></div></div></div><div class="card tw" id="dl"></div>`;
  ['dg', 'da'].forEach(i => $('#' + i).addEventListener('input', donorList));
  donorList();
  if (newDonor) setTimeout(() => { const nr = $('#dl .newd'); if (nr) nr.scrollIntoView({ block: 'center' }); }, 120);
};

function donorList() {
  const g = $('#dg').value, a = $('#da').value, r = db.donors.filter(d => (!g || d.group === g) && (!a || d.loc === a)).sort((x, y) => x.name.localeCompare(y.name));
  $('#dl').innerHTML = `<table><tr><th>#</th><th>Name</th><th>Group</th><th>Area</th><th>Status</th><th>Donations</th><th>Last donated</th><th>Contact</th></tr>${r.map((d, i) => { const [s, c] = status(d); return `<tr${d.id === newDonor ? ' class="newd"' : ''}><td>${i + 1}</td><td>${esc(d.name)} ${d.verified ? '<span class="t ok">Verified</span>' : ''}</td><td>${badge(d)}</td><td>${esc(d.loc || '—')}</td><td class="${c}">${esc(s)}</td><td>${d.hist.length}</td><td>${esc(d.last ? fd(d.last) : '—')}</td><td class="ctc"><button class="s g" data-act="dshow" data-id="${d.id}">Show</button></td></tr>`; }).join('') || '<tr><td colspan="8">No donors yet.</td></tr>'}</table>`;
}

const CELLS = [
  ['Red Blood Cells (RBC)', 95.1, 'Carry oxygen from the lungs to every part of the body', '#c4161c'],
  ['Platelets', 4.8, 'Help blood to clot and stop bleeding', '#7048e8'],
  ['White Blood Cells (WBC)', 0.1, 'Fight infections and protect the body', '#0c8599']
];

const cellsHtml = () => `<h2 class="ct">What Is in Your Blood? (Blood Cells)</h2><div class="card">${CELLS.map(c => `<div class="cb"><div class="cbh"><b>${c[0]}</b><b>${c[1]}%</b></div><div class="cbt"><div class="cbf" style="width:${Math.max(c[1], 0.6)}%;background:${c[3]}"></div></div><small class="mu">${c[2]}</small></div>`).join('')}<p class="mu" style="font-size:12px;margin-bottom:0">Approximate share of the three cell types by number in a healthy adult (about 5 million red cells, 250 thousand platelets and 7 thousand white cells per µL of blood). Values differ from person to person. Plasma, the liquid part of blood, is not counted here.</p></div>`;

V.summary = () => {
  const L = [
    'Blood cannot be made in a laboratory, so hospitals depend completely on voluntary donors.',
    'Every day patients need blood after accidents, surgeries, childbirth complications, burns, cancer treatment, dengue and thalassemia.',
    'One donation can help up to three people, because it is separated into red cells, platelets and plasma.',
    'A healthy adult’s body replaces the donated fluid within a day or two and the red cells within a few weeks.',
    'Before donating you get a quick free check of your pulse, blood pressure, temperature and haemoglobin.',
    'Licensed blood banks screen donated blood for infections such as HIV, hepatitis B and C, syphilis and malaria.',
    'Donating is a simple way to help your own city and gives a real sense of purpose.',
    'A ready list of donors in Dhaka saves families precious time when they search in an emergency.',
    'Donate only if you are healthy, 18 or older, weigh at least 50 kg, and wait at least 3 months between donations.',
    'Always donate through a licensed hospital or blood bank, and tell the staff about any illness or medicine.'
  ];
  $('#app').innerHTML = `<div class="card"><h2>Why Donate Blood? Benefits of Donating</h2><ol class="sl">${L.map(x => `<li>${x}</li>`).join('')}</ol></div><div class="card tw"><h2>Who Can Give Blood to Whom?</h2><table class="cmp"><tr><th>Donor group</th><th>Can donate to</th><th>Cannot donate to</th></tr>${G.map(d => `<tr><td>${badge({ group: d })}</td><td>${G.filter(r => CAN[r].includes(d)).map(x => `<span class="chip y">${x}</span>`).join('')}</td><td>${G.filter(r => !CAN[r].includes(d)).map(x => `<span class="chip n">${x}</span>`).join('') || '<span class="mu">None</span>'}</td></tr>`).join('')}</table><p class="mu" style="font-size:12px">This table is for red blood cells. Plasma and platelet matching follows different rules, and hospitals always cross-match blood before a transfusion.</p></div>`;
};

V.record = () => {
  const cnt = G.map(g => ({
    g,
    t: db.donors.filter(d => d.group === g).length,
    a: db.donors.filter(d => d.group === g && d.avail && elig(d)).length,
    v: db.donors.filter(d => d.group === g && d.verified).length
  })), mx = Math.max(1, ...cnt.map(c => c.t)), T = db.donors.length, sum = k => cnt.reduce((s, c) => s + c[k], 0);
  $('#app').innerHTML = `<div class="st rst"><div><b>${T}</b>Total donors</div><div><b>${sum('a')}</b>Available now</div><div><b>${sum('v')}</b>Verified</div></div>
  <div class="card"><h3 style="margin-top:0">Donors by Blood Group</h3><div class="rc">${cnt.map(c => `<div class="rcol"><div class="rbars"><div class="rb t" style="height:${Math.max(c.t / mx * 100, 1)}%"><span>${c.t}</span></div><div class="rb a" style="height:${Math.max(c.a / mx * 100, 1)}%"><span>${c.a}</span></div></div><b>${c.g}</b></div>`).join('')}</div><div class="rleg"><span><i class="t"></i>Registered</span><span><i class="a"></i>Available now</span></div></div>
  <div class="card tw"><h3 style="margin-top:0">Record Table</h3><table><tr><th>Blood group</th><th>Registered</th><th>Share</th><th>Available now</th><th>Verified</th></tr>${cnt.map(c => `<tr><td>${badge({ group: c.g })}</td><td>${c.t}</td><td>${T ? (c.t / T * 100).toFixed(1) : '0.0'}%</td><td>${c.a}</td><td>${c.v}</td></tr>`).join('')}<tr><td><b>Total</b></td><td><b>${T}</b></td><td><b>100%</b></td><td><b>${sum('a')}</b></td><td><b>${sum('v')}</b></td></tr></table></div>`;
};

V.reqrec = () => {
  const cnt = G.map(g => {
    const r = db.reqs.filter(x => x.group === g), f = r.filter(x => x.status === 'Fulfilled'), su = a => a.reduce((s, x) => s + (+x.units || 0), 0);
    return { g, n: r.length, u: su(r), fn: f.length, fu: su(f) };
  }), mx = Math.max(1, ...cnt.map(c => c.u)), sum = k => cnt.reduce((s, c) => s + c[k], 0), T = sum('u'), top = cnt.slice().sort((a, b) => b.u - a.u)[0], open = db.reqs.filter(r => r.status === 'Open').length;
  $('#app').innerHTML = `<div class="st rst"><div><b>${db.reqs.length}</b>Total requests</div><div><b>${open}</b>Open now</div><div><b>${T}</b>Units requested</div><div><b>${sum('fu')}</b>Units received</div><div><b>${top && top.u ? top.g : '—'}</b>Most requested</div></div>
  <div class="card"><h3 style="margin-top:0">Requested vs Received (blood units)</h3><div class="rc">${cnt.map(c => `<div class="rcol"><div class="rbars"><div class="rb q" style="height:${Math.max(c.u / mx * 100, 1)}%"><span>${c.u}</span></div><div class="rb f" style="height:${Math.max(c.fu / mx * 100, 1)}%"><span>${c.fu}</span></div></div><b>${c.g}</b></div>`).join('')}</div><div class="rleg"><span><i class="q"></i>Requested</span><span><i class="f"></i>Received</span></div><p class="mu" style="font-size:13px;text-align:center;margin-bottom:0">Received means units of requests marked Fulfilled by the admin.</p></div>
  <div class="card tw"><h3 style="margin-top:0">Record Table</h3><table><tr><th>Blood group</th><th>Requests</th><th>Units requested</th><th>Share</th><th>Fulfilled</th><th>Units received</th><th>Received %</th></tr>${cnt.map(c => `<tr><td>${badge({ group: c.g })}</td><td>${c.n}</td><td>${c.u}</td><td>${T ? (c.u / T * 100).toFixed(1) : '0.0'}%</td><td>${c.fn}</td><td>${c.fu}</td><td>${c.u ? Math.round(c.fu / c.u * 100) : 0}%</td></tr>`).join('')}<tr><td><b>Total</b></td><td><b>${sum('n')}</b></td><td><b>${T}</b></td><td><b>100%</b></td><td><b>${sum('fn')}</b></td><td><b>${sum('fu')}</b></td><td><b>${T ? Math.round(sum('fu') / T * 100) : 0}%</b></td></tr></table></div>`;
};

V.search = () => {
  $('#app').innerHTML = `<div class="card"><div class="row"><div><label>Blood group needed</label><select id="sg" required><option value="">- Select Blood Group -</option>${opts(G)}</select></div><div><label>Area in Dhaka</label><select id="sl"><option value="">None</option>${opts(AREAS)}</select></div></div>
  <label class="ck"><input type="checkbox" id="sc">Include compatible donor groups</label><label class="ck"><input type="checkbox" id="sa" checked>Show only available donors</label></div><div class="card" id="res"></div>`;
  ['sg', 'sl', 'sc', 'sa'].forEach(i => $('#' + i).addEventListener('input', doSearch));
  if (pre) { $('#sg').value = pre.g || ''; $('#sl').value = pre.l || ''; pre = null; }
  doSearch();
};

function dcard(d, i) {
  const [s, c] = status(d);
  return `<div class="it"><div><b class="sn">${i + 1}.</b> ${badge(d)}<b>${esc(d.name)}</b>${ver(d.verified)}<br><span class="mu">📍 ${esc(d.loc || 'No area')} · <span class="${c}">${esc(s)}</span>${d.last ? ' · Last donated ' + fd(d.last) : ''}</span></div><button class="s g" data-act="reveal" data-id="${d.id}">Show contact</button></div>`;
}

function doSearch() {
  const g = $('#sg').value;
  if (!g) { $('#res').innerHTML = '<p class="mu">Please select a blood group above to see the matching donors.</p>'; return; }
  const l = $('#sl').value.toLowerCase().trim(), gs = g ? ($('#sc').checked ? CAN[g] : [g]) : G, av = $('#sa').checked;
  const r = db.donors.filter(d => gs.includes(d.group) && inD(d) && (!l || d.loc.toLowerCase() === l) && (!av || (d.avail && elig(d))));
  $('#res').innerHTML = `<h3 style="margin-top:0">${r.length} donor${r.length == 1 ? '' : 's'} found</h3>` + (r.map(dcard).join('') || '<p class="mu">No donors match in Dhaka. Try another area, include compatible groups, or post a blood request.</p>');
}

V.register = () => {
  $('#app').innerHTML = `<div class="card"><form id="fr"><div class="row"><div><label>Full name</label><input name="name" required maxlength="60"></div><div><label>Blood group</label><select name="group" required><option value="">- Select Blood Group -</option>${opts(G)}</select></div><div><label>Contact number</label><input name="phone" required placeholder="01XXXXXXXXX"></div><div><label>Area in Dhaka</label><select name="loc"><option value="">None</option>${opts(AREAS)}</select></div><div><label>Last donation date (optional)</label>${dfield('last', 0, '', '', today())}</div></div>
  <label class="ck"><input type="checkbox" name="age" required>I am 18 or older and in good health.</label><label class="ck"><input type="checkbox" name="ok" required>I consent to my name, blood group, area and (on request) phone number being shown to people seeking blood.</label><button>Register</button></form></div>`;
};

let showReq = false;

V.request = () => {
  const o = db.reqs.filter(r => r.status === 'Open');
  $('#app').innerHTML = `<div class="card"><form id="fq"><div class="row"><div><label>Patient name / info</label><input name="patient" required maxlength="80"></div><div><label>Required blood group</label><select name="group" required><option value="">- Select Blood Group -</option>${opts(G)}</select></div><div><label>Units needed</label><input type="number" name="units" min="1" max="20" value="1"></div><div><label>Hospital name</label><input name="hospital" required maxlength="80" list="hosp" placeholder="Type or choose a hospital" autocomplete="off"><datalist id="hosp">${HOSP.map(h => `<option value="${esc(h)}">`).join('')}</datalist></div><div><label>Area in Dhaka</label><select name="loc"><option value="">None</option>${opts(AREAS)}</select></div><div><label>Required date</label>${dfield('date', 1, '', today(), '')}</div><div><label>Contact number</label><input name="phone" required placeholder="01XXXXXXXXX"></div><div><label>Urgency</label><select name="urgency" required><option value="" disabled selected hidden>Type or Choose</option>${opts(['Urgent', 'Within 3 days', 'Within 7 days', 'Planned'])}</select></div></div><button>Submit Request</button></form></div>
  ${showReq ? `<div class="card"><h2>Open Requests (${o.length})</h2>${o.map((r, i) => { const m = db.donors.filter(d => CAN[r.group].includes(d.group) && d.avail && elig(d) && inD(d)).length; return `<div class="it"><div><b class="sn">${i + 1}.</b> ${badge(r)}<b>${esc(r.units)} unit(s)</b> · ${esc(r.urgency)}${ver(r.verified)}<br><span class="mu">${esc(r.patient)} · ${esc(r.hospital)}${r.loc ? ', ' + esc(r.loc) : ''} · needed by ${fd(r.date)}<br>${m} matching available donor(s) in Dhaka</span></div><button class="s g" data-act="rq" data-id="${r.id}">Show contact</button></div>`; }).join('') || '<p class="mu">No open requests.</p>'}</div>` : ''}`;
};

V.profile = () => {
  if (!me) {
    $('#app').innerHTML = `<div class="card"><form id="fl"><label>Enter your registered phone number</label><input name="phone" required><button>Open Profile</button></form><p class="mu">Demo note: a phone number is used as a simple lookup. A real deployment must add OTP/password login.</p></div>`;
    return;
  }
  const d = db.donors.find(x => x.id === me);
  if (!d) { me = null; return V.profile(); }
  const [s, c] = status(d);
  $('#app').innerHTML = `<div class="card"><h2>${badge(d)}${esc(d.name)} ${ver(d.verified)}</h2><p>Status: <b class="${c}">${esc(s)}</b></p><button class="s" data-act="tog">${d.avail ? 'Mark as unavailable' : 'Mark as available'}</button> <button class="s g" data-act="out">Sign out</button></div>
  <div class="card"><h3 style="margin-top:0">Update information</h3><form id="fu"><div class="row"><div><label>Name</label><input name="name" value="${esc(d.name)}" required></div><div><label>Blood group</label><select name="group">${opts(G, d.group)}</select></div><div><label>Phone</label><input name="phone" value="${esc(d.phone)}" required></div><div><label>Area in Dhaka</label><select name="loc"><option value="">None</option>${opts(AREAS, d.loc)}</select></div></div><button>Save changes</button></form></div>
  <div class="card"><h3 style="margin-top:0">Donation history (${d.hist.length})</h3><form id="fh" class="row"><div><label>Date</label>${dfield('date', 1, '', '', today())}</div><div><label>Place / hospital</label><input name="place" required maxlength="80"></div><div><label>&nbsp;</label><button style="margin:0">Add donation</button></div></form>${[...d.hist].sort((a, b) => b.date.localeCompare(a.date)).map(h => `<div class="it"><span>${fd(h.date)} — ${esc(h.place)}</span></div>`).join('') || '<p class="mu">No donations recorded yet.</p>'}<button class="g" data-act="del">Delete my profile</button></div>`;
};

V.admin = () => {
  if (!admin) {
    $('#app').innerHTML = `<div class="card"><h2>Admin Login</h2><form id="fa"><label>Admin PIN</label><input type="password" name="pin" required><button>Login</button></form></div>`;
    return;
  }
  const T = ['donors', 'requests', 'reports'].map(t => `<button class="s ${t === tab ? '' : 'g'}" data-act="tab" data-id="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('');
  let h = `<div class="card">${T}<button class="s g" data-act="alogout">Logout</button></div><div class="card tw">`;
  
  if (tab === 'donors') {
    h += `<table><tr><th>Name</th><th>Group</th><th>Location</th><th>Phone</th><th>Status</th><th>Actions</th></tr>${db.donors.map(d => `<tr><td>${esc(d.name)}</td><td>${esc(d.group)}</td><td>${esc(d.loc || '—')}</td><td>${esc(d.phone)}</td><td>${ver(d.verified)}</td><td><button class="s" data-act="vd" data-id="${d.id}">${d.verified ? 'Unverify' : 'Verify'}</button><button class="s g" data-act="dd" data-id="${d.id}">Delete</button></td></tr>`).join('')}</table>`;
  } else if (tab === 'requests') {
    h += `<table><tr><th>Patient</th><th>Group</th><th>Hospital</th><th>Date</th><th>Phone</th><th>Verified</th><th>Status</th><th></th></tr>${db.reqs.map(r => `<tr><td>${esc(r.patient)}</td><td>${esc(r.group)}</td><td>${esc(r.hospital)}</td><td>${fd(r.date)}</td><td>${esc(r.phone)}</td><td>${ver(r.verified)}<button class="s" data-act="vr" data-id="${r.id}">${r.verified ? 'Unverify' : 'Verify'}</button></td><td><span class="stb ${r.status === 'Open' ? 'o' : r.status === 'Fulfilled' ? 'f' : 'c'}">${esc(r.status)}</span><select data-act="rs" data-id="${r.id}" required><option value="" disabled selected hidden>Type or Choose</option>${opts(['Open', 'Fulfilled', 'Closed'], '')}</select></td><td><button class="s g" data-act="dr" data-id="${r.id}">Delete</button></td></tr>`).join('') || '<tr><td>No requests</td></tr>'}</table>`;
  } else {
    const av = db.donors.filter(d => d.avail && elig(d)).length, op = db.reqs.filter(r => r.status === 'Open').length, mx = Math.max(1, ...G.map(g => Math.max(db.donors.filter(d => d.group === g).length, db.reqs.filter(r => r.group === g && r.status === 'Open').length)));
    h += `<div class="st"><div><b>${db.donors.length}</b>Donors</div><div><b>${db.donors.filter(d => d.verified).length}</b>Verified</div><div><b>${av}</b>Available now</div><div><b>${op}</b>Open requests</div><div><b>${db.reqs.filter(r => r.status === 'Fulfilled').length}</b>Fulfilled</div></div><h3>Supply vs demand by blood group</h3><p class="mu">Red: donors · Orange: open requests</p>${G.map(g => { const a = db.donors.filter(d => d.group === g).length, b = db.reqs.filter(r => r.group === g && r.status === 'Open').length; return `<div style="display:grid;grid-template-columns:40px 1fr;gap:8px;align-items:center;margin:6px 0"><b>${g}</b><div><div class="bar" style="width:${a / mx * 100}%"></div><div class="bar o" style="width:${b / mx * 100}%;margin-top:2px"></div></div></div>`; }).join('')}`;
  }
  $('#app').innerHTML = h + '</div>';
};

document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, v = Object.fromEntries(new FormData(f)), id = f.id;
  for (const k of ['last', 'date']) {
    if (v[k]) {
      const iso = td(v[k]), el = f.elements[k];
      if (!iso || (el.dataset.min && iso < el.dataset.min) || (el.dataset.max && iso > el.dataset.max)) return toast('Enter a valid date in dd/mm/yyyy format' + (el.dataset.max ? ' (not in the future)' : el.dataset.min ? ' (not in the past)' : ''));
      v[k] = iso;
    }
  }
  if (id === 'fr') {
    if (!val.phone(v.phone)) return toast('Enter a valid phone number');
    if (db.donors.some(d => dig(d.phone) === dig(v.phone))) return toast('This number is already registered');
    newDonor = uid();
    db.donors.push({ id: newDonor, name: v.name.trim(), group: v.group, phone: v.phone.trim(), loc: v.loc.trim(), avail: 1, last: v.last || '', verified: 0, hist: v.last ? [{ date: v.last, place: 'Previous donation' }] : [], created: today() });
    save();
    toast('Registered successfully! You are now in the All Donors list.');
    location.hash = 'donors';
  } else if (id === 'fq') {
    if (!val.phone(v.phone)) return toast('Enter a valid phone number');
    db.reqs.unshift({ id: uid(), patient: v.patient.trim(), group: v.group, units: +v.units || 1, hospital: v.hospital.trim(), loc: v.loc.trim(), date: v.date, phone: v.phone.trim(), urgency: v.urgency, status: 'Open', verified: 0, created: today() });
    save();
    toast('Request posted');
    showReq = true;
    V.request();
  } else if (id === 'fl') {
    const d = db.donors.find(x => dig(x.phone) === dig(v.phone));
    if (!d) return toast('No donor found with this number');
    me = d.id;
    V.profile();
  } else if (id === 'fu') {
    const d = db.donors.find(x => x.id === me);
    if (!val.phone(v.phone)) return toast('Invalid phone number');
    if (db.donors.some(x => x.id !== me && dig(x.phone) === dig(v.phone))) return toast('Number already in use');
    if (d.group !== v.group || dig(d.phone) !== dig(v.phone)) d.verified = 0;
    Object.assign(d, { name: v.name.trim(), group: v.group, phone: v.phone.trim(), loc: v.loc.trim() });
    save();
    toast('Profile updated');
    V.profile();
  } else if (id === 'fh') {
    const d = db.donors.find(x => x.id === me);
    d.hist.push({ date: v.date, place: v.place.trim() });
    if (!d.last || v.date > d.last) d.last = v.date;
    save();
    toast('Donation added');
    V.profile();
  } else if (id === 'fa') {
    if (v.pin === PIN) { admin = true; V.admin(); } else toast('Wrong PIN');
  }
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b || b.tagName === 'SELECT') return;
  const a = b.dataset.act, id = b.dataset.id, D = db.donors.find(x => x.id === id), Q = db.reqs.find(x => x.id === id);
  if (a === 'hs') {
    if (!$('#hg').value) return toast('Please select a blood group');
    pre = { g: $('#hg').value, l: $('#hl').value };
    location.hash = 'search';
  } else if (a === 'reveal') {
    b.outerHTML = `<a class="ph" href="tel:${esc(D.phone)}">📞 ${esc(D.phone)}</a>`;
  } else if (a === 'rq') {
    b.outerHTML = `<a class="ph rq" data-id="${id}" href="tel:${esc(Q.phone)}">📞 ${esc(Q.phone)}</a>`;
  } else if (a === 'tog') {
    const d = db.donors.find(x => x.id === me);
    d.avail = d.avail ? 0 : 1;
    save();
    V.profile();
  } else if (a === 'out') {
    me = null;
    V.profile();
  } else if (a === 'del') {
    if (confirm('Delete your donor profile permanently?')) {
      db.donors = db.donors.filter(x => x.id !== me);
      me = null;
      save();
      V.profile();
      toast('Profile deleted');
    }
  } else if (a === 'tab') {
    tab = id;
    V.admin();
  } else if (a === 'alogout') {
    admin = false;
    V.admin();
  } else if (a === 'vd') {
    D.verified = D.verified ? 0 : 1;
    save();
    V.admin();
  } else if (a === 'vr') {
    Q.verified = Q.verified ? 0 : 1;
    save();
    V.admin();
  } else if (a === 'dd') {
    if (confirm('Delete this donor?')) {
      db.donors = db.donors.filter(x => x.id !== id);
      save();
      V.admin();
    }
  } else if (a === 'dr') {
    if (confirm('Delete this request?')) {
      db.reqs = db.reqs.filter(x => x.id !== id);
      save();
      V.admin();
    }
  }
});

document.addEventListener('click', e => {
  const x = e.target.closest('[data-g]');
  if (x) pre = { g: x.dataset.g, l: '' };
});

function hideDon() {
  document.querySelectorAll('.rv').forEach(x => {
    x.outerHTML = `<button class="s g" data-act="dshow" data-id="${x.dataset.id}">Show</button>`;
  });
}

document.addEventListener('click', e => {
  if (e.target.closest('.rv')) return;
  const b = e.target.closest('[data-act="dshow"]');
  hideDon();
  if (b) {
    const D = db.donors.find(x => x.id === b.dataset.id);
    if (D) b.outerHTML = `<a class="ph rv" data-id="${D.id}" href="tel:${esc(D.phone)}" title="Call"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align:-2px;margin-right:6px"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>${esc(D.phone)}</a>`;
  }
});

document.addEventListener('change', e => {
  if (e.target.dataset.act === 'rs') {
    db.reqs.find(x => x.id === e.target.dataset.id).status = e.target.value;
    save();
    toast('Status updated');
    V.admin();
  }
});

const PHONE = '01768620607', EMAIL = 'contactbloodlink-Dhaka@gmail.com';
const NOTE = '<b>Dhaka only:</b> search covers donors and requests inside Dhaka. BloodLink does not verify donors and cannot guarantee blood availability. Always confirm the donor’s health and eligibility, and use a licensed hospital or blood bank. Share contact details responsibly.';
const HERO = {
  reqrec: ['Request Record', 'Which blood groups people ask for most, and how much they have received'],
  record: ['Donors Record', 'Blood group wise record of every donor registered in Dhaka'],
  summary: ['Summary', 'Why we donate blood, its benefits and who can give blood to whom'],
  donors: ['All Donor List', 'Everyone who has registered or donated blood in Dhaka'],
  search: ['Find a Blood Donor in Dhaka', 'Search available donors by blood group and area.'],
  register: ['Become a Blood Donor', 'Register in a minute and help save a life in Dhaka.'],
  request: ['Emergency Blood Request', 'Post a request so donors in Dhaka can reach you quickly.'],
  profile: ['My Donor Profile', 'Update your details, availability and donation history.'],
  admin: ['Admin Dashboard', 'Manage donors and requests, verify information and view reports.']
};

Object.assign(HERO, PT);

const tl = document.querySelector('.tl');
if (tl) tl.innerHTML = `<a href="tel:+88${PHONE}">📞 ${PHONE}</a><a href="mailto:${EMAIL}">✉ ${EMAIL}</a><span>📍 Dhaka, Bangladesh</span>`;

function dress(h) {
  const a = $('#app');
  if (a.lastElementChild && a.lastElementChild.tagName === 'FOOTER') return;
  if (h !== 'home') {
    const w = document.createElement('div');
    w.className = 'wrap';
    const n = document.createElement('div');
    n.className = 'note';
    n.innerHTML = NOTE;
    w.appendChild(n);
    while (a.firstChild) w.appendChild(a.firstChild);
    const s = document.createElement('section');
    s.className = 'phero';
    s.dataset.p = h;
    s.innerHTML = `<h1>${HERO[h][0]}</h1><p>${HERO[h][1]}</p>`;
    a.append(s, w);
  }
  const f = document.createElement('footer');
  f.innerHTML = `<b>BloodLink Dhaka</b><br>📞 <a href="tel:+88${PHONE}">${PHONE}</a> · ✉ <a href="mailto:${EMAIL}">${EMAIL}</a><br><small>Donors are not verified by BloodLink; always confirm with a licensed hospital or blood bank.</small>`;
  a.append(f);
}

Object.keys(V).forEach(k => {
  const f = V[k];
  V[k] = (...x) => { f(...x); dress(k); };
});

document.addEventListener('input', e => {
  const t = e.target;
  if (!t.classList.contains('dti')) return;
  const d = t.value.replace(/\D/g, '').slice(0, 8);
  t.value = d.slice(0, 2) + (d.length > 2 ? '/' + d.slice(2, 4) : '') + (d.length > 4 ? '/' + d.slice(4) : '');
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.classList.contains('dtp') && t.value) t.parentElement.querySelector('.dti').value = fd(t.value);
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act="cal"]');
  if (!b) return;
  const p = b.parentElement.querySelector('.dtp'), t = b.parentElement.querySelector('.dti'), i = td(t.value);
  if (i) p.value = i;
  try { p.showPicker(); } catch (x) { p.focus(); }
});

const noAC = () => document.querySelectorAll('#app form,#app input,#app textarea').forEach(x => x.setAttribute('autocomplete', x.type === 'password' ? 'new-password' : 'off'));
new MutationObserver(noAC).observe($('#app'), { childList: true, subtree: true });
noAC();

document.addEventListener('click', e => {
  document.querySelectorAll('.rq').forEach(x => {
    if (!x.contains(e.target)) x.outerHTML = `<button class="s g" data-act="rq" data-id="${x.dataset.id}">Show contact</button>`;
  });
}, true);

addEventListener('storage', e => {
  if (e.key === 'bloodlinkDhaka1') {
    db = load();
    {
      const h = location.hash;
      if (h === '#donors') V.donors();
      else if (h === '#record') V.record();
      else if (h === '#reqrec') V.reqrec();
    }
  }
});

function lockWarn() {
  toast('Please Sign Out Your Profile', 4500, 'warn');
  const b = document.querySelector('[data-act="out"]');
  if (b) {
    b.classList.remove('shake');
    void b.offsetWidth;
    b.classList.add('shake');
    b.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

document.addEventListener('click', e => {
  if (!me) return;
  const a = e.target.closest('a[href]');
  if (!a) return;
  const h = a.getAttribute('href');
  if (h && h.startsWith('#') && h !== '#profile') {
    e.preventDefault();
    e.stopPropagation();
    lockWarn();
  }
}, true);

addEventListener('beforeunload', e => {
  if (me) { e.preventDefault(); e.returnValue = ''; }
});

addEventListener('hashchange', route);
route();
