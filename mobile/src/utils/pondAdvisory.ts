/**
 * Pond Advisory Rule Engine
 * Offline-first, zero-backend rule system.
 * Evaluates water quality readings against species-specific targets.
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
    /** Optional: pass scientific name for species-specific thresholds */
    speciesScientificName?: string | null;
}

export function evaluatePondHealth(reading: Reading): Advisory {
    const { temperature, dissolved_oxygen, ph, ammonia, speciesScientificName } = reading;

    // Import targets lazily to avoid circular deps
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getWaterQualityTargets } = require('./pondLifecycle') as typeof import('./pondLifecycle');
    const targets = getWaterQualityTargets(speciesScientificName);

    // ─── CRITICAL rules ───────────────────────────────────────────────────
    if (dissolved_oxygen != null && dissolved_oxygen < 3) {
        return {
            level: 'critical',
            title: '🚨 Critical: Oxygen Emergency',
            message: `DO is dangerously low at ${dissolved_oxygen} mg/L. Fish mortality risk is HIGH.`,
            action: 'Run all aerators immediately. Do NOT feed fish. Call your local fisheries officer.',
            icon: 'alert-circle',
        };
    }

    if (ammonia != null && ammonia > targets.ammoniaMax) {
        return {
            level: 'critical',
            title: '🚨 Critical: Toxic Ammonia',
            message: `Ammonia is ${ammonia} mg/L — above safe limit of ${targets.ammoniaMax} mg/L.`,
            action: 'Stop feeding immediately. Do a 20–30% water exchange. Apply zeolite at 50 kg/acre.',
            icon: 'alert-circle',
        };
    }

    // ─── WARNING rules ────────────────────────────────────────────────────
    if (dissolved_oxygen != null && dissolved_oxygen < targets.doMin) {
        return {
            level: 'warning',
            title: '⚠️ Low Dissolved Oxygen',
            message: `DO is ${dissolved_oxygen} mg/L. Optimal for this species is > ${targets.doOpt} mg/L.`,
            action: 'Start aerators. Avoid feeding during low-oxygen hours (5–7 AM). Recheck in 2 hrs.',
            icon: 'warning',
        };
    }

    if (ph != null && ph > targets.phMax) {
        return {
            level: 'warning',
            title: '⚠️ pH Too High',
            message: `pH is ${ph.toFixed(1)} — above safe range of ${targets.phMin}–${targets.phMax}.`,
            action: 'Add agricultural gypsum at 10 kg/acre. Avoid lime application today.',
            icon: 'warning',
        };
    }

    if (ph != null && ph < targets.phMin) {
        return {
            level: 'warning',
            title: '⚠️ pH Too Low (Acidic)',
            message: `pH is ${ph.toFixed(1)} — below safe range of ${targets.phMin}–${targets.phMax}.`,
            action: 'Apply agricultural lime (quicklime) at 10–15 kg/acre in the evening.',
            icon: 'warning',
        };
    }

    if (temperature != null && temperature > targets.tempMax) {
        return {
            level: 'warning',
            title: '⚠️ High Water Temperature',
            message: `Water temperature is ${temperature}°C. Above ${targets.tempMax}°C causes heat stress.`,
            action: 'Increase water depth if possible. Run aerators 24/7. Reduce feed by 30% today.',
            icon: 'thermometer',
        };
    }

    if (temperature != null && temperature < targets.tempMin) {
        return {
            level: 'warning',
            title: '⚠️ Low Temperature',
            message: `Temperature is ${temperature}°C. Below ${targets.tempMin}°C — fish metabolism slows.`,
            action: 'Reduce feeding by 50%. Avoid stocking during cold spell. Monitor DO more frequently.',
            icon: 'thermometer',
        };
    }

    if (ammonia != null && ammonia > targets.ammoniaMax * 0.2) {
        return {
            level: 'warning',
            title: '⚠️ Ammonia Rising',
            message: `Ammonia at ${ammonia} mg/L — approaching danger zone (limit: ${targets.ammoniaMax} mg/L).`,
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
    const { dissolved_oxygen, ph, temperature, ammonia, speciesScientificName } = reading;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getWaterQualityTargets } = require('./pondLifecycle') as typeof import('./pondLifecycle');
    const t = getWaterQualityTargets(speciesScientificName);

    if (dissolved_oxygen != null && dissolved_oxygen < 3) return 5;
    if (ammonia != null && ammonia > t.ammoniaMax) return 10;
    if (dissolved_oxygen != null && dissolved_oxygen < t.doMin) return 40;
    if (ph != null && (ph < t.phMin || ph > t.phMax)) return 45;
    if (temperature != null && temperature > t.tempMax) return 50;
    if (ammonia != null && ammonia > t.ammoniaMax * 0.2) return 55;

    let score = 100;
    if (dissolved_oxygen != null && dissolved_oxygen < t.doOpt) score -= 10;
    if (ph != null && (ph < t.phOpt - 0.5 || ph > t.phOpt + 0.5)) score -= 5;
    if (temperature != null && (temperature > t.tempOptMax || temperature < t.tempOptMin)) score -= 5;

    return Math.max(0, Math.min(100, score));
}
