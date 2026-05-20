/**
 * Indian aquaculture diseases — bilingual (English / Hindi) content.
 * Sourced from ICAR / Bihar fisheries extension material and rewritten
 * in farmer-friendly language for both languages.
 */

type LocalizedContent = {
  education: {
    overview: string;
    whyItHappens: string;
    firstResponse: string[];
    farmerChecklist: string[];
    callDoctorNow: string[];
  };
  db?: {
    name?: string;
    symptoms?: string[];
    causes?: string[];
    prevention?: string[];
    treatment?: string[];
  };
};

type AllLanguages = { en: LocalizedContent; hi: LocalizedContent };

export const INDIAN_DISEASE_CONTENT: Record<string, AllLanguages> = {
  // ─── EUS / RED SPOT ─────────────────────────────────────────────────
  'eus-red-spot': {
    en: {
      education: {
        overview:
          'EUS, also called Red Spot Disease, is one of the most common and damaging diseases in Indian fish ponds. It starts as small red spots that slowly grow into deep open wounds where skin and scales peel off. Affected fish often jump out of the water and stop feeding.',
        whyItHappens:
          'It is mostly caused by a fungus (Aphanomyces invadans) but is usually a mixed infection involving viruses, bacteria, and protozoans. Outbreaks are triggered by entry of dirty rainy-season water, cold stress, and weak fish immunity.',
        firstResponse: [
          'Block any inflow of contaminated water immediately.',
          'Apply quick lime to the pond at 200 to 600 kg per hectare based on water pH.',
          'Stop feeding for a day or two if many fish are weak.',
          'Remove and bury dead or dying fish in a pit far from the pond.',
        ],
        farmerChecklist: [
          'Look for red spots on Rohu, Catla, Mrigal, or local catfish species.',
          'Check whether the outbreak followed heavy rains or contaminated water entry.',
          'Note if fish are jumping or rubbing against pond banks.',
        ],
        callDoctorNow: [
          'Wounds are spreading rapidly across many fish.',
          'Mortality continues even after liming and water correction.',
          'Multiple species in the pond are affected at the same time.',
        ],
      },
      db: {
        name: 'EUS / Red Spot Disease',
        symptoms: ['Red spot-like wounds on body that gradually spread', 'Deep wounds in chronic stages with skin and scales falling off', 'Fish jumping at the water surface', 'Reduced feeding and slow growth'],
        causes: ['Primary cause: fungus Aphanomyces invadans', 'Often a mixed infection with virus, bacteria and protozoans', 'Triggered by contaminated water in monsoon', 'Cold stress and weak fish immunity'],
        prevention: ['Block contaminated water from entering the pond', 'Apply quick lime periodically (200–600 kg/ha based on pH)', 'Net the pond once a month in summer, twice in winter', 'Stock disease-free, well-acclimatized seed only'],
        treatment: ['Apply CIFAX (3–4 litres per hectare)', 'Apply Sokrina WS (5–10 litres per hectare)', 'Apply quick lime (200–600 kg/ha based on pH)', 'Use Potassium Permanganate plus salt combination as advised'],
      },
    },
    hi: {
      education: {
        overview:
          'EUS, जिसे लाल धब्बे की बीमारी (Red Spot Disease) भी कहते हैं, भारतीय तालाबों में सबसे आम और घातक मछली रोगों में से एक है। शुरू में छोटे लाल धब्बे होते हैं जो धीरे-धीरे बड़े गहरे घावों में बदल जाते हैं जहां त्वचा और शल्क (स्केल) उतर जाते हैं। प्रभावित मछलियां पानी से बाहर कूदती हैं और खाना बंद कर देती हैं।',
        whyItHappens:
          'यह मुख्य रूप से एक फंगस (Aphanomyces invadans) से होती है, लेकिन साथ में वायरस, बैक्टीरिया और प्रोटोज़ोआ का मिला-जुला संक्रमण भी होता है। बरसाती मौसम में गंदा पानी आने, ठंड का तनाव और मछली की कमज़ोर रोग प्रतिरोधक क्षमता से प्रकोप शुरू होता है।',
        firstResponse: [
          'गंदे पानी का तालाब में आना तुरंत रोकें।',
          'पानी के pH के अनुसार 200-600 किलो प्रति हेक्टेयर चूना डालें।',
          'अगर बहुत सी मछलियां कमज़ोर हैं तो 1-2 दिन खाना बंद करें।',
          'मरी या मरती हुई मछलियों को तालाब से दूर गड्ढे में दफना दें।',
        ],
        farmerChecklist: [
          'रोहू, कतला, मृगल या स्थानीय कैटफिश पर लाल धब्बे देखें।',
          'जांचें कि क्या यह प्रकोप तेज़ बारिश या गंदा पानी आने के बाद शुरू हुआ।',
          'देखें कि क्या मछलियां कूद रही हैं या तालाब के किनारे रगड़ रही हैं।',
        ],
        callDoctorNow: [
          'कई मछलियों पर घाव बहुत तेज़ी से फैल रहे हैं।',
          'चूना और पानी सुधार के बाद भी मौत जारी है।',
          'तालाब में कई प्रजातियां एक साथ प्रभावित हो रही हैं।',
        ],
      },
      db: {
        name: 'EUS / लाल धब्बे की बीमारी',
        symptoms: ['शरीर पर लाल धब्बे जैसे घाव जो धीरे-धीरे फैलते हैं', 'गंभीर अवस्था में गहरे घाव बनना और त्वचा-स्केल का गिरना', 'मछलियों का पानी की सतह से बाहर कूदना', 'चारा कम खाना और धीमी ग्रोथ'],
        causes: ['मुख्य कारण: फंगस Aphanomyces invadans', 'अक्सर वायरस, बैक्टीरिया और प्रोटोज़ोआ का मिला-जुला संक्रमण', 'बरसात में गंदा पानी आने से प्रकोप शुरू होता है', 'ठंड का तनाव और कमज़ोर रोग प्रतिरोधक क्षमता'],
        prevention: ['तालाब में गंदा पानी आना रोकें', 'समय-समय पर चूना डालें (pH के अनुसार 200-600 किलो प्रति हेक्टेयर)', 'गर्मियों में महीने में एक बार और सर्दियों में दो बार जाली डालें', 'सिर्फ रोग-मुक्त, ठीक से अभ्यस्त बीज (सीड) ही स्टॉक करें'],
        treatment: ['CIFAX डालें (3-4 लीटर प्रति हेक्टेयर)', 'Sokrina WS डालें (5-10 लीटर प्रति हेक्टेयर)', 'चूना डालें (pH के अनुसार 200-600 किलो प्रति हेक्टेयर)', 'सलाह अनुसार Potassium Permanganate और नमक का संयोजन'],
      },
    },
  },

  // ─── DROPSY ─────────────────────────────────────────────────────────
  dropsy: {
    en: {
      education: {
        overview:
          'Dropsy is a serious bacterial infection where the fish body and belly look swollen because of fluid build-up. The scales often stand out like a pinecone and the eyes may bulge out. It affects all major Indian carp species.',
        whyItHappens:
          'It is caused by bacteria (Aeromonas hydrophila and Aeromonas punctata) that take advantage when fish are stressed by poor water quality, ammonia spikes, or rough handling. Wounds from netting let the bacteria into the body.',
        firstResponse: [
          'Test water quality (especially ammonia) and improve it before applying chemicals.',
          'Stop netting and rough handling immediately.',
          'Isolate visibly swollen or weak fish if possible.',
        ],
        farmerChecklist: [
          'Look for swollen belly, bulging eyes, and standing-out scales.',
          'Check whether handling, transport, or stocking happened recently.',
          'Note any ammonia smell or sludge build-up at the pond bottom.',
        ],
        callDoctorNow: [
          'Multiple fish show severe swelling within 1 to 2 days.',
          'Antibiotic course is needed — only under doctor advice.',
          'Mortality continues despite improved water quality.',
        ],
      },
      db: {
        name: 'Dropsy (Bacterial Hemorrhagic Septicemia)',
        symptoms: ['Swollen body and abdomen from fluid build-up', 'Scales standing out like pinecone', 'Bulging eyes (exophthalmia)', 'Disrupted blood vessels under skin', 'Reduced feeding and slow movement'],
        causes: ['Bacteria: Aeromonas hydrophila and Aeromonas punctata', 'Stress from poor water quality, ammonia spikes or rough handling', 'Wounds from netting let bacteria enter'],
        prevention: ['Maintain good water quality', 'Avoid rough handling and netting injuries', 'Disinfect nets, crates and equipment between uses', 'Apply lime regularly to keep pH stable'],
        treatment: ['1–4 mg/L Potassium Permanganate bath for 2 minutes daily for 1 week', 'Antibiotic course only under doctor supervision', 'Reduce feed during treatment'],
      },
    },
    hi: {
      education: {
        overview:
          'ड्रॉपसी एक गंभीर बैक्टीरियल बीमारी है जिसमें मछली का शरीर और पेट तरल पदार्थ इकट्ठा होने से सूजे हुए दिखते हैं। शल्क (स्केल) शरीर से बाहर निकलकर पाइनकोन जैसा दिखता है और आंखें बाहर निकल आती हैं। यह बीमारी सभी प्रमुख भारतीय कार्प मछलियों को प्रभावित करती है।',
        whyItHappens:
          'यह बैक्टीरिया (Aeromonas hydrophila और Aeromonas punctata) से होती है जो तब फैलते हैं जब मछलियां खराब पानी, अमोनिया स्पाइक या रफ हैंडलिंग से तनाव में हों। जाली से लगे घाव बैक्टीरिया को शरीर में घुसने का रास्ता देते हैं।',
        firstResponse: [
          'पानी की गुणवत्ता (विशेष रूप से अमोनिया) जांचें और दवा से पहले उसे ठीक करें।',
          'जाली से पकड़ना और रफ हैंडलिंग तुरंत बंद करें।',
          'अगर संभव हो तो साफ तौर पर सूजी या कमज़ोर मछलियों को अलग करें।',
        ],
        farmerChecklist: [
          'सूजा हुआ पेट, बाहर निकली हुई आंखें और बाहर खड़े शल्क देखें।',
          'देखें कि क्या हाल में हैंडलिंग, परिवहन या स्टॉकिंग हुई थी।',
          'तालाब के तले पर अमोनिया की गंध या कीचड़ जमाव देखें।',
        ],
        callDoctorNow: [
          '1-2 दिन में कई मछलियों में गंभीर सूजन दिख रही है।',
          'एंटीबायोटिक की ज़रूरत है — सिर्फ डॉक्टर की सलाह पर।',
          'पानी सुधार के बाद भी मौत बनी हुई है।',
        ],
      },
      db: {
        name: 'ड्रॉपसी (बैक्टीरियल हेमरेजिक सेप्टीसीमिया)',
        symptoms: ['शरीर और पेट में तरल जमा होने से सूजा हुआ दिखना', 'शल्क (स्केल) बाहर खड़े होकर पाइनकोन जैसा दिखना', 'आंखों का बाहर निकलना', 'त्वचा के नीचे फैले या टूटे हुए खून के धागे', 'चारा कम और धीमी हलचल'],
        causes: ['बैक्टीरिया: Aeromonas hydrophila और Aeromonas punctata', 'खराब पानी, अमोनिया या रफ हैंडलिंग से तनाव', 'जाली से लगी चोट से बैक्टीरिया अंदर घुसते हैं'],
        prevention: ['नियमित निगरानी से पानी की गुणवत्ता बनाए रखें', 'रफ हैंडलिंग और जाली से लगी चोट से बचें', 'जाली, क्रेट और सामान को कीटाणुरहित करें', 'pH स्थिर रखने के लिए नियमित चूना डालें'],
        treatment: ['1-4 मिलीग्राम/लीटर Potassium Permanganate में 2 मिनट का बाथ — 1 हफ्ते तक रोज़', 'सिर्फ डॉक्टर की देखरेख में एंटीबायोटिक कोर्स', 'उपचार के दौरान चारा कम करें'],
      },
    },
  },

  // ─── TAIL ROT / FIN ROT ─────────────────────────────────────────────
  'tail-fin-rot': {
    en: {
      education: {
        overview:
          'Tail Rot and Fin Rot are bacterial diseases where the tail and fins start rotting and become ragged with white edges. It is very common in Indian carps when ponds become crowded or dirty in summer.',
        whyItHappens:
          'Caused by bacteria (Aeromonas and Pseudomonas species) that take hold after handling injuries, overcrowding, low oxygen, or dirty water. Warm weather and high organic load make it spread faster.',
        firstResponse: [
          'Increase aeration and check that dissolved oxygen is above 5 mg per litre.',
          'Reduce feed slightly until fish recover.',
          'Disinfect nets and equipment before moving between ponds.',
        ],
        farmerChecklist: [
          'Check whether tail or fin edges look frayed or whitish.',
          'Note any recent crowding, transport, or rough netting.',
          'Look at pond bottom for excess sludge or uneaten feed.',
        ],
        callDoctorNow: [
          'Rotting is spreading deeper into the body.',
          'Multiple fish are affected at once.',
          'Standard Potassium Permanganate baths are not helping after a week.',
        ],
      },
      db: {
        name: 'Tail Rot / Fin Rot',
        symptoms: ['Tail and fins start rotting', 'White lines or edges on fins', 'Frayed and ragged fin margins', 'Fish stay near bottom and feed less'],
        causes: ['Bacteria: Aeromonas and Pseudomonas species', 'Poor water hygiene and high organic load', 'Crowding and physical injury'],
        prevention: ['Keep DO above 5 mg/L', 'Avoid overstocking and rough handling', 'Disinfect equipment between ponds', 'Apply lime to control bacterial load'],
        treatment: ['10–20 mg/L Potassium Permanganate bath for 1 hour daily for 7–10 days', '500 mg/L Copper Sulphate bath for 10–15 days as advised', 'Improve water quality before any chemical treatment'],
      },
    },
    hi: {
      education: {
        overview:
          'टेल रॉट और फिन रॉट बैक्टीरियल बीमारियां हैं जिनमें मछली की पूंछ और पंख सड़ने लगते हैं और सफेद किनारों के साथ कटे-फटे हो जाते हैं। यह भारतीय कार्प मछलियों में बहुत आम है, खासकर जब गर्मियों में तालाब में भीड़ या गंदगी हो।',
        whyItHappens:
          'यह बैक्टीरिया (Aeromonas और Pseudomonas) से होती है जो हैंडलिंग से लगी चोट, ज़्यादा भीड़, कम ऑक्सीजन या गंदे पानी के बाद मछली पर हमला करते हैं। गर्म मौसम और ज़्यादा जैविक भार से यह तेज़ी से फैलती है।',
        firstResponse: [
          'एयरेशन बढ़ाएं और जांचें कि ऑक्सीजन 5 मिलीग्राम/लीटर से ऊपर है।',
          'जब तक मछलियां ठीक न हों, चारा थोड़ा कम करें।',
          'अलग-अलग तालाबों में जाने से पहले जाली और सामान कीटाणुरहित करें।',
        ],
        farmerChecklist: [
          'पूंछ या पंख के किनारों पर फटन या सफेदी देखें।',
          'हाल की भीड़, परिवहन या जाली से रफ निकासी याद करें।',
          'तालाब के तले पर अतिरिक्त कीचड़ या बचा हुआ चारा देखें।',
        ],
        callDoctorNow: [
          'सड़न शरीर के अंदरूनी हिस्से तक फैल रही है।',
          'एक साथ कई मछलियां प्रभावित हो रही हैं।',
          'एक हफ्ते के Potassium Permanganate बाथ के बाद भी फायदा नहीं हुआ।',
        ],
      },
      db: {
        name: 'टेल रॉट / फिन रॉट (पूंछ-पंख सड़न)',
        symptoms: ['पूंछ और पंखों का सड़ने लगना', 'पंखों पर सफेद रेखाएं या किनारे', 'पंखों के किनारे फटे और कटे-फटे', 'मछलियों का तले पर रहना और कम खाना'],
        causes: ['बैक्टीरिया: Aeromonas और Pseudomonas प्रजातियां', 'पानी की खराब साफ-सफाई और ज़्यादा जैविक भार', 'भीड़ और हैंडलिंग से लगी चोट'],
        prevention: ['ऑक्सीजन (DO) 5 मिलीग्राम/लीटर से ऊपर रखें', 'ज़्यादा भीड़ और रफ हैंडलिंग से बचें', 'तालाबों के बीच सामान कीटाणुरहित करें', 'बैक्टीरिया भार कम करने के लिए चूना डालें'],
        treatment: ['10-20 मिलीग्राम/लीटर Potassium Permanganate में 1 घंटे का बाथ — 7-10 दिन तक रोज़', '500 मिलीग्राम/लीटर Copper Sulphate बाथ 10-15 दिन तक', 'किसी भी रासायनिक उपचार से पहले पानी की गुणवत्ता सुधारें'],
      },
    },
  },

  // ─── ARGULOSIS (Fish Louse) ─────────────────────────────────────────
  argulosis: {
    en: {
      education: {
        overview:
          'Argulosis or Fish Louse infection is a parasitic disease where small disc-shaped insects (Argulus) attach to the body and fins of the fish. They suck blood from the fish, causing irritation and small red wounds.',
        whyItHappens:
          'It spreads through infected fish, contaminated water, or dirty nets. It is especially common in muddy and polluted ponds, and breeders are often the first to get infected.',
        firstResponse: [
          'Avoid bringing in unquarantined fish from other ponds.',
          'Net the pond regularly to spot early infestations.',
          'Disinfect any equipment shared between ponds.',
        ],
        farmerChecklist: [
          'Look for tiny disc-shaped insects on the body, fins, or gill area.',
          'Notice if fish are rubbing against pond edges or showing extra mucus.',
          'Check breeders carefully — they get infected first.',
        ],
        callDoctorNow: [
          'The infestation has spread to most fish in the pond.',
          'Chemical treatment (Dipterex) is needed — apply only under guidance.',
          'You see open wounds where parasites have detached.',
        ],
      },
      db: {
        name: 'Argulosis (Fish Louse)',
        symptoms: ['Small insect-like parasites on body and fins', 'Excessive mucus secretion', 'Fish rubbing along pond edges', 'Small red wounds where parasites attached'],
        causes: ['External parasite: Argulus species', 'Common in muddy and polluted ponds', 'Spreads through infected fish, water or contaminated nets'],
        prevention: ['Quarantine new fish before stocking', 'Net regularly to detect early infection', 'Keep pond bottom clean and dry pond every 3 years'],
        treatment: ['Apply Dipterex (0.2 mg/L) under expert guidance', 'Manual removal for small batches', 'Potassium Permanganate bath as advised'],
      },
    },
    hi: {
      education: {
        overview:
          'अरगुलोसिस या मछली जूं (Fish Louse) एक परजीवी बीमारी है जिसमें छोटे डिस्क के आकार के कीड़े (Argulus) मछली के शरीर और पंखों पर चिपक जाते हैं। ये मछली का खून चूसते हैं जिससे जलन और छोटे लाल घाव हो जाते हैं।',
        whyItHappens:
          'यह संक्रमित मछलियों, गंदे पानी या गंदी जाली से फैलती है। यह विशेष रूप से कीचड़ भरे और प्रदूषित तालाबों में आम है, और प्रजनक मछलियां सबसे पहले संक्रमित होती हैं।',
        firstResponse: [
          'दूसरे तालाबों से बिना क्वारंटीन की मछलियां लाने से बचें।',
          'जल्दी संक्रमण पकड़ने के लिए नियमित रूप से जाली से जांच करें।',
          'तालाबों के बीच साझा सामान को कीटाणुरहित करें।',
        ],
        farmerChecklist: [
          'शरीर, पंख या गलफड़े के पास छोटे डिस्क के आकार के कीड़े देखें।',
          'देखें कि क्या मछलियां तालाब के किनारों पर रगड़ रही हैं या ज्यादा श्लेष्म दिख रहा है।',
          'प्रजनकों को ध्यान से जांचें — वे पहले संक्रमित होते हैं।',
        ],
        callDoctorNow: [
          'संक्रमण ज़्यादातर मछलियों में फैल चुका है।',
          'रासायनिक उपचार (Dipterex) की ज़रूरत है — सिर्फ डॉक्टर की सलाह पर।',
          'जहां परजीवी छोड़ कर गए हैं, वहां खुले घाव दिख रहे हैं।',
        ],
      },
      db: {
        name: 'अरगुलोसिस / मछली जूं',
        symptoms: ['शरीर और पंखों पर छोटे कीड़े जैसे परजीवी', 'त्वचा से ज़्यादा श्लेष्म निकलना', 'मछलियों का तालाब के किनारों पर रगड़ना', 'जहां परजीवी चिपके थे वहां छोटे लाल घाव'],
        causes: ['बाहरी परजीवी: Argulus प्रजाति', 'कीचड़ भरे प्रदूषित तालाबों में आम', 'संक्रमित मछली, पानी या गंदी जाली से फैलता है'],
        prevention: ['नई मछलियों को क्वारंटीन करें', 'नियमित जाली से जांच करें', 'हर 3 साल में तालाब को सुखाएं'],
        treatment: ['विशेषज्ञ की सलाह से Dipterex (0.2 मिलीग्राम/लीटर) डालें', 'छोटे बैच के लिए हाथ से परजीवी निकालें', 'सलाह अनुसार Potassium Permanganate बाथ'],
      },
    },
  },

  // ─── LERNAEOSIS (Anchor Worm) ───────────────────────────────────────
  lernaeosis: {
    en: {
      education: {
        overview:
          'Lernaeosis or Anchor Worm disease is a parasitic infection where long thread-like worms attach to the body and fins of fish. The worms cause skin to rot around the attachment site and the fish become very restless.',
        whyItHappens:
          'Caused by Lernaea parasites that enter the pond with polluted or unfiltered water. It is common during and after the monsoon when contaminated water flows into the pond.',
        firstResponse: [
          'Block all sources of contaminated water entering the pond.',
          'Filter or screen incoming water.',
          'Net the pond and inspect fish weekly during the monsoon.',
        ],
        farmerChecklist: [
          'Look for thread-like worms hanging from the body or fins.',
          'Notice if fish are rubbing on the pond bottom.',
          'Check whether recent rains caused water flow into the pond.',
        ],
        callDoctorNow: [
          'Many fish are infested — chemical treatment is needed.',
          'Wounds at attachment sites are turning into ulcers.',
          'Mortality is starting among smaller fingerlings.',
        ],
      },
      db: {
        name: 'Lernaeosis (Anchor Worm)',
        symptoms: ['Long thread-like worms on body and fins', 'Skin rotting around attachment points', 'Fish rubbing on pond bottom', 'Open red wounds on body'],
        causes: ['Parasite: Lernaea species', 'Polluted water entering pond', 'Spreads via infected wild fish and unfiltered water'],
        prevention: ['Block contaminated water entry', 'Filter or screen all incoming water', 'Net the pond regularly during summer'],
        treatment: ['Spray Gammexane (1 mg/L) under expert supervision', 'Spray Dipterex (0.2 mg/L) as advised', 'Manual removal for valuable broodstock'],
      },
    },
    hi: {
      education: {
        overview:
          'लर्नियोसिस या एंकर वर्म रोग एक परजीवी बीमारी है जिसमें लंबे धागे जैसे कीड़े मछली के शरीर और पंखों से चिपके दिखते हैं। ये कीड़े जहां चिपकते हैं वहां की त्वचा सड़ने लगती है और मछलियां बहुत बेचैन हो जाती हैं।',
        whyItHappens:
          'यह Lernaea परजीवी से होती है जो गंदा या बिना फिल्टर किया हुआ पानी तालाब में आने पर अंदर घुस जाता है। यह बरसात के दौरान और बाद में आम होता है जब बाहर का पानी तालाब में बहता है।',
        firstResponse: [
          'गंदे पानी के सभी स्रोतों को तालाब में आने से रोकें।',
          'आने वाले पानी को फिल्टर या जाली से छानें।',
          'बरसात के दौरान हफ्ते में एक बार जाली से मछलियां जांचें।',
        ],
        farmerChecklist: [
          'शरीर या पंखों से लटकते धागे जैसे कीड़े देखें।',
          'देखें कि क्या मछलियां तालाब के तले पर रगड़ रही हैं।',
          'जांचें कि क्या हाल की बारिश से तालाब में पानी आया था।',
        ],
        callDoctorNow: [
          'कई मछलियों पर परजीवी हैं — रासायनिक उपचार की ज़रूरत है।',
          'चिपकने वाली जगहों पर घाव अल्सर बन रहे हैं।',
          'छोटी मछलियों (फिंगरलिंग) में मौत शुरू हो रही है।',
        ],
      },
      db: {
        name: 'लर्नियोसिस / एंकर वर्म',
        symptoms: ['शरीर और पंखों से लंबे धागे जैसे कीड़े लटके', 'चिपकने की जगह पर त्वचा सड़ना', 'मछलियों का तले पर रगड़ना', 'शरीर पर खुले लाल घाव'],
        causes: ['परजीवी: Lernaea प्रजाति', 'गंदा पानी तालाब में आने से प्रकोप', 'संक्रमित जंगली मछली और बिना फिल्टर किए पानी से'],
        prevention: ['गंदा पानी तालाब में आना रोकें', 'आने वाले सभी पानी को छानें', 'गर्मियों में नियमित जाली से जांच करें'],
        treatment: ['विशेषज्ञ निगरानी में Gammexane (1 मिलीग्राम/लीटर) छिड़काव', 'सलाह अनुसार Dipterex (0.2 मिलीग्राम/लीटर)', 'मूल्यवान प्रजनकों के लिए हाथ से निकालना'],
      },
    },
  },

  // ─── LEECH INFECTION ────────────────────────────────────────────────
  'leech-infection': {
    en: {
      education: {
        overview:
          'Leech Infection happens when brown or black leeches (5 to 15 mm) attach to the body, gills, fins, or mouth of fish to suck blood. Affected fish become weak, lose weight, and produce excessive mucus.',
        whyItHappens:
          'Leeches thrive in muddy, polluted pond bottoms with heavy organic sludge. Ponds that have not been dried and cleaned in years are most affected.',
        firstResponse: [
          'Check pond bottom for excess sludge and organic build-up.',
          'Apply lime to clean the bottom.',
          'Remove badly affected fish if possible.',
        ],
        farmerChecklist: [
          'Look for small worm-like leeches on body, gills, or mouth.',
          'Check the pond bottom for thick black sludge.',
          'Note when the pond was last fully dried and cleaned.',
        ],
        callDoctorNow: [
          'Leech infestation is heavy across the pond.',
          'Chemical treatment is needed.',
          'You may need to drain and dry the entire pond.',
        ],
      },
      db: {
        name: 'Leech Infection',
        symptoms: ['Brown or black leeches (5–15 mm) on body, gills, fins or mouth', 'Excessive mucus secretion', 'Fish rubbing against hard objects', 'Weight loss and reduced growth'],
        causes: ['External parasitic worms (leeches)', 'Muddy and polluted pond bottoms', 'Heavy organic sludge build-up'],
        prevention: ['Dry pond and remove half foot of bottom mud every 3 years', 'Apply lime regularly', 'Avoid muddy or sewage water inflow'],
        treatment: ['Spray Glacial Acetic Acid (1.0 ml/L) under guidance', 'Apply Copper Sulphate (500 g per hectare)', 'Drain and dry the pond as last resort'],
      },
    },
    hi: {
      education: {
        overview:
          'जोंक संक्रमण तब होता है जब भूरे या काले जोंक (5 से 15 मिमी) मछली के शरीर, गलफड़े, पंख या मुंह से चिपककर खून चूसते हैं। प्रभावित मछलियां कमज़ोर हो जाती हैं, वज़न घटता है और ज़्यादा श्लेष्म निकलता है।',
        whyItHappens:
          'जोंक कीचड़ भरे, प्रदूषित तालाब के तले में पनपते हैं जहां भारी जैविक कीचड़ हो। जिन तालाबों को सालों से सुखा कर साफ नहीं किया गया, वे सबसे ज़्यादा प्रभावित होते हैं।',
        firstResponse: [
          'तालाब के तले में अतिरिक्त कीचड़ और जैविक जमाव जांचें।',
          'तले की सफाई के लिए चूना डालें।',
          'अगर संभव हो तो बहुत प्रभावित मछलियों को हटाएं।',
        ],
        farmerChecklist: [
          'शरीर, गलफड़े या मुंह पर छोटे कीड़े जैसे जोंक देखें।',
          'तालाब के तले पर मोटा काला कीचड़ चेक करें।',
          'याद करें कि तालाब को आखिरी बार पूरी तरह कब सुखाया और साफ किया था।',
        ],
        callDoctorNow: [
          'जोंक का संक्रमण पूरे तालाब में बहुत भारी है।',
          'रासायनिक उपचार चाहिए।',
          'पूरे तालाब को सुखाना और निकालना पड़ सकता है।',
        ],
      },
      db: {
        name: 'जोंक संक्रमण',
        symptoms: ['शरीर, गलफड़े, पंख या मुंह पर भूरे/काले जोंक', 'ज़्यादा श्लेष्म निकलना', 'मछलियों का कठोर चीज़ों पर रगड़ना', 'खून चूसने से वज़न घटना'],
        causes: ['बाहरी परजीवी कीड़े (जोंक)', 'कीचड़ भरे प्रदूषित तालाब के तले में पनपते हैं', 'तले में भारी जैविक कीचड़ का जमाव'],
        prevention: ['हर 3 साल में तालाब को सुखाएं और तले की मिट्टी हटाएं', 'नियमित रूप से चूना डालें', 'कीचड़ भरा या नाली का पानी तालाब में आने ना दें'],
        treatment: ['सलाह अनुसार Glacial Acetic Acid (1.0 मिली/लीटर) छिड़काव', 'Copper Sulphate (500 ग्राम प्रति हेक्टेयर)', 'अंतिम उपाय के तौर पर तालाब को सुखाएं'],
      },
    },
  },

  // ─── GILL ROT ───────────────────────────────────────────────────────
  'gill-rot': {
    en: {
      education: {
        overview:
          'Gill Rot is a fungal disease that attacks the gills, making them lose their natural red colour and turn pale or grey. Fish gasp at the surface because their gills cannot take in enough oxygen.',
        whyItHappens:
          'Caused by the fungus Branchiomyces demigrans. It spreads in stagnant, polluted water with high organic load. Hot weather combined with low oxygen makes it much worse.',
        firstResponse: [
          'Increase aeration and water exchange immediately.',
          'Reduce feeding and remove uneaten feed.',
          'Apply lime to control bacterial and fungal load.',
        ],
        farmerChecklist: [
          'Open the gill cover and check if gills are pale, grey, or broken.',
          'Notice if many fish are gasping at the surface.',
          'Check for stagnant water or strong sludge smell.',
        ],
        callDoctorNow: [
          'Many fish are gasping despite improved aeration.',
          'Gills look very damaged or have white patches.',
          'Mortality starts climbing in just 1 to 2 days.',
        ],
      },
      db: {
        name: 'Gill Rot Disease',
        symptoms: ['Gills lose red colour, become pale or grey', 'Necrotic and rotting gill filaments', 'Surface gasping and heavy breathing', 'Reduced feeding'],
        causes: ['Fungus: Branchiomyces demigrans', 'Stagnant, polluted water with high organic load', 'Hot weather with low oxygen'],
        prevention: ['Maintain water exchange', 'Reduce overfeeding and remove uneaten feed', 'Apply lime to keep alkalinity stable'],
        treatment: ['Increase aeration and water exchange immediately', 'Apply Potassium Permanganate as advised', 'Reduce stocking density temporarily'],
      },
    },
    hi: {
      education: {
        overview:
          'गलफड़ा सड़न (Gill Rot) एक फंगल बीमारी है जो गलफड़ों पर हमला करती है, जिससे उनका प्राकृतिक लाल रंग खत्म होकर पीला या भूरा हो जाता है। मछलियां सतह पर हवा के लिए छटपटाती हैं क्योंकि उनके गलफड़े पर्याप्त ऑक्सीजन नहीं ले पाते।',
        whyItHappens:
          'यह फंगस (Branchiomyces demigrans) से होती है। यह रुके हुए, गंदे पानी में फैलती है जहां जैविक भार ज़्यादा हो। गर्म मौसम और कम ऑक्सीजन से स्थिति बहुत खराब हो जाती है।',
        firstResponse: [
          'एयरेशन और पानी का आदान-प्रदान तुरंत बढ़ाएं।',
          'चारा कम करें और बचा हुआ चारा हटाएं।',
          'बैक्टीरिया और फंगस को कंट्रोल करने के लिए चूना डालें।',
        ],
        farmerChecklist: [
          'गलफड़े का ढक्कन खोलकर देखें — गलफड़े पीले, भूरे या टूटे हुए हैं क्या।',
          'देखें कि क्या कई मछलियां सतह पर हवा ले रही हैं।',
          'रुके हुए पानी या तेज़ कीचड़ की गंध जांचें।',
        ],
        callDoctorNow: [
          'एयरेशन सुधारने के बाद भी मछलियां छटपटा रही हैं।',
          'गलफड़े बहुत खराब दिख रहे हैं या सफेद धब्बे हैं।',
          'सिर्फ 1-2 दिन में मौत बढ़ रही है।',
        ],
      },
      db: {
        name: 'गलफड़ा सड़न (Gill Rot)',
        symptoms: ['गलफड़ों का लाल रंग खत्म होकर पीला या भूरा होना', 'गलफड़े के तंतु सड़ जाना', 'सतह पर हवा के लिए छटपटाना', 'चारा कम खाना'],
        causes: ['फंगस: Branchiomyces demigrans', 'गंदा, रुका हुआ पानी और ज़्यादा जैविक भार', 'गर्म तापमान के साथ कम ऑक्सीजन'],
        prevention: ['पानी का आदान-प्रदान बनाए रखें', 'ज़्यादा खाना देना कम करें', 'पानी की क्षारीयता स्थिर रखने के लिए चूना डालें'],
        treatment: ['तुरंत एयरेशन और पानी का आदान-प्रदान बढ़ाएं', 'डॉक्टर की सलाह अनुसार Potassium Permanganate', 'अस्थायी रूप से स्टॉकिंग घनत्व कम करें'],
      },
    },
  },

  // ─── BROWN BLOOD DISEASE ────────────────────────────────────────────
  'brown-blood-disease': {
    en: {
      education: {
        overview:
          'Brown Blood Disease is a water quality problem caused by high nitrite levels. The fish blood turns brownish because nitrite damages the haemoglobin. Fish look weak and gasp at the surface even when oxygen seems fine.',
        whyItHappens:
          'It happens when nitrite levels in the pond go above 1 ppm. This is usually caused by overfeeding, high biomass, or weak nitrification (poor pond probiotics activity).',
        firstResponse: [
          'Apply common salt (sodium chloride, 40 kg per acre) to block nitrite uptake by fish.',
          'Reduce or stop feeding until levels normalize.',
          'Increase aeration and exchange 25 to 50% of pond water.',
        ],
        farmerChecklist: [
          'Test nitrite if you see weak gasping fish despite good oxygen.',
          'Note recent overfeeding or high stocking density.',
          'Check whether you applied any pond probiotics recently.',
        ],
        callDoctorNow: [
          'Nitrite remains high after corrective steps.',
          'Mortality is rising even after salt application.',
          'Multiple ponds on the farm show the same symptoms.',
        ],
      },
      db: {
        name: 'Brown Blood Disease (Nitrite Toxicity)',
        symptoms: ['Brownish tint to gills and blood', 'Slow movement and surface gasping', 'Reduced feeding and weight loss', 'Weak fish despite good oxygen'],
        causes: ['Nitrite toxicity above 1.0 ppm', 'Methemoglobin formation in blood', 'Overfeeding, high biomass and weak nitrification'],
        prevention: ['Test nitrite weekly during high-feed periods', 'Avoid overfeeding', 'Apply pond probiotics for nitrification', 'Regular water exchange'],
        treatment: ['Apply sodium chloride (40 kg per acre)', 'Reduce or stop feeding until levels normalize', 'Exchange 25–50% pond water', 'Increase aeration'],
      },
    },
    hi: {
      education: {
        overview:
          'ब्राउन ब्लड डिज़ीज़ पानी की गुणवत्ता की समस्या है जो ज़्यादा नाइट्राइट से होती है। मछली का खून भूरा हो जाता है क्योंकि नाइट्राइट खून के हीमोग्लोबिन को नुकसान पहुंचाता है। मछलियां कमज़ोर दिखती हैं और ऑक्सीजन ठीक होने पर भी सतह पर सांस लेती हैं।',
        whyItHappens:
          'यह तब होता है जब तालाब में नाइट्राइट 1 ppm से ज्यादा हो जाए। यह आमतौर पर ज़्यादा खाना, ज्यादा बायोमास या कमज़ोर नाइट्रिफिकेशन (तालाब प्रोबायोटिक्स की कमी) से होता है।',
        firstResponse: [
          'मछलियों में नाइट्राइट सोख रोकने के लिए साधारण नमक (40 किलो प्रति एकड़) डालें।',
          'जब तक स्तर सामान्य न हों, चारा कम करें या बंद करें।',
          'एयरेशन बढ़ाएं और 25-50% पानी बदलें।',
        ],
        farmerChecklist: [
          'अगर ऑक्सीजन ठीक होने पर भी मछलियां कमज़ोर हैं तो नाइट्राइट जांचें।',
          'हाल का ज़्यादा खाना या भारी स्टॉकिंग याद करें।',
          'जांचें कि क्या आपने हाल में तालाब प्रोबायोटिक्स डाले थे।',
        ],
        callDoctorNow: [
          'सुधार के बाद भी नाइट्राइट ज्यादा बना है।',
          'नमक डालने के बाद भी मौत बढ़ रही है।',
          'फार्म के कई तालाबों में एक जैसे लक्षण हैं।',
        ],
      },
      db: {
        name: 'ब्राउन ब्लड रोग (नाइट्राइट विषाक्तता)',
        symptoms: ['गलफड़ों और खून का भूरा रंग', 'धीमी हलचल और सतह पर हवा लेना', 'चारा कम खाना और वज़न घटना', 'ऑक्सीजन ठीक होने पर भी मछलियों का कमज़ोर दिखना'],
        causes: ['नाइट्राइट 1.0 ppm से ज़्यादा होने पर विषाक्तता', 'खून में मेथेमोग्लोबिन का बनना', 'ज़्यादा खाना, ज़्यादा बायोमास और कमज़ोर नाइट्रिफिकेशन'],
        prevention: ['ज़्यादा चारे वाले समय में हफ्ते में नाइट्राइट जांचें', 'ज़्यादा खाना देने से बचें', 'नाइट्रिफिकेशन के लिए तालाब प्रोबायोटिक्स डालें', 'नियमित पानी का आदान-प्रदान करें'],
        treatment: ['साधारण नमक (40 किलो प्रति एकड़) डालें', 'जब तक स्तर सामान्य न हो, चारा कम करें या बंद करें', 'तालाब का 25-50% पानी बदलें', 'एयरेशन बढ़ाएं'],
      },
    },
  },

  // ─── HYDROGEN SULFIDE ──────────────────────────────────────────────
  'hydrogen-sulfide-toxicity': {
    en: {
      education: {
        overview:
          'Hydrogen Sulfide Toxicity is a serious water quality issue caused by toxic gas building up at the pond bottom. The pond water smells like rotten eggs and fish die suddenly, especially after the bottom is disturbed.',
        whyItHappens:
          'Excess aquatic vegetation and heavy organic sludge at the pond bottom block water circulation and produce hydrogen sulfide gas. The toxic gas releases into the water column when the bottom is stirred.',
        firstResponse: [
          'Increase aeration immediately, especially at the bottom of the pond.',
          'Apply lime (200 to 500 kg per hectare) to neutralize the bottom.',
          'Exchange 25 to 50% of the pond water.',
          'Stop feeding until the smell and water condition improve.',
        ],
        farmerChecklist: [
          'Smell the pond water — rotten egg smell is the warning sign.',
          'Check pond bottom for thick black sludge.',
          'Note any sudden mortality after stirring or netting.',
        ],
        callDoctorNow: [
          'Sudden mass mortality with rotten egg smell.',
          'Foul smell does not go away after liming.',
          'You may need to drain and dry the pond fully.',
        ],
      },
      db: {
        name: 'Hydrogen Sulfide (H₂S) Toxicity',
        symptoms: ['Rotten egg smell from pond water', 'Black sludge at pond bottom', 'Fish gasping at surface and avoiding bottom', 'Sudden mortality after disturbing bottom'],
        causes: ['Toxic H₂S buildup at pond bottom', 'High aquatic vegetation blocking circulation', 'Heavy organic sludge with no aeration'],
        prevention: ['Remove excess aquatic vegetation regularly', 'Aerate pond in early morning', 'Dry pond every 3 years', 'Avoid overfeeding'],
        treatment: ['Increase aeration immediately', 'Apply lime (200–500 kg per hectare)', 'Exchange 25–50% pond water', 'Stop feeding until conditions normalize'],
      },
    },
    hi: {
      education: {
        overview:
          'हाइड्रोजन सल्फाइड विषाक्तता पानी की गुणवत्ता की एक गंभीर समस्या है जो तालाब के तले में जहरीली गैस जमा होने से होती है। तालाब के पानी में सड़े अंडे जैसी गंध आती है और मछलियां अचानक मरती हैं, खासकर जब तला हिलाया जाए।',
        whyItHappens:
          'तालाब के तले पर ज़्यादा जलीय वनस्पति और भारी जैविक कीचड़ पानी का संचार रोकते हैं और हाइड्रोजन सल्फाइड गैस पैदा करते हैं। तला हिलने पर यह जहरीली गैस पानी में फैल जाती है।',
        firstResponse: [
          'एयरेशन तुरंत बढ़ाएं, खासकर तालाब के तले में।',
          'तले को निष्क्रिय करने के लिए चूना डालें (200-500 किलो प्रति हेक्टेयर)।',
          'तालाब का 25-50% पानी बदलें।',
          'जब तक गंध और पानी ठीक न हो, चारा देना बंद करें।',
        ],
        farmerChecklist: [
          'तालाब के पानी की गंध सूंघें — सड़े अंडे जैसी गंध चेतावनी का संकेत है।',
          'तालाब के तले पर मोटा काला कीचड़ देखें।',
          'तला हिलाने या जाली के बाद अचानक मौत हुई क्या जांचें।',
        ],
        callDoctorNow: [
          'सड़े अंडे जैसी गंध के साथ अचानक बड़ी संख्या में मौत हो रही है।',
          'चूना डालने के बाद भी गंध नहीं जा रही।',
          'तालाब को पूरी तरह सुखाना पड़ सकता है।',
        ],
      },
      db: {
        name: 'हाइड्रोजन सल्फाइड (H₂S) विषाक्तता',
        symptoms: ['तालाब के पानी में सड़े अंडे जैसी गंध', 'तालाब के तले पर काला कीचड़', 'मछलियों का सतह पर हवा लेना और तले से बचना', 'तला हिलाने के बाद अचानक मौत'],
        causes: ['तालाब के तले में हाइड्रोजन सल्फाइड गैस का जहरीला जमाव', 'ज़्यादा जलीय वनस्पति से पानी का संचार रुकना', 'तले में भारी जैविक कीचड़'],
        prevention: ['अतिरिक्त जलीय वनस्पति नियमित रूप से हटाएं', 'सुबह जल्दी तालाब का एयरेशन करें', 'हर 3 साल में तालाब सुखाएं', 'ज़्यादा खाना देने से बचें'],
        treatment: ['तुरंत एयरेशन बढ़ाएं', 'चूना डालें (200-500 किलो प्रति हेक्टेयर)', 'तालाब का 25-50% पानी बदलें', 'गंध और पानी ठीक होने तक चारा बंद करें'],
      },
    },
  },

  // ─── ALGAL BLOOM ────────────────────────────────────────────────────
  'algal-toxicosis': {
    en: {
      education: {
        overview:
          'Algal Toxicosis or Algal Bloom happens when algae grow too much in the pond. The water turns deep green, blue-green, or brown, and may smell bad. Sudden bloom crashes cause overnight oxygen depletion and mass mortality.',
        whyItHappens:
          'Caused by overfeeding, high nutrient load, and stagnant water. When the bloom crashes (usually after cloudy days or heavy rain), oxygen drops sharply and toxins are released.',
        firstResponse: [
          'Stop feeding immediately if the water turns dark green and smells bad.',
          'Increase aeration through the night to prevent oxygen crash.',
          'Exchange 25 to 50% of pond water.',
          'Apply pond probiotics to recover the system.',
        ],
        farmerChecklist: [
          'Check water colour daily — deep green or brown is a warning.',
          'Smell the water every morning.',
          'Watch for fish gasping in the early morning hours.',
        ],
        callDoctorNow: [
          'Sudden mass mortality at dawn.',
          'Fish refuse feed and water colour does not improve after exchange.',
          'You see a strong bloom crash with dead algae floating.',
        ],
      },
      db: {
        name: 'Algal Toxicosis / Algal Bloom',
        symptoms: ['Pond water turns deep green, blue-green or brown', 'Foul smell from water', 'Sudden dawn mortality after bloom crash', 'Fish gasping and refusing feed'],
        causes: ['Excessive unbalanced algal growth', 'Overfeeding and high nutrient load', 'Stagnant water with little exchange', 'Bloom crash leads to oxygen depletion'],
        prevention: ['Avoid overfeeding', 'Maintain stable plankton with regular water exchange', 'Stop feeding when water turns deep green or smells bad', 'Apply lime periodically'],
        treatment: ['Stop feeding if water turns green and smells bad', 'Increase nighttime aeration', 'Exchange 25–50% pond water', 'Apply pond probiotics'],
      },
    },
    hi: {
      education: {
        overview:
          'अल्गल टॉक्सिकोसिस या अल्गल ब्लूम तब होता है जब तालाब में शैवाल (एलगी) बहुत ज़्यादा बढ़ जाते हैं। पानी गहरा हरा, नीला-हरा या भूरा हो जाता है और बदबू आ सकती है। अचानक ब्लूम क्रैश से रात भर ऑक्सीजन गिर जाता है और बहुत मौत होती है।',
        whyItHappens:
          'यह ज़्यादा खाना, ज़्यादा पोषक तत्व और रुके हुए पानी से होता है। जब ब्लूम क्रैश होता है (आमतौर पर बादल वाले दिनों या तेज़ बारिश के बाद), ऑक्सीजन तेज़ी से गिरता है और विषाक्त पदार्थ निकलते हैं।',
        firstResponse: [
          'अगर पानी गहरा हरा हो और बदबू आए तो तुरंत खाना देना बंद करें।',
          'रात में ऑक्सीजन गिरने से रोकने के लिए एयरेशन बढ़ाएं।',
          'तालाब का 25-50% पानी बदलें।',
          'सिस्टम ठीक करने के लिए तालाब प्रोबायोटिक्स डालें।',
        ],
        farmerChecklist: [
          'रोज़ पानी का रंग देखें — गहरा हरा या भूरा रंग चेतावनी है।',
          'हर सुबह पानी की गंध सूंघें।',
          'सुबह जल्दी मछलियों को हवा के लिए छटपटाते देखें।',
        ],
        callDoctorNow: [
          'सुबह बड़ी संख्या में मौत हो रही है।',
          'मछलियां खाना बंद कर रही हैं और पानी बदलने के बाद भी रंग नहीं सुधर रहा।',
          'भारी ब्लूम क्रैश दिख रहा है और मरे हुए शैवाल तैर रहे हैं।',
        ],
      },
      db: {
        name: 'अल्गल टॉक्सिकोसिस / अल्गल ब्लूम',
        symptoms: ['तालाब का पानी गहरा हरा, नीला-हरा या भूरा होना', 'पानी से बदबू आना', 'ब्लूम क्रैश के बाद सुबह अचानक बड़ी संख्या में मौत', 'मछलियों का हवा के लिए छटपटाना'],
        causes: ['शैवाल की अत्यधिक असंतुलित वृद्धि', 'ज़्यादा खाना और ज़्यादा पोषक तत्व', 'रुका हुआ पानी और कम आदान-प्रदान', 'ब्लूम क्रैश से अचानक ऑक्सीजन गिरना'],
        prevention: ['ज़्यादा खाना देने से बचें', 'नियमित पानी आदान-प्रदान से प्लैंकटन स्थिर रखें', 'पानी गहरा हरा हो या बदबू आए तो चारा बंद करें', 'नियमित चूना डालें'],
        treatment: ['पानी हरा हो और बदबू आए तो तुरंत चारा बंद करें', 'रात में एयरेशन बढ़ाएं', 'तालाब का 25-50% पानी बदलें', 'तालाब प्रोबायोटिक्स डालें'],
      },
    },
  },

  // ─── GAS BUBBLE DISEASE ─────────────────────────────────────────────
  'gas-bubble-disease': {
    en: {
      education: {
        overview:
          'Gas Bubble Disease happens when oxygen in the water becomes too high (super-saturation). Tiny gas bubbles form under the skin and in the eyes of fish, especially small fingerlings, which then float belly-up and die.',
        whyItHappens:
          'It is most common during summer and rainy seasons when heavy algal photosynthesis or sudden temperature changes super-saturate the water with dissolved gases.',
        firstResponse: [
          'Increase water exchange to release excess gas.',
          'Reduce algal density carefully with lime.',
          'Provide shade and deeper water for fingerlings.',
        ],
        farmerChecklist: [
          'Look for tiny bubbles under the skin or in the eyes of fingerlings.',
          'Note if fish are floating belly-up during peak sun hours.',
          'Check whether the pond has very heavy algal growth.',
        ],
        callDoctorNow: [
          'Many fingerlings die during peak sun hours.',
          'Algal growth is uncontrolled despite liming.',
          'Eye protrusion is visible in many fish.',
        ],
      },
      db: {
        name: 'Gas Bubble Disease (Super-saturation)',
        symptoms: ['Tiny gas bubbles under skin or in eyes', 'Erratic swimming or belly-up floating', 'Eye protrusion in severe cases', 'Sudden fingerling mortality'],
        causes: ['Excessively high dissolved oxygen', 'Common in summer and rainy season', 'Heavy algal photosynthesis on bright days', 'Sudden temperature changes'],
        prevention: ['Avoid extreme algal blooms', 'Aerate gently in peak sun', 'Provide shaded zones for fingerlings'],
        treatment: ['Increase water exchange', 'Reduce algal density with controlled liming', 'Move affected fish to deeper, cooler water'],
      },
    },
    hi: {
      education: {
        overview:
          'गैस बबल डिज़ीज़ तब होता है जब पानी में ऑक्सीजन बहुत ज़्यादा हो जाए (सुपर-सैचुरेशन)। मछलियों की त्वचा के नीचे और आंखों में छोटे गैस के बुलबुले बनते हैं, खासकर छोटी मछलियों (फिंगरलिंग) में, जो फिर उल्टी होकर तैरती हैं और मर जाती हैं।',
        whyItHappens:
          'यह सबसे अधिक गर्मी और बरसात के मौसम में होता है जब भारी शैवाल फोटोसिंथेसिस या तापमान में अचानक बदलाव से पानी में गैस बहुत ज़्यादा घुल जाती है।',
        firstResponse: [
          'अतिरिक्त गैस निकालने के लिए पानी का आदान-प्रदान बढ़ाएं।',
          'चूने से शैवाल का घनत्व सावधानी से कम करें।',
          'फिंगरलिंग के लिए छाया और गहरा पानी दें।',
        ],
        farmerChecklist: [
          'फिंगरलिंग की त्वचा के नीचे या आंखों में छोटे बुलबुले देखें।',
          'जांचें कि क्या मछलियां तेज़ धूप में उल्टी होकर तैर रही हैं।',
          'देखें कि क्या तालाब में बहुत भारी शैवाल वृद्धि है।',
        ],
        callDoctorNow: [
          'तेज़ धूप के समय बहुत सी फिंगरलिंग मर रही हैं।',
          'चूना डालने के बाद भी शैवाल नियंत्रण में नहीं आ रहे।',
          'कई मछलियों में आंख बाहर निकलना दिखाई दे रहा है।',
        ],
      },
      db: {
        name: 'गैस बबल डिज़ीज़ (सुपर-सैचुरेशन)',
        symptoms: ['त्वचा के नीचे या आंखों में छोटे गैस के बुलबुले', 'अनियमित तैरना या उल्टी होकर तैरना', 'गंभीर मामलों में आंखें बाहर निकलना', 'तेज़ धूप में फिंगरलिंग का अचानक मरना'],
        causes: ['पानी में बहुत ज़्यादा घुली हुई ऑक्सीजन', 'गर्मी और बरसात में आम', 'भारी शैवाल फोटोसिंथेसिस', 'अचानक तापमान बदलना'],
        prevention: ['अत्यधिक शैवाल वृद्धि से बचें', 'तेज़ धूप में हल्के से एयरेशन करें', 'फिंगरलिंग के लिए छाया वाले क्षेत्र दें'],
        treatment: ['पानी का आदान-प्रदान बढ़ाएं', 'नियंत्रित चूना डालकर शैवाल का घनत्व कम करें', 'प्रभावित मछलियों को गहरे, ठंडे पानी में भेजें'],
      },
    },
  },
};
