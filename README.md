# 🎣 Fishing God — Aquaculture Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Version](https://img.shields.io/badge/Version-0.85--pre--release-orange.svg)]()

An **offline-first, AI-assisted aquaculture intelligence platform** engineered for the Indian subcontinent. Built for small-to-medium fish and shrimp farmers — bridging the knowledge and technology gap between modern aquaculture science and rural India.

> **Current State (March 2026):** Core features are working end-to-end. Authentication, multi-pond management, and push notifications are not yet implemented. See [Known Limitations](#-known-limitations) for a full breakdown.

---

## 📋 Table of Contents

- [What This App Does](#-what-this-app-does)
- [Feature Status](#-feature-status)
- [Screens Overview](#-screens-overview)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Local Development](#-local-development)
- [Deployment Options](#-deployment-options)
  - [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended-for-self-hosting)
  - [Option 2: AWS Deployment](#option-2-aws-deployment)
  - [Option 3: Supabase Deployment](#option-3-supabase-deployment)
  - [Option 4: Google Cloud Platform](#option-4-google-cloud-platform)
  - [Option 5: Azure Deployment](#option-5-azure-deployment)
- [Mobile App Deployment](#-mobile-app-deployment)
- [Environment Variables](#-environment-variables)
- [Database Migration](#-database-migration)
- [API Documentation](#-api-documentation)
- [Known Limitations](#-known-limitations)
- [Roadmap](#-roadmap-next-steps)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 What This App Does

**Fishing God** puts six layers of intelligence directly in a farmer's hands:

1. **Know what to farm** — Species selection based on local water quality, salinity, and climate.
2. **Know if it's viable** — Full ROI simulation with CAPEX/OPEX breakdown, PMMSY government subsidy calculations, and sensitivity analysis.
3. **Know your environment** — GPS-based geo-suitability analysis: given your pond's location and water source, what aquaculture systems and species are suitable?
4. **Track water quality** — Log and trend critical pond parameters (temperature, DO, pH, salinity, ammonia) with instant health alerts.
5. **Stay informed on prices** — Live market price data scraped from government portals.
6. **Choose the right gear & feed** — Browseable catalog of aquaculture equipment and feeds.

**Target audience:** Small-to-medium scale fish/shrimp farmers in India. The UI is icon-driven and available in 7 Indian languages (English, Hindi, Bengali, Telugu, Tamil, Malayalam, Kannada) to support rural/low-literacy users.

---

## ✅ Feature Status

| Feature | Backend | Mobile UI | End-to-End | Notes |
|---|---|---|---|---|
| Geo Suitability Engine | ✅ | ✅ | ✅ | Fully working |
| ROI / Economics Simulator | ✅ | ✅ | ✅ | All known bugs fixed as of Mar 2026 |
| PMMSY Subsidy Calculation | ✅ | ✅ | ✅ | Part of simulator |
| Species Data Browser | ✅ | ✅ | ✅ | 8 species seeded |
| Water Quality Logging | ✅ | ✅ | ✅ | History + status badges |
| Market Prices | ✅ (scraper) | ✅ | ✅ | Fragile — see Known Limitations |
| Equipment Catalog | ✅ | ✅ | ✅ | Static data |
| Feed Catalog | ✅ | ✅ | ✅ | Static data |
| GPS Map + Auto-fill | N/A | ✅ | ✅ | OSM Nominatim (no API key needed) |
| Offline-First (WatermelonDB) | N/A | 🟡 | 🟡 | Integrated, not battle-tested |
| User Authentication | 🟡 (JWT scaffolded) | 🔴 | 🔴 | No login screen exists |
| Profile Management | 🔴 | 🔴 | 🔴 | UI shell only, all handlers empty |
| Multi-Pond Management | 🔴 | 🟡 (UI stubs) | 🔴 | Screens exist, no backend wiring |
| Push Notifications | 🔴 | 🔴 | 🔴 | Not started |
| Multi-language (i18n) | N/A | 🟡 | N/A | ~80% complete across 7 languages |
| Production Deployment | ✅ Docker | N/A | 🟡 | Documented, not actively deployed |

**Legend:** ✅ Complete &nbsp; 🟡 Partial / In Progress &nbsp; 🔴 Not Started / Non-functional

---

## 📱 Screens Overview

### Working Screens ✅

| Screen | Description |
|---|---|
| **HomeScreen** | Quick-action grid: Species, ROI Calculator, Water Quality, Market Prices, Equipment, Feed |
| **MapScreen** | Full-screen GPS map, tap-to-move marker, OSM Nominatim auto-fill, suitability result card |
| **EconomicsScreen** | ROI calculator form (land, capital, state, district, salinity, risk, farmer category) |
| **EconomicsResultScreen** | Full simulation results: recommended species, system, revenue, profit, CAPEX, BCR, cash flow, sensitivity |
| **SpeciesScreen** | Browse all species with category filter and search |
| **SpeciesDetailScreen** | Full biological + economic parameters for each species |
| **WaterQualityScreen** | Add readings tab + history tab; status badges (✓ Normal / ⚠ Warning / 🚨 Alert) |
| **MarketPricesScreen** | Live market prices from backend; recently updated with improved UI |
| **EquipmentCatalogScreen** | Grid browser for aquaculture equipment by category |
| **FeedCatalogScreen** | Browse feeds by type (Starter, Grow-out, Finisher) |

### Partial / UI-Only Screens 🟡🔴

| Screen | Status | Notes |
|---|---|---|
| **ProfileScreen** | 🔴 UI shell | All menu items have empty `onPress: () => {}` handlers. Username is hardcoded. |
| **PersonalInfoScreen** | 🔴 Non-functional | Recently updated UI, but no API calls wired |
| **PondsListScreen** | 🟡 Partial | Screen exists, no backend CRUD |
| **AddEditPondScreen** | 🟡 Partial | Screen exists, no backend CRUD |
| **MapScreen (Web)** | 🟡 Degraded | `MapScreen.web.tsx` exists as a fallback; full GPS + map only works on native |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE APP                               │
│  React Native + Expo + WatermelonDB (Offline-First SQLite)      │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS / REST API
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                │
│         Node.js + Express + TypeScript (Port 3000)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Economics  │  │    Geo       │  │      Species         │  │
│  │   Simulator  │  │  Suitability │  │    Knowledge Graph   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  PostgreSQL  │ │  Redis   │ │ Market Worker│
│   (PostGIS)  │ │  (Cache) │ │  (Puppeteer) │
└──────────────┘ └──────────┘ └──────────────┘
```

**Key technology choices:**
- **WatermelonDB** — Local SQLite-backed offline-first storage on device
- **PostgreSQL + PostGIS** — Spatial queries for geography and suitability data
- **Redis** — API response caching for market prices and species data
- **OpenStreetMap Nominatim** — Free reverse geocoding (no API key required)
- **Expo** — Cross-platform build & deployment (Android + iOS from one codebase)
- **Puppeteer** — Market price scraping from `nfdb.fishmarket.gov.in` and `agmarknet.gov.in`

---

## 📦 Prerequisites

### Required Software
- **Node.js** 18.x or 20.x ([Download](https://nodejs.org/))
- **Docker** 24.x+ and Docker Compose v2+ ([Download](https://docs.docker.com/get-docker/))
- **Expo CLI** (`npm install -g expo-cli`)
- **Git**

### Optional (for local dev without Docker)
- **PostgreSQL** 15+ with PostGIS extension
- **Redis** 7+

### Cloud Accounts (for deployment only)
- AWS, Supabase, Google Cloud, or Azure account
- Expo Account (for mobile app builds via EAS)

---

## 🚀 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/lalbear/fishery_app.git
cd fishery_app
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

See [Environment Variables](#-environment-variables) for all available options. The minimum required set is the database credentials and `JWT_SECRET`.

### 3. Start with Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL, Redis, Backend API, Market Worker)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Reset with fresh database (wipes all data)
docker-compose down -v
docker-compose up -d
```

### 4. Run Database Migrations

```bash
# Migrations run automatically on container start
# Or manually:
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

### 5. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get all species
curl http://localhost:3000/api/v1/species

# Run an economics simulation (e.g., 100 acres in Karnataka)
curl -X POST http://localhost:3000/api/v1/economics/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "landSizeHectares": 40.47,
    "waterSourceSalinityUsCm": 350,
    "availableCapitalInr": 500000,
    "riskTolerance": "MEDIUM",
    "farmerCategory": "WOMEN",
    "stateCode": "KA",
    "districtCode": "Bangalore"
  }'
```

### 6. Start Mobile App

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on Android emulator / connected device
npx expo start --android

# Run on iOS (macOS only)
npx expo start --ios
```

> **Note:** The map screen requires native Android/iOS. The web platform (`MapScreen.web.tsx`) renders a degraded no-map fallback.

---

## 🌐 Deployment Options

---

### Option 1: Docker Compose (Recommended for Self-Hosting)

Best for: Small to medium deployments, single server setup, development/staging.

#### Server Requirements
- Ubuntu 22.04 LTS or CentOS 8
- 4 vCPU, 8GB RAM, 50GB SSD
- Ports 80, 443, 3000 open

#### Deployment Steps

```bash
# 1. Provision server and SSH in
ssh user@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clone repository
git clone https://github.com/lalbear/fishery_app.git
cd fishery_app

# 5. Create production environment file
sudo nano .env
# Fill in production values

# 6. Start services
docker-compose up -d

# 7. Verify deployment
curl http://localhost:3000/health

# 8. Setup Nginx reverse proxy (optional)
sudo apt install nginx
cat << 'EOF' | sudo tee /etc/nginx/sites-available/fishing-god
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/fishing-god /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Setup SSL with Certbot
sudo snap install certbot --classic
sudo certbot --nginx -d your-domain.com
```

---

### Option 2: AWS Deployment

Best for: Production workloads, auto-scaling, high availability.

#### Architecture Components
- **ECS/Fargate** or **EC2** for backend containers
- **RDS PostgreSQL** with Multi-AZ
- **ElastiCache Redis**
- **Application Load Balancer**
- **ECR** for Docker images
- **CloudWatch** for monitoring

#### Step-by-Step Deployment

**Step 1: Create RDS PostgreSQL Instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier fishing-god-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --allocated-storage 20 \
  --master-username fishinggod \
  --master-user-password YOUR_SECURE_PASSWORD \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name your-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --enable-performance-insights
```

**Step 2: Create ElastiCache Redis**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id fishing-god-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxxxx
```

**Step 3: Create ECR Repository and Push Images**
```bash
aws ecr create-repository --repository-name fishing-god-backend
aws ecr create-repository --repository-name fishing-god-worker

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t fishing-god-backend:latest ./backend
docker tag fishing-god-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fishing-god-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fishing-god-backend:latest
```

**Step 4: Deploy to ECS Fargate**
```bash
aws ecs create-cluster --cluster-name fishing-god-cluster

cat << 'EOF' > task-definition.json
{
  "family": "fishing-god-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/fishing-god-backend:latest",
      "portMappings": [{ "containerPort": 3000 }],
      "environment": [
        { "name": "NODE_ENV", "value": "production" },
        { "name": "DB_HOST", "value": "your-rds-endpoint" },
        { "name": "REDIS_URL", "value": "redis://your-redis-endpoint:6379" }
      ],
      "secrets": [
        { "name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/fishing-god",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json

aws ecs create-service \
  --cluster fishing-god-cluster \
  --service-name fishing-god-backend \
  --task-definition fishing-god-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=3000
```

---

### Option 3: Supabase Deployment

Best for: Rapid deployment, managed PostgreSQL, serverless functions.

**Step 1: Create Supabase Project**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. New Project → Name: `fishing-god` → Region: **Mumbai (ap-south-1)**

**Step 2: Run Migrations**
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref

psql -h db.your-project-ref.supabase.co -p 5432 -U postgres -d postgres -f backend/migrations/001_initial_schema.sql
psql -h db.your-project-ref.supabase.co -p 5432 -U postgres -d postgres -f backend/migrations/002_seed_data.sql
```

**Step 3: Deploy Backend**
```bash
# Deploy to Vercel with Supabase connection
cd backend
npm install
vercel --prod

# Set secrets
supabase secrets set JWT_SECRET=your_secret
supabase secrets set DATABASE_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres
```

---

### Option 4: Google Cloud Platform

Best for: Indian cloud infrastructure, Cloud SQL proximity to users.

```bash
# Enable required APIs
gcloud services enable run.googleapis.com sqladmin.googleapis.com redis.googleapis.com containerregistry.googleapis.com

# Create Cloud SQL (PostgreSQL 15)
gcloud sql instances create fishing-god-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-south1 \
  --storage-size=10GB

gcloud sql databases create fishing_god --instance=fishing-god-db
gcloud sql users set-password postgres --instance=fishing-god-db --password=YOUR_PASSWORD

# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/YOUR_PROJECT/fishing-god-backend

gcloud run deploy fishing-god-backend \
  --image gcr.io/YOUR_PROJECT/fishing-god-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DB_HOST=/cloudsql/YOUR_PROJECT:asia-south1:fishing-god-db" \
  --set-secrets="DB_PASSWORD=db-password:latest" \
  --add-cloudsql-instances=YOUR_PROJECT:asia-south1:fishing-god-db
```

---

### Option 5: Azure Deployment

Best for: Enterprise integration, Microsoft ecosystem.

```bash
# Create resource group in India
az group create --name fishing-god-rg --location centralindia

# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --resource-group fishing-god-rg \
  --name fishing-god-db \
  --location centralindia \
  --admin-user fishinggod \
  --admin-password YOUR_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15

# Deploy to Azure Container Instances
az container create \
  --resource-group fishing-god-rg \
  --name fishing-god-backend \
  --image your-registry/fishing-god-backend:latest \
  --cpu 1 \
  --memory 2 \
  --ports 3000 \
  --environment-variables NODE_ENV=production DB_HOST=fishing-god-db.postgres.database.azure.com \
  --secrets DB_PASSWORD=YOUR_PASSWORD
```

---

## 📱 Mobile App Deployment

### Build for Production

**Step 1: Configure API Endpoint**
```typescript
// mobile/src/services/apiService.ts
// Update base URL before building:
const API_BASE_URL = 'https://your-api-domain.com';
```

**Step 2: Build with Expo EAS**
```bash
cd mobile

npm install -g eas-cli
eas login
eas build:configure

# Build for Android (.aab)
eas build --platform android --profile production

# Build for iOS (.ipa) — requires Apple Developer Account
eas build --platform ios --profile production

# Or build locally
npx expo prebuild
npx expo run:android --variant release
```

**Step 3: Submit to App Stores**

*Google Play Store:*
1. Build AAB: `eas build --platform android`
2. Download artifact from Expo Dashboard
3. Upload to [Google Play Console](https://play.google.com/console)

*Apple App Store:*
1. Build IPA: `eas build --platform ios`
2. Upload via Transporter or Xcode

> **Note:** An onboarding flow and privacy policy screen are required before app store submission. These are listed in the roadmap but not yet implemented.

---

## 🔧 Environment Variables

### Backend (`.env`)

```env
# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database (Required)
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=fishinggod
DB_PASSWORD=secure_password
DB_NAME=fishing_god
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis (Required)
REDIS_URL=redis://localhost:6379

# Security (Required)
JWT_SECRET=your-256-bit-secret-key-here-min-32-chars
JWT_EXPIRES_IN=7d

# Market Scraping (Required for market data worker)
NFDB_FMPI_BASE_URL=https://nfdb.fishmarket.gov.in
AGMARKNET_BASE_URL=https://agmarknet.gov.in

# PMMSY Subsidy Configuration (Required for economics simulator)
PMMSY_GENERAL_SUBSIDY_PERCENT=40
PMMSY_SPECIAL_CATEGORY_SUBSIDY_PERCENT=60
PMMSY_FRESHWATER_CAP=400000
PMMSY_BRACKISH_CAP=600000
PMMSY_RAS_CAP=2500000

# Equipment Costs in INR (Required for CAPEX calculations)
AERATOR_18W_INR=1600
VORTEX_BLOWER_550W_INR=13500
BIOFLOC_TARPAULIN_650GSM_INR=31000
RAS_PUMP_1HP_INR=8500
UV_STERILIZER_40W_INR=12000
```

### Mobile (`.env` or `app.json` extras)

```env
EXPO_PROJECT_ID=fishing-god-app
API_BASE_URL=https://your-api-domain.com
ENABLE_OFFLINE_SYNC=true
SYNC_INTERVAL_MINUTES=15
```

> **Note on Maps:** The app uses **OpenStreetMap Nominatim** for reverse geocoding — this is free and requires no API key. A `GOOGLE_MAPS_API_KEY` is **not required**.

---

## 🗄 Database Migration

### Files

| File | Purpose |
|---|---|
| `backend/migrations/001_initial_schema.sql` | Creates all tables: `knowledge_nodes`, `water_quality_readings`, geography zones, etc. |
| `backend/migrations/002_seed_data.sql` | Seeds 8 species, economic models, equipment, and feed data |
| `backend/seed_brackish.ts` | Additional seed script for brackish species |

### Running Migrations

```bash
# Via Docker (recommended)
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# Manually with psql
psql -h localhost -U fishinggod -d fishing_god -f backend/migrations/001_initial_schema.sql
psql -h localhost -U fishinggod -d fishing_god -f backend/migrations/002_seed_data.sql
```

### Backup Strategy

```bash
# Daily backup (cron)
0 2 * * * pg_dump -h localhost -U fishinggod fishing_god > /backups/fishing_god_$(date +\%Y\%m\%d).sql

# AWS RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier fishing-god-db \
  --db-snapshot-identifier fishing-god-$(date +%Y%m%d)
```

---

## 📚 API Documentation

### Base URL
```
Local:      http://localhost:3000/api/v1
Production: https://your-domain.com/api/v1
```

### Authentication

> ⚠️ **Note:** The JWT auth flow is scaffolded on the backend but the mobile app has no login screen yet. All current API calls are unauthenticated.

```bash
# Obtain JWT token (backend-only — no mobile UI yet)
POST /auth/login
Body: { "phoneNumber": "+919999999999", "otp": "123456" }

# Use token in headers
Authorization: Bearer <token>
```

### Economics Simulator

```bash
POST /economics/simulate
Body: {
  "landSizeHectares": 40.47,
  "waterSourceSalinityUsCm": 350,
  "availableCapitalInr": 500000,
  "riskTolerance": "LOW" | "MEDIUM" | "HIGH",
  "farmerCategory": "GENERAL" | "WOMEN" | "SC" | "ST",
  "stateCode": "KA",
  "districtCode": "Bangalore"
}

POST /economics/subsidy
Body: {
  "projectType": "FRESHWATER" | "BRACKISH" | "INTEGRATED" | "RAS",
  "beneficiaryCategory": "GENERAL" | "WOMEN" | "SC" | "ST",
  "unitCostInr": 400000,
  "landAreaHectares": 1.0
}
```

### Geographic Suitability

```bash
POST /geo/suitability
Body: {
  "latitude": 16.5062,
  "longitude": 80.6480,
  "stateCode": "AP",
  "districtCode": "KR",
  "waterSourceType": "BOREWELL",
  "measuredSalinityUsCm": 500
}

GET /geo/zones          # All Indian states and districts
```

### Species Data

```bash
GET /species                          # All species
GET /species/:id                      # Species detail
GET /species/search?q=rohu            # Text search
GET /species/category/INDIAN_MAJOR_CARP
```

### Market Prices

```bash
GET /market/prices
GET /market/prices?species=rohu&state=WB
GET /market/trends
```

### Water Quality

```bash
POST /water-quality/readings          # Save a new reading
Body: {
  "temperature": 28.5,
  "dissolvedOxygen": 5.2,
  "ph": 7.4,
  "salinity": 0.3,
  "ammonia": 0.02,
  "notes": "Morning check"
}

GET /water-quality/readings           # Fetch historical readings
```

---

## ⚠️ Known Limitations

These are real, documented gaps in the current build. Do not treat these as minor polish items — they affect production readiness.

### 🔴 Authentication System — Missing on Mobile
The backend has a JWT scaffolding with `/auth/login` (phone + OTP), but **there is no login or registration screen in the mobile app**. All API calls are currently unauthenticated. This means:
- Water quality readings cannot be attributed to users
- Multi-pond management is impossible
- No user data persists across app reinstalls

**Priority:** Blocker for production.

### 🔴 Profile Screen — Non-Functional UI Shell
`ProfileScreen.tsx`, `PersonalInfoScreen.tsx`, `PondsListScreen.tsx`, and `AddEditPondScreen.tsx` all exist and render UI, but every `onPress` handler is empty (`() => {}`). The username/phone shown are hardcoded placeholders.

### 🔴 Push Notifications — Not Started
There is no push notification system. Water quality alerts only appear when the user actively opens the app. No FCM/APNs integration exists.

### 🟡 Market Prices — Fragile Web Scraping
The market worker uses Puppeteer to scrape `nfdb.fishmarket.gov.in` and `agmarknet.gov.in`. Website redesigns or anti-bot measures will silently break this. There is no stale-data warning in the UI.

### 🟡 Offline Sync — Integrated but Unverified
WatermelonDB is integrated as a dependency, but the end-to-end sync flow (background sync job, conflict resolution) has not been tested. The `SYNC_INTERVAL_MINUTES` env var exists but actual behavior is unclear.

### 🟡 Multi-Language — ~80% Complete
i18n files exist for 7 languages, but not all string keys are translated. Equipment Catalog and Feed Catalog screens are largely English-only. Several screens use `t('key') || 'English fallback'` patterns.

### 🟡 Geo Map — Web Platform Degraded
`react-native-maps` does not support web. The web fallback (`MapScreen.web.tsx`) shows a stripped-down UI without the map view. Full GPS + map only works on native Android/iOS.

---

## 🗺 Roadmap (Next Steps)

Ordered by priority:

1. **Authentication** (~1 week) — Login screen (phone + OTP), JWT storage (`SecureStore`), auth headers on all API calls, auth context in `App.tsx`
2. **Profile Screen** (~3 days) — Personal info editable form, language switcher (`i18n.changeLanguage()`), logout flow
3. **Multi-Pond Management** (~1 week) — `ponds` table in DB, CRUD API, pond selector for water quality logging
4. **Push Notifications** (~4 days) — `expo-notifications`, threshold-checking cron (DO < 4 mg/L, pH < 6.5 or > 8.5, ammonia > 0.1 mg/L)
5. **Offline Sync Hardening** (~3 days) — Verify WatermelonDB sync, conflict resolution, sync status indicator
6. **Translation Completion** (~2 days) — Audit all `t()` keys against all 7 language files, fill gaps
7. **Market Data Reliability** (~2 days) — Stale data warning in UI, attempt to use `agmarknet.gov.in` XML API
8. **App Store Preparation** (~3 days) — Expo EAS build profiles, onboarding flow, app icons/splash, privacy policy screen

---

## 📁 Key File Reference

| File | Purpose |
|---|---|
| `backend/src/services/EconomicsSimulatorService.ts` | Core 13-step ROI simulation engine |
| `backend/src/services/GeoSuitabilityService.ts` | Geo suitability analysis with salinity logic |
| `backend/src/services/PMMSYSubsidyService.ts` | PMMSY government subsidy calculations |
| `backend/src/routes/economics.ts` | Economics API routes |
| `backend/src/routes/geography.ts` | Geography/zones API routes |
| `backend/src/routes/species.ts` | Species data API routes |
| `backend/src/routes/market.ts` | Market prices API routes |
| `backend/src/routes/waterQuality.ts` | Water quality CRUD routes |
| `backend/migrations/001_initial_schema.sql` | Database schema |
| `backend/migrations/002_seed_data.sql` | Initial data seed |
| `mobile/src/screens/HomeScreen.tsx` | Main dashboard |
| `mobile/src/screens/MapScreen.tsx` | GPS + geo suitability |
| `mobile/src/screens/EconomicsScreen.tsx` | ROI calculator form |
| `mobile/src/screens/EconomicsResultScreen.tsx` | Simulation results |
| `mobile/src/screens/WaterQualityScreen.tsx` | Water quality logging + history |
| `mobile/src/screens/MarketPricesScreen.tsx` | Live market price feed |
| `mobile/src/screens/ProfileScreen.tsx` | Profile (UI shell — non-functional) |
| `mobile/src/services/apiService.ts` | All API calls from mobile |
| `mobile/src/i18n/` | Translation files (7 languages) |
| `docker-compose.yml` | Full stack container orchestration |

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify connection
psql -h localhost -U fishinggod -d fishing_god

# Check Docker logs
docker-compose logs postgres
```

### Redis Connection Failed
```bash
redis-cli ping
# Should return: PONG
```

### Migration Errors
```bash
# Reset database (WARNING: destroys all data)
docker-compose down -v
docker-compose up -d
```

### Mobile not connecting to backend
- Verify `API_BASE_URL` in `mobile/src/services/apiService.ts`
- On Android emulator, use `10.0.2.2` instead of `localhost`
- Ensure CORS is configured in backend
- Check device has network permission in `app.json`

### PMMSY Calculation Incorrect
- Verify `PMMSY_*` environment variables are set
- Farmer category must match: `GENERAL | WOMEN | SC | ST`
- Land area is in **hectares** (`landAreaHectares`), not acres
- The simulator auto-converts acres input from the mobile UI

### Market Worker Not Scraping
- Check `docker-compose logs market-worker`
- Verify outbound internet access from the container
- Target websites may have changed — check scraper selectors in `backend/src/workers/`

### Performance — Database Indexing
```sql
-- Add indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_market_prices_species_date
ON market_prices(species_id, date DESC);

CREATE INDEX CONCURRENTLY idx_water_quality_pond_timestamp
ON water_quality_logs(pond_id, timestamp DESC);
```

---

## 📄 License

MIT License — See LICENSE file for details.

## 🙏 Support

For support, email `support@fishinggod.app` or open an issue on GitHub.

---

**Built with ❤️ for Indian Aquaculture**