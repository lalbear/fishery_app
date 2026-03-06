# 📊 Market Data Integration Strategy (v1.1)

Based on comprehensive species-wise market mapping, the following strategy will be used to ensure 100% price coverage for the 42-species catalog.

---

## 🔗 Primary Data Sources (APIs & Scraping)

| Source | Role in App | Data Focus | Integration Path |
|---|---|---|---|
| **FMPIS (NFDB)** | **New Secondary Scraper** | Broad national coverage (138 species) | [fmpisnfdb.in](https://fmpisnfdb.in/prices/dashboard) |
| **Agmarknet** | **Existing Primary Scraper** | Inland wholesale commodities (Carps, Carpio, Pangasius) | [agmarknet.gov.in](https://agmarknet.gov.in) |
| **MPEDA Prime** | **Manual/API** | Shrimp Farmgate prices (Vannamei/Black Tiger) | [mpeda.gov.in](https://mpeda.gov.in/?page_id=10156) |

---

## 💰 Species Benchmark Pricing (2025-2026 Reference)

Used as placeholder/benchmark data when live feeds are unavailable.

### 🦐 Shrimp & Prawns
- **Vannamei Shrimp**: ₹320–430/kg (Farmgate 60-count)
- **Black Tiger Shrimp**: ₹500–700/kg
- **Scampi (Giant Prawn)**: ₹600–900/kg

### 🐍 Murrels (Snakehead) - High Value
- **Striped Murrel**: ₹400–650/kg
- **Giant Murrel**: ₹500–800/kg

### 🐟 Catfish & Niche Freshwater
- **Pabda**: ₹500–700/kg (Premium Bengali Niche)
- **Magur / Singhi**: ₹350–600/kg (Medicinal/Live market)
- **Tengra**: ₹300–500/kg

### ❄️ Cold Water & Marine
- **Rainbow Trout**: ₹430–800/kg (Peak regional pricing)
- **Bhetki (Sea Bass)**: ₹360–470/kg (Wholesale)
- **Mud Crab**: ₹500–600/kg (Premium grades)
- **Cobia / Grouper**: ₹450–900/kg (Marine landing benchmarks)

---

## 🛠️ Implementation Roadmap

### Phase 1: Support Hotline Integration (Next Release)
Add the MPEDA Missed-Call Service buttons directly in the "No Trade Data" placeholder:
- **Vannamei Support**: `+91-8590100800`
- **Black Tiger Support**: `+91-8590200800`

### Phase 2: FMPIS Scraper Development
Build a new background worker `fmpisScraper.ts` to pull from the NFDB dashboard. This will fill the gaps for marine fish and niche catfish that Agmarknet misses.

### Phase 3: Qualitative Price Tags
For Mahseer and sport fish, display "Non-commercial / Conservation species" instead of price placeholders.
