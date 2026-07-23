// Auto-ported UNILAG 2025/2026 programme dataset (from the original Ciceroo single-file build).
// Data only — no DOM. Types kept loose to preserve the source shape exactly.
/* eslint-disable */

export interface ReqGroup { label?: string; subjects: string[]; count: number; }
export interface Programme {
  name: string; faculty: string; merit: number;
  catchment: Record<string, number>;
  utme: string[]; requirements: ReqGroup[]; utmeReqs: ReqGroup[];
}

export const GRADES = [
  {label: "A1", value: "A1", pts: 4.0},
  {label: "B2", value: "B2", pts: 3.6},
  {label: "B3", value: "B3", pts: 3.2},
  {label: "C4", value: "C4", pts: 2.8},
  {label: "C5", value: "C5", pts: 2.4},
  {label: "C6", value: "C6", pts: 2.0},
  {label: "D7", value: "D7", pts: 0},
  {label: "E8", value: "E8", pts: 0},
  {label: "F9", value: "F9", pts: 0},
];

export const SUBJECTS: string[] = [
  "English Language","Mathematics","Further Mathematics","Biology","Chemistry","Physics",
  "Agricultural Science","Health Science","Health Education","Geography","Economics","Government",
  "History","Literature-in-English","Christian Religious Studies","Islamic Religious Studies",
  "Yoruba","Igbo","Hausa","French","Fine Arts","Visual Arts","Music","Technical Drawing",
  "Computer Studies","Financial Accounting","Commerce","Civic Education","Social Studies",
  "Food & Nutrition","Home Economics","Clothing & Textile","Building Construction","Book Keeping",
  "Insurance","Physical Education","Integrated Science","Data Processing","Business Management","Arabic"
];

export const NORM_MAP: Record<string, string> = {
  "crs": "Christian Religious Studies",
  "crk": "Christian Religious Studies",
  "christian religious knowledge": "Christian Religious Studies",
  "christian religious studies": "Christian Religious Studies",
  "irs": "Islamic Religious Studies",
  "irk": "Islamic Religious Studies",
  "islamic religious knowledge": "Islamic Religious Studies",
  "islamic religious studies": "Islamic Religious Studies",
  "lit": "Literature-in-English",
  "literature": "Literature-in-English",
  "lit in english": "Literature-in-English",
  "lit-in-eng": "Literature-in-English",
  "further maths": "Further Mathematics",
  "further math": "Further Mathematics",
  "agric": "Agricultural Science",
  "agriculture": "Agricultural Science",
  "agricultural science": "Agricultural Science",
  "govt": "Government",
  "gov't": "Government",
  "econs": "Economics",
  "maths": "Mathematics",
  "eng": "English Language",
  "eng lang": "English Language",
  "bio": "Biology",
  "chem": "Chemistry",
  "phy": "Physics",
  "phys": "Physics",
  "fin acct": "Financial Accounting",
  "financial acc": "Financial Accounting",
  "principles of accounting": "Financial Accounting",
  "comm": "Commerce",
  "tech drawing": "Technical Drawing",
  "tech. drawing": "Technical Drawing",
  "data processing": "Computer Studies",
  "computer science": "Computer Studies",
  "fine art": "Fine Arts",
  "vis arts": "Visual Arts",
  "visual art": "Visual Arts",
  "food and nutrition": "Food & Nutrition",
  "home econ": "Home Economics",
  "home ec": "Home Economics",
};

export const FAC_GRADIENTS: Record<string, string> = {
  "College of Medicine":          "linear-gradient(135deg,#0d9488,#06b6d4)",
  "Faculty of Pharmacy":          "linear-gradient(135deg,#059669,#34d399)",
  "Faculty of Engineering":       "linear-gradient(135deg,#1d4ed8,#3b82f6)",
  "Faculty of Science":           "linear-gradient(135deg,#7c3aed,#a78bfa)",
  "Faculty of Management Sciences":"linear-gradient(135deg,#d97706,#fbbf24)",
  "Faculty of Law":               "linear-gradient(135deg,#dc2626,#f87171)",
  "Faculty of Arts":              "linear-gradient(135deg,#db2777,#f472b6)",
  "Faculty of Social Sciences":   "linear-gradient(135deg,#0891b2,#67e8f9)",
  "Faculty of Environmental Sciences":"linear-gradient(135deg,#65a30d,#a3e635)",
  "Faculty of Education":         "linear-gradient(135deg,#9333ea,#c084fc)",
};

export const FAC_ICONS: Record<string, string> = {
  "College of Medicine":"stethoscope","Faculty of Pharmacy":"pill","Faculty of Engineering":"cog",
  "Faculty of Science":"flask-conical","Faculty of Management Sciences":"trending-up","Faculty of Law":"scale",
  "Faculty of Arts":"palette","Faculty of Social Sciences":"globe-2","Faculty of Environmental Sciences":"trees",
  "Faculty of Education":"graduation-cap",
};

export const req: any = {
  engMathBioChem5: [
    {label:"English Language", subjects:["English Language"], count:1},
    {label:"Mathematics", subjects:["Mathematics"], count:1},
    {label:"Biology", subjects:["Biology"], count:1},
    {label:"Chemistry", subjects:["Chemistry"], count:1},
    {label:"Physics", subjects:["Physics"], count:1},
  ],
  engMathBioChemPhy: [
    {label:"English Language", subjects:["English Language"], count:1},
    {label:"Mathematics", subjects:["Mathematics"], count:1},
    {label:"Biology", subjects:["Biology"], count:1},
    {label:"Chemistry", subjects:["Chemistry"], count:1},
    {label:"Physics", subjects:["Physics"], count:1},
  ],
  engineering: [
    {label:"English Language", subjects:["English Language"], count:1},
    {label:"Mathematics", subjects:["Mathematics"], count:1},
    {label:"Further Mathematics", subjects:["Further Mathematics"], count:1},
    {label:"Physics", subjects:["Physics"], count:1},
    {label:"Chemistry", subjects:["Chemistry"], count:1},
  ],
};
req.utmeMedical    = [{subjects:["English Language"],count:1},{subjects:["Biology"],count:1},{subjects:["Chemistry"],count:1},{subjects:["Physics"],count:1}];
req.utmeEngineering = [{subjects:["English Language"],count:1},{subjects:["Mathematics"],count:1},{subjects:["Physics"],count:1},{subjects:["Chemistry"],count:1}];
req.utmeCSPhysics  = [{subjects:["English Language"],count:1},{subjects:["Mathematics"],count:1},{subjects:["Physics"],count:1},{subjects:["Chemistry","Biology"],count:1}];
req.utmeMathSci    = [{subjects:["English Language"],count:1},{subjects:["Mathematics"],count:1},{subjects:["Physics"],count:1},{subjects:["Chemistry","Economics","Biology","Geography"],count:1}];
req.utmePhysChem   = [{subjects:["English Language"],count:1},{subjects:["Physics"],count:1},{subjects:["Chemistry"],count:1},{subjects:["Biology"],count:1}];
req.utmeManagement = [{subjects:["English Language"],count:1},{subjects:["Mathematics"],count:1},{subjects:["Economics"],count:1},{subjects:["__ANY__"],count:1}];
req.utmeLaw        = [{subjects:["English Language"],count:1},{subjects:["Literature-in-English","History","Government","Christian Religious Studies","Islamic Religious Studies","French","Yoruba","Igbo","Hausa","Economics","Geography","Sociology"],count:3}];
req.utmeArts       = [{subjects:["English Language"],count:1},{subjects:["Literature-in-English","History","Government","Christian Religious Studies","Islamic Religious Studies","French","Yoruba","Igbo","Hausa","Economics","Geography","Fine Arts","Visual Arts","Music","Sociology","Arabic"],count:3}];
req.utmeSocial     = [{subjects:["English Language"],count:1},{subjects:["__ANY__"],count:3}];
req.utmeEnvPhysics = [{subjects:["English Language"],count:1},{subjects:["Mathematics"],count:1},{subjects:["Physics"],count:1},{subjects:["__ANY__"],count:1}];
req.utmeEnvEcon    = [{subjects:["English Language"],count:1},{subjects:["Mathematics"],count:1},{subjects:["Economics","Geography","Physics"],count:1},{subjects:["__ANY__"],count:1}];
req.utmeBioAny     = [{subjects:["English Language"],count:1},{subjects:["Biology"],count:1},{subjects:["__ANY__"],count:2}];
req.utmeChem2Any   = [{subjects:["English Language"],count:1},{subjects:["Chemistry"],count:1},{subjects:["Biology","__ANY__"],count:1},{subjects:["__ANY__"],count:1}];
req.utmeOpen       = [{subjects:["English Language"],count:1},{subjects:["__ANY__"],count:3}];

export const PROGRAMMES: Programme[] = [
  // COLLEGE OF MEDICINE
  {name:"Medicine & Surgery", faculty:"College of Medicine", merit:85.025, catchment:{Ekiti:79.975,Lagos:79.75,Ogun:83.8,Ondo:81.325,Osun:81.775,Oyo:81.575}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Nursing", faculty:"College of Medicine", merit:79.8, catchment:{Ekiti:73.2,Lagos:73.7,Ogun:77.5,Ondo:77.1,Osun:77.85,Oyo:77.65}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Physiotherapy", faculty:"College of Medicine", merit:74.725, catchment:{Ekiti:66.25,Lagos:72.975,Ogun:74.2,Ondo:73.6,Osun:72.25,Oyo:73.175}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Radiography", faculty:"College of Medicine", merit:77.375, catchment:{Ekiti:74.9,Lagos:73.975,Ogun:76.9,Ondo:70.35,Osun:75.625,Oyo:76.7}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Anatomy", faculty:"College of Medicine", merit:72.4, catchment:{Ekiti:71.5,Lagos:70.35,Ogun:70.125,Ondo:71.65,Osun:66.475,Oyo:64.75}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Pharmacology", faculty:"College of Medicine", merit:73.125, catchment:{Ekiti:69.025,Lagos:69.65,Ogun:71.925,Ondo:67.075,Osun:66.3,Oyo:71.6}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Physiology", faculty:"College of Medicine", merit:72.875, catchment:{Ekiti:66.45,Lagos:63.8,Ogun:70.225,Ondo:57.3,Osun:70.925,Oyo:67.95}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Medical Laboratory Science", faculty:"College of Medicine", merit:74.375, catchment:{Ekiti:70.925,Lagos:72,Ogun:73,Ondo:70.6,Osun:72.7,Oyo:72.825}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Dentistry", faculty:"College of Medicine", merit:76.65, catchment:{Ekiti:70.875,Lagos:65.825,Ogun:75.325,Ondo:72.775,Osun:69.175,Oyo:64.975}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},

  // PHARMACY
  {name:"Pharmacy", faculty:"Faculty of Pharmacy", merit:76.4, catchment:{Ekiti:69.175,Lagos:69.5,Ogun:73.3,Ondo:69.55,Osun:73.725,Oyo:71.275}, utme:["English Language","Physics","Chemistry","Biology"], utmeReqs:req.utmePhysChem,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Biology",subjects:["Biology"],count:1},
   ]},

  // ENGINEERING
  {name:"Computer Engineering", faculty:"Faculty of Engineering", merit:82.875, catchment:{Ekiti:71.8,Lagos:78.3,Ogun:80.75,Ondo:77,Osun:81.475,Oyo:79}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Electrical/Electronics Engineering", faculty:"Faculty of Engineering", merit:79.5, catchment:{Ekiti:63.35,Lagos:69.775,Ogun:77.1,Ondo:68.525,Osun:72.1,Oyo:72.125}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Mechanical Engineering", faculty:"Faculty of Engineering", merit:78.525, catchment:{Ekiti:71.6,Lagos:73.825,Ogun:75.85,Ondo:66.3,Osun:72.5,Oyo:72.575}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Systems Engineering", faculty:"Faculty of Engineering", merit:78.225, catchment:{Ekiti:65.475,Lagos:73.475,Ogun:75.875,Ondo:58.35,Osun:70.6,Oyo:73.95}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Civil Engineering", faculty:"Faculty of Engineering", merit:75.625, catchment:{Ekiti:65.525,Lagos:74.5,Ogun:72.075,Ondo:65.575,Osun:72.375,Oyo:71.05}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Chemical Engineering", faculty:"Faculty of Engineering", merit:72.8, catchment:{Ekiti:68.25,Lagos:62.35,Ogun:64.9,Osun:57.65,Oyo:59.325}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Biomedical Engineering", faculty:"Faculty of Engineering", merit:73.3, catchment:{Lagos:66.125,Ogun:68.45,Ondo:69.55,Oyo:68.275}, utme:["English Language","Chemistry","Mathematics","Physics"], utmeReqs:req.utmeEngineering,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Further Mathematics",subjects:["Further Mathematics"],count:1},
    {label:"Biology",subjects:["Biology"],count:1},
    {label:"Chemistry or Physics",subjects:["Chemistry","Physics"],count:1},
   ]},
  {name:"Petroleum & Gas Engineering", faculty:"Faculty of Engineering", merit:70.725, catchment:{Ekiti:64.125,Lagos:65.2,Ogun:67.75,Osun:65.225,Oyo:65.6}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Metallurgical & Materials Engineering", faculty:"Faculty of Engineering", merit:59.8, catchment:{Ekiti:58.975,Ogun:57.95}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},
  {name:"Surveying & Geoinformatics Engineering", faculty:"Faculty of Engineering", merit:58.125, catchment:{}, utme:["English Language","Chemistry","Mathematics","Physics"], requirements:req.engineering, utmeReqs:req.utmeEngineering},

  // SCIENCE
  {name:"Computer Science", faculty:"Faculty of Science", merit:83.425, catchment:{Ekiti:80.125,Lagos:79.6,Ogun:82.025,Ondo:77.5,Osun:79.2,Oyo:78.1}, utme:["English Language","Mathematics","Physics","Chemistry or Biology"], utmeReqs:req.utmeCSPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Further Mathematics",subjects:["Further Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Chemistry or Biology",subjects:["Chemistry","Biology"],count:1},
   ]},
  {name:"Data Science", faculty:"Faculty of Science", merit:76.925, catchment:{Ekiti:72.65,Lagos:74.025,Ogun:75.775,Ondo:73.9,Osun:74.3,Oyo:72.675}, utme:["English Language","Mathematics","Physics","one of Chemistry/Biology/Economics/Geography"], utmeReqs:req.utmeCSPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Science/Social electives (best 2)",subjects:["Further Mathematics","Chemistry","Biology","Economics","Geography"],count:2},
   ]},
  {name:"Biochemistry", faculty:"Faculty of Science", merit:69.4, catchment:{Ekiti:64.775,Lagos:66.275,Ogun:66.275,Ondo:65,Osun:64.375,Oyo:67.15}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Cell Biology & Genetics", faculty:"Faculty of Science", merit:68.975, catchment:{Ekiti:63.325,Lagos:63.85,Ogun:66.55,Ondo:65.75,Osun:56.125,Oyo:64.225}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Microbiology", faculty:"Faculty of Science", merit:68.075, catchment:{Ekiti:61.2,Lagos:65.95,Ogun:64.9,Ondo:62,Osun:57.175,Oyo:54.95}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Mathematics", faculty:"Faculty of Science", merit:63.675, catchment:{Lagos:58.625,Ogun:52.5,Ondo:60.9,Osun:61.825}, utme:["English Language","Mathematics","Physics","one of Chemistry/Economics/Biology/Geography"], utmeReqs:req.utmeMathSci,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Further Mathematics",subjects:["Further Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Science/Social elective",subjects:["Chemistry","Economics","Biology","Geography"],count:1},
   ]},
  {name:"Statistics", faculty:"Faculty of Science", merit:65.925, catchment:{Lagos:64.1,Ogun:60.9,Ondo:63.775,Oyo:60.925}, utme:["English Language","Mathematics","Physics","one of Chemistry/Economics/Biology/Geography"], utmeReqs:req.utmeMathSci,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Further Mathematics",subjects:["Further Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Science/Social elective",subjects:["Chemistry","Economics","Biology","Geography"],count:1},
   ]},
  {name:"Industrial Mathematics", faculty:"Faculty of Science", merit:67.875, catchment:{Ekiti:61.8,Lagos:52.5,Ogun:62.425,Ondo:64.125}, utme:["English Language","Mathematics","Physics","one of Chemistry/Economics/Biology/Geography"], utmeReqs:req.utmeMathSci,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Further Mathematics",subjects:["Further Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Science/Social elective",subjects:["Chemistry","Economics","Biology","Geography"],count:1},
   ]},
  {name:"Physics", faculty:"Faculty of Science", merit:60.25, catchment:{Ekiti:52.225,Lagos:54.925,Ogun:55.125,Ondo:55.35}, utme:["English Language","Mathematics","Physics","Chemistry"], utmeReqs:req.utmeEngineering,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Further Mathematics",subjects:["Further Mathematics"],count:1},
   ]},
  {name:"Chemistry", faculty:"Faculty of Science", merit:59.5, catchment:{Lagos:59.3,Ogun:54.325,Osun:54.15}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Geology", faculty:"Faculty of Science", merit:63.55, catchment:{Ekiti:60.125,Lagos:58.375,Ogun:58.45,Ondo:54.575,Osun:61.375,Oyo:60.825}, utme:["English Language","Physics","Chemistry","Biology"], utmeReqs:req.utmePhysChem,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Biology",subjects:["Biology"],count:1},
   ]},
  {name:"Geophysics", faculty:"Faculty of Science", merit:65.225, catchment:{Ekiti:55.7,Lagos:57.925,Ogun:53.675,Ondo:54.75,Osun:52.675,Oyo:60.55}, utme:["English Language","Physics","Chemistry","Biology"], utmeReqs:req.utmePhysChem,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Biology",subjects:["Biology"],count:1},
   ]},
  {name:"Botany", faculty:"Faculty of Science", merit:51.45, catchment:{}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Zoology", faculty:"Faculty of Science", merit:57.25, catchment:{}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Marine Biology", faculty:"Faculty of Science", merit:55.45, catchment:{Osun:54.725}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Fisheries & Aquaculture", faculty:"Faculty of Science", merit:52.475, catchment:{}, utme:["English Language","Biology","Chemistry","Physics"], requirements:req.engMathBioChemPhy, utmeReqs:req.utmeMedical},
  {name:"Biostatistics", faculty:"Faculty of Science", merit:52.125, catchment:{}, utme:["English Language","Mathematics","Physics","one of Chemistry/Biology/Economics/Geography"], utmeReqs:req.utmeMathSci,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Further Mathematics",subjects:["Further Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Science/Social elective",subjects:["Chemistry","Biology","Economics","Geography"],count:1},
   ]},
  {name:"Environmental Standards", faculty:"Faculty of Science", merit:65.775, catchment:{Lagos:63.575,Oyo:62.625}, utme:["English Language","any 3 subjects"], utmeReqs:req.utmeOpen,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 Science/Social subjects",subjects:["Biology","Chemistry","Physics","Geography","Economics","Government"],count:3},
   ]},

  // MANAGEMENT SCIENCES
  {name:"Accounting", faculty:"Faculty of Management Sciences", merit:75.7, catchment:{Ekiti:69.475,Lagos:71.4,Ogun:73.825,Ondo:68.8,Osun:72.325,Oyo:71}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Financial Accounting","Further Mathematics","Geography","Government","Biology","Business Management","Computer Studies","Literature-in-English"],count:2},
   ]},
  {name:"Business Administration", faculty:"Faculty of Management Sciences", merit:69.3, catchment:{Ekiti:52.725,Lagos:60.2,Ogun:68.15,Ondo:66.075,Osun:64.05,Oyo:67.025}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Financial Accounting","Government","Geography","Christian Religious Studies","Business Management","History","Literature-in-English","Social Studies","Civic Education"],count:2},
   ]},
  {name:"Banking & Finance", faculty:"Faculty of Management Sciences", merit:70.35, catchment:{Ekiti:59.225,Lagos:64,Ogun:67.625,Ondo:61.725,Osun:55.875,Oyo:57.375}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Government","Geography","Commerce","Financial Accounting","Physics","Chemistry","Biology","Business Management","Book Keeping"],count:2},
   ]},
  {name:"Actuarial Science", faculty:"Faculty of Management Sciences", merit:64.925, catchment:{Ekiti:59.725,Ogun:63.15,Ondo:64.05,Osun:60.375,Oyo:59}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Financial Accounting","Computer Studies","Christian Religious Studies","Further Mathematics","Geography","Government","Biology","Chemistry","Physics","Commerce","Civic Education","Insurance"],count:2},
   ]},
  {name:"Insurance", faculty:"Faculty of Management Sciences", merit:65.85, catchment:{Lagos:57.75,Ogun:64.375,Ondo:53.05,Osun:53.05,Oyo:55.1}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Financial Accounting","Computer Studies","Christian Religious Studies","Further Mathematics","Geography","Government","Biology","Chemistry","Physics","Commerce","Civic Education","Insurance"],count:2},
   ]},
  {name:"Taxation", faculty:"Faculty of Management Sciences", merit:66.4, catchment:{Ekiti:57.025,Lagos:62.65,Ogun:63.725,Ondo:61.45,Osun:62.25,Oyo:59.025}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Financial Accounting",subjects:["Financial Accounting"],count:1},
    {label:"Best 1 elective",subjects:["Commerce","Government","Business Management","Geography","Literature-in-English","Civic Education"],count:1},
   ]},
  {name:"Employment Relations & HRM", faculty:"Faculty of Management Sciences", merit:60.775, catchment:{Ekiti:55.65,Lagos:59.6,Ogun:54.5,Ondo:60.025,Osun:58.15,Oyo:53.925}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Financial Accounting","Geography","Government","Computer Studies","Biology","Business Management","Social Studies"],count:2},
   ]},
  {name:"Procurement Management", faculty:"Faculty of Management Sciences", merit:67.175, catchment:{Ekiti:58.7,Lagos:58.625,Ogun:65.675,Ondo:64.75,Osun:60.95,Oyo:64.35}, utme:["English Language","Mathematics","Economics","any elective"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from pool",subjects:["Economics","Physics","Chemistry","Financial Accounting","Government","Civic Education","Geography"],count:3},
   ]},

  // LAW
  {name:"Law", faculty:"Faculty of Law", merit:78.225, catchment:{Ekiti:73.625,Lagos:75.9,Ogun:76.55,Ondo:75.75,Osun:76.35,Oyo:74.525}, utme:["English Language","any 3 Arts/Social Sciences"], utmeReqs:req.utmeLaw,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Literature-in-English",subjects:["Literature-in-English"],count:1},
    {label:"Best 2 Arts/Social Sciences",subjects:["Government","History","Economics","Geography","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo","Hausa","French","Sociology"],count:2},
   ]},

  // ARTS
  {name:"English Language", faculty:"Faculty of Arts", merit:68.175, catchment:{Ekiti:57.475,Lagos:59.2,Ogun:65.05,Ondo:62.025,Osun:55.675,Oyo:63.3}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Literature-in-English",subjects:["Literature-in-English"],count:1},
    {label:"Best 2 from Arts",subjects:["French","History","Government","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo","Hausa"],count:2},
   ]},
  {name:"History & Strategic Studies", faculty:"Faculty of Arts", merit:70.725, catchment:{Ekiti:58.75,Lagos:60.175,Ogun:67.675,Ondo:65.725,Osun:61.625,Oyo:65.1}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"History or Government",subjects:["History","Government"],count:1},
    {label:"Best 2 from Arts",subjects:["Literature-in-English","Christian Religious Studies","Islamic Religious Studies","Civic Education","Yoruba","Igbo","French"],count:2},
   ]},
  {name:"Creative Arts", faculty:"Faculty of Arts", merit:69.5, catchment:{Ekiti:59.375,Lagos:61.675,Ogun:66.225,Ondo:57.725,Osun:65.175,Oyo:65.75}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Literature-in-English",subjects:["Literature-in-English"],count:1},
    {label:"Best 2 from Arts",subjects:["Fine Arts","Visual Arts","Music","Christian Religious Studies","Islamic Religious Studies","Government","History","French","Yoruba","Igbo"],count:2},
   ]},
  {name:"Philosophy", faculty:"Faculty of Arts", merit:66.075, catchment:{Ekiti:58.225,Lagos:54.6,Ogun:60.6,Ondo:57.3,Osun:57.725,Oyo:55.5}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Arts required (1)",subjects:["Literature-in-English","History","Government","Economics","Christian Religious Studies","Islamic Religious Studies","French","Yoruba","Igbo"],count:1},
    {label:"Best 2 from any",subjects:["__ANY__"],count:2},
   ]},
  {name:"French", faculty:"Faculty of Arts", merit:60.225, catchment:{Lagos:59.65}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from Arts",subjects:["French","History","Government","Literature-in-English","Economics","Geography","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo","Civic Education","Computer Studies"],count:3},
   ]},
  {name:"Linguistics", faculty:"Faculty of Arts", merit:72.55, catchment:{Ekiti:67.425,Lagos:70.9,Ogun:71.375,Ondo:68.725,Osun:66.75,Oyo:68.325}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from any",subjects:["__ANY__"],count:3},
   ]},
  {name:"Christian Religious Studies", faculty:"Faculty of Arts", merit:54.625, catchment:{}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Christian Religious Studies",subjects:["Christian Religious Studies"],count:1},
    {label:"Best 2 from any",subjects:["__ANY__"],count:2},
   ]},
  {name:"Islamic Studies", faculty:"Faculty of Arts", merit:54.675, catchment:{}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Islamic Religious Studies",subjects:["Islamic Religious Studies"],count:1},
    {label:"Best 2 from any",subjects:["__ANY__"],count:2},
   ]},

  // SOCIAL SCIENCES
  {name:"Economics", faculty:"Faculty of Social Sciences", merit:73.475, catchment:{Ekiti:54.925,Lagos:66.575,Ogun:71.575,Ondo:63.625,Osun:65.45,Oyo:66.125}, utme:["English Language","Mathematics","Economics","any"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 from any",subjects:["__ANY__"],count:2},
   ]},
  {name:"Mass Communication", faculty:"Faculty of Social Sciences", merit:74.074, catchment:{Ekiti:69.625,Lagos:71.8,Ogun:72.6,Ondo:70.65,Osun:70.825,Oyo:70.45}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Literature-in-English",subjects:["Literature-in-English"],count:1},
    {label:"Best 2 electives",subjects:["Economics","History","Government","Geography","Yoruba","Igbo","Christian Religious Studies","Islamic Religious Studies","Civic Education"],count:2},
   ]},
  {name:"Political Science", faculty:"Faculty of Social Sciences", merit:68.15, catchment:{Ekiti:58.325,Lagos:62.75,Ogun:64.275,Ondo:58.75,Osun:52.075,Oyo:60.9}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Government",subjects:["Government"],count:1},
    {label:"Economics or Geography",subjects:["Economics","Geography"],count:1},
    {label:"Best 1 from Arts",subjects:["History","Literature-in-English","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo"],count:1},
   ]},
  {name:"Psychology", faculty:"Faculty of Social Sciences", merit:69.7, catchment:{Ekiti:61.975,Lagos:65.95,Ogun:68.675,Ondo:63.05,Osun:55.75,Oyo:67.825}, utme:["English Language","Biology","any"], utmeReqs:req.utmeBioAny,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Biology",subjects:["Biology"],count:1},
    {label:"Best 2 electives",subjects:["Physics","Chemistry","Economics","Government","Literature-in-English","Health Science","Health Education","Integrated Science"],count:2},
   ]},
  {name:"Public Administration", faculty:"Faculty of Social Sciences", merit:74.2, catchment:{Ekiti:63.025,Lagos:68.475,Ogun:73.475,Ondo:69.625,Osun:70.25,Oyo:72.05}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Government/History/Civic Education",subjects:["Government","History","Civic Education"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 1 from Social Sciences/Arts",subjects:["__ANY__"],count:1},
   ]},
  {name:"Sociology", faculty:"Faculty of Social Sciences", merit:68.275, catchment:{Lagos:64.175,Ogun:66.875,Ondo:63.8,Osun:57,Oyo:65.95}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 2 Social Sciences",subjects:["Economics","Government","History","Civic Education","Geography"],count:2},
    {label:"1 Arts/Religion",subjects:["Literature-in-English","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo","Hausa","French"],count:1},
   ]},
  {name:"Social Work", faculty:"Faculty of Social Sciences", merit:67.35, catchment:{Ekiti:59.725,Lagos:55.15,Ogun:66.025,Ondo:60.575,Osun:63,Oyo:52.125}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 2 Social Sciences",subjects:["Economics","Government","History","Civic Education","Geography"],count:2},
    {label:"1 Arts/Religion",subjects:["Literature-in-English","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo","Hausa","French"],count:1},
   ]},
  {name:"Geography", faculty:"Faculty of Social Sciences", merit:57.475, catchment:{}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Geography",subjects:["Geography"],count:1},
    {label:"Best 2 from pool",subjects:["Biology","Chemistry","Physics","Economics","Government","Agricultural Science"],count:2},
   ]},
  {name:"Library & Information Science", faculty:"Faculty of Social Sciences", merit:66.625, catchment:{Lagos:62.95,Ogun:63.3,Ondo:61.225,Osun:60.85,Oyo:66.55}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Literature-in-English",subjects:["Literature-in-English"],count:1},
    {label:"Best 2 electives",subjects:["Government","Economics","History","Christian Religious Studies","Islamic Religious Studies","Physics","Chemistry","Biology","French","Yoruba","Igbo"],count:2},
   ]},
  {name:"Economics & Development Studies", faculty:"Faculty of Social Sciences", merit:65.725, catchment:{Lagos:59.8,Ogun:62.425,Ondo:58.175,Oyo:61.8}, utme:["English Language","Mathematics","Economics","any"], utmeReqs:req.utmeManagement,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 from any",subjects:["__ANY__"],count:2},
   ]},

  // ENVIRONMENTAL SCIENCES
  {name:"Architecture", faculty:"Faculty of Environmental Sciences", merit:75.575, catchment:{Ekiti:60.725,Lagos:72.025,Ogun:72.15,Ondo:70.35,Osun:72.175,Oyo:72.825}, utme:["English Language","Mathematics","Physics","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Fine Arts/Technical Drawing",subjects:["Fine Arts","Visual Arts","Technical Drawing"],count:1},
    {label:"Best 1 elective",subjects:["Chemistry","Economics","Geography","Biology","Building Construction"],count:1},
   ]},
  {name:"Building", faculty:"Faculty of Environmental Sciences", merit:57.825, catchment:{Ekiti:56.225,Lagos:52.375,Ogun:52.95,Ondo:56.6,Osun:57.125}, utme:["English Language","Mathematics","Physics","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Best 1 elective",subjects:["Building Construction","Technical Drawing","Economics"],count:1},
   ]},
  {name:"Estate Management", faculty:"Faculty of Environmental Sciences", merit:57.325, catchment:{Ekiti:53.05,Ogun:51.15,Osun:51.2}, utme:["English Language","Mathematics","Economics","any"], utmeReqs:req.utmeEnvEcon,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Chemistry or Physics",subjects:["Chemistry","Physics"],count:1},
    {label:"Best 1 elective",subjects:["Biology","Geography","Agricultural Science","Technical Drawing","Fine Arts","Financial Accounting"],count:1},
   ]},
  {name:"Quantity Surveying", faculty:"Faculty of Environmental Sciences", merit:64.3, catchment:{Ekiti:56.3,Lagos:56.75,Ogun:54.825,Ondo:59.625}, utme:["English Language","Mathematics","Physics","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Best 2 electives",subjects:["Geography","Chemistry","Technical Drawing","Economics"],count:2},
   ]},
  {name:"Urban & Regional Planning", faculty:"Faculty of Environmental Sciences", merit:53.5, catchment:{}, utme:["English Language","Mathematics","Geography","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Geography",subjects:["Geography"],count:1},
    {label:"Best 2 electives",subjects:["Physics","Biology","Chemistry","Economics","Fine Arts","Technical Drawing"],count:2},
   ]},

  // EDUCATION
  {name:"English Education", faculty:"Faculty of Education", merit:68.05, catchment:{Ekiti:62.625,Lagos:63.025,Ogun:64.2,Ondo:58.825,Osun:63.875,Oyo:65.45}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Literature-in-English",subjects:["Literature-in-English"],count:1},
    {label:"Best 2 from any",subjects:["__ANY__"],count:2},
   ]},
  {name:"Mathematics Education", faculty:"Faculty of Education", merit:51.075, catchment:{}, utme:["English Language","Mathematics","Physics","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Best 2 electives",subjects:["Chemistry","Biology","Agricultural Science","Further Mathematics","Computer Studies"],count:2},
   ]},
  {name:"Biology Education", faculty:"Faculty of Education", merit:53.5, catchment:{}, utme:["English Language","Biology","Chemistry","any"], utmeReqs:req.utmeBioAny,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Biology",subjects:["Biology"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 1 elective",subjects:["Physics","Agricultural Science","Health Science"],count:1},
   ]},
  {name:"Chemistry Education", faculty:"Faculty of Education", merit:53.875, catchment:{}, utme:["English Language","Chemistry","any"], utmeReqs:req.utmeChem2Any,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Best 2 electives",subjects:["Physics","Biology","Agricultural Science","Integrated Science"],count:2},
   ]},
  {name:"Physics Education", faculty:"Faculty of Education", merit:63, catchment:{}, utme:["English Language","Physics","Chemistry","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Best 1 elective",subjects:["Biology","Agricultural Science","Further Mathematics"],count:1},
   ]},
  {name:"Computer Science Education", faculty:"Faculty of Education", merit:55.125, catchment:{}, utme:["English Language","Mathematics","Physics","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics",subjects:["Physics"],count:1},
    {label:"Best 2 electives",subjects:["Technical Drawing","Chemistry","Biology","Computer Studies","Further Mathematics"],count:2},
   ]},
  {name:"Economics Education", faculty:"Faculty of Education", merit:56.175, catchment:{}, utme:["English Language","Mathematics","Economics","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Geography","History","Government","Literature-in-English","Financial Accounting","Civic Education"],count:2},
   ]},
  {name:"Business Education", faculty:"Faculty of Education", merit:59.65, catchment:{Lagos:55.425,Ogun:56.425,Osun:56.6,Oyo:52.575}, utme:["English Language","Mathematics","Economics","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Financial Accounting","Government","Geography","Literature-in-English","Computer Studies","__ANY__"],count:2},
   ]},
  {name:"Early Childhood Education", faculty:"Faculty of Education", merit:60.25, catchment:{Lagos:54.775,Ogun:60,Osun:52.6}, utme:["English Language","any"], utmeReqs:req.utmeOpen,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from any",subjects:["__ANY__"],count:3},
   ]},
  {name:"Geography Education", faculty:"Faculty of Education", merit:0, catchment:{}, utme:["English Language","Geography","any"], utmeReqs:req.utmeOpen,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Geography",subjects:["Geography"],count:1},
    {label:"Best 2 electives",subjects:["Economics","Biology","Government","History","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo"],count:2},
   ]},
  {name:"History Education", faculty:"Faculty of Education", merit:53.9, catchment:{}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"History or Government",subjects:["History","Government"],count:1},
    {label:"Best 2 Arts/Social Sciences",subjects:["__ANY__"],count:2},
   ]},
  {name:"Human Kinetics & Health Education", faculty:"Faculty of Education", merit:53.35, catchment:{}, utme:["English Language","Biology","any"], utmeReqs:req.utmeBioAny,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Biology/Health Science",subjects:["Biology","Health Science","Physical Education"],count:1},
    {label:"Best 2 Science",subjects:["Physics","Chemistry","Agricultural Science","Further Mathematics","Integrated Science","Health Education"],count:2},
   ]},
  {name:"Educational Administration", faculty:"Faculty of Education", merit:58, catchment:{Lagos:50.8,Ogun:52.55,Oyo:53.125}, utme:["English Language","Economics","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Economics",subjects:["Economics"],count:1},
    {label:"Best 2 electives",subjects:["Literature-in-English","History","Government","Geography","Yoruba","Igbo","Christian Religious Studies","Islamic Religious Studies"],count:2},
   ]},
  {name:"Adult & Continuing Education", faculty:"Faculty of Education", merit:53.525, catchment:{}, utme:["English Language","any"], utmeReqs:req.utmeOpen,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from pool",subjects:["Literature-in-English","History","Government","Geography","Economics","Commerce","Yoruba","Igbo","Christian Religious Studies","Islamic Religious Studies","French","Civic Education","Social Studies","Biology","Agricultural Science","Financial Accounting","Food & Nutrition"],count:3},
   ]},
  {name:"Special Needs Education", faculty:"Faculty of Education", merit:58.2, catchment:{}, utme:["English Language","any"], utmeReqs:req.utmeOpen,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from pool",subjects:["Literature-in-English","Geography","Economics","History","Government","Yoruba","Igbo","Christian Religious Studies","Islamic Religious Studies","French","Civic Education"],count:3},
   ]},
  {name:"CRS Education", faculty:"Faculty of Education", merit:56.275, catchment:{}, utme:["English Language","any"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Christian Religious Studies",subjects:["Christian Religious Studies"],count:1},
    {label:"Best 2 electives",subjects:["Literature-in-English","Yoruba","Igbo","History","Government","French","Economics","Commerce","Geography","Civic Education","Social Studies"],count:2},
   ]},
  {name:"IRS/Islamic Studies Education", faculty:"Faculty of Education", merit:56.125, catchment:{}, utme:["English Language","any"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Islamic Religious Studies",subjects:["Islamic Religious Studies"],count:1},
    {label:"Best 2 electives",subjects:["Literature-in-English","History","Government","French","Arabic","Yoruba","Igbo","Economics","Commerce","Geography"],count:2},
   ]},
  {name:"Igbo Education", faculty:"Faculty of Education", merit:0, catchment:{}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from any",subjects:["__ANY__"],count:3},
   ]},
  {name:"Yoruba Education", faculty:"Faculty of Education", merit:62.025, catchment:{}, utme:["English Language","any Arts"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from any",subjects:["__ANY__"],count:3},
   ]},
  {name:"French Education", faculty:"Faculty of Education", merit:59.3, catchment:{}, utme:["English Language","French","any"], utmeReqs:req.utmeArts,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"French",subjects:["French"],count:1},
    {label:"Best 2 Arts/Social Sciences",subjects:["History","Government","Literature-in-English","Economics","Geography","Christian Religious Studies","Islamic Religious Studies","Yoruba","Igbo","Civic Education"],count:2},
   ]},
  {name:"Integrated Science Education", faculty:"Faculty of Education", merit:56.1, catchment:{}, utme:["English Language","Chemistry","Biology","any"], utmeReqs:req.utmeChem2Any,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Biology",subjects:["Biology"],count:1},
    {label:"Best 1 elective",subjects:["Agricultural Science","Integrated Science","Physics"],count:1},
   ]},
  {name:"Education Home Economics", faculty:"Faculty of Education", merit:58.125, catchment:{}, utme:["English Language","any"], utmeReqs:req.utmeOpen,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Chemistry",subjects:["Chemistry"],count:1},
    {label:"Biology or Agricultural Science",subjects:["Biology","Agricultural Science"],count:1},
    {label:"Best 1 elective",subjects:["Economics","Home Economics","Physics","Food & Nutrition","Clothing & Textile"],count:1},
   ]},
  {name:"Technology Education", faculty:"Faculty of Education", merit:55.125, catchment:{}, utme:["English Language","Physics","any"], utmeReqs:req.utmeEnvPhysics,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Physics or Technical Drawing",subjects:["Physics","Technical Drawing"],count:1},
    {label:"Best 2 electives",subjects:["Chemistry","Biology","Technical Drawing","Physics","Building Construction","Computer Studies"],count:2},
   ]},
  {name:"Educational Foundations (Guidance & Counselling)", faculty:"Faculty of Education", merit:60.025, catchment:{Ekiti:59.65,Lagos:54.05,Ogun:55.625,Osun:52.525,Oyo:57.575}, utme:["English Language","any"], utmeReqs:req.utmeSocial,
   requirements:[
    {label:"English Language",subjects:["English Language"],count:1},
    {label:"Mathematics",subjects:["Mathematics"],count:1},
    {label:"Best 3 from pool",subjects:["Literature-in-English","History","Government","Geography","Economics","Yoruba","Igbo","Christian Religious Studies","Islamic Religious Studies","French","Civic Education"],count:3},
   ]},
];

export const SW_STATES = ["Ekiti","Lagos","Ogun","Ondo","Osun","Oyo"];
export const ALL_STATES = [...SW_STATES, "Other"];
