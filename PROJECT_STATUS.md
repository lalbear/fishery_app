# Fishing God — Current Product Status / AI Handoff

> Last updated: April 2, 2026  
> Repository: `lalbear/fishery_app`  
> Purpose: This file is a practical handoff for another AI/code assistant to understand what exists today, what is partially wired, what is missing, and where the best next feature opportunities are.

## What this app is

Fishing God is a mobile-first aquaculture assistant for Indian users. It combines:

- species discovery
- ROI simulation
- subsidy guidance
- geo suitability
- market prices
- water quality logging
- pond management
- beginner education

The product is split into:

- a React Native + Expo mobile app in [`mobile/`](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile)
- a Node.js + Express + PostgreSQL backend in [`backend/`](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend)
- local offline-first mobile storage via WatermelonDB
- a seeded institutional knowledge layer for subsidy/policy/economic assumptions

## High-level architecture

### Mobile

- React Native + Expo
- WatermelonDB for local storage
- AsyncStorage for user profile/token/theme
- React Navigation
- i18n currently present for English and Hindi only

### Backend

- Node.js + Express + TypeScript
- PostgreSQL
- routes for auth, economics, geography, species, market, sync, water quality, knowledge
- institutional `knowledge_rules` table with seeded policy/economics records

## Current feature inventory

The statuses below are based on current code, not marketing intent.

### 1. Authentication

Status: `Working, but basic`

What exists:

- Login and signup UI in [AuthScreen.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/screens/AuthScreen.tsx)
- Backend auth routes in [auth.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/auth.ts)
- Token persistence in [authService.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/services/authService.ts)
- Local auth gate in [AuthContext.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/AuthContext.tsx)

What works:

- user can sign up
- user can log in
- token is stored locally
- auth screen disappears after successful login
- profile fields are seeded locally from auth response

What is incomplete:

- no forgot password flow
- no OTP flow
- no token refresh/session expiry handling
- token is not globally attached to every API request
- most backend feature routes are not strongly auth-protected

### 2. Home dashboard

Status: `Working`

What exists:

- Quick actions for species, economics, water quality, market, equipment, feed
- weather card
- beginner learning entry card
- notification bell
- active harvest widget if pond data is rich enough

What works:

- clean dashboard navigation
- quick action entry points
- weather component
- learning center entry

What is incomplete:

- bell icon is not a true notification system
- bell currently shows an `Alert.alert(...)` style message, not push/inbox notifications
- active-harvest logic depends on pond fields that the current Add Pond form does not yet capture fully

### 3. Species browser

Status: `Working`

What exists:

- Species list screen
- search/filter
- species detail screen
- backend species routes in [species.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/species.ts)

What works:

- fetch all species
- search species
- filter by category
- show detailed biological/economic information

Limitations:

- quality depends on seeded `knowledge_nodes`
- no user notes/favorites/compare flow yet

### 4. Economics simulator

Status: `Working and one of the strongest modules`

What exists:

- economics input form in [EconomicsScreen.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/screens/EconomicsScreen.tsx)
- simulation result screen in [EconomicsResultScreen.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/screens/EconomicsResultScreen.tsx)
- backend simulator in [EconomicsSimulatorService.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/services/EconomicsSimulatorService.ts)
- economics routes in [economics.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/economics.ts)

What works:

- land size, salinity, capital, farmer category, state, district, risk tolerance inputs
- backend simulation
- recommended species output
- recommended system output
- projected revenue, profit, CAPEX, working capital, subsidy, breakeven, BCR
- policy-backed guidance on input and result screens
- expandable species cards with “why this species fits” reasons
- compatibility color grading on result cards

What is especially good:

- subsidy preview is backed by seeded institutional rules
- result screen explains beneficiary subsidy and funding share
- compatibility cards now explain reasons like FCR/BCR/survival

What is incomplete:

- user cannot explicitly choose project template type like pond vs shrimp vs RAS from the form
- some assumptions are still system-inferred rather than chosen by the user
- no “save simulation” workflow exposed to user even though local schema exists for economics simulations
- no lender-ready DPR export / PDF export yet

### 5. Knowledge-backed policy guidance

Status: `Working`

What exists:

- Seeded `knowledge_rules` dataset in [knowledge_rules.json](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/data/knowledge_rules.json)
- Knowledge API in [knowledge.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/knowledge.ts)
- Knowledge service in [KnowledgeRulesService.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/services/KnowledgeRulesService.ts)
- Policy guidance UI in [PolicyGuidanceScreen.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/screens/PolicyGuidanceScreen.tsx)

What works:

- state/category subsidy preview
- funding share explanation
- state benchmark display where available
- document-backed template assumptions
- disclaimers and warnings

What is incomplete:

- knowledge dataset is still relatively small
- not every state/project type has good seeded records
- guidance is mostly read-only and internal-to-app; there is no admin knowledge management flow

### 6. Learning Center

Status: `Working`

What exists:

- Beginner-friendly educational screen in [LearningCenterScreen.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/screens/LearningCenterScreen.tsx)
- linked from Home, Economics, Profile, and Policy Guidance

What works:

- explains aquaculture basics
- explains FCR, BCR, CAPEX, OPEX, survival, culture period
- explains subsidy in simpler terms
- explains how to read ROI results
- gives beginner warnings

What is incomplete:

- content is static/in-app, not CMS-driven
- no state-specific educational flows
- no rich visuals, comparisons, or “choose your business type” wizard yet

### 7. Geo suitability / map

Status: `Likely working, not deeply re-QAed in this pass`

What exists:

- map screen
- geography routes in [geography.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/geography.ts)
- suitability service in [GeoSuitabilityService.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/services/GeoSuitabilityService.ts)

What should work from code:

- zone fetch
- suitability analysis
- coordinate validation
- water source input

What is incomplete or uncertain:

- this module was not the main focus of recent work, so it should be treated as “implemented but needs a regression QA pass”

### 8. Water quality logging

Status: `Working, but not pond-specific yet`

What exists:

- Water quality form/history UI in [WaterQualityScreen.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/screens/WaterQualityScreen.tsx)
- backend CRUD in [waterQuality.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/waterQuality.ts)
- advisory logic in [pondAdvisory.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/utils/pondAdvisory.ts)

What works:

- save water quality readings
- list recent reading history
- render simple chart/trend UI
- generate advisory banner after save

What is incomplete:

- current screen saves generic device-level readings, not pond-linked readings
- backend route writes to `water_quality_readings`, while local offline schema/sync path expects `water_quality_logs`
- no pond picker in the Water Quality screen
- no pond-specific alerting

This is a major “partially wired” area.

### 9. Market prices

Status: `Working, but data quality depends on source freshness`

What exists:

- market routes in [market.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/market.ts)
- market price UI
- historic/latest endpoints

What works:

- list latest prices
- filter by species/state
- trends endpoint exists

What is incomplete:

- live data freshness depends on ingestion/scraping status
- no very rich analytics layer yet
- no alerts for price spikes or selling windows

### 10. Equipment and feed catalogs

Status: `Working`

What exists:

- Equipment catalog screen
- Feed catalog screen
- `/api/v1/economics/equipment`
- `/api/v1/economics/feed`

What works:

- browse catalog data
- equipment category chips and improved readable labels
- local images/fallback artwork

What is incomplete:

- no advanced filters
- no equipment comparison
- no ROI impact calculator tied directly to a selected equipment item

### 11. Profile and personal information

Status: `Mostly working locally`

What exists:

- profile screen
- personal info screen
- local profile persistence in AsyncStorage
- manual sync button
- dark mode toggle
- language toggle
- logout

What works:

- personal info can be saved locally in [PersonalInfoScreen.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/screens/PersonalInfoScreen.tsx)
- profile screen reflects saved profile and pond count
- dark mode works
- language switch between English and Hindi works
- logout works

What is incomplete:

- profile is mostly local, not a proper backend-managed profile
- settings icon has no real settings page
- offline mode toggle is UI-only state, not a true offline policy engine
- sync is manual, not background/automatic

### 12. Pond management

Status: `Partially working`

What exists:

- Pond model in [Pond.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/database/models/Pond.ts)
- Add/Edit pond screen
- My Ponds list screen
- backend sync support for pond records in [sync.ts](/Users/pranjalupadhyay/Desktop/projects/fishery_app/backend/src/routes/sync.ts)

What works:

- create pond locally
- edit pond locally
- list ponds live from local DB
- save basic pond attributes:
  - name
  - area
  - water source
  - system
  - active/fallow status
  - latitude/longitude
- push/pull pond records through sync pipeline

What is incomplete:

- no delete pond flow
- Add/Edit form does not capture `speciesId`
- Add/Edit form does not capture `stockingDate`
- list screen shows raw `speciesId` if present instead of a friendly species name
- pond records are not deeply integrated into economics, water quality, or notifications

This is one of the most important incomplete areas.

### 13. Harvest countdown / pond alerts

Status: `Implemented, but blocked by missing pond inputs`

What exists:

- active harvest widget in [HarvestCountdownCard.tsx](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/src/components/HarvestCountdownCard.tsx)
- home screen loads local ponds and filters active ones

What works:

- if a pond has:
  - active status
  - `stockingDate`
  - optional `speciesId`
  then the home screen can show harvest progress, days elapsed, days left, and culture phase

What is incomplete:

- current Add Pond UI does not collect the needed fields
- therefore most user-created ponds never become “active harvest” ponds
- bell icon logic depends on `activePonds.length`, so it feels broken to end users even though the logic exists

This is the exact reason the bell often says “no active pond alerts yet.”

### 14. Notifications

Status: `Not really implemented`

What exists:

- bell icon on Home
- bell icon on Water Quality
- some alert-style messaging through modal alerts and banners

What does not exist yet:

- push notifications
- notification inbox/history
- pond-specific threshold alerts
- scheduled reminders
- harvest reminders
- feed reminders

## Important partial integrations and mismatches

These are the most important “looks implemented but is not fully complete” areas.

### Pond data vs bell notifications

Current logic:

- Home only treats ponds as alert-worthy if they are active and have `stockingDate`
- current Add Pond UI does not ask for `stockingDate`

Result:

- user adds pond
- user sees it in My Ponds
- bell still says no active pond alerts

### Pond model vs pond form

The local model supports:

- `speciesId`
- `stockingDate`

But the current form does not expose them.

Result:

- data model is richer than the UI
- harvest logic is waiting on fields that users cannot enter

### Water quality backend vs pond management

There are effectively two tracks:

- generic device-level `water_quality_readings`
- offline-sync-oriented `water_quality_logs` with `pond_id`

Current UI uses the generic one.

Result:

- water quality logging works
- but it is not linked to a specific pond
- so the app cannot yet say “Pond A has poor oxygen”

### Auth vs API enforcement

Auth exists, but product security/state is still basic:

- token is stored
- auth screen works
- app can gate access based on token existence

But:

- many routes are still callable without deeper auth enforcement
- profile data lives partly in AsyncStorage rather than a clean backend profile flow

## Current localization status

Status: `Partial`

What exists:

- English locale
- Hindi locale

What does not currently exist in repo:

- Bengali
- Telugu
- Tamil
- Malayalam
- Kannada

So older docs claiming 7 languages are outdated.

## Current theming status

Status: `Working`

Recent improvements:

- dark mode shifted from dark green to black/charcoal base
- card readability improved
- home shortcut labels cleaned up
- equipment category labels cleaned up

## Backend feature map

### Auth

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`

### Economics

- `POST /api/v1/economics/simulate`
- `POST /api/v1/economics/subsidy`
- `GET /api/v1/economics/advisory`
- `GET /api/v1/economics/equipment`
- `GET /api/v1/economics/feed`

### Geography

- `POST /api/v1/geo/suitability`
- `GET /api/v1/geo/zones`
- `GET /api/v1/geo/zones/:stateCode`

### Species

- `GET /api/v1/species`
- `GET /api/v1/species/search`
- `GET /api/v1/species/category/:category`
- `GET /api/v1/species/:id`
- `GET /api/v1/species/:id/tree`

### Market

- `GET /api/v1/market/prices`
- `GET /api/v1/market/prices/species/:speciesId`
- `GET /api/v1/market/trends`
- `POST /api/v1/market/prices`

### Water quality

- `POST /api/v1/water-quality/readings`
- `GET /api/v1/water-quality/readings`

### Knowledge base

- `GET /api/v1/knowledge/rules`
- `GET /api/v1/knowledge/rules/:idSlug`

### Sync

- `GET /api/v1/sync/changes`
- `POST /api/v1/sync`

## Strongest parts of the product right now

These are the best-built areas today:

1. Economics simulator and result experience
2. Knowledge-backed subsidy/policy guidance
3. Beginner Learning Center
4. Species recommendation explanation
5. Home/dashboard polish
6. Basic auth flow

## Weakest or least-finished parts right now

These are the best candidates for Claude to help complete:

1. Pond lifecycle management
2. Pond-linked water quality
3. Real notifications
4. Automatic/robust sync
5. Profile/settings depth
6. Rich project template selection
7. More complete knowledge dataset

## Best next completion tasks for Claude

If you give this repo to Claude, these are the highest-value completion requests.

### A. Complete pond management end to end

Ask for:

- add `species` and `stocking date` fields to Add/Edit Pond
- add delete pond support
- show species name instead of raw species id in pond list
- make home bell and harvest widget use the newly captured fields

### B. Make water quality pond-specific

Ask for:

- pond picker in Water Quality screen
- save logs against `pond_id`
- unify current device-level readings with pond-based logs
- show pond-wise history and pond-wise advisories

### C. Build real notifications

Ask for:

- notification inbox screen
- local notifications for harvest reminders
- alerts when pond status or water-quality thresholds go bad
- replace current bell alert with a real notification center

### D. Improve economics onboarding

Ask for:

- explicit project type selector: Pond / RAS / Shrimp / Integrated / Ornamental
- beginner presets by land size and budget
- save/share/export simulation

### E. Upgrade the Learning Center

Ask for:

- visual explainer cards
- business-type comparison tables
- step-by-step “how to start with 1 acre / low capital / medium capital”
- state-specific educational notes if knowledge exists

### F. Strengthen auth/profile system

Ask for:

- proper profile API
- auth headers on protected calls
- forgot password/reset flow
- onboarding after signup

### G. Expand the institutional knowledge base

Ask for:

- import more normalized policy/template/subsidy records
- better state coverage
- project-specific unit cost caps
- richer beginner-facing explanations generated from rules

## New feature ideas worth exploring

These are not just bug fixes; they are product-expansion ideas.

### Farm operations

- daily farm checklist
- feed scheduler
- medicine/vaccination calendar
- stock movement / mortality tracker
- harvest planner

### Business / finance

- loan readiness checklist
- subsidy application checklist
- cash flow planner by month
- vendor / buyer contact book
- DPR export / banker report export

### Advisory / intelligence

- “Which business should I start?” wizard
- alerting on price opportunity by species
- district-level opportunity cards
- seasonality planner
- beginner vs advanced mode

### Community / workflow

- consultant mode / advisor mode
- multi-user farm account
- worker task assignment
- farm photo log / audit history

## Key truth Claude should know before proposing work

1. The app already has real foundations. It is not just a mock UI.
2. Several modules are good individually, but cross-module wiring is still incomplete.
3. The biggest product gap is not raw feature count, but integration:
   - pond data
   - water quality
   - alerts
   - harvest tracking
   - notifications
4. The institutional knowledge layer is now important and should be treated as a core system, not side content.
5. Beginner education is now part of the product direction and should continue to expand.

## Recommended prompt to give Claude

You can paste this file to Claude and ask something like:

> Read this project status handoff carefully. Based on the current app state, propose:
> 1. the best order to complete the partially working features,
> 2. exact implementation plans for the top 3 incomplete areas,
> 3. new high-value features that fit the existing architecture,
> 4. any codebase risks or refactors needed before scaling.

