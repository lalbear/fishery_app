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
        const response = await api.get('/api/v1/economics/equipment');
        return response.data;
    },
    getFeed: async () => {
        const response = await api.get('/api/v1/economics/feed');
        return response.data;
    },
};

export const marketService = {
    getPrices: async (params?: { species?: string; state?: string }) => {
        const response = await api.get('/api/v1/market/prices', { params });
        return response.data;
    },
    getTrends: async () => {
        const response = await api.get('/api/v1/market/trends');
        return response.data;
    },
};

export const speciesService = {
    getAll: async () => {
        const response = await api.get('/api/v1/species');
        return response.data;
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
