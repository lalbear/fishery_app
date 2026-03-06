/**
 * Pond Advisory Rule Engine
 * Offline-first, zero-backend rule system.
 * Evaluates water quality readings and returns actionable advice.
 */

export type AdvisoryLevel = 'critical' | 'warning' | 'good';

export interface Advisory {
    level: AdvisoryLevel;
    title: string;
    message: string;
    action: string;
    icon: string;
}

interface Reading {
    temperature?: number | null;
    dissolved_oxygen?: number | null;
    ph?: number | null;
    salinity?: number | null;
    ammonia?: number | null;
}

export function evaluatePondHealth(reading: Reading): Advisory {
    const { temperature, dissolved_oxygen, ph, ammonia } = reading;

    // ─── CRITICAL rules (immediate action required) ───────────────────────
    if (dissolved_oxygen != null && dissolved_oxygen < 3) {
        return {
            level: 'critical',
            title: '🚨 Critical: Oxygen Emergency',
            message: `DO is dangerously low at ${dissolved_oxygen} mg/L. Fish mortality risk is HIGH.`,
            action: 'Run all aerators immediately. Do NOT feed fish. Call your local fisheries officer.',
            icon: 'alert-circle',
        };
    }

    if (ammonia != null && ammonia > 0.5) {
        return {
            level: 'critical',
            title: '🚨 Critical: Toxic Ammonia',
            message: `Ammonia is ${ammonia} mg/L — above safe limit of 0.5 mg/L.`,
            action: 'Stop feeding immediately. Do a 20–30% water exchange. Apply zeolite at 50 kg/acre.',
            icon: 'alert-circle',
        };
    }

    // ─── WARNING rules (act within a few hours) ───────────────────────────
    if (dissolved_oxygen != null && dissolved_oxygen < 5) {
        return {
            level: 'warning',
            title: '⚠️ Low Dissolved Oxygen',
            message: `DO is ${dissolved_oxygen} mg/L. Optimal is 5–8 mg/L.`,
            action: 'Start aerators. Avoid feeding during low-oxygen hours (5–7 AM). Recheck in 2 hrs.',
            icon: 'warning',
        };
    }

    if (ph != null && ph > 9.0) {
        return {
            level: 'warning',
            title: '⚠️ pH Too High',
            message: `pH is ${ph.toFixed(1)} — highly alkaline. Stress risk for fish.`,
            action: 'Add agricultural gypsum at 10 kg/acre. Avoid lime application today.',
            icon: 'warning',
        };
    }

    if (ph != null && ph < 6.5) {
        return {
            level: 'warning',
            title: '⚠️ pH Too Low (Acidic)',
            message: `pH is ${ph.toFixed(1)} — below safe range of 6.5–8.5.`,
            action: 'Apply agricultural lime (quicklime) at 10–15 kg/acre in the evening.',
            icon: 'warning',
        };
    }

    if (temperature != null && temperature > 35) {
        return {
            level: 'warning',
            title: '⚠️ High Water Temperature',
            message: `Water temperature is ${temperature}°C. Above 35°C causes heat stress.`,
            action: 'Increase water depth if possible. Run aerators 24/7. Reduce feed by 30% today.',
            icon: 'thermometer',
        };
    }

    if (temperature != null && temperature < 20) {
        return {
            level: 'warning',
            title: '⚠️ Low Temperature',
            message: `Temperature is ${temperature}°C. Fish metabolism slows below 20°C.`,
            action: 'Reduce feeding by 50%. Avoid stocking during cold spell. Monitor DO more frequently.',
            icon: 'thermometer',
        };
    }

    if (ammonia != null && ammonia > 0.1) {
        return {
            level: 'warning',
            title: '⚠️ Ammonia Rising',
            message: `Ammonia at ${ammonia} mg/L — approaching danger zone.`,
            action: 'Reduce feed ration by 20%. Apply probiotics. Ensure aeration is running.',
            icon: 'warning',
        };
    }

    // ─── GOOD ─────────────────────────────────────────────────────────────
    return {
        level: 'good',
        title: '✅ Pond Health: Normal',
        message: 'All measured parameters are within safe ranges.',
        action: 'Keep monitoring daily. Maintain regular feeding schedule.',
        icon: 'checkmark-circle',
    };
}

/** Returns a simple health score 0–100 for display in dashboards */
export function pondHealthScore(reading: Reading): number {
    const advisories: Advisory[] = [];
    const { dissolved_oxygen, ph, temperature, ammonia } = reading;

    if (dissolved_oxygen != null && dissolved_oxygen < 3) return 5;
    if (ammonia != null && ammonia > 0.5) return 10;
    if (dissolved_oxygen != null && dissolved_oxygen < 5) return 40;
    if (ph != null && (ph < 6.5 || ph > 9.0)) return 45;
    if (temperature != null && temperature > 35) return 50;
    if (ammonia != null && ammonia > 0.1) return 55;

    // Score based on how close to optimal values
    let score = 100;
    if (dissolved_oxygen != null) {
        if (dissolved_oxygen < 6) score -= 10;
    }
    if (ph != null) {
        if (ph < 7 || ph > 8.5) score -= 5;
    }
    if (temperature != null) {
        if (temperature > 32 || temperature < 22) score -= 5;
    }

    return Math.max(0, Math.min(100, score));
}
