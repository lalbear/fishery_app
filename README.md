# 🎣 Fishing God - Aquaculture Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)

A production-grade, offline-first aquaculture intelligence platform specifically engineered for the Indian subcontinent. Built with React Native, Node.js, PostgreSQL, and WatermelonDB.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Local Development](#-local-development)
- [Deployment Options](#-deployment-options)
  - [Option 1: Docker Compose (Recommended for Self-Hosting)](#option-1-docker-compose-recommended-for-self-hosting)
  - [Option 2: AWS Deployment](#option-2-aws-deployment)
  - [Option 3: Supabase Deployment](#option-3-supabase-deployment)
  - [Option 4: Google Cloud Platform](#option-4-google-cloud-platform)
  - [Option 5: Azure Deployment](#option-5-azure-deployment)
- [Mobile App Deployment](#-mobile-app-deployment)
- [Environment Variables](#-environment-variables)
- [Database Migration](#-database-migration)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### Core Intelligence
- **Geospatial Intelligence**: Comprehensive Indian administrative coverage with all 36 States/UTs and 700+ Districts.
- **ROI Simulator**: High-fidelity ROI projections including PMMSY subsidy logic (40% General / 60% Women/SC/ST) and sensitivity analysis.
- **Species Intelligence**: Expert-level biological and economic data for Indian Major Carps (Rohu, Catla), Pangasius, Vannamei Shrimp, Scampi, and Tilapia.
- **Regional Suitability**: Salinity-based species recommendations with local soil and climate constraints.

### Offline-First Mobile App
- WatermelonDB for local SQLite storage
- Background synchronization when connectivity returns
- Multi-language support (English, Hindi, Bengali, Telugu, Tamil, Malayalam, Kannada)
- Icon-driven interface optimized for rural demographics

### Technical Stack
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (PostGIS), Redis
- **Mobile**: React Native, Expo, WatermelonDB
- **Infrastructure**: Docker, Docker Compose

## ✅ Project Status & Progress

### 🟢 Completed Tasks
- **Geo Suitability Engine**:
  - Fixed critical API 500 errors in `GeoSuitabilityService`.
  - Implemented robust null checks and state-level default fallbacks.
  - Expanded district code validation to support all Indian administrative zones.
- **ROI Calculator & Simulator**:
  - Full end-to-end integration between mobile frontend and backend simulation logic.
  - Accurate PMMSY subsidy calculation (40%/60% logic) based on land size and category.
  - Dynamic cash flow projections and breakeven analysis.
- **Water Quality Management**:
  - Integrated backend persistence for water quality readings.
  - Implemented historical trend viewing on mobile.
- **Species & Market Intelligence**:
  - Fully integrated Species Detail Screen with biological and economic parameters.
  - Switched from mock data to live backend API for Market Prices.
- **New Features**:
  - **Equipment Catalog**: Grid-based UI for browsing aquaculture gear with categorization (Aeration, Filtration, etc.).
- **Infrastructure & UX**:
  - Resolved WatermelonDB/LokiJS deprecation warnings for modern browsers.
  - Improved location service reliability with OSM Nominatim fallback for geocoding.

### 🟡 In Progress / Next Steps
- **User Profiles**: Finalizing registration sync and multi-pond management.
- **Real-time Notifications**: Threshold-based alerts for water quality parameters.
- **Offline Sync**: Optimizing background sync performance for large datasets.

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE APP                               │
│  React Native + Expo + WatermelonDB (Offline-First SQLite)      │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS / REST API
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                       LOAD BALANCER                             │
│              (AWS ALB / Nginx / Cloudflare)                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                │
│         Node.js + Express + TypeScript (Port 3000)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Economics  │  │    Geo       │  │      Species         │   │
│  │   Simulator  │  │  Suitability │  │    Knowledge Graph   │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
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

## 📦 Prerequisites

### Required Software
- **Node.js** 18.x or 20.x ([Download](https://nodejs.org/))
- **Docker** 24.x+ and Docker Compose v2+ ([Download](https://docs.docker.com/get-docker/))
- **PostgreSQL** 15+ with PostGIS extension (for local development without Docker)
- **Redis** 7+ (for local development without Docker)
- **Expo CLI** (`npm install -g expo-cli`)
- **Git**

### Cloud Accounts (for deployment)
- AWS Account (for EC2, RDS, ElastiCache, ECR)
- OR Supabase Account
- OR Google Cloud Platform Account
- OR Azure Account
- Expo Account (for mobile app builds)

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

**Required Environment Variables:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=fishinggod
DB_PASSWORD=your_secure_password
DB_NAME=fishing_god

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Equipment Costs (INR)
AERATOR_18W_INR=1600
VORTEX_BLOWER_550W_INR=13500
BIOFLOC_TARPAULIN_650GSM_INR=31000
```

### 3. Start with Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL, Redis, Backend, Worker)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Reset with fresh database
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

# Run economics simulation (e.g., 100 acres in Karnataka)
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

# Run on Android
npx expo start --android

# Run on iOS (macOS only)
npx expo start --ios
```

## 🌐 Deployment Options

---

### Option 1: Docker Compose (Recommended for Self-Hosting)

Best for: Small to medium deployments, single server setup, development/staging

#### Server Requirements
- Ubuntu 22.04 LTS or CentOS 8
- 4 vCPU, 8GB RAM, 50GB SSD
- Ports 80, 443, 3000, 5432, 6379 open

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
docker-compose -f docker-compose.yml up -d

# 7. Verify deployment
curl http://localhost:3000/health

# 8. Setup Nginx reverse proxy (optional)
sudo apt install nginx -c /dev/null
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

Best for: Production workloads, auto-scaling, high availability

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

**Step 3: Create ECR Repository**
```bash
aws ecr create-repository --repository-name fishing-god-backend
aws ecr create-repository --repository-name fishing-god-worker

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

**Step 4: Build and Push Images**
```bash
# Build backend image
docker build -t fishing-god-backend:latest ./backend
docker tag fishing-god-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fishing-god-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fishing-god-backend:latest

# Build worker image
docker build -f ./backend/Dockerfile.worker -t fishing-god-worker:latest ./backend
docker tag fishing-god-worker:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fishing-god-worker:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fishing-god-worker:latest
```

**Step 5: Deploy to ECS**
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name fishing-god-cluster

# Create task definition
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

# Create service
aws ecs create-service \
  --cluster fishing-god-cluster \
  --service-name fishing-god-backend \
  --task-definition fishing-god-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=3000
```

**Step 6: Setup Application Load Balancer**
```bash
# Create target group
aws elbv2 create-target-group \
  --name fishing-god-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /health

# Create load balancer
aws elbv2 create-load-balancer \
  --name fishing-god-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

---

### Option 3: Supabase Deployment

Best for: Rapid deployment, managed PostgreSQL, serverless functions

#### Setup Steps

**Step 1: Create Supabase Project**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Name: `fishing-god`
4. Database Password: (generate strong password)
5. Region: Mumbai (ap-south-1) for India

**Step 2: Run Migrations**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
psql -h db.your-project-ref.supabase.co -p 5432 -U postgres -d postgres -f backend/migrations/001_initial_schema.sql
psql -h db.your-project-ref.supabase.co -p 5432 -U postgres -d postgres -f backend/migrations/002_seed_data.sql
```

**Step 3: Deploy Backend to Supabase Functions**
```bash
# Note: Supabase Functions use Deno, so we need to adapt
# Create a new function
supabase functions new api

# Or deploy to Vercel/Netlify with Supabase connection
cd backend
npm install
vercel --prod
```

**Step 4: Environment Variables in Supabase**
```bash
# Go to Project Settings > API
# Copy: Project URL and anon/public key

# Set environment variables
supabase secrets set JWT_SECRET=your_secret
supabase secrets set DATABASE_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres
```

---

### Option 4: Google Cloud Platform

Best for: Integration with Google Maps, Firebase, and Indian cloud infrastructure

#### Deployment Steps

**Step 1: Enable APIs**
```bash
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

**Step 2: Create Cloud SQL Instance**
```bash
gcloud sql instances create fishing-god-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-south1 \
  --storage-size=10GB \
  --backup-start-time=03:00

# Create database
gcloud sql databases create fishing_god --instance=fishing-god-db

# Set password
gcloud sql users set-password postgres \
  --instance=fishing-god-db \
  --password=YOUR_PASSWORD
```

**Step 3: Deploy to Cloud Run**
```bash
# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT/fishing-god-backend

# Deploy service
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

Best for: Enterprise integration, Microsoft ecosystem

#### Deployment Steps

**Step 1: Create Resource Group**
```bash
az group create \
  --name fishing-god-rg \
  --location centralindia
```

**Step 2: Create PostgreSQL Flexible Server**
```bash
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
```

**Step 3: Deploy to Container Instances**
```bash
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
// mobile/src/config/api.ts
export const API_BASE_URL = 'https://your-api-domain.com';
export const ENABLE_OFFLINE_SYNC = true;
```

**Step 2: Build with Expo EAS**
```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS (requires Apple Developer Account)
eas build --platform ios --profile production

# Or build locally
npx expo prebuild
npx expo run:android --variant release
```

**Step 3: Publish to App Stores**

**Google Play Store:**
1. Build AAB: `eas build --platform android`
2. Download artifact from Expo Dashboard
3. Upload to [Google Play Console](https://play.google.com/console)

**Apple App Store:**
1. Build IPA: `eas build --platform ios`
2. Download artifact
3. Upload via Transporter app or Xcode

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=fishinggod
DB_PASSWORD=secure_password
DB_NAME=fishing_god
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRES_IN=7d

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NFDB_FMPI_BASE_URL=https://nfdb.fishmarket.gov.in
AGMARKNET_BASE_URL=https://agmarknet.gov.in

# PMMSY Configuration
PMMSY_GENERAL_SUBSIDY_PERCENT=40
PMMSY_SPECIAL_CATEGORY_SUBSIDY_PERCENT=60
PMMSY_FRESHWATER_CAP=400000
PMMSY_BRACKISH_CAP=600000

# Equipment Costs (INR)
AERATOR_18W_INR=1600
VORTEX_BLOWER_550W_INR=13500
BIOFLOC_TARPAULIN_650GSM_INR=31000
RAS_PUMP_1HP_INR=8500
UV_STERILIZER_40W_INR=12000
```

### Mobile (.env)
```env
EXPO_PROJECT_ID=fishing-god-app
API_BASE_URL=https://your-api-domain.com
ENABLE_OFFLINE_SYNC=true
SYNC_INTERVAL_MINUTES=15
GOOGLE_MAPS_API_KEY=your_maps_key
```

---

## 🗄 Database Migration

### Manual Migration
```bash
# Connect to database
psql -h localhost -U fishinggod -d fishing_god

# Run migrations
\i backend/migrations/001_initial_schema.sql
\i backend/migrations/002_seed_data.sql
```

### Automated Migration (Production)
```bash
# Using Node.js script
cd backend
npm run db:migrate

# Or using Docker
docker-compose exec backend npm run db:migrate
```

### Backup Strategy
```bash
# Automated daily backup (cron job)
0 2 * * * pg_dump -h localhost -U fishinggod fishing_god > /backups/fishing_god_$(date +\%Y\%m\%d).sql

# AWS RDS automated backups
aws rds create-db-snapshot \
  --db-instance-identifier fishing-god-db \
  --db-snapshot-identifier fishing-god-$(date +%Y%m%d)
```

---

## 📚 API Documentation

### Base URL
```
Production: https://your-domain.com/api/v1
Local: http://localhost:3000/api/v1
```

### Authentication
```bash
# Obtain JWT token
POST /auth/login
Body: { "phoneNumber": "+919999999999", "otp": "123456" }

# Use token in headers
Authorization: Bearer <token>
```

### Endpoints

**Economics Simulator**
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

**Geographic Suitability**
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
```

**Species Data**
```bash
GET /species
GET /species/:id
GET /species/search?q=rohu
GET /species/category/INDIAN_MAJOR_CARP
```

**Market Prices**
```bash
GET /market/prices
GET /market/prices?species=rohu&state=WB
GET /market/trends
```

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify connection
psql -h localhost -U fishinggod -d fishing_god

# Check logs
docker-compose logs postgres
```

**Redis Connection Failed**
```bash
# Check Redis
redis-cli ping

# Should return: PONG
```

**Migration Errors**
```bash
# Reset database (WARNING: Destroys all data)
docker-compose down -v
docker-compose up -d

# Or manually drop and recreate
dropdb fishing_god
createdb fishing_god
```

**Mobile Sync Not Working**
- Check API_BASE_URL in mobile/.env
- Verify HTTPS certificate is valid
- Check CORS configuration in backend
- Ensure device has network permission

**PMMSY Calculation Incorrect**
- Verify PMMSY_* environment variables are set
- Check farmer category matches enum values
- Validate unit cost is within scheme limits

### Performance Optimization

**Database Indexing**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_market_prices_species_date 
ON market_prices(species_id, date DESC);

CREATE INDEX CONCURRENTLY idx_water_quality_pond_timestamp 
ON water_quality_logs(pond_id, timestamp DESC);
```

**Redis Caching**
```typescript
// Cache market prices for 1 hour
const cacheKey = `market_prices:${state}:${species}`;
let prices = await redis.get(cacheKey);

if (!prices) {
  prices = await fetchPricesFromDB();
  await redis.setex(cacheKey, 3600, JSON.stringify(prices));
}
```

---

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Support

For support, email support@fishinggod.app or join our WhatsApp group.

---

**Built with ❤️ for Indian Aquaculture**