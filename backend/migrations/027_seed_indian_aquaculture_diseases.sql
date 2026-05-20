-- Migration 027: Seed Indian aquaculture diseases (Bihar/India-focused content)
-- Adds diseases from official ICAR / Bihar fisheries extension material:
--   EUS, Dropsy, Tail/Fin Rot, Argulosis, Lernaeosis, Leech Infection,
--   Gill Rot, Brown Blood Disease, Hydrogen Sulfide Toxicity,
--   Algal Toxicosis, Gas Bubble Disease.
-- Also updates Saprolegniasis, Ich, and Ammonia Toxicity with richer content
-- that matches Indian pond conditions and treatments.

INSERT INTO diseases (
    slug, name, category, affected_species, symptoms, causes, prevention, treatment,
    severity, mortality_rate, seasonality, water_conditions
) VALUES
-- ─── EUS / Red Spot Disease ───────────────────────────────────────────────
(
    'eus-red-spot',
    'EUS / Red Spot Disease',
    'FUNGAL',
    ARRAY['Rohu', 'Catla', 'Mrigal', 'Grass Carp', 'Common Carp', 'Silver Carp', 'Singhi', 'Mangur', 'Bhakur', 'Garai', 'Naini', 'Kavai', 'Tengra', 'Saura'],
    ARRAY[
      'Red spot-like wounds on the body that gradually spread',
      'Deep wounds in chronic stages with skin and scales falling off',
      'Fish jumping at the water surface',
      'Reduced feeding and slow growth'
    ],
    ARRAY[
      'Primary cause: fungus Aphanomyces invadans',
      'Often a mixed infection involving viruses, bacteria, and protozoans',
      'Triggered by entry of contaminated water during the rainy season',
      'Cold water stress and weak fish immunity'
    ],
    ARRAY[
      'Block contaminated water from entering the pond',
      'Apply quick lime periodically (200–600 kg per hectare based on pH)',
      'Net the pond once a month in summer, twice a month in winter',
      'Stock disease-free, well-acclimatized seed only'
    ],
    ARRAY[
      'Apply CIFAX (3–4 litres per hectare)',
      'Apply Sokrina WS (5–10 litres per hectare)',
      'Apply quick lime (200–600 kg per hectare based on water pH)',
      'Use a Potassium Permanganate plus salt combination as per advisory'
    ],
    'HIGH',
    50.00,
    ARRAY['monsoon', 'winter'],
    '{"temperatureRange":{"min":18,"max":28}}'::jsonb
),
-- ─── Dropsy ───────────────────────────────────────────────────────────────
(
    'dropsy',
    'Dropsy (Bacterial Hemorrhagic Septicemia)',
    'BACTERIAL',
    ARRAY['Rohu', 'Catla', 'Mrigal', 'Grass Carp', 'Common Carp', 'Silver Carp'],
    ARRAY[
      'Fluid build-up making the body and abdomen look swollen',
      'Scales standing out from the body (pinecone appearance)',
      'Eyes bulging out (exophthalmia)',
      'Disrupted or scattered blood vessels visible under the skin',
      'Reduced feeding and slow movement'
    ],
    ARRAY[
      'Bacteria: Aeromonas hydrophila and Aeromonas punctata',
      'Stress from poor water quality, ammonia spikes, or rough handling',
      'Wounds from netting or transport allowing bacterial entry'
    ],
    ARRAY[
      'Maintain good water quality with regular monitoring',
      'Avoid rough handling and netting injuries',
      'Disinfect nets, crates, and pond equipment between uses',
      'Apply lime regularly to keep pH stable'
    ],
    ARRAY[
      'Bath in 1 to 4 mg per litre Potassium Permanganate for 2 minutes daily for one week',
      'Antibiotic course only under doctor supervision',
      'Reduce feed during the treatment period'
    ],
    'HIGH',
    45.00,
    ARRAY['pre-monsoon', 'monsoon'],
    '{"ammoniaLevel":{"max":0.1}}'::jsonb
),
-- ─── Tail Rot / Fin Rot ───────────────────────────────────────────────────
(
    'tail-fin-rot',
    'Tail Rot / Fin Rot',
    'BACTERIAL',
    ARRAY['Rohu', 'Catla', 'Mrigal', 'Grass Carp', 'Common Carp', 'Silver Carp', 'Tilapia'],
    ARRAY[
      'Tail and fins begin to rot and become necrotic',
      'White lines or whitish edges appear on the fins',
      'Frayed and ragged fin margins',
      'Fish stay near the bottom and feed less'
    ],
    ARRAY[
      'Bacteria: Aeromonas salmonicida, Aeromonas sp., and Pseudomonas sp.',
      'Poor water hygiene and high organic load',
      'Crowding and physical injury during handling'
    ],
    ARRAY[
      'Maintain dissolved oxygen above 5 mg/L',
      'Avoid overstocking and rough handling',
      'Disinfect handling equipment between ponds',
      'Apply lime to control bacterial load'
    ],
    ARRAY[
      'Bath in 10–20 mg per litre Potassium Permanganate for 1 hour daily for 7–10 days',
      'Bath in 500 mg per litre Copper Sulphate for 10–15 days as advised',
      'Improve water quality before adding any chemical treatment'
    ],
    'MEDIUM',
    25.00,
    ARRAY['summer', 'monsoon'],
    '{"temperatureRange":{"min":24,"max":34}}'::jsonb
),
-- ─── Argulosis (Fish Louse) ───────────────────────────────────────────────
(
    'argulosis',
    'Argulosis (Fish Louse)',
    'PARASITIC',
    ARRAY['All freshwater fish', 'Rohu', 'Catla', 'Mrigal', 'Common Carp', 'Breeders'],
    ARRAY[
      'Visible small insect-like parasites (Argulus) on body and fins',
      'Excessive mucus secretion from the skin',
      'Fish dragging or rubbing their bodies along pond edges',
      'Small red wounds where parasites attached'
    ],
    ARRAY[
      'External parasite: Argulus species',
      'Common in muddy and polluted ponds',
      'Spreads through infected fish, water, or contaminated nets'
    ],
    ARRAY[
      'Quarantine new fish and disinfect them before stocking',
      'Net the pond regularly to detect early infestation',
      'Keep pond bottoms clean and dry pond once every 3 years'
    ],
    ARRAY[
      'Apply Dipterex (0.2 mg per litre) under expert guidance',
      'Manual removal of parasites for small batches',
      'Treat infested fish with Potassium Permanganate bath as advised'
    ],
    'MEDIUM',
    15.00,
    ARRAY['summer', 'monsoon'],
    '{}'::jsonb
),
-- ─── Lernaeosis (Anchor Worm) ─────────────────────────────────────────────
(
    'lernaeosis',
    'Lernaeosis (Anchor Worm)',
    'PARASITIC',
    ARRAY['All freshwater fish', 'Rohu', 'Catla', 'Mrigal', 'Common Carp'],
    ARRAY[
      'Long thread-like worms attached to body and fins',
      'Skin starts rotting around the attachment point',
      'Fish rubbing their body against pond bottom or hard objects',
      'Visible red wounds and ulcers on the body'
    ],
    ARRAY[
      'Parasite: Lernaea species',
      'Outbreak linked to entry of polluted water into the pond',
      'Spreads through infected wild fish and unfiltered intake water'
    ],
    ARRAY[
      'Block contaminated water from entering the pond',
      'Filter or screen all incoming water',
      'Net the pond regularly during summer'
    ],
    ARRAY[
      'Spray Gammexane (1 mg per litre) under expert supervision',
      'Spray Dipterex (0.2 mg per litre) as advised',
      'Manual removal for valuable broodstock'
    ],
    'MEDIUM',
    20.00,
    ARRAY['monsoon', 'post-monsoon'],
    '{}'::jsonb
),
-- ─── Leech Infection ──────────────────────────────────────────────────────
(
    'leech-infection',
    'Leech Infection',
    'PARASITIC',
    ARRAY['All freshwater fish'],
    ARRAY[
      'Brown or black leeches (5 to 15 mm) attached to body, gills, fins, or mouth',
      'Excessive mucus secretion',
      'Fish rubbing against hard objects',
      'Reduced growth and weight loss as leeches feed on blood'
    ],
    ARRAY[
      'External parasitic worms (leeches)',
      'Thrives in muddy and polluted pond bottoms',
      'High organic sludge build-up at the bottom'
    ],
    ARRAY[
      'Dry the pond and remove half a foot of bottom mud every 3 years',
      'Apply lime regularly to clean the bottom',
      'Avoid letting muddy or sewage water enter the pond'
    ],
    ARRAY[
      'Spray Glacial Acetic Acid (1.0 ml per litre) under guidance',
      'Apply Copper Sulphate (500 g per hectare)',
      'Transfer fish and dry out the infected pond as last resort'
    ],
    'MEDIUM',
    18.00,
    ARRAY['monsoon', 'post-monsoon'],
    '{}'::jsonb
),
-- ─── Gill Rot ─────────────────────────────────────────────────────────────
(
    'gill-rot',
    'Gill Rot Disease',
    'FUNGAL',
    ARRAY['Rohu', 'Catla', 'Mrigal', 'Common Carp', 'Tilapia'],
    ARRAY[
      'Gills lose natural red colour and become pale or grey',
      'Necrotic and rotting gill filaments',
      'Fish gasping at the surface and breathing heavily',
      'Reduced feeding'
    ],
    ARRAY[
      'Fungus: Branchiomyces demigrans',
      'Polluted, stagnant water and high organic load',
      'High temperature combined with low oxygen'
    ],
    ARRAY[
      'Maintain water exchange and avoid stagnation',
      'Reduce overfeeding and remove uneaten feed',
      'Apply lime to keep water alkalinity stable'
    ],
    ARRAY[
      'Improve aeration and water exchange immediately',
      'Apply Potassium Permanganate as per doctor advisory',
      'Reduce stocking density temporarily'
    ],
    'HIGH',
    35.00,
    ARRAY['summer'],
    '{"dissolvedOxygen":{"min":4}}'::jsonb
),
-- ─── Brown Blood Disease (Nitrite Toxicity) ───────────────────────────────
(
    'brown-blood-disease',
    'Brown Blood Disease (Nitrite Toxicity)',
    'ENVIRONMENTAL',
    ARRAY['All', 'Catla', 'Rohu', 'Mrigal', 'Tilapia', 'Common Carp'],
    ARRAY[
      'Brownish tint to the gills and blood',
      'Slow movement and gasping near the surface',
      'Reduced feeding and weight loss',
      'Fish appear weak even when oxygen levels look fine'
    ],
    ARRAY[
      'Nitrite toxicity when nitrite exceeds 1.0 ppm',
      'Methemoglobin formation in the blood',
      'Caused by overfeeding, high biomass, and weak nitrification'
    ],
    ARRAY[
      'Test nitrite weekly during high-feed periods',
      'Avoid overfeeding and remove uneaten feed promptly',
      'Apply pond probiotics to support nitrification',
      'Maintain regular water exchange'
    ],
    ARRAY[
      'Apply sodium chloride (40 kg per acre) to block nitrite uptake',
      'Reduce or stop feeding until levels normalize',
      'Exchange 25–50% of pond water',
      'Increase aeration'
    ],
    'HIGH',
    35.00,
    ARRAY['summer', 'pre-monsoon'],
    '{"ammoniaLevel":{"warningAbove":0.1}}'::jsonb
),
-- ─── Hydrogen Sulfide Toxicity ────────────────────────────────────────────
(
    'hydrogen-sulfide-toxicity',
    'Hydrogen Sulfide (H₂S) Toxicity',
    'ENVIRONMENTAL',
    ARRAY['All'],
    ARRAY[
      'Foul rotten-egg smell from pond water',
      'Black sludge at the pond bottom',
      'Fish gasping at surface and avoiding the bottom',
      'Sudden mortality especially after stirring the bottom'
    ],
    ARRAY[
      'Toxic build-up of hydrogen sulfide at the pond bottom',
      'High aquatic vegetation restricting water circulation',
      'Heavy organic sludge with no aeration at the bottom'
    ],
    ARRAY[
      'Remove excess aquatic vegetation regularly',
      'Aerate the pond during early morning hours',
      'Dry the pond every 3 years and remove bottom mud',
      'Avoid overfeeding'
    ],
    ARRAY[
      'Increase aeration immediately',
      'Apply lime to neutralize the bottom (200–500 kg per hectare)',
      'Exchange 25–50% of pond water',
      'Stop feeding until smell and water condition normalize'
    ],
    'HIGH',
    40.00,
    ARRAY['summer'],
    '{}'::jsonb
),
-- ─── Algal Toxicosis / Algal Bloom ────────────────────────────────────────
(
    'algal-toxicosis',
    'Algal Toxicosis / Algal Bloom',
    'ENVIRONMENTAL',
    ARRAY['All'],
    ARRAY[
      'Pond water turns deep green, blue-green, or brown',
      'Foul smell from the water',
      'Sudden fish mortality at dawn after a bloom crash',
      'Fish gasping and refusing feed'
    ],
    ARRAY[
      'Excessive unbalanced algal growth',
      'Overfeeding and high nutrient load',
      'Stagnant water with little exchange',
      'Bloom crash leads to sudden oxygen depletion'
    ],
    ARRAY[
      'Avoid overfeeding and remove uneaten feed daily',
      'Maintain stable plankton with regular water exchange',
      'Avoid feeding when water turns deep green or smells bad',
      'Apply lime periodically to balance water chemistry'
    ],
    ARRAY[
      'Stop feeding immediately if water turns green and smells bad',
      'Increase aeration to prevent overnight oxygen crash',
      'Exchange 25–50% pond water',
      'Apply pond probiotics to recover the system'
    ],
    'HIGH',
    50.00,
    ARRAY['summer', 'monsoon'],
    '{"dissolvedOxygen":{"criticalBelow":4}}'::jsonb
),
-- ─── Gas Bubble Disease (Super-saturation) ───────────────────────────────
(
    'gas-bubble-disease',
    'Gas Bubble Disease (Super-saturation)',
    'ENVIRONMENTAL',
    ARRAY['All', 'Fingerlings', 'Larvae'],
    ARRAY[
      'Tiny gas bubbles visible under the skin or in eyes',
      'Erratic swimming or fish floating belly-up',
      'Eye protrusion in severe cases',
      'Sudden mortality of fingerlings during peak sun hours'
    ],
    ARRAY[
      'Excessively high dissolved oxygen (super-saturation)',
      'Common during summer and rainy seasons',
      'Heavy algal photosynthesis on bright days',
      'Sudden temperature changes'
    ],
    ARRAY[
      'Avoid extreme algal blooms — manage feeding and fertilizer carefully',
      'Aerate gently during peak sun hours',
      'Provide shaded zones for fingerlings'
    ],
    ARRAY[
      'Increase water exchange to release excess gas',
      'Reduce algal density with controlled liming',
      'Move affected fish to deeper, cooler water'
    ],
    'MEDIUM',
    20.00,
    ARRAY['summer', 'monsoon'],
    '{}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Update existing diseases with richer Indian-specific symptoms/causes/treatments
UPDATE diseases SET
    name = 'White Spot Disease (Ich)',
    affected_species = ARRAY['Rohu', 'Catla', 'Mrigal', 'Tilapia', 'Common Carp', 'Ornamental fish', 'All freshwater species'],
    symptoms = ARRAY[
      'Small white pinhead-sized cysts on body and fins',
      'Excessive sticky mucus secretion from the skin',
      'Fish rubbing or dragging their bodies against pond edges',
      'Gasping at the surface in heavy infections'
    ],
    causes = ARRAY[
      'Protozoan parasite: Ichthyophthirius multifiliis',
      'Outbreaks triggered by polluted pond water',
      'Sudden temperature drops weaken fish defense',
      'Introduction of unquarantined fish'
    ],
    prevention = ARRAY[
      'Quarantine all new stock for at least one week',
      'Avoid sudden temperature changes',
      'Keep pond water clean — block contaminated water inflow',
      'Net pond regularly to detect early infections'
    ],
    treatment = ARRAY[
      'Apply quick lime (300–500 kg per hectare)',
      'Bath in 1:5000 Formalin solution for 1 hour daily for 7 days',
      'Improve water quality before applying any chemical',
      'Increase aeration during treatment'
    ]
WHERE slug = 'ich-white-spot';

UPDATE diseases SET
    affected_species = ARRAY['Rohu', 'Catla', 'Mrigal', 'Common Carp', 'Tilapia', 'Trout', 'All freshwater species'],
    symptoms = ARRAY[
      'White cotton-wool-like growth on body, fins, and gills',
      'Dull whitish patches spreading across skin',
      'Cotton-like fungus on eggs in hatchery trays',
      'Fish becoming weak and refusing feed'
    ],
    causes = ARRAY[
      'Fungus: Saprolegnia parasitica',
      'Spreads rapidly during rainy season or when contaminated water enters',
      'Skin injuries from rough handling',
      'Cold stress and dead organic matter in pond'
    ],
    prevention = ARRAY[
      'Block contaminated water entry into the pond',
      'Handle fish gently to prevent skin injuries',
      'Remove dead fish, dead eggs, and decaying organic matter quickly',
      'Apply lime regularly during winter and rainy season'
    ],
    treatment = ARRAY[
      'Treat pond with 3% salt solution',
      'Apply Formalin (2.5 litres) plus Malachite Green (250 g) per 100 litres of water per acre',
      'Feed mixed with 5–6 g of salt per kg of feed for 5–6 days',
      'Improve water quality and remove dead biomass'
    ]
WHERE slug = 'saprolegniasis';

UPDATE diseases SET
    treatment = ARRAY[
      'Reduce feed by 50% immediately',
      'Apply zeolite (10–20 kg per hectare) to absorb ammonia',
      'Exchange 25–50% pond water',
      'Apply pond probiotics to support nitrification',
      'Increase aeration'
    ]
WHERE slug = 'ammonia-toxicity';
