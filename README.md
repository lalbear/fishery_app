# Fishing God

Fishing God is an offline-first aquaculture decision-support app for Indian fish and shrimp farmers.
It combines farm planning, policy-aware subsidy guidance, water quality tracking, and market intelligence in one mobile workflow.

## Core Features

- Species intelligence with searchable species profiles and suitability context
- Economics and ROI simulator with CAPEX/OPEX, BCR, breakeven, and scenario guidance
- Policy-backed subsidy preview using seeded institutional/government rules
- Geo suitability and location-aware advisory inputs
- Pond management foundation (pond records, lifecycle tracking hooks)
- Water quality logging and trend history
- Market price module for fishery price visibility
- Equipment and feed catalogs
- Beginner learning center for key aquaculture/business terms
- Multi-language UI support (in progress across Indian languages)

## Tech Stack

- Mobile: React Native (Expo)
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Mobile local/offline: WatermelonDB
- Caching/worker utilities: Redis + background jobs

## Repository Structure

- `mobile/` React Native app
- `backend/` API, business logic, migrations, seed data
- `docker-compose.yml` local infrastructure services

## Local Development

### Prerequisites

- Node.js 18+
- Docker Desktop (recommended)
- npm

### 1. Start Infrastructure

```bash
cd /Users/pranjalupadhyay/Desktop/projects/fishery_app
docker compose up -d postgres redis
```

### 2. Backend

```bash
cd /Users/pranjalupadhyay/Desktop/projects/fishery_app/backend
../node_modules/.bin/tsc
node dist/scripts/migrate.js
node dist/scripts/seed_knowledge.js
HOST=127.0.0.1 PORT=3000 ../node_modules/.bin/nodemon --watch 'src/**/*.ts' --exec '../node_modules/.bin/ts-node' src/index.ts
```

### 3. Mobile App (Expo)

```bash
cd /Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile
npm install
npx expo start
```

Then run on iOS simulator from Expo (`i`) or open with Expo Go.

## Deployment

### Backend Deployment

Deploy `backend/` as a Node web service with a managed PostgreSQL database.
Recommended platforms: Render, Railway, Fly.io, or AWS.

Required environment variables (backend):

- `NODE_ENV=production`
- `PORT` (platform-provided)
- `DATABASE_URL` (managed Postgres connection string)
- `JWT_SECRET` (long random secret)
- `REDIS_URL` (if Redis-enabled in your deployment)

### Mobile (TestFlight / Play Store)

The mobile app uses Expo EAS builds.

- Configure `mobile/app.json` bundle identifiers and versioning
- Configure `mobile/eas.json` build profiles
- Set `EXPO_PUBLIC_BACKEND_URL` to your deployed backend URL (not localhost)
- Build and submit using EAS

Detailed iOS flow is in `mobile/TESTFLIGHT_SETUP.md`.

## Documentation Map

- `DEVELOPER_README.md` internal development status and known gaps
- `mobile/TESTFLIGHT_SETUP.md` iOS/TestFlight release setup
- `backend/MARKET_DATA_STRATEGY.md` market data pipeline notes
- `ECONOMICS_MATH.md` economics formulas and assumptions

## License

MIT
