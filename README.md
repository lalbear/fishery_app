# Fishing God

**Fishing God** is an offline-first mobile app built specifically for Indian fish and shrimp farmers. It empowers them to make better decisions about what to farm, how to manage their ponds, access government subsidies, and stay informed about market prices—all without requiring constant internet connectivity.

## Why Fishing God?

Many Indian aquaculture farmers operate in remote areas with limited internet access. They need practical tools that work offline while still providing expert guidance. Fishing God addresses this by:

- **Accessible Offline:** Farm planning and pond management works even without internet. Data syncs when connection returns.
- **Local Intelligence:** Recommendations consider your specific location, crop season, and farmer category (general, women-owned, SC/ST) to qualify for relevant subsidies.
- **Economics at Your Fingertips:** Run ROI calculations for fish/shrimp species before investing—see CAPEX, OPEX, break-even periods, and profitability scenarios.
- **Real-Time Market Data:** Track fish and shrimp prices in your region to time sales and purchases better.
- **Doctor Network:** Direct access to certified aquaculture experts based on your location for on-demand consultations and disease diagnosis.
- **Water Quality Tracking:** Log and monitor your pond's water parameters over time to catch issues early.

## How It Works

### Getting Started: Set Up Your Profile
When you first open the app, you enter your basic information: name, phone number, farmer category, and home location (state, district, block, panchayat). This location data is critical—it determines which government subsidies you're eligible for and which local aquaculture doctor is assigned to help you.

### Planning Your Pond
Select a fish or shrimp species and enter expected pond specifications. The app instantly shows you:
- **Suitability:** Can you farm this species in your area?
- **Profitability:** What's your expected break-even period? How much profit if everything goes well?
- **Subsidy Eligibility:** What government schemes can help fund your startup costs?

You can run multiple scenarios (different stocking densities, feed costs) to find the most profitable approach for your situation.

### Managing Active Ponds
Once your pond is operational:
- **Log water quality metrics** (pH, dissolved oxygen, ammonia, etc.) to maintain optimal growing conditions
- **Track the pond lifecycle** with notes and observations
- **Get alerts** when water parameters drift outside healthy ranges
- **Access your assigned doctor** anytime you notice signs of disease or stress

### Staying Informed
The app provides:
- **Market prices** for fish and shrimp in your state—track trends and time your harvests for better prices
- **Learning center** with beginner-friendly explanations of aquaculture and business terms
- **Equipment and feed catalogs** with local sourcing information

---

## Features in Detail

### 🐟 Species Intelligence
Search from a comprehensive database of fish and shrimp species. Each profile includes:
- Growth rates, survival rates, and feed conversion ratios
- Water quality requirements (temperature, pH, dissolved oxygen ranges)
- Stocking density recommendations for your region
- Suitability for your area based on climate and policy support

### 💰 Economics & ROI Simulator
Plan your investment with real numbers:
- Input your capital costs (pond construction, equipment) and operating costs (feed, electricity, labor)
- Instantly calculate break-even production and profit margins
- Run "what-if" scenarios: What if feed costs rise 10%? What if yield drops?
- Benefit-Cost Ratio (BCR) shows if the venture is economically viable

### 🏛️ Government Subsidies & Policy
India offers numerous subsidy schemes for aquaculture farmers. Fishing God tracks these by farmer category and location:
- See subsidies you qualify for based on your location and farmer type (general, women, SC/ST)
- Understand what each subsidy covers (land prep, pond liner, equipment, stocking)
- Plan your investment knowing what portion the government will fund

### 🌍 Location-Aware Advisory
Because aquaculture is highly location-dependent, the app delivers location-specific guidance:
- Seasonal advisory tied to your district's climate
- Water sourcing recommendations for your area
- Connectivity to block-level agricultural officers and specialists
- Your assigned aquaculture doctor based on your panchayat

### 📍 Doctor Network
Every farmer is assigned a certified aquaculture specialist based on their home location (panchayat). You can:
- View your assigned doctor's details and contact information
- Request on-demand consultations for disease diagnosis, pond emergencies, or technical advice
- Share pond photos and water quality data with your doctor
- Book paid consultations for specialized guidance

The doctor routing system works hierarchically: if no doctor covers your specific panchayat, you're routed to a doctor covering your block.

### 💧 Water Quality Monitoring
Log water parameters regularly to catch problems before they become costly:
- Record dissolved oxygen, pH, ammonia, temperature, turbidity
- View trends over time in a simple graph
- Get alerts if parameters drift outside safe ranges
- Share logs with your assigned doctor for remote diagnosis

### 💹 Market Intelligence
Access real-time and historical price data for fish and shrimp:
- Track price trends in your state
- Identify seasonal high/low periods
- Make informed decisions about timing harvests
- Adjust stocking plans based on market demand

### 📚 Learning Center
Glossary and beginner guides covering:
- Aquaculture fundamentals (stocking, feeding, disease prevention)
- Business concepts (BCR, profitability, subsidy navigation)
- Water quality management essentials
- Equipment and feed selection

### 🛒 Equipment & Feed Catalogs
Browse suppliers and products with pricing:
- Locally-sourced feed recommendations
- Aeration equipment, nets, and tools
- Pond construction materials
- Supplier contact information

### 🌐 Multi-Language Support
The interface supports multiple Indian languages to ensure farmers in their native region can use the app comfortably.

---

## How It's Built

Fishing God is built with modern, reliable technology:

- **Mobile App:** React Native with Expo, enabling fast deployment to iOS and Android
- **Local Storage:** WatermelonDB for offline-first data syncing
- **Backend API:** Node.js/Express with TypeScript for reliability and developer experience
- **Data:** PostgreSQL for robust, queryable data storage
- **Infrastructure:** Docker for consistent local and production environments

The offline-first architecture means farmers can plan, log, and browse while offline. When internet returns, all data automatically syncs to the backend, ensuring no information is lost.

---

## For Developers

If you're contributing to Fishing God or setting up a local development environment:

- **`DEVELOPER_README.md`** — development status, known gaps, and roadmap
- **`mobile/TESTFLIGHT_SETUP.md`** — iOS build and TestFlight release workflow
- **`backend/MARKET_DATA_STRATEGY.md`** — market data pipeline and sourcing details
- **`ECONOMICS_MATH.md`** — economic formulas, assumptions, and BCR calculations

### Quick Local Setup

```bash
# Start infrastructure
docker compose up -d postgres redis

# Backend
cd backend && npm install
npm run build && npm run migrate
npm run dev

# Mobile (in separate terminal)
cd mobile && npm install
npx expo start
```

For detailed instructions, see `DEVELOPER_README.md`.

---

## License

MIT
