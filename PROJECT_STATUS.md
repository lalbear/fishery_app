# 🎣 Fishing God — Project Status & Feature Tracker

> **Last Updated:** March 2026  
> **Version:** ~0.8 (Pre-release, feature-complete core, polish in progress)  
> **App Name:** Fishing God — Aquaculture Intelligence Platform  
> **Repository:** `github.com/lalbear/fishery_app`

---

## 🎯 Goal & Vision

**Fishing God** is an **offline-first, AI-assisted aquaculture intelligence platform** for Indian fish farmers. The goal is to bridge the knowledge and technology gap between modern aquaculture science and rural farmers who often have no access to agronomists, financial advisors, or real-time market data.

### What we are building

A mobile application (React Native/Expo) backed by a Node.js API that puts the following intelligence directly in a farmer's hands:

1. **Know what to farm** — Species selection based on local water quality, salinity, and regional climate
2. **Know if it's viable** — Full ROI simulation with CAPEX/OPEX breakdown, PMMSY government subsidy calculations, and sensitivity analysis
3. **Know your environment** — GPS-based geo-suitability analysis: given your pond's location and water source, what aquaculture systems and species are suitable?
4. **Track water quality** — Log and trend critical pond parameters (temperature, DO, pH, salinity, ammonia) with instant health status alerts
5. **Stay informed on prices** — Live market price data for aquaculture commodities
6. **Choose the right gear & feed** — A browseable catalog of aquaculture equipment and feeds

### Target Audience

- Small-to-medium scale fish/shrimp farmers in India
- Rural demographics: icon-driven UI, multi-language support (7 Indian languages)
- Farmers applying for PMMSY (Pradhan Mantri Matsya Sampada Yojana) subsidies

---

## 🏗️ Architecture Overview

```
[React Native Mobile App]  ←→  [Node.js + Express API]  ←→  [PostgreSQL + PostGIS]
        (Expo)                         (Port 3000)                   (+ Redis cache)
   WatermelonDB (offline)         ├── EconomicsSimulator         ├─ knowledge_nodes table
   7-language i18n                ├── GeoSuitabilityService      ├─ water_quality_readings
   GPS + MapView                  ├── PMMSYSubsidyService        ├─ Species / Economic data
   Ionicons UI                    ├── Market Worker (Puppeteer)  └─ Geography zones
```

**Key technology choices:**
- **WatermelonDB** — Local SQLite-backed offline-first storage on device  
- **PostgreSQL + PostGIS** — Spatial queries for geography and suitability data  
- **Redis** — API response caching for market prices and species data  
- **OpenStreetMap Nominatim** — Free reverse geocoding (no API key needed, avoids rate-limits)  
- **Expo** — Cross-platform build & deployment (Android + iOS from one codebase)

---

## ✅ What Has Been Achieved (Completed Features)

### Backend Infrastructure
- [x] **Full REST API** built with Node.js + Express + TypeScript running on port 3000
- [x] **PostgreSQL database** with PostGIS extension, migrated via versioned SQL migration files (`001_initial_schema.sql`, `002_seed_data.sql`)
- [x] **`knowledge_nodes` table** — JSONB-powered flexible storage for both species biological data and economic models
- [x] **Docker Compose** setup: runs PostgreSQL, Redis, Backend API, and a Market Data Worker all together
- [x] **Multi-stage Dockerfiles** for production — separate build stages for backend and market worker
- [x] **Redis caching** integrated for API responses
- [x] **Structured logger** (`utils/logger.ts`) across backend

### Geographic Suitability Engine (`/api/v1/geo`)
- [x] **POST `/geo/suitability`** — Takes GPS coordinates + state/district + water source type → returns a suitability score (0–100), water quality classification (freshwater/brackish/saline), recommended cultivation systems, and species restrictions
- [x] **GET `/geo/zones`** — Returns all Indian administrative zones (States + Districts) from database
- [x] **GeoSuitabilityService.ts** — Full logic implementation including:
  - Salinity-based water classification (freshwater < 1000 μS/cm, brackish 1000-3000, saline > 3000)
  - State-level default fallbacks (handles missing district data gracefully)
  - Null checks to prevent 500 errors on incomplete data
  - District code validation for all 36 Indian States/UTs

### ROI Economics Simulator (`/api/v1/economics`)
- [x] **POST `/economics/simulate`** — End-to-end simulation that takes land size, capital, salinity, risk tolerance, farmer category, state/district — returns a full financial projection
- [x] **POST `/economics/subsidy`** — Standalone PMMSY subsidy calculation endpoint
- [x] **`EconomicsSimulatorService.ts`** — 13-step simulation pipeline:
  - Water type classification
  - Eligible species filtering from database
  - Optimal cultivation system selection (`TRADITIONAL_POND`, `BIOFLOC`, `RAS`, `BRACKISH_POND` — scaled per hectare)
  - CAPEX calculation with itemized equipment costs (aerators, blowers, biofloc tanks, RAS pumps/UV)
  - OPEX calculation **including feed cost** (`feed_cost_inr_per_kg_fish × avgYield`)
  - PMMSY subsidy application (40% General / 60% Women+SC+ST, capped by project type and land area)
  - Net profit = Revenue − OPEX − CAPEX (after subsidy)
  - Break-even calculation based on harvest cycles (not naive monthly division)
  - Benefit-Cost Ratio
  - Monthly cash flow projection for the culture period
  - Sensitivity analysis (best/worst case, ±10% price, −15% yield, +20% feed cost)
  - Risk analysis profile with mitigation strategies
- [x] **`PMMSYSubsidyService.ts`** — Exact PMMSY rules: freshwater (₹4L cap), brackish (₹6L cap), RAS (₹25L cap)
- [x] **All known calculation bugs fixed** (from March 2026 debugging sessions):
  - Bug 1: Net profit now deducts CAPEX
  - Bug 2: Feed cost now included in OPEX
  - Bug 3: PMMSY subsidy now uses land area (not just unit cost)
  - Bug 4: System selection now uses capital _per hectare_ (scales correctly for large farms)
  - Bug 5: Break-even calculates in harvest cycles, not flat months

### Species & Knowledge Data (`/api/v1/species`)
- [x] **GET `/species`** — Returns all species from `knowledge_nodes` table
- [x] **GET `/species/:id`** — Species detail by ID
- [x] **GET `/species/search?q=`** — Text search on species names
- [x] **GET `/species/category/:category`** — Filter by category (e.g., `INDIAN_MAJOR_CARP`, `SHRIMP`)
- [x] **Species data seeded** for: Rohu (*Labeo rohita*), Catla (*Catla catla*), Mrigal (*Cirrhinus mrigala*), Pangasius (*Pangasianodon hypophthalmus*), Vannamei Shrimp (*Litopenaeus vannamei*), Black Tiger Shrimp (*Penaeus monodon*), Tilapia (*Oreochromis niloticus*), Scampi (*Macrobrachium rosenbergii*)
- [x] **Economic Models seeded** for each cultivation system matching species data
- [x] **Excel data extraction** — `India_Aquaculture_Economics_v2.xlsx` and `India_Aquaculture_Species_Parameters.xlsx` parsed and seeded into `knowledge_nodes`

### Water Quality Module (`/api/v1/water-quality`)
- [x] **POST `/water-quality/readings`** — Saves a water quality reading for the current user
- [x] **GET `/water-quality/readings`** — Fetches historical readings
- [x] **Backend persistence** fully wired up (readings stored in PostgreSQL, not just local)
- [x] **Market Data Worker** — Background Puppeteer/Chromium worker scraping NFDB market prices

### Mobile App — Screens & Navigation
- [x] **Tab Navigation** — Bottom tabs: Home, Map (Suitability), Species, Market Prices, Profile
- [x] **Stack Navigator** — Nested navigation for Economics flow and Species Detail

#### Home Screen ✅ Working
- Grid of quick-action cards: Species, ROI Calculator, Water Quality, Market Prices, Equipment Catalog, Feed & Nutrition
- Icon-driven design optimized for rural/low-literacy users

#### Geo Suitability / Map Screen ✅ Working
- Full-screen `react-native-maps` MapView
- GPS auto-detection with `expo-location`
- **OSM Nominatim reverse geocoding** — auto-fills state & district from GPS coordinates (no API key)
- Tap-to-move marker: tapping anywhere on map updates analysis location
- State/District dropdowns backed by live `/geo/zones` API data
- Water source & salinity inputs
- Suitability result card: score, water profile classification, top 3 recommended systems, restricted species tags, critical warnings

#### Economics / ROI Calculator ✅ Working
- Input form: land size (acres → converts to hectares), state, district, salinity, capital (INR)
- Risk tolerance selector (Low / Medium / High)
- Farmer category for PMMSY: General / Women / SC / ST
- Optional preferred species selector (7 species + auto-recommend)
- Full simulation via API → navigates to `EconomicsResultScreen`

#### Economics Result Screen ✅ Working
- Displays: recommended species list (sorted by compatibility score), recommended system, gross revenue, net profit, CAPEX, subsidized CAPEX, subsidy amount, benefit-cost ratio, break-even timeline
- Monthly cash flow table
- Sensitivity analysis section (best/worst case scenarios)

#### Species Screen ✅ Working
- Browses all species from live backend API
- Category filter (All / Indian Major Carps / Shrimp / Catfish / etc.)
- Search by common/scientific name

#### Species Detail Screen ✅ Working
- Full biological parameters: temperature range, pH, DO, salinity tolerance, FCR
- Economic parameters: market price, survival rate, crops per year
- Cultural requirements: stocking density, culture duration

#### Water Quality Screen ✅ Working
- Tab UI: "Add Reading" and "History"
- Log: Temperature, Dissolved Oxygen, pH, Salinity, Ammonia, Notes
- Saves to backend API via POST
- History: pull-to-refresh, chronological list of past readings
- Status badges: ✓ Normal / ⚠ Warning / 🚨 Alert (computed from parameter thresholds)

#### Market Prices Screen ✅ Working (live API)
- Fetches latest market prices from backend
- Switched from hardcoded mock data to live `/market/prices` API endpoint

#### Equipment Catalog Screen ✅ Working
- Grid-based category browser (Aeration, Filtration, Feeding, Measurement, Biosecurity)
- Shows equipment name, description, price (INR), specifications
- Data backed by `knowledge_nodes` with `node_type = 'EQUIPMENT'`

#### Feed Catalog Screen ✅ Working
- Browse aquaculture feeds by type (Starter, Grow-out, Finisher)
- Feed details: protein %, FCR, compatible species, price per kg

#### Profile Screen ⚠️ UI Shell Only (NOT FUNCTIONAL)
- Shows menu items: Personal Info, My Ponds, Language, Offline Mode, Sync Data, Settings, Logout
- **All menu items have empty `onPress: () => {}` handlers — nothing actually works**
- Username and phone number are hardcoded placeholder values ("Farmer Name", "+91 98765 43210")
- No authentication flow implemented

### Multi-Language Support
- [x] `react-i18next` integrated
- [x] Translation files exist for: English, Hindi, Bengali, Telugu, Tamil, Malayalam, Kannada
- [x] Language key structure consistent across major screens
- [ ] **Some screens have fallback strings** (e.g., `t('home.welcome') || 'Fishing God'`) — translations not 100% complete for all keys

### Infrastructure & DevOps
- [x] `docker-compose.yml` runs full stack (DB, Redis, API, Worker)
- [x] Backend Dockerfile + Dockerfile.worker (multi-stage builds)
- [x] Database migration scripts (`001_initial_schema.sql`, `002_seed_data.sql`)
- [x] Seed scripts for brackish species (`seed_brackish.ts`)
- [x] WatermelonDB/LokiJS deprecation warnings resolved for modern browsers

---

## ⚠️ Features With Known Issues / Incomplete

### Profile Screen — Complete Skeleton
**Status: 🔴 Non-functional**  
All actions (personal info, pond management, language switch, offline mode, sync, settings, logout) have empty handlers. The screen renders a UI shell with hardcoded user data. No authentication system (JWT/OTP) is wired to the mobile app.

**Impact:** Users cannot create accounts, log in, or personalize the app.

### Authentication / User System
**Status: 🔴 Missing on mobile**  
The backend API includes JWT auth (`JWT_SECRET` in env), and the README documents a `/auth/login` endpoint (phone + OTP flow). However, there is **no login/registration screen** in the mobile app. The app currently works without authentication — all API calls are unauthenticated.

**Impact:** Water quality readings and future user-specific data cannot be attributed to specific users. Multi-pond management is impossible.

### Offline Sync (WatermelonDB)
**Status: 🟡 Integrated but not battle-tested**  
WatermelonDB is listed as a dependency and the architecture doc references it as the offline-first local storage layer. However, the actual sync mechanisms (background sync job, conflict resolution) have not been verified as working end-to-end. The `SYNC_INTERVAL_MINUTES` env var exists but the sync worker behavior is unclear.

**Impact:** The app may lose data on poor connectivity; offline-first capability is not guaranteed.

### Market Prices — Real Scraping Reliability
**Status: 🟡 Works but fragile**  
The market worker uses Puppeteer to scrape `nfdb.fishmarket.gov.in` and `agmarknet.gov.in`. Web scraping is inherently fragile — website redesigns or anti-bot measures will break the worker silently.

**Impact:** Market prices may be stale or unavailable if the scraping targets change.

### Real-time Notifications / Alerts
**Status: 🔴 Not implemented**  
There is no push notification system. The Water Quality screen shows local status badges (Normal/Warning/Alert), but there is no threshold-based alerting, no notification when DO drops critically, and no integration with FCM/APNs.

**Impact:** Farmers cannot be alerted when pond conditions become critical without actively checking the app.

### Translation Coverage
**Status: 🟡 Partial**  
i18n files exist for 7 languages but not all string keys are translated. Several screens use inline fallback strings (e.g., `t('key') || 'English fallback'`) suggesting some translations are missing. Equipment Catalog and Feed Catalog screens appear to have mostly English-only strings.

### Map Screen — Web Fallback
**Status: 🟡 Degraded on Web**  
There is a `MapScreen.web.tsx` file (3.4KB) which is the web platform version of the map. Given `react-native-maps` doesn't support web, the web version likely shows a stripped-down no-map UI. The full GPS + MapView feature only works on native Android/iOS.

---

## 🚀 Next Steps (Prioritized)

### Priority 1 — Authentication System (Blocker for Production)
**Effort: ~1 week**
- Build a Login/Registration screen with phone number + OTP
- Wire JWT token storage (AsyncStorage or SecureStore)
- Add auth headers to all `apiService` calls
- Backend `/auth/login` endpoint is already scaffolded (needs verification)
- Add auth context/provider in `App.tsx`

### Priority 2 — Profile Screen Functionality
**Effort: ~3 days**
- Personal Info: name, village, district, farmer category — editable form, POST to API
- My Ponds: list of farmer's ponds with key parameters (size, species, system type)
- Language switcher: call `i18n.changeLanguage()` on selection, persist to AsyncStorage
- Logout: clear JWT token, navigate to login screen

### Priority 3 — Multi-Pond Management
**Effort: ~1 week**
- Database schema: `ponds` table linked to `users`
- API endpoints: CRUD for ponds
- Mobile: punch ponds into profile, select active pond for water quality logging and ROI simulation

### Priority 4 — Push Notifications
**Effort: ~4 days**
- Integrate Expo Notifications (`expo-notifications`)
- Backend: implement threshold-checking cron job on water quality readings
- Alert triggers: DO < 4 mg/L → "Critical: Low Oxygen", pH outside 6.5–8.5, ammonia > 0.1 mg/L
- Foreground and background notification handling

### Priority 5 — Offline Sync Hardening
**Effort: ~3 days**
- Verify WatermelonDB sync actually works with backend
- Implement conflict resolution strategy (last-write-wins for water quality readings)
- Add visual sync status indicator in UI (last synced timestamp, pending changes count)
- Test behaviour on airplane mode → reconnect → sync

### Priority 6 — Translation Completion
**Effort: ~2 days**
- Audit all `t()` call keys against all 7 language JSON files
- Fill gaps in Hindi, Bengali, Telugu, Tamil, Malayalam, Kannada translations
- Remove fallback strings once all keys are confirmed translated
- Translate Equipment Catalog and Feed Catalog screens

### Priority 7 — Market Data Reliability
**Effort: ~2 days**
- Add health monitoring to the market scraper worker (alert when scraping fails)
- Consider using official government APIs (`agmarknet.gov.in` has an XML API)
- Implement stale data warning in the MarketPrices screen (`Last updated: X hours ago`)
- Cache fallback: return last-known-good prices when fresh scrape fails

### Priority 8 — App Store Preparation
**Effort: ~3 days**
- Set up Expo EAS (Expo Application Services) build profiles
- Configure `app.json` with proper bundle ID, version, icon, splash screen
- Add onboarding flow for first-time users
- Privacy policy & terms of service screens (required by app stores)
- Production environment configuration (API base URL for production)

---

## 📁 Key File Reference

| File | Purpose |
|---|---|
| `backend/src/services/EconomicsSimulatorService.ts` | Core 13-step ROI simulation engine (581 lines) |
| `backend/src/services/GeoSuitabilityService.ts` | Geo suitability analysis with salinity logic (15KB) |
| `backend/src/services/PMMSYSubsidyService.ts` | PMMSY government subsidy calculations |
| `backend/src/routes/economics.ts` | Economics API routes |
| `backend/src/routes/geography.ts` | Geography/zones API routes |
| `backend/src/routes/species.ts` | Species data API routes |
| `backend/src/routes/market.ts` | Market prices API routes |
| `backend/src/routes/waterQuality.ts` | Water quality CRUD routes |
| `backend/migrations/001_initial_schema.sql` | Database schema |
| `backend/migrations/002_seed_data.sql` | Initial data seed |
| `mobile/src/screens/HomeScreen.tsx` | Main dashboard with quick-action grid |
| `mobile/src/screens/MapScreen.tsx` | GPS + geo suitability analysis screen |
| `mobile/src/screens/EconomicsScreen.tsx` | ROI calculator form |
| `mobile/src/screens/EconomicsResultScreen.tsx` | Full simulation results display |
| `mobile/src/screens/SpeciesScreen.tsx` | Species browser |
| `mobile/src/screens/SpeciesDetailScreen.tsx` | Species detail view |
| `mobile/src/screens/WaterQualityScreen.tsx` | Water quality logging + history |
| `mobile/src/screens/MarketPricesScreen.tsx` | Live market price feed |
| `mobile/src/screens/EquipmentCatalogScreen.tsx` | Equipment browser |
| `mobile/src/screens/FeedCatalogScreen.tsx` | Feed/nutrition browser |
| `mobile/src/screens/ProfileScreen.tsx` | Profile (UI shell only — NOT FUNCTIONAL) |
| `mobile/src/services/apiService.ts` | All API calls from mobile to backend |
| `mobile/src/i18n/` | Translation files (7 languages) |
| `India_Aquaculture_Economics_v2.xlsx` | Source economic model data |
| `India_Aquaculture_Species_Parameters.xlsx` | Source species biological data |

---

## 🔢 Feature Status Summary

| Feature | Backend | Mobile UI | End-to-End | Notes |
|---|---|---|---|---|
| Geo Suitability Engine | ✅ | ✅ | ✅ | Fully working |
| ROI / Economics Simulator | ✅ | ✅ | ✅ | All known bugs fixed |
| PMMSY Subsidy Calculation | ✅ | ✅ | ✅ | Part of simulator |
| Species Data Browser | ✅ | ✅ | ✅ | 8 species seeded |
| Water Quality Logging | ✅ | ✅ | ✅ | History + status badges |
| Market Prices | ✅ (scraper) | ✅ | ✅ | Fragile scraping |
| Equipment Catalog | ✅ | ✅ | ✅ | Static data |
| Feed Catalog | ✅ | ✅ | ✅ | Static data |
| GPS Map + Auto-fill | N/A | ✅ | ✅ | OSM Nominatim geocoding |
| Offline-First (WatermelonDB) | N/A | 🟡 | 🟡 | Integrated, not verified |
| User Authentication | 🟡 (JWT) | 🔴 | 🔴 | No login screen |
| Profile Management | 🔴 | 🔴 | 🔴 | Both sides missing |
| Multi-Pond Management | 🔴 | 🔴 | 🔴 | Not started |
| Push Notifications | 🔴 | 🔴 | 🔴 | Not started |
| Multi-language (i18n) | N/A | 🟡 | N/A | ~80% translated |
| Production Deployment | ✅ Docker | N/A | 🟡 | Documented, not deployed |

**Legend:** ✅ Complete &nbsp; 🟡 Partial / In Progress &nbsp; 🔴 Not Started / Broken

---

*This document is the single source of truth for project status. Update it after each major feature completion or bug fix.*
