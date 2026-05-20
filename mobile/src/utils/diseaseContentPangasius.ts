/**
 * Pangasius-specific disease education content.
 * Merged into CONTENT_BY_SLUG via Object.assign in diseaseContent.ts.
 *
 * Source: Official Bihar Fisheries / ICAR Pangasius cultivation manual.
 * 4 diseases:
 *   1. pangasius-bacillary-necrosis  — Edwardsiella ictaluri, cold-triggered
 *   2. pangasius-red-spot            — Aeromonas hydrophila, transport stress
 *   3. pangasius-white-spot-ich      — Ichthyophthirius multifiliis, fry/fingerling
 *   4. pangasius-fungal-infection    — Saprolegnia, transport injuries
 */

import type { Lang } from './diseaseContent';
import type { DiseaseEducationContent, DiseaseDbOverride } from './diseaseContent';

type LocalizedContent = {
  education: DiseaseEducationContent;
  db?: DiseaseDbOverride;
};

type AllLanguages = Record<Lang, LocalizedContent>;

export const PANGASIUS_DISEASE_CONTENT: Record<string, AllLanguages> = {

  // ─── PANGASIUS BACILLARY NECROSIS ────────────────────────────────────────
  'pangasius-bacillary-necrosis': {
    en: {
      education: {
        overview:
          'Bacillary Necrosis is the most dangerous bacterial disease of Pangasius. It is caused by Edwardsiella ictaluri and is triggered mainly by cold weather. Gills and skin turn yellow, and white spots appear on internal organs. Mortality can reach 70% if not caught early.',
        whyItHappens:
          'The bacteria become active when water temperature drops rapidly — especially below 20°C. Pangasius is a warm-water fish and cold stress severely weakens its immune system. Overcrowding, poor water quality, and infected seed stock also trigger outbreaks.',
        firstResponse: [
          'Check water temperature immediately — if below 20°C, increase aeration to prevent thermal stratification.',
          'Stop feeding and reduce stocking density if possible.',
          'Remove dead fish immediately and disinfect the pond with Potassium Permanganate (2–4 mg/L).',
        ],
        farmerChecklist: [
          'Look for yellowing of gills and skin — this is the most visible early sign.',
          'Check whether the outbreak followed a sudden cold spell or temperature drop.',
          'Review whether fingerlings came from a certified, disease-free hatchery.',
        ],
        callDoctorNow: [
          'Mortality is rising rapidly — this disease can kill 70% of stock.',
          'Multiple fish show yellow gills and lethargy at the same time.',
          'The outbreak is happening in October–December (pre-winter period).',
        ],
      },
      db: {
        name: 'Bacillary Necrosis (Pangasius)',
        symptoms: [
          'Gills and skin turn yellow',
          'White spots on spleen, liver, and kidneys (visible on dissection)',
          'Lethargy and complete loss of appetite',
          'Rapid mortality in cold weather',
        ],
        causes: [
          'Bacterial infection: Edwardsiella ictaluri',
          'Triggered by rapid water temperature drop (below 20°C)',
          'Stress from overcrowding, poor water quality, or transport',
          'Contaminated water or infected seed stock',
        ],
        prevention: [
          'Harvest Pangasius before October to avoid cold-weather outbreaks',
          'Maintain water temperature above 22°C using aeration',
          'Source fingerlings only from certified, disease-free hatcheries',
          'Apply lime regularly to maintain stable pH and reduce bacterial load',
        ],
        treatment: [
          'Mix Oxytetracycline or Sulfonamide antibiotics with feed for 1–2 weeks',
          'Apply Potassium Permanganate (2–4 mg/L) as pond disinfectant',
          'Increase aeration and reduce stocking density',
          'Consult a fisheries doctor before starting antibiotic treatment',
        ],
      },
    },
    hi: {
      education: {
        overview:
          'बैसिलरी नेक्रोसिस पंगास मछली की सबसे खतरनाक बैक्टीरियल बीमारी है। यह Edwardsiella ictaluri बैक्टीरिया से होती है और मुख्य रूप से ठंड के मौसम में फैलती है। गलफड़े और त्वचा पीले पड़ जाते हैं और अंदरूनी अंगों पर सफेद धब्बे बनते हैं। समय पर इलाज न हो तो 70% तक मौत हो सकती है।',
        whyItHappens:
          'यह बैक्टीरिया तब सक्रिय होता है जब पानी का तापमान तेज़ी से गिरे — खासकर 20°C से नीचे। पंगास गर्म पानी की मछली है और ठंड का तनाव उसकी रोग प्रतिरोधक क्षमता को बहुत कमज़ोर कर देता है। भीड़, खराब पानी और संक्रमित बीज भी बीमारी को बढ़ाते हैं।',
        firstResponse: [
          'तुरंत पानी का तापमान जांचें — 20°C से कम हो तो एयरेशन बढ़ाएं।',
          'खाना देना बंद करें और अगर संभव हो तो स्टॉकिंग घनत्व कम करें।',
          'मरी हुई मछलियां तुरंत निकालें और पोटेशियम परमैंगनेट (2–4 mg/L) से तालाब कीटाणुरहित करें।',
        ],
        farmerChecklist: [
          'गलफड़ों और त्वचा का पीला पड़ना देखें — यह सबसे पहला और स्पष्ट संकेत है।',
          'जांचें कि क्या बीमारी अचानक ठंड या तापमान गिरने के बाद शुरू हुई।',
          'देखें कि क्या फिंगरलिंग किसी प्रमाणित, रोगमुक्त हैचरी से आई थी।',
        ],
        callDoctorNow: [
          'मौत तेज़ी से बढ़ रही है — यह बीमारी 70% स्टॉक को मार सकती है।',
          'एक साथ कई मछलियों में पीले गलफड़े और सुस्ती दिख रही है।',
          'यह प्रकोप अक्टूबर–दिसंबर (सर्दी से पहले) में हो रहा है।',
        ],
      },
      db: {
        name: 'बैसिलरी नेक्रोसिस (पंगास)',
        symptoms: [
          'गलफड़े और त्वचा का पीला पड़ना',
          'तिल्ली, जिगर और गुर्दे पर सफेद धब्बे (चीरफाड़ पर दिखते हैं)',
          'सुस्ती और खाना पूरी तरह बंद करना',
          'ठंड के मौसम में तेज़ मौत',
        ],
        causes: [
          'बैक्टीरियल संक्रमण: Edwardsiella ictaluri',
          'पानी का तापमान तेज़ी से गिरने से (20°C से नीचे) शुरू होता है',
          'भीड़, खराब पानी या परिवहन का तनाव',
          'दूषित पानी या संक्रमित बीज',
        ],
        prevention: [
          'अक्टूबर से पहले पंगास की कटाई करें — ठंड से बचाव के लिए',
          'एयरेशन से पानी का तापमान 22°C से ऊपर रखें',
          'केवल प्रमाणित, रोगमुक्त हैचरी से फिंगरलिंग लें',
          'pH स्थिर रखने और बैक्टीरियल भार कम करने के लिए नियमित चूना डालें',
        ],
        treatment: [
          'चारे में ऑक्सीटेट्रासाइक्लिन या सल्फोनामाइड एंटीबायोटिक 1–2 हफ्ते मिलाएं',
          'पोटेशियम परमैंगनेट (2–4 mg/L) से तालाब कीटाणुरहित करें',
          'एयरेशन बढ़ाएं और स्टॉकिंग घनत्व कम करें',
          'एंटीबायोटिक शुरू करने से पहले मत्स्य डॉक्टर से सलाह लें',
        ],
      },
    },
  },

  // ─── PANGASIUS RED SPOT DISEASE ──────────────────────────────────────────
  'pangasius-red-spot': {
    en: {
      education: {
        overview:
          'Red Spot Disease is a serious bacterial infection of Pangasius caused by Aeromonas hydrophila. It shows up as bleeding around the mouth and fin bases, swollen red abdomen, and open skin ulcers. It is most common after transport stress or sudden water quality changes.',
        whyItHappens:
          'The bacteria enter through skin injuries caused by rough handling during transport, netting, or grading. Poor water quality — high ammonia, low dissolved oxygen, or pH swings — weakens the fish and makes it easy for the bacteria to take hold.',
        firstResponse: [
          'Test ammonia and dissolved oxygen immediately — correct water quality before anything else.',
          'Stop all handling, grading, and transport of the stock.',
          'Apply Potassium Permanganate (2–4 mg/L) to the pond as a disinfectant.',
        ],
        farmerChecklist: [
          'Look for bleeding around the mouth, fin bases, and a swollen red belly.',
          'Check whether the outbreak followed transport, netting, or a water quality event.',
          'Review whether ammonia is high or dissolved oxygen is low.',
        ],
        callDoctorNow: [
          'Open ulcers and bleeding are spreading across multiple fish.',
          'Deaths continue after water quality correction.',
          'The pond had a recent ammonia spike or temperature swing.',
        ],
      },
      db: {
        name: 'Red Spot Disease (Pangasius)',
        symptoms: [
          'Bleeding (hemorrhage) around mouth and fin bases',
          'Swollen red abdomen',
          'Skin ulcers and open wounds',
          'Lethargy and surface swimming',
        ],
        causes: [
          'Bacterial infection: Aeromonas hydrophila and Aeromonas sobria',
          'Transport stress and sudden temperature changes weaken immunity',
          'Poor water quality: high ammonia, low DO, pH fluctuations',
          'Skin injuries from netting or handling allow bacteria to enter',
        ],
        prevention: [
          'Acclimatize fingerlings properly before stocking — never release directly from transport bags',
          'Maintain stable water quality: DO > 5 ppm, ammonia < 0.5 ppm, pH 6.5–7.5',
          'Disinfect nets and equipment between uses',
          'Avoid rough handling during harvest and grading',
          'Apply lime (200 kg/acre) before stocking to reduce bacterial load',
        ],
        treatment: [
          'Mix antibiotics (Oxytetracycline or Amoxicillin) with feed for 7–10 days under veterinary guidance',
          'Partial water exchange (20–30%) if ammonia is high',
          'Apply Potassium Permanganate (2–4 mg/L) as pond disinfectant',
          'Reduce feeding during treatment to lower organic load',
        ],
      },
    },
    hi: {
      education: {
        overview:
          'रेड स्पॉट रोग पंगास की एक गंभीर बैक्टीरियल बीमारी है जो Aeromonas hydrophila से होती है। मुंह और पंखों के आधार पर खून रिसता है, पेट सूजकर लाल हो जाता है और त्वचा पर खुले घाव बनते हैं। यह परिवहन के तनाव या पानी की गुणवत्ता में अचानक बदलाव के बाद सबसे ज़्यादा होती है।',
        whyItHappens:
          'बैक्टीरिया परिवहन, जाली या छंटाई के दौरान रफ हैंडलिंग से लगी त्वचा की चोटों से अंदर घुसते हैं। खराब पानी — ज़्यादा अमोनिया, कम ऑक्सीजन या pH में उतार-चढ़ाव — मछली को कमज़ोर कर देता है और बैक्टीरिया को पकड़ने का मौका देता है।',
        firstResponse: [
          'तुरंत अमोनिया और ऑक्सीजन जांचें — कुछ और करने से पहले पानी ठीक करें।',
          'सभी हैंडलिंग, छंटाई और परिवहन तुरंत बंद करें।',
          'पोटेशियम परमैंगनेट (2–4 mg/L) से तालाब कीटाणुरहित करें।',
        ],
        farmerChecklist: [
          'मुंह, पंखों के आधार और सूजे लाल पेट पर खून रिसाव देखें।',
          'जांचें कि क्या बीमारी परिवहन, जाली या पानी की गुणवत्ता की घटना के बाद शुरू हुई।',
          'देखें कि क्या अमोनिया ज़्यादा है या ऑक्सीजन कम है।',
        ],
        callDoctorNow: [
          'कई मछलियों में खुले घाव और खून रिसाव फैल रहा है।',
          'पानी ठीक करने के बाद भी मौत बढ़ रही है।',
          'तालाब में हाल ही में अमोनिया बढ़ा था या तापमान में अचानक बदलाव हुआ था।',
        ],
      },
      db: {
        name: 'रेड स्पॉट रोग (पंगास)',
        symptoms: [
          'मुंह और पंखों के आधार पर खून रिसाव (हेमरेज)',
          'पेट का सूजकर लाल होना',
          'त्वचा पर घाव और खुले जख्म',
          'सुस्ती और सतह पर तैरना',
        ],
        causes: [
          'बैक्टीरियल संक्रमण: Aeromonas hydrophila और Aeromonas sobria',
          'परिवहन का तनाव और अचानक तापमान बदलाव से रोग प्रतिरोधक क्षमता कमज़ोर होती है',
          'खराब पानी: ज़्यादा अमोनिया, कम DO, pH में उतार-चढ़ाव',
          'जाली या हैंडलिंग से लगी त्वचा की चोट से बैक्टीरिया अंदर घुसते हैं',
        ],
        prevention: [
          'स्टॉकिंग से पहले फिंगरलिंग को ठीक से अनुकूलित करें — परिवहन बैग से सीधे न छोड़ें',
          'पानी की गुणवत्ता स्थिर रखें: DO > 5 ppm, अमोनिया < 0.5 ppm, pH 6.5–7.5',
          'जाली और उपकरण को उपयोग के बीच कीटाणुरहित करें',
          'कटाई और छंटाई के दौरान रफ हैंडलिंग से बचें',
          'स्टॉकिंग से पहले चूना (200 किलो/एकड़) डालें',
        ],
        treatment: [
          'पशु चिकित्सक की देखरेख में चारे में एंटीबायोटिक (ऑक्सीटेट्रासाइक्लिन या अमोक्सिसिलिन) 7–10 दिन मिलाएं',
          'अमोनिया ज़्यादा हो तो 20–30% पानी बदलें',
          'पोटेशियम परमैंगनेट (2–4 mg/L) से तालाब कीटाणुरहित करें',
          'उपचार के दौरान जैविक भार कम करने के लिए खाना कम दें',
        ],
      },
    },
  },

  // ─── PANGASIUS WHITE SPOT / ICH ──────────────────────────────────────────
  'pangasius-white-spot-ich': {
    en: {
      education: {
        overview:
          'White Spot Disease (Ich) in Pangasius is a parasitic infection that mainly affects fry and fingerlings. Tiny white spots appear on the skin and gills, fish become lethargic, and they rub against surfaces. Young Pangasius are especially vulnerable because their immune system is not yet fully developed.',
        whyItHappens:
          'The protozoan parasite Ichthyophthirius multifiliis takes hold when fish face temperature stress, overcrowding, or poor water quality. It is commonly introduced through infected seed stock or contaminated water. Fry and fingerlings are the most at-risk stage.',
        firstResponse: [
          'Quarantine affected fish immediately if possible.',
          'Apply Potassium Permanganate (10–15 ppm) in the morning — repeat every 3 days.',
          'Improve aeration and water quality during treatment.',
        ],
        farmerChecklist: [
          'Look for tiny white pinhead spots scattered across the body and fins — not one patch.',
          'Watch for fish rubbing against pond walls, nets, or substrate (flashing behavior).',
          'Check whether the outbreak followed new stocking or a cold-water event.',
        ],
        callDoctorNow: [
          'White spots are spreading pond-wide and fish are gasping.',
          'Fry or fingerlings are dying rapidly.',
          'Treatment with Potassium Permanganate is not reducing the spots after 2–3 cycles.',
        ],
      },
      db: {
        name: 'White Spot Disease / Ich (Pangasius)',
        symptoms: [
          'Small white spots (1–2 mm) on skin and gills',
          'Lethargy and complete loss of appetite',
          'Excessive mucus on body surface',
          'Fish rubbing against pond walls or substrate (flashing)',
          'Breathing difficulty in severe cases',
        ],
        causes: [
          'Protozoan parasite: Ichthyophthirius multifiliis',
          'Fry and fingerlings are most vulnerable',
          'Temperature stress, overcrowding, or poor water quality',
          'Infected seed stock or contaminated water',
        ],
        prevention: [
          'Source fingerlings only from certified, disease-free hatcheries',
          'Quarantine new stock for 7–10 days before introducing to main pond',
          'Maintain stable water temperature — avoid sudden drops',
          'Keep stocking density within recommended limits',
          'Apply lime regularly to maintain pH and reduce parasite load',
        ],
        treatment: [
          'Apply Potassium Permanganate (10–15 ppm) in the morning',
          'Repeat treatment every 3 days for 2–3 cycles until spots disappear',
          'Increase water temperature slightly if possible to speed up parasite life cycle',
          'Improve aeration and water quality during treatment',
        ],
      },
    },
    hi: {
      education: {
        overview:
          'पंगास में व्हाइट स्पॉट रोग (Ich) एक परजीवी संक्रमण है जो मुख्य रूप से स्पॉन और फिंगरलिंग को प्रभावित करता है। त्वचा और गलफड़ों पर छोटे सफेद धब्बे दिखते हैं, मछलियां सुस्त हो जाती हैं और सतहों पर रगड़ती हैं। छोटी पंगास विशेष रूप से कमज़ोर होती है क्योंकि उसकी रोग प्रतिरोधक क्षमता अभी पूरी तरह विकसित नहीं होती।',
        whyItHappens:
          'Ichthyophthirius multifiliis परजीवी तब पकड़ लेता है जब मछली तापमान के तनाव, भीड़ या खराब पानी से कमज़ोर हो। यह आमतौर पर संक्रमित बीज या दूषित पानी से आता है। स्पॉन और फिंगरलिंग सबसे ज़्यादा खतरे में होते हैं।',
        firstResponse: [
          'अगर संभव हो तो प्रभावित मछलियों को तुरंत अलग करें।',
          'सुबह पोटेशियम परमैंगनेट (10–15 ppm) डालें — हर 3 दिन पर दोहराएं।',
          'उपचार के दौरान एयरेशन और पानी की गुणवत्ता सुधारें।',
        ],
        farmerChecklist: [
          'शरीर और पंखों पर बिखरे छोटे सफेद धब्बे देखें — एक जगह नहीं, पूरे शरीर पर।',
          'देखें कि मछलियां तालाब की दीवारों, जाली या तले पर रगड़ रही हैं।',
          'जांचें कि क्या बीमारी नई स्टॉकिंग या ठंडे पानी की घटना के बाद शुरू हुई।',
        ],
        callDoctorNow: [
          'सफेद धब्बे पूरे तालाब में फैल रहे हैं और मछलियां हवा के लिए छटपटा रही हैं।',
          'स्पॉन या फिंगरलिंग तेज़ी से मर रहे हैं।',
          '2–3 चक्र पोटेशियम परमैंगनेट के बाद भी धब्बे कम नहीं हो रहे।',
        ],
      },
      db: {
        name: 'व्हाइट स्पॉट रोग / Ich (पंगास)',
        symptoms: [
          'त्वचा और गलफड़ों पर छोटे सफेद धब्बे (1–2 mm)',
          'सुस्ती और खाना पूरी तरह बंद करना',
          'शरीर पर ज़्यादा चिपचिपा श्लेष्म',
          'तालाब की दीवारों या तले पर रगड़ना (फ्लैशिंग)',
          'गंभीर मामलों में सांस लेने में कठिनाई',
        ],
        causes: [
          'प्रोटोज़ोआ परजीवी: Ichthyophthirius multifiliis',
          'स्पॉन और फिंगरलिंग सबसे ज़्यादा कमज़ोर होते हैं',
          'तापमान का तनाव, भीड़ या खराब पानी',
          'संक्रमित बीज या दूषित पानी',
        ],
        prevention: [
          'केवल प्रमाणित, रोगमुक्त हैचरी से फिंगरलिंग लें',
          'नए स्टॉक को मुख्य तालाब में डालने से पहले 7–10 दिन क्वारंटीन में रखें',
          'पानी का तापमान स्थिर रखें — अचानक गिरावट से बचें',
          'स्टॉकिंग घनत्व सीमा में रखें',
          'pH बनाए रखने और परजीवी भार कम करने के लिए नियमित चूना डालें',
        ],
        treatment: [
          'सुबह पोटेशियम परमैंगनेट (10–15 ppm) डालें',
          'धब्बे गायब होने तक हर 3 दिन पर 2–3 चक्र दोहराएं',
          'परजीवी के जीवन-चक्र को तेज़ करने के लिए पानी का तापमान थोड़ा बढ़ाएं',
          'उपचार के दौरान एयरेशन और पानी की गुणवत्ता सुधारें',
        ],
      },
    },
  },

  // ─── PANGASIUS FUNGAL INFECTION ──────────────────────────────────────────
  'pangasius-fungal-infection': {
    en: {
      education: {
        overview:
          'Fungal infection in Pangasius fry and fingerlings is caused by Saprolegnia and typically appears after transport injuries. Fish lose balance, swim sideways or upside down, and develop cotton-wool-like white or grey growth on wounds. It is a secondary infection — the fungus colonizes skin already damaged by rough handling.',
        whyItHappens:
          'Rough handling during transport, grading, or stocking causes skin abrasions. Cold water stress weakens immunity and promotes fungal growth. Poor water quality with high organic load further encourages Saprolegnia to spread. Fry and fingerlings are most at risk.',
        firstResponse: [
          'Dip affected fish in 10% Potassium Permanganate solution for 30–40 seconds before releasing into clean water.',
          'Remove dead fish immediately to prevent spread.',
          'Improve water quality and increase aeration.',
        ],
        farmerChecklist: [
          'Look for cotton-wool-like white or grey growth on wounds or injured areas.',
          'Check whether fish are swimming sideways or upside down — a sign of balance loss.',
          'Review whether the outbreak followed transport, rough handling, or a cold spell.',
        ],
        callDoctorNow: [
          'Fungal growth is spreading to multiple fish rapidly.',
          'Fry or fingerling mortality is accelerating.',
          'Repeated fungal growth returns after basic treatment.',
        ],
      },
      db: {
        name: 'Fungal Infection (Pangasius Fry/Fingerling)',
        symptoms: [
          'Loss of balance — fish swim sideways or upside down',
          'White or grey cotton-wool-like fungal growth on wounds',
          'Skin lesions and tissue damage at injury sites',
          'Reduced feeding and lethargy',
          'High mortality in fry and fingerlings if untreated',
        ],
        causes: [
          'Fungal infection: Saprolegnia spp.',
          'Skin injuries from rough handling during transport, grading, or stocking',
          'Cold water stress weakens immunity and promotes fungal growth',
          'Poor water quality with high organic load',
        ],
        prevention: [
          'Handle fingerlings gently during transport and stocking — minimize physical injury',
          'Dip fingerlings in 10% Potassium Permanganate solution for 30–40 seconds before stocking',
          'Maintain water temperature above 22°C — cold water promotes fungal growth',
          'Remove dead fish immediately to prevent spread',
          'Apply lime to maintain pH and reduce organic load in nursery ponds',
        ],
        treatment: [
          'Dip affected fish in 10% Potassium Permanganate solution for 30–40 seconds',
          'Apply Malachite Green (0.1 mg/L) to the pond as a fungicide — follow withdrawal periods',
          'Treat pond with salt (NaCl) at 3–5 kg per 1000 litres',
          'Improve water quality and increase aeration during treatment',
        ],
      },
    },
    hi: {
      education: {
        overview:
          'पंगास के स्पॉन और फिंगरलिंग में फंगल संक्रमण Saprolegnia से होता है और आमतौर पर परिवहन की चोटों के बाद दिखता है। मछलियां संतुलन खो देती हैं, तिरछी या उल्टी तैरती हैं और घावों पर रुई जैसी सफेद या भूरी वृद्धि होती है। यह एक द्वितीयक संक्रमण है — फंगस उस त्वचा पर बसता है जो रफ हैंडलिंग से पहले से क्षतिग्रस्त हो।',
        whyItHappens:
          'परिवहन, छंटाई या स्टॉकिंग के दौरान रफ हैंडलिंग से त्वचा पर खरोंचें आती हैं। ठंड का तनाव रोग प्रतिरोधक क्षमता कमज़ोर करता है और फंगल वृद्धि को बढ़ावा देता है। ज़्यादा जैविक भार वाला खराब पानी Saprolegnia को और फैलाता है। स्पॉन और फिंगरलिंग सबसे ज़्यादा खतरे में होते हैं।',
        firstResponse: [
          'प्रभावित मछलियों को साफ पानी में छोड़ने से पहले 10% पोटेशियम परमैंगनेट के घोल में 30–40 सेकंड डुबोएं।',
          'मरी हुई मछलियां तुरंत निकालें ताकि फैलाव रुके।',
          'पानी की गुणवत्ता सुधारें और एयरेशन बढ़ाएं।',
        ],
        farmerChecklist: [
          'घावों या चोट वाली जगहों पर रुई जैसी सफेद या भूरी वृद्धि देखें।',
          'जांचें कि क्या मछलियां तिरछी या उल्टी तैर रही हैं — संतुलन खोने का संकेत।',
          'देखें कि क्या बीमारी परिवहन, रफ हैंडलिंग या ठंड के बाद शुरू हुई।',
        ],
        callDoctorNow: [
          'फंगल वृद्धि तेज़ी से कई मछलियों में फैल रही है।',
          'स्पॉन या फिंगरलिंग की मौत तेज़ी से बढ़ रही है।',
          'बुनियादी उपचार के बाद भी फंगस बार-बार वापस आ रहा है।',
        ],
      },
      db: {
        name: 'फंगल संक्रमण (पंगास स्पॉन/फिंगरलिंग)',
        symptoms: [
          'संतुलन खोना — मछलियां तिरछी या उल्टी तैरती हैं',
          'घावों पर सफेद या भूरी रुई जैसी फंगल वृद्धि',
          'चोट वाली जगहों पर त्वचा के घाव और ऊतक क्षति',
          'खाना कम करना और सुस्ती',
          'इलाज न होने पर स्पॉन और फिंगरलिंग में ज़्यादा मौत',
        ],
        causes: [
          'फंगल संक्रमण: Saprolegnia spp.',
          'परिवहन, छंटाई या स्टॉकिंग के दौरान रफ हैंडलिंग से त्वचा की चोट',
          'ठंड का तनाव रोग प्रतिरोधक क्षमता कमज़ोर करता है और फंगल वृद्धि बढ़ाता है',
          'ज़्यादा जैविक भार वाला खराब पानी',
        ],
        prevention: [
          'परिवहन और स्टॉकिंग के दौरान फिंगरलिंग को धीरे से हैंडल करें — शारीरिक चोट कम करें',
          'स्टॉकिंग से पहले फिंगरलिंग को 10% पोटेशियम परमैंगनेट के घोल में 30–40 सेकंड डुबोएं',
          'पानी का तापमान 22°C से ऊपर रखें — ठंडा पानी फंगल वृद्धि को बढ़ावा देता है',
          'फैलाव रोकने के लिए मरी हुई मछलियां तुरंत निकालें',
          'नर्सरी तालाबों में pH बनाए रखने और जैविक भार कम करने के लिए चूना डालें',
        ],
        treatment: [
          'प्रभावित मछलियों को 10% पोटेशियम परमैंगनेट के घोल में 30–40 सेकंड डुबोएं',
          'तालाब में फफूंदनाशक के रूप में मैलाकाइट ग्रीन (0.1 mg/L) डालें — निकासी अवधि का पालन करें',
          'तालाब में नमक (NaCl) 3–5 किलो प्रति 1000 लीटर डालें',
          'उपचार के दौरान पानी की गुणवत्ता सुधारें और एयरेशन बढ़ाएं',
        ],
      },
    },
  },
};
