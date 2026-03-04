import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.7:3000';

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    getSubsidy: async (data: any) => {
        const response = await api.post('/api/v1/economics/subsidy', data);
        return response.data;
    },
    getEquipment: async () => {
        const response = await api.get('/api/v1/economics/equipment');
        return response.data;
    },
};

export default api;
