import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROFILE_KEY = '@fishing_god_profile';

export interface UserProfile {
    userId: string;
    name: string;
    phone: string;
    farmerCategory: 'GENERAL' | 'WOMEN' | 'SC' | 'ST';
    stateCode: string;
    districtCode?: string;
    districtName?: string;
    blockCode?: string;
    blockName?: string;
    panchayatCode?: string;
    panchayatName?: string;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function loadProfile(): Promise<UserProfile> {
    try {
        const json = await AsyncStorage.getItem(PROFILE_KEY);
        if (json) {
            const p = JSON.parse(json) as UserProfile;
            if (!p.userId) {
                p.userId = generateUUID();
                await saveProfile(p);
            }
            return p;
        }
    } catch { }
    return { userId: generateUUID(), name: '', phone: '', farmerCategory: 'GENERAL', stateCode: '' };
}

export async function saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function isProfileLocationComplete(profile: UserProfile): boolean {
    return !!(profile.stateCode && profile.districtCode && profile.blockCode && profile.panchayatCode);
}
