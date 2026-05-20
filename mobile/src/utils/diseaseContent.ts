/**
 * Disease education content — farmer-friendly explanations.
 *
 * Each disease has two variants: English (en) and Hindi (hi).
 * The screen passes the active language; if the requested language
 * is missing, English is used as the safe fallback.
 *
 * Database-backed fields (name, symptoms, causes, prevention, treatment)
 * are also exposed here per language so that the UI can switch instantly
 * without re-running database migrations.
 */

export type DiseaseEducationContent = {
  overview: string;
  whyItHappens: string;
  firstResponse: string[];
  farmerChecklist: string[];
  callDoctorNow: string[];
};

export type DiseaseDbOverride = {
  name?: string;
  symptoms?: string[];
  causes?: string[];
  prevention?: string[];
  treatment?: string[];
};

export type Lang = 'en' | 'hi';

type LocalizedContent = {
  education: DiseaseEducationContent;
  db?: DiseaseDbOverride;
};

type AllLanguages = Record<Lang, LocalizedContent>;

// ─── English fallback (used when slug or lang is missing) ─────────────────
const FALLBACK_EN: DiseaseEducationContent = {
  overview:
    'This condition can reduce feeding, stress the stock, and quickly affect survival if pond checks are delayed. Use the symptom list as an early warning, not as a lab-confirmed diagnosis.',
  whyItHappens:
    'Most outbreaks happen when the stock is already under pressure from poor water quality, abrupt weather shifts, handling stress, or weak biosecurity.',
  firstResponse: [
    'Check dissolved oxygen, pH, temperature, and ammonia before changing medicines.',
    'Reduce stress immediately by stopping rough handling and correcting water quality first.',
    'Isolate the affected pond, net, or tank equipment from healthy stock.',
  ],
  farmerChecklist: [
    'Track whether feeding dropped suddenly or slowly over 2 to 3 days.',
    'Look for visible body changes on skin, fins, gills, shell, or swimming behavior.',
    'Note any recent stocking, transport, liming, rain event, or feed change.',
  ],
  callDoctorNow: [
    'Mortality rises for more than one day in a row.',
    'Fish or shrimp stop feeding across a large part of the pond.',
    'You see gasping, heavy lesions, or fast spread to multiple ponds.',
  ],
};

const FALLBACK_HI: DiseaseEducationContent = {
  overview:
    'यह बीमारी मछलियों के खाने में कमी, तनाव और जल्दी मौत का कारण बन सकती है यदि तालाब की समय पर जांच न की जाए। लक्षणों को शुरुआती चेतावनी के रूप में लें, ना कि पक्की बीमारी की पहचान।',
  whyItHappens:
    'ज़्यादातर बीमारियां तब फैलती हैं जब मछली पहले से ही पानी की खराब गुणवत्ता, मौसम के अचानक बदलाव, हाथ से उठाने का तनाव, या कमज़ोर तालाब हाइजीन से कमज़ोर हो।',
  firstResponse: [
    'दवा बदलने से पहले ऑक्सीजन (DO), pH, तापमान और अमोनिया की जांच करें।',
    'पकड़ने और स्थानांतरण को रोकें — पहले पानी ठीक करें।',
    'प्रभावित तालाब, जाली और बाकी सामान को स्वस्थ तालाबों से अलग रखें।',
  ],
  farmerChecklist: [
    'देखें कि क्या मछलियां 2-3 दिन में अचानक खाना कम कर रही हैं।',
    'त्वचा, पंख, गलफड़े या तैरने के तरीके में कोई बदलाव दिखे तो नोट करें।',
    'हाल का स्टॉकिंग, परिवहन, चूना डालना, बारिश या चारा बदलने का रिकॉर्ड देखें।',
  ],
  callDoctorNow: [
    'मौत एक से ज्यादा दिन तक लगातार बढ़ रही है।',
    'तालाब के बड़े हिस्से में मछलियों ने खाना बंद कर दिया है।',
    'मछलियां हवा के लिए छटपटा रही हैं, गहरे घाव हैं, या कई तालाबों में फैल रहा है।',
  ],
};

// ─── Per-disease bilingual content ────────────────────────────────────────
const CONTENT_BY_SLUG: Record<string, AllLanguages> = {
  // ─── COLUMNARIS ─────────────────────────────────────────────────────
  columnaris: {
    en: {
      education: {
        overview:
          'Columnaris is a fast-moving bacterial skin and gill infection that often starts as pale or white patches and then progresses into frayed fins, ulcers, or saddle-shaped lesions. It becomes especially dangerous in warm water when fish are already stressed.',
        whyItHappens:
          'The bacteria usually take hold after stress from crowding, low dissolved oxygen, transport, netting, dirty pond bottoms, or sudden water quality deterioration. Warm organic-rich ponds make it easier for the infection to spread.',
        firstResponse: [
          'Raise aeration and check dissolved oxygen right away.',
          'Reduce feeding for the day if fish are weak or not coming to feed.',
          'Separate handling equipment and remove badly affected mortalities quickly.',
        ],
        farmerChecklist: [
          'Look for white or grey patches near the back, mouth, or gills.',
          'Check whether fins are fraying and if fish are rubbing against pond edges.',
          'Review whether the pond recently had crowding, transport stress, or dirty water.',
        ],
        callDoctorNow: [
          'Lesions are spreading across many fish within 24 to 48 hours.',
          'Gill damage is causing gasping or fish are hanging near the inlet.',
          'Mortality starts climbing despite better aeration and water exchange.',
        ],
      },
      db: {
        name: 'Columnaris',
        symptoms: ['White or grey patches on skin', 'Frayed fins', 'Skin lesions', 'Saddle-shaped marks near back or mouth'],
        causes: ['Stress and weak immunity', 'Poor water quality', 'High organic load and sludge'],
        prevention: ['Keep DO above 5 mg/L', 'Avoid overstocking', 'Disinfect equipment between ponds'],
        treatment: ['Salt bath', 'Doctor-approved antibacterial treatment', 'Partial water exchange'],
      },
    },
    hi: {
      education: {
        overview:
          'कोलमनेरिस एक तेज़ी से फैलने वाली बैक्टीरियल बीमारी है जो मछली की त्वचा और गलफड़े पर हमला करती है। शुरू में सफेद या हल्के भूरे धब्बे दिखते हैं, फिर पंख फटने लगते हैं और शरीर पर घाव बनते हैं। गर्म पानी में और जब मछली पहले से कमज़ोर हो, यह बीमारी बहुत खतरनाक हो जाती है।',
        whyItHappens:
          'यह बैक्टीरिया तब सक्रिय होता है जब मछली तालाब में भीड़, कम ऑक्सीजन, परिवहन की थकान, गंदे तालाब का पानी, जाली से चोट, या अचानक पानी की खराब गुणवत्ता से कमज़ोर हो जाती है। गर्म और गंदा पानी इसे और तेज़ी से फैलाता है।',
        firstResponse: [
          'तुरंत एयरेटर चालू करें और ऑक्सीजन की जांच करें।',
          'अगर मछलियां कमज़ोर हैं तो आज चारा देना बंद कर दें।',
          'मरी हुई मछलियों को तुरंत निकालें और जाली को कीटाणुरहित करें।',
        ],
        farmerChecklist: [
          'पीठ, मुंह या गलफड़े के पास सफेद या भूरे धब्बे देखें।',
          'जांचें कि पंख फट रहे हैं या नहीं और मछलियां तालाब के किनारे रगड़ती हैं या नहीं।',
          'देखें कि क्या हाल ही में भीड़, परिवहन या गंदा पानी आया था।',
        ],
        callDoctorNow: [
          '1-2 दिन में कई मछलियों पर घाव फैल रहा है।',
          'गलफड़े खराब होने से मछलियां हवा के लिए सतह पर आ रही हैं।',
          'एयरेटर और पानी बदलने के बाद भी मौत हो रही है।',
        ],
      },
      db: {
        name: 'कोलमनेरिस (Columnaris)',
        symptoms: ['त्वचा पर सफेद या भूरे धब्बे', 'पंखों का फटना और कटा-फटा दिखना', 'शरीर पर घाव', 'पीठ या मुंह के पास घोड़े की काठी जैसे निशान'],
        causes: ['तनाव और मछली की कमज़ोर रोग प्रतिरोधक क्षमता', 'खराब पानी की गुणवत्ता', 'तालाब में ज़्यादा जैविक भार और कीचड़'],
        prevention: ['पानी में ऑक्सीजन (DO) 5 मिलीग्राम/लीटर से ऊपर रखें', 'तालाब में ज़्यादा भीड़ ना करें', 'जाली और सामान को कीटाणुरहित करें'],
        treatment: ['नमक का घोल देना', 'डॉक्टर की सलाह से अनुमोदित बैक्टीरिया-नाशक दवा', 'तालाब का आंशिक पानी बदलना'],
      },
    },
  },

  // ─── AEROMONAS SEPTICEMIA ───────────────────────────────────────────
  'aeromonas-septicemia': {
    en: {
      education: {
        overview:
          'Aeromonas septicemia is a serious bacterial infection that commonly shows up as reddening, bleeding patches, ulcers, swelling, or a soft bloated abdomen. Farmers usually notice that fish stop feeding and become weak before deaths increase.',
        whyItHappens:
          'It commonly appears when fish are injured or immunocompromised by high ammonia, unstable temperature, organic sludge, rough handling, or poor feed hygiene. Once fish are stressed, the bacteria can enter through damaged skin or gills.',
        firstResponse: [
          'Test ammonia and dissolved oxygen immediately and improve water quality first.',
          'Stop any unnecessary handling, grading, or transport of the stock.',
          'Keep a sample of freshly dead fish for veterinary review instead of discarding all evidence.',
        ],
        farmerChecklist: [
          'Check for red patches around fins, belly, or the base of the tail.',
          'Watch for swollen abdomens, ulcers, or fish drifting weakly near the edge.',
          'Review recent feed spoilage, ammonia spikes, or injury during netting.',
        ],
        callDoctorNow: [
          'You see open ulcers, bleeding, or sudden bloating across multiple fish.',
          'Deaths continue after emergency water correction.',
          'The pond had a recent ammonia event or strong temperature swing.',
        ],
      },
      db: {
        name: 'Aeromonas (Hemorrhagic Septicemia)',
        symptoms: ['Hemorrhage and red patches', 'Ulcers', 'Abdominal swelling'],
        causes: ['Injury and wounds', 'Temperature stress', 'High ammonia'],
        prevention: ['Stable temperature', 'Good biosecurity', 'Clean feed hygiene'],
        treatment: ['Doctor-supervised antimicrobial plan', 'Supportive mineral feed'],
      },
    },
    hi: {
      education: {
        overview:
          'एरोमोनस सेप्टीसीमिया एक गंभीर बैक्टीरियल बीमारी है जिसमें मछली के शरीर पर लाली, खून के धब्बे, घाव, सूजन या नरम फूला हुआ पेट दिखाई देता है। आमतौर पर मछलियां पहले खाना बंद करती हैं और कमज़ोर हो जाती हैं, फिर मौत बढ़ने लगती है।',
        whyItHappens:
          'यह तब फैलता है जब मछलियां ज्यादा अमोनिया, अस्थिर तापमान, गंदे तालाब के तले, हाथ से रगड़ने या खराब चारा से कमज़ोर हों। एक बार तनाव में आने पर बैक्टीरिया त्वचा या गलफड़ों के घावों से अंदर घुस जाते हैं।',
        firstResponse: [
          'तुरंत अमोनिया और ऑक्सीजन की जांच करें — पहले पानी ठीक करें।',
          'मछलियों को पकड़ना, छंटाई या परिवहन तुरंत बंद करें।',
          'जांच के लिए ताज़ा मरी हुई मछली का नमूना डॉक्टर को दिखाने के लिए रखें।',
        ],
        farmerChecklist: [
          'पंख, पेट या पूंछ के आधार पर लाल धब्बे देखें।',
          'सूजे हुए पेट, घाव या किनारे पर कमज़ोरी से तैरती मछलियों को देखें।',
          'चारा खराब होना, अमोनिया बढ़ना या जाली से चोट जैसी हाल की घटना याद करें।',
        ],
        callDoctorNow: [
          'कई मछलियों में खुले घाव, खून रिसाव या अचानक सूजन दिख रही है।',
          'पानी ठीक करने के बाद भी मौत बढ़ रही है।',
          'तालाब में हाल ही में अमोनिया बढ़ा था या तापमान में अचानक बदलाव हुआ था।',
        ],
      },
      db: {
        name: 'एरोमोनस सेप्टीसीमिया (खून बहने वाला बैक्टीरियल रोग)',
        symptoms: ['शरीर पर लाली और खून के धब्बे', 'घाव और अल्सर', 'पेट का सूजना'],
        causes: ['चोट और घाव', 'तापमान का तनाव', 'अमोनिया का बढ़ना'],
        prevention: ['तापमान स्थिर रखें', 'तालाब की बायोसिक्योरिटी बनाए रखें', 'चारे की सफाई और गुणवत्ता पर ध्यान दें'],
        treatment: ['डॉक्टर की देखरेख में एंटीबायोटिक उपचार', 'मिनरल मिश्रित सहायक चारा देना'],
      },
    },
  },

  // ─── WHITE SPOT SYNDROME (Shrimp Viral) ─────────────────────────────
  'white-spot-syndrome': {
    en: {
      education: {
        overview:
          'White Spot Syndrome is a high-risk viral shrimp disease that can wipe out a pond very quickly. Visible white spots on the shell may appear, but fast lethargy, loss of appetite, and rapid mortality are often the first signs farmers notice.',
        whyItHappens:
          'The virus spreads through infected seed, contaminated water, carriers like crabs or other crustaceans, and biosecurity breakdowns. Salinity shocks, temperature swings, low DO, and ammonia stress can trigger a sharp outbreak.',
        firstResponse: [
          'Stop new water movement between ponds and tighten farm biosecurity immediately.',
          'Stop transferring seed, nets, crates, workers, or sludge across ponds.',
          'Call your shrimp health advisor at the first sign of rapid mortality or shell spotting.',
        ],
        farmerChecklist: [
          'Check whether shrimp are swimming near the bund, surface, or pond edge.',
          'Look for reduced feeding and new white shell spots on recently sampled shrimp.',
          'Review whether any new seed, carriers, or untreated water entered the pond.',
        ],
        callDoctorNow: [
          'Mortality rises sharply within 1 to 3 days.',
          'Multiple shrimp show white shell spots and weak movement.',
          'You suspect the pond received contaminated seed or carrier organisms.',
        ],
      },
      db: {
        name: 'White Spot Syndrome',
        symptoms: ['White spots on shell', 'Lethargy and weakness', 'Rapid mass mortality'],
        causes: ['Viral infection', 'Poor biosecurity', 'Contaminated seed (PL)'],
        prevention: ['Use only PCR-screened seed', 'Strict pond disinfection', 'Filter and screen incoming water'],
        treatment: ['Emergency harvest where possible', 'Immediate shrimp specialist consultation'],
      },
    },
    hi: {
      education: {
        overview:
          'व्हाइट स्पॉट सिंड्रोम झींगा की एक बहुत खतरनाक वायरल बीमारी है जो तालाब को बहुत जल्दी पूरी तरह से बर्बाद कर सकती है। झींगे के खोल पर सफेद धब्बे दिख सकते हैं, लेकिन तेज़ी से कमज़ोरी, खाना बंद होना और तेज़ मौत पहले संकेत हैं।',
        whyItHappens:
          'यह वायरस संक्रमित बीज, गंदा पानी, केकड़े या अन्य क्रस्टेशियन वाहक, और ख़राब बायोसिक्योरिटी से फैलता है। नमक का झटका, तापमान में बदलाव, कम ऑक्सीजन और अमोनिया तनाव से तेज़ प्रकोप शुरू हो जाता है।',
        firstResponse: [
          'तालाबों के बीच पानी का आदान-प्रदान तुरंत बंद करें और बायोसिक्योरिटी सख्त करें।',
          'बीज, जाली, क्रेट, मज़दूर या कीचड़ को एक तालाब से दूसरे में ना ले जाएं।',
          'खोल पर धब्बे या तेज़ मौत के पहले संकेत पर तुरंत झींगा डॉक्टर को बुलाएं।',
        ],
        farmerChecklist: [
          'देखें कि क्या झींगे बांध, सतह या तालाब के किनारे तैर रहे हैं।',
          'खाना कम होना और हाल में नमूना झींगे पर सफेद धब्बे चेक करें।',
          'देखें कि क्या नया बीज, वाहक जीव या बिना उपचार किया पानी तालाब में आया था।',
        ],
        callDoctorNow: [
          '1-3 दिन में मौत तेज़ी से बढ़ रही है।',
          'कई झींगों में सफेद धब्बे और कमज़ोरी दिख रही है।',
          'आपको शक है कि तालाब में संक्रमित बीज या वाहक जीव आ गए हैं।',
        ],
      },
      db: {
        name: 'व्हाइट स्पॉट सिंड्रोम (झींगा का सफेद धब्बा रोग)',
        symptoms: ['खोल पर सफेद धब्बे', 'सुस्ती और कमज़ोरी', 'तेज़ी से बड़ी संख्या में मौत'],
        causes: ['वायरस का संक्रमण', 'खराब बायोसिक्योरिटी', 'दूषित बीज (सीड)'],
        prevention: ['PCR से जांचा हुआ बीज ही डालें', 'तालाब को सख्ती से कीटाणुरहित करें', 'आने वाले पानी को छानें और जांचें'],
        treatment: ['जहां संभव हो आपातकालीन कटाई करें', 'झींगा विशेषज्ञ से तुरंत सलाह लें'],
      },
    },
  },

  // ─── ICH / WHITE SPOT (Fish Parasite) ───────────────────────────────
  'ich-white-spot': {
    en: {
      education: {
        overview:
          'Ich is a parasitic disease that appears like tiny white pinhead spots on the body and fins. Fish often scratch against surfaces, breathe harder, and lose appetite because the parasite irritates the skin and gills.',
        whyItHappens:
          'It spreads most easily after new stock is introduced without quarantine or when fish face temperature shock. Stress weakens the slime coat and allows the parasite lifecycle to build up in the pond or tank.',
        firstResponse: [
          'Avoid sudden temperature fluctuations and keep handling to a minimum.',
          'Check whether any new fish were recently added without quarantine.',
          'Clean the system carefully and remove visibly weak fish if advised by a doctor.',
        ],
        farmerChecklist: [
          'Look for repeated flashing or rubbing against tank walls, nets, or bunds.',
          'Check whether white dots are scattered over fins and body instead of one patch.',
          'Review whether the outbreak followed stocking or a cold-water event.',
        ],
        callDoctorNow: [
          'Fish are gasping or white spots are spreading pond-wide.',
          'The stock is going off feed and scratching continuously.',
          'Juveniles are weakening faster than larger fish.',
        ],
      },
      db: {
        name: 'White Spot Disease (Ich)',
        symptoms: ['Tiny white pinhead-sized spots on body and fins', 'Excessive sticky mucus', 'Fish rubbing against pond edges', 'Surface gasping in heavy infections'],
        causes: ['Protozoan parasite: Ichthyophthirius multifiliis', 'Polluted pond water triggers outbreaks', 'Sudden temperature drops', 'Unquarantined new stock'],
        prevention: ['Quarantine all new stock for at least one week', 'Avoid sudden temperature changes', 'Block contaminated water inflow', 'Net pond regularly to detect early infections'],
        treatment: ['Apply quick lime (300–500 kg per hectare)', '1-hour bath in 1:5000 Formalin solution daily for 7 days', 'Improve water quality before any chemical', 'Increase aeration during treatment'],
      },
    },
    hi: {
      education: {
        overview:
          'व्हाइट स्पॉट या Ich बीमारी एक परजीवी रोग है जिसमें मछली के शरीर और पंखों पर सुई की नोक जैसे छोटे सफेद धब्बे (सिस्ट) दिखाई देते हैं। मछलियां शरीर में खुजली के कारण तालाब के किनारों पर रगड़ती हैं, ज़्यादा सांस लेती हैं और खाना कम कर देती हैं।',
        whyItHappens:
          'यह बीमारी सबसे ज़्यादा तब फैलती है जब बिना क्वारंटीन के नई मछलियां डाली जाएं या तापमान का झटका लगे। तनाव से मछली की रक्षात्मक श्लेष्म की परत कमज़ोर हो जाती है और परजीवी का जीवन-चक्र तालाब में बढ़ जाता है।',
        firstResponse: [
          'अचानक तापमान बदलने से बचें और हाथ से कम छेड़छाड़ करें।',
          'जांचें कि क्या हाल में बिना क्वारंटीन की कोई नई मछली डाली गई थी।',
          'पानी साफ रखें और डॉक्टर की सलाह पर बहुत कमज़ोर मछली अलग करें।',
        ],
        farmerChecklist: [
          'देखें कि क्या मछलियां बार-बार दीवारों, जाली या तालाब के किनारों पर रगड़ रही हैं।',
          'देखें कि सफेद धब्बे एक ही जगह नहीं बल्कि पूरे शरीर और पंखों पर बिखरे हैं।',
          'याद करें कि क्या यह बीमारी स्टॉकिंग या ठंडे पानी की घटना के बाद शुरू हुई।',
        ],
        callDoctorNow: [
          'मछलियां हवा के लिए छटपटा रही हैं या सफेद धब्बे पूरे तालाब में फैल रहे हैं।',
          'मछलियां खाना बंद कर रही हैं और लगातार खुजली कर रही हैं।',
          'छोटी मछलियां (फिंगरलिंग) बड़ी मछलियों से ज्यादा तेज़ी से कमज़ोर हो रही हैं।',
        ],
      },
      db: {
        name: 'व्हाइट स्पॉट रोग (Ich) / सफेद धब्बे',
        symptoms: ['शरीर और पंखों पर सुई की नोक जैसे छोटे सफेद धब्बे (सिस्ट)', 'त्वचा से ज़्यादा चिपचिपा श्लेष्म निकलना', 'मछलियों का तालाब के किनारों पर रगड़ना', 'भारी संक्रमण में सतह पर हवा के लिए छटपटाना'],
        causes: ['प्रोटोज़ोआ परजीवी: Ichthyophthirius multifiliis', 'गंदे तालाब के पानी से प्रकोप तेज़ होता है', 'अचानक तापमान गिरने से मछली कमज़ोर होती है', 'बिना क्वारंटीन की मछलियों का स्टॉक करना'],
        prevention: ['सभी नई मछलियों को कम से कम एक हफ्ते क्वारंटीन में रखें', 'अचानक तापमान बदलने से बचें', 'तालाब का पानी साफ रखें — गंदा पानी आना रोकें', 'जल्दी संक्रमण पकड़ने के लिए नियमित जाली से जांच करें'],
        treatment: ['चूना डालें (300-500 किलो प्रति हेक्टेयर)', '1:5000 फॉर्मेलिन के घोल में 1 घंटे के लिए 7 दिन तक बाथ', 'किसी भी रसायन से पहले पानी की गुणवत्ता सुधारें', 'उपचार के दौरान एयरेशन बढ़ाएं'],
      },
    },
  },

  // ─── SAPROLEGNIASIS ────────────────────────────────────────────────
  saprolegniasis: {
    en: {
      education: {
        overview:
          'Saprolegniasis is a fungal infection that usually looks like cotton-wool growth on fish skin, gills, or eggs. It is often a secondary problem, which means it appears after another stress event has already damaged the fish or egg surface.',
        whyItHappens:
          'Cold stress, injuries, rough handling, dead organic matter, and poor hygiene allow fungal growth to colonize damaged tissue. Hatchery eggs are especially vulnerable when water quality and disinfection routines slip.',
        firstResponse: [
          'Remove dead eggs, dead fish, and visibly decaying organic matter quickly.',
          'Improve hygiene around trays, nets, and holding systems.',
          'Reduce handling until the immediate fungal spread is under control.',
        ],
        farmerChecklist: [
          'Look for cotton-like growth on skin, fins, gills, or egg surfaces.',
          'Check whether a cold spell or rough grading happened just before the outbreak.',
          'Inspect whether dead biomass was left in the pond, hapa, or hatchery tray.',
        ],
        callDoctorNow: [
          'Egg loss is accelerating inside hatchery trays.',
          'Cotton-like growth is entering deeper tissue instead of staying superficial.',
          'Repeated fungal growth returns after basic hygiene correction.',
        ],
      },
      db: {
        name: 'Saprolegniasis (Cotton Wool Disease)',
        symptoms: ['Cotton-wool-like white growth on body, fins and gills', 'Dull whitish patches spreading across skin', 'Cotton-like fungus on hatchery eggs', 'Fish weak and refusing feed'],
        causes: ['Fungus: Saprolegnia parasitica', 'Spreads rapidly during rainy season or with contaminated water', 'Skin injuries from rough handling', 'Cold stress and dead organic matter'],
        prevention: ['Block contaminated water from entering the pond', 'Handle fish gently to prevent skin injuries', 'Remove dead fish, dead eggs, and decaying matter promptly', 'Apply lime regularly during winter and rainy season'],
        treatment: ['Treat pond with 3% salt solution', 'Spray 2.5 L Formalin + 250 g Malachite Green per 100 L water per acre', 'Feed with 5–6 g salt per kg feed for 5–6 days', 'Improve water quality and remove dead biomass'],
      },
    },
    hi: {
      education: {
        overview:
          'सेप्रोलेग्नियासिस एक फफूंदी (फंगल) रोग है जो मछली की त्वचा, गलफड़े या अंडों पर रुई जैसे सफेद धब्बों के रूप में दिखाई देता है। यह आमतौर पर दूसरी समस्या के बाद आता है — यानी पहले से किसी कारण से मछली या अंडा कमज़ोर हो तभी फंगस लगता है।',
        whyItHappens:
          'सर्दी का तनाव, चोट, हाथ से रगड़, मरी हुई बायोमास और गंदे तालाब से फंगस फैलता है। हैचरी के अंडे विशेष रूप से तब कमज़ोर होते हैं जब पानी की गुणवत्ता और सफाई का ध्यान न रखा जाए।',
        firstResponse: [
          'मरी हुई मछलियों, मरे अंडों और सड़ रही जैविक चीज़ों को तुरंत हटाएं।',
          'जाली, ट्रे और रखने वाले बर्तनों की सफाई बढ़ाएं।',
          'फंगस फैलने तक मछलियों को कम छेड़छाड़ करें।',
        ],
        farmerChecklist: [
          'त्वचा, पंख, गलफड़े या अंडों पर रुई जैसी वृद्धि देखें।',
          'जांचें कि क्या ठंड का झटका या रफ ग्रेडिंग बीमारी से ठीक पहले हुई थी।',
          'देखें कि क्या तालाब, हापा या ट्रे में मरी हुई बायोमास छोड़ी गई थी।',
        ],
        callDoctorNow: [
          'हैचरी ट्रे में अंडों का नुकसान तेज़ी से बढ़ रहा है।',
          'रुई जैसी वृद्धि सतह तक नहीं रुक रही और गहरे ऊतकों में जा रही है।',
          'सफाई के बाद भी फंगस फिर से उभर रहा है।',
        ],
      },
      db: {
        name: 'सेप्रोलेग्नियासिस / कॉटन वूल रोग (फंगल)',
        symptoms: ['शरीर, पंखों और गलफड़ों पर रुई जैसी सफेद वृद्धि', 'त्वचा पर फीके सफेद धब्बे फैलना', 'हैचरी ट्रे में अंडों पर रुई जैसा फंगस', 'मछलियों का कमज़ोर होना और चारा खाना बंद करना'],
        causes: ['फंगस: Saprolegnia parasitica', 'बरसात में या गंदा पानी आने पर तेज़ी से फैलता है', 'रफ हैंडलिंग से लगी त्वचा की चोट', 'ठंड का तनाव और तालाब में मरी हुई जैविक चीज़ें'],
        prevention: ['तालाब में गंदा पानी आना रोकें', 'त्वचा की चोट से बचने के लिए मछलियों को धीरे से हैंडल करें', 'मरी हुई मछलियां, अंडे और सड़ रही जैविक चीज़ें तुरंत हटाएं', 'सर्दी और बरसात में नियमित रूप से चूना डालें'],
        treatment: ['3% नमक के घोल से तालाब का उपचार', '2.5 लीटर फॉर्मेलिन और 250 ग्राम मैलाकाइट ग्रीन को 100 लीटर पानी में मिलाकर प्रति एकड़ छिड़काव', '5-6 ग्राम नमक प्रति किलो चारे में मिलाकर 5-6 दिन तक खिलाएं', 'पानी की गुणवत्ता सुधारें और मरी हुई बायोमास हटाएं'],
      },
    },
  },

  // ─── OXYGEN DEPLETION ──────────────────────────────────────────────
  'oxygen-depletion': {
    en: {
      education: {
        overview:
          'Oxygen depletion is an environmental emergency, not an infection. Fish or shrimp can look healthy one evening and still crash at dawn if dissolved oxygen falls too low overnight.',
        whyItHappens:
          'It usually follows algal crashes, overfeeding, high biomass, decaying sludge, cloudy weather, or weak aeration planning. Warm water makes the situation worse because oxygen demand rises while oxygen-holding capacity falls.',
        firstResponse: [
          'Start every available aerator immediately and keep water moving.',
          'Stop feeding until stock behavior normalizes.',
          'Check dawn dissolved oxygen and review pond biomass versus aeration capacity.',
        ],
        farmerChecklist: [
          'See whether fish are piping or shrimp are crowding near the inlet or paddlewheel.',
          'Review the previous night for rain, algal crash, power cut, or heavy feeding.',
          'Check sludge load and whether the pond has enough nighttime aeration.',
        ],
        callDoctorNow: [
          'You have repeated dawn stress despite extra aeration.',
          'Large stock numbers are gasping or rolling at the surface.',
          'Mortality followed a suspected algal bloom crash or power failure.',
        ],
      },
      db: {
        name: 'Oxygen Depletion (Asphyxiation)',
        symptoms: ['Surface gasping by fish', 'Crowding near inlet or aerator', 'Sudden dawn mortality'],
        causes: ['Weak aeration', 'Sudden algal crash', 'Overfeeding'],
        prevention: ['Continuous aeration', 'Disciplined feeding', 'Night-time pond checks'],
        treatment: ['Run all aerators immediately', 'Stop feed temporarily', 'Increase water exchange'],
      },
    },
    hi: {
      education: {
        overview:
          'ऑक्सीजन की कमी एक गंभीर पर्यावरणीय आपातकाल है, ना कि कोई संक्रमण। मछली या झींगा शाम को बिल्कुल स्वस्थ दिख सकता है लेकिन सुबह पानी में ऑक्सीजन कम होने से बहुत बड़ी संख्या में मर सकता है।',
        whyItHappens:
          'यह आमतौर पर शैवाल (एलगी) के अचानक नष्ट होने, ज़्यादा खाना देने, ज़्यादा बायोमास, सड़ रहे कीचड़, बादल वाले मौसम, या कमज़ोर एयरेशन योजना के कारण होता है। गर्म पानी में स्थिति और बदतर हो जाती है क्योंकि ऑक्सीजन की मांग बढ़ती है पर ऑक्सीजन रखने की क्षमता कम होती है।',
        firstResponse: [
          'सभी एयरेटर तुरंत चालू करें और पानी को हिलाते रहें।',
          'जब तक मछली का व्यवहार सामान्य नहीं हो, खाना देना बंद रखें।',
          'सुबह जल्दी ऑक्सीजन की जांच करें और बायोमास के अनुसार एयरेटर की क्षमता परखें।',
        ],
        farmerChecklist: [
          'देखें कि मछलियां सतह पर हवा ले रही हैं या झींगे एयरेटर के पास इकट्ठा हो रहे हैं।',
          'पिछली रात की बारिश, शैवाल के क्रैश, बिजली कट या ज्यादा खाना देने को याद करें।',
          'तालाब के तले में कीचड़ और रात की एयरेशन क्षमता जांचें।',
        ],
        callDoctorNow: [
          'अतिरिक्त एयरेशन के बावजूद बार-बार सुबह तनाव हो रहा है।',
          'बड़ी संख्या में मछलियां सतह पर सांस ले रही हैं या लुढ़क रही हैं।',
          'शैवाल के क्रैश या बिजली फेल होने के बाद मौत हुई है।',
        ],
      },
      db: {
        name: 'ऑक्सीजन की कमी (दम घुटना)',
        symptoms: ['मछलियों का सतह पर हवा के लिए छटपटाना', 'पानी आने वाले स्थान या एयरेटर के पास भीड़', 'सुबह जल्दी अचानक मौत'],
        causes: ['कमज़ोर एयरेशन', 'शैवाल (एलगी) का अचानक नष्ट होना', 'ज़्यादा खाना देना'],
        prevention: ['लगातार एयरेशन रखें', 'चारा अनुशासन से दें', 'रात में जांच करें'],
        treatment: ['तुरंत एयरेटर चालू करें', 'थोड़े समय के लिए चारा देना बंद करें', 'पानी का आदान-प्रदान बढ़ाएं'],
      },
    },
  },

  // ─── AMMONIA TOXICITY ──────────────────────────────────────────────
  'ammonia-toxicity': {
    en: {
      education: {
        overview:
          'Ammonia toxicity is a water quality poisoning issue that damages gills, reduces feeding, and makes the stock weak and restless. Farmers often mistake it for infection because fish or shrimp become sluggish and start surfacing.',
        whyItHappens:
          'It builds up when feed input, sludge, and biomass rise faster than the system can nitrify or exchange water. High pH and warm temperatures also make toxic unionized ammonia more dangerous.',
        firstResponse: [
          'Reduce feed immediately and test ammonia, pH, and temperature together.',
          'Improve aeration and water exchange if the system allows it safely.',
          'Use pond-bottom cleanup and corrective water management before chasing medicines.',
        ],
        farmerChecklist: [
          'Look for gill irritation, slow feeding, piping, or unexplained restlessness.',
          'Check whether pH is high in the afternoon and whether sludge has accumulated.',
          'Review recent overfeeding, heavy stocking, or filtration weakness.',
        ],
        callDoctorNow: [
          'Ammonia remains high after water correction steps.',
          'Fish or shrimp are surfacing repeatedly and feeding has collapsed.',
          'The pond also shows red gills, secondary lesions, or continued mortality.',
        ],
      },
      db: {
        name: 'Ammonia Toxicity',
        symptoms: ['Gill irritation', 'Surface piping', 'Reduced feeding'],
        causes: ['Overfeeding', 'High biomass and stocking', 'Weak nitrification (poor probiotic activity)'],
        prevention: ['Regular sludge removal', 'Apply pond probiotics', 'Optimize feed input'],
        treatment: ['Reduce feed by 50%', 'Apply zeolite (10–20 kg per hectare)', 'Exchange 25–50% pond water', 'Apply pond probiotics', 'Increase aeration'],
      },
    },
    hi: {
      education: {
        overview:
          'अमोनिया विषाक्तता पानी की गुणवत्ता का ज़हर है जो गलफड़ों को नुकसान पहुंचाता है, खाना कम कर देता है और मछली या झींगे को कमज़ोर तथा बेचैन कर देता है। किसान अक्सर इसे संक्रमण समझ लेते हैं क्योंकि मछलियां सुस्त होकर सतह पर आने लगती हैं।',
        whyItHappens:
          'यह तब बनता है जब चारा, कीचड़ और बायोमास इतनी तेज़ी से बढ़ें कि सिस्टम नाइट्रिफिकेशन या पानी का आदान-प्रदान न कर सके। ज़्यादा pH और गर्म तापमान से ज़हरीली अमोनिया और अधिक खतरनाक हो जाती है।',
        firstResponse: [
          'चारा तुरंत कम करें और अमोनिया, pH और तापमान साथ-साथ जांचें।',
          'सुरक्षित हो तो एयरेशन और पानी बदलना बढ़ाएं।',
          'दवा खोजने से पहले तालाब के तले की सफाई और पानी सुधार करें।',
        ],
        farmerChecklist: [
          'गलफड़ों में जलन, धीमा खाना, सतह पर हवा लेना, या अनजान बेचैनी देखें।',
          'दोपहर में pH ज़्यादा है क्या और तले में कीचड़ जमा है क्या जांचें।',
          'हाल का ज़्यादा खाना, ज्यादा स्टॉकिंग या फिल्टर की कमज़ोरी याद करें।',
        ],
        callDoctorNow: [
          'पानी सुधार के बाद भी अमोनिया ज्यादा बना है।',
          'मछली या झींगा बार-बार सतह पर आ रहे हैं और खाना पूरी तरह बंद हो गया है।',
          'तालाब में लाल गलफड़े, घाव या लगातार मौत भी दिख रही है।',
        ],
      },
      db: {
        name: 'अमोनिया विषाक्तता',
        symptoms: ['गलफड़ों में जलन', 'सतह पर हवा लेना', 'चारा खाना कम कर देना'],
        causes: ['ज़्यादा खाना देना', 'ज़्यादा बायोमास और स्टॉकिंग', 'कमज़ोर नाइट्रिफिकेशन (तालाब प्रोबायोटिक्स की कमी)'],
        prevention: ['नियमित रूप से तले की कीचड़ साफ करें', 'प्रोबायोटिक्स डालें', 'चारा सोच-समझकर दें'],
        treatment: ['चारा 50% कम करें', 'जिओलाइट डालें (10-20 किलो प्रति हेक्टेयर)', 'तालाब का 25-50% पानी बदलें', 'प्रोबायोटिक्स डालें', 'एयरेशन बढ़ाएं'],
      },
    },
  },
};

/**
 * Get farmer-friendly educational content for a disease.
 * Falls back to English if Hindi is missing for a slug.
 */
export function getDiseaseEducationContent(
  slug?: string,
  lang: Lang = 'en'
): DiseaseEducationContent {
  const normalizedSlug = slug?.trim().toLowerCase() ?? '';
  const entry = CONTENT_BY_SLUG[normalizedSlug];
  if (!entry) {
    return lang === 'hi' ? FALLBACK_HI : FALLBACK_EN;
  }
  return entry[lang]?.education ?? entry.en?.education ?? FALLBACK_EN;
}

/**
 * Get the localized DB-side fields (name, symptoms, causes, etc.) for a disease.
 * Returns undefined if no override exists — the caller should fall back to the
 * raw DB row in that case.
 */
export function getDiseaseDbOverride(
  slug?: string,
  lang: Lang = 'en'
): DiseaseDbOverride | undefined {
  const normalizedSlug = slug?.trim().toLowerCase() ?? '';
  const entry = CONTENT_BY_SLUG[normalizedSlug];
  if (!entry) return undefined;
  return entry[lang]?.db ?? entry.en?.db;
}

// ─── Indian aquaculture diseases (Bihar / India focused) ───────────────────
// To keep this file readable, the 11 Indian-specific diseases have their
// full content in a companion module. The default export merges them.

import { INDIAN_DISEASE_CONTENT } from './diseaseContentIndian';
import { PANGASIUS_DISEASE_CONTENT } from './diseaseContentPangasius';

Object.assign(CONTENT_BY_SLUG, INDIAN_DISEASE_CONTENT);
Object.assign(CONTENT_BY_SLUG, PANGASIUS_DISEASE_CONTENT);
