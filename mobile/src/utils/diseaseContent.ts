export type DiseaseEducationContent = {
  overview: string;
  whyItHappens: string;
  firstResponse: string[];
  farmerChecklist: string[];
  callDoctorNow: string[];
};

const FALLBACK_CONTENT: DiseaseEducationContent = {
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

const CONTENT_BY_SLUG: Record<string, DiseaseEducationContent> = {
  columnaris: {
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
  'aeromonas-septicemia': {
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
  'white-spot-syndrome': {
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
  'ich-white-spot': {
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
  saprolegniasis: {
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
  'oxygen-depletion': {
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
  'ammonia-toxicity': {
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
};

export function getDiseaseEducationContent(slug?: string): DiseaseEducationContent {
  const normalizedSlug = slug?.trim().toLowerCase() ?? '';
  return CONTENT_BY_SLUG[normalizedSlug] ?? FALLBACK_CONTENT;
}
