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
