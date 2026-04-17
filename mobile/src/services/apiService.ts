import axios from 'axios';
import { Platform } from 'react-native';

const LOCAL_BACKEND_URL =
    Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const MISSING_PRODUCTION_BACKEND_URL = 'https://fishery-app.onrender.com';

const BACKEND_URL =
    process.env.EXPO_PUBLIC_BACKEND_URL ||
    (__DEV__ ? LOCAL_BACKEND_URL : MISSING_PRODUCTION_BACKEND_URL);

if (!__DEV__ && !process.env.EXPO_PUBLIC_BACKEND_URL) {
    console.warn(
        'EXPO_PUBLIC_BACKEND_URL is not set. Production builds must point to a deployed backend before release or TestFlight.'
    );
}

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

if (__DEV__) {
    api.interceptors.request.use((config) => {
        console.log('[API request]', {
            method: config.method,
            baseURL: config.baseURL,
            url: config.url,
            data: config.data,
        });
        return config;
    });

    api.interceptors.response.use(
        (response) => {
            console.log('[API response]', {
                status: response.status,
                url: response.config?.url,
                data: response.data,
            });
            return response;
        },
        (error) => {
            console.log('[API error]', {
                message: error.message,
                code: error.code,
                url: error.config?.url,
                baseURL: error.config?.baseURL,
                status: error.response?.status,
                data: error.response?.data,
            });
            return Promise.reject(error);
}
    );
}

const FALLBACK_EQUIPMENT = [
    { id: 'eq_1', name: 'Paddle Wheel Aerator 1HP', category: 'AERATION', cost_inr: 25000, lifespan_years: 5, maintenance_cost_annual_inr: 2000, shop_url: 'https://dir.indiamart.com/search.mp?ss=Paddle+Wheel+Aerator' },
    { id: 'eq_2', name: 'Water Quality Test Kit', category: 'MONITORING', cost_inr: 1500, lifespan_years: 1, maintenance_cost_annual_inr: 500, shop_url: 'https://dir.indiamart.com/search.mp?ss=Water+Quality+Test+Kit' },
    { id: 'eq_3', name: 'Automatic Feeder', category: 'FEEDING', cost_inr: 12000, lifespan_years: 3, maintenance_cost_annual_inr: 1000, shop_url: 'https://dir.indiamart.com/search.mp?ss=Automatic+Feeder' }
];

const FALLBACK_FEED = [
    { id: 'fd_1', name: 'Premium Starter', brand: 'Godrej Agrovet', feed_type: 'FLOATING_PELLET', protein_percent: 32, fat_percent: 5, cost_per_kg_inr: 55, packaging_size_kg: 25, suitable_for: 'Fry and Fingerlings', shop_url: 'https://dir.indiamart.com/search.mp?ss=Godrej+Agrovet+Fish+Feed' },
    { id: 'fd_2', name: 'Grower Plus', brand: 'CP Aquaculture', feed_type: 'FLOATING_PELLET', protein_percent: 28, fat_percent: 4, cost_per_kg_inr: 45, packaging_size_kg: 35, suitable_for: 'Grow-out stage (Indian Major Carp)', shop_url: 'https://dir.indiamart.com/search.mp?ss=CP+Aquaculture+Fish+Feed' },
    { id: 'fd_3', name: 'Shrimp Finisher', brand: 'Avanti Feeds', feed_type: 'SINKING_PELLET', protein_percent: 38, fat_percent: 6, cost_per_kg_inr: 110, packaging_size_kg: 25, suitable_for: 'Vannamei Shrimp', shop_url: 'https://dir.indiamart.com/search.mp?ss=Avanti+Feeds+Shrimp' }
];

const FALLBACK_PRICES = [
    { id: 'pr_1', species_name: 'Rohu', market_name: 'Local Fish Market', state_code: 'AP', price_inr_per_kg: 150, grade: 'Medium', date: new Date().toISOString(), source: 'Local Data', volume_kg: 500 },
    { id: 'pr_2', species_name: 'Catla', market_name: 'Local Fish Market', state_code: 'AP', price_inr_per_kg: 160, grade: 'Medium', date: new Date().toISOString(), source: 'Local Data', volume_kg: 300 },
    { id: 'pr_3', species_name: 'Vannamei Shrimp', market_name: 'Export Hub', state_code: 'AP', price_inr_per_kg: 400, grade: 'Premium', date: new Date().toISOString(), source: 'Export Data', volume_kg: 1000 }
];

const FALLBACK_SPECIES = [
    {
        id: 'sp_1',
        data: {
            scientific_name: "Labeo rohita",
            common_names: { "en": "Rohu", "hi": "Rui" },
            category: "INDIAN_MAJOR_CARP",
            culture_period_months: { min: 8, max: 12 },
            optimal_systems: ["TRADITIONAL_POND", "BIOFLOC"]
        }
    },
    {
        id: 'sp_2',
        data: {
            scientific_name: "Catla catla",
            common_names: { "en": "Catla", "hi": "Bhakur" },
            category: "INDIAN_MAJOR_CARP",
            culture_period_months: { min: 10, max: 12 },
            optimal_systems: ["TRADITIONAL_POND"]
        }
    },
    {
        id: 'sp_3',
        data: {
            scientific_name: "Litopenaeus vannamei",
            common_names: { "en": "Vannamei Shrimp", "hi": "Safed Jhinga" },
            category: "SHRIMP",
            culture_period_months: { min: 4, max: 5 },
            optimal_systems: ["BRACKISH_POND"]
        }
    }
];

export const geoService = {
    getZones: async () => {
        const response = await api.get('/api/v1/geo/zones');
        return response.data;
    },
    getZonesByState: async (stateCode: string) => {
        const response = await api.get(`/api/v1/geo/zones/${stateCode}`);
        return response.data;
    },
    analyzeSuitability: async (data: {
        latitude: number;
        longitude: number;
        stateCode: string;
        districtCode: string;
        waterSourceType: string;
        measuredSalinityUsCm?: number;
    }) => {
        const response = await api.post('/api/v1/geo/suitability', data);
        return response.data;
    },
};

export const economicsService = {
    simulate: async (data: any) => {
        const response = await api.post('/api/v1/economics/simulate', data);
        return response.data;
    },
    getAdvisory: async (params: {
        stateCode: string;
        farmerCategory: 'GENERAL' | 'WOMEN' | 'SC' | 'ST';
        projectType?: 'FRESHWATER' | 'BRACKISH' | 'INTEGRATED' | 'RAS';
    }) => {
        const response = await api.get('/api/v1/economics/advisory', { params });
        return response.data;
    },
    getSubsidy: async (data: any) => {
        const response = await api.post('/api/v1/economics/subsidy', data);
        return response.data;
    },
    getEquipment: async () => {
        try {
            const response = await api.get('/api/v1/economics/equipment');
            return response.data;
        } catch (error) {
            console.warn('[Offline Mode] Falling back to local equipment data');
            return { success: true, data: FALLBACK_EQUIPMENT };
        }
    },
    getFeed: async () => {
        try {
            const response = await api.get('/api/v1/economics/feed');
            return response.data;
        } catch (error) {
            console.warn('[Offline Mode] Falling back to local feed data');
            return { success: true, data: FALLBACK_FEED };
        }
    },
};

export const marketService = {
    getPrices: async (params?: { species?: string; state?: string }) => {
        try {
            const response = await api.get('/api/v1/market/prices', { params });
            return response.data;
        } catch (error) {
            console.warn('[Offline Mode] Falling back to local market prices');
            return { success: true, data: FALLBACK_PRICES };
        }
    },
    getTrends: async () => {
        const response = await api.get('/api/v1/market/trends');
        return response.data;
    },
};

export const speciesService = {
    getAll: async () => {
        try {
            const response = await api.get('/api/v1/species');
            return response.data;
        } catch (error) {
            console.warn('[Offline Mode] Falling back to local species data');
            return { success: true, data: FALLBACK_SPECIES };
        }
    },
    getById: async (id: string) => {
        const response = await api.get(`/api/v1/species/${id}`);
        return response.data;
    },
};

export const waterQualityService = {
    saveReading: async (data: {
        temperature?: number;
        dissolvedOxygen?: number;
        ph?: number;
        salinity?: number;
        ammonia?: number;
        notes?: string;
    }) => {
        const response = await api.post('/api/v1/water-quality/readings', data);
        return response.data;
    },
    getReadings: async () => {
        const response = await api.get('/api/v1/water-quality/readings');
        return response.data;
    },
};

export default api;
