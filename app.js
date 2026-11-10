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