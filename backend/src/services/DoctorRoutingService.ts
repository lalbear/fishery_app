import { query } from '../db';

type RoutingInput = {
  farmerId: string;
  pondId?: string | null;
};

type RoutingResult = {
  doctor: any;
  routing: {
    source: 'pond' | 'profile';
    panchayatCode: string;
    blockCode?: string | null;
    districtCode?: string | null;
  };
};

function normalize(value?: string | null): string {
  return (value || '').trim();
}

export async function resolveDoctorForFarmer(input: RoutingInput): Promise<RoutingResult> {
  const profileResult = await query(
    `
      SELECT id, state_code, district_code, block_code, panchayat_code
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [input.farmerId]
  );

  if (profileResult.rowCount === 0) {
    throw new Error('Farmer profile not found.');
  }

  const profile = profileResult.rows[0];
  let districtCode = normalize(profile.district_code);
  let blockCode = normalize(profile.block_code);
  let panchayatCode = normalize(profile.panchayat_code);
  let source: 'pond' | 'profile' = 'profile';

  if (input.pondId) {
    const pondResult = await query(
      `
        SELECT id, district_code, block_code, panchayat_code
        FROM ponds
        WHERE id = $1 AND user_id = $2
        LIMIT 1
      `,
      [input.pondId, input.farmerId]
    );

    if (pondResult.rowCount === 0) {
      throw new Error('Selected pond not found for this farmer.');
    }

    const pond = pondResult.rows[0];
    if (normalize(pond.panchayat_code)) {
      districtCode = normalize(pond.district_code) || districtCode;
      blockCode = normalize(pond.block_code) || blockCode;
      panchayatCode = normalize(pond.panchayat_code);
      source = 'pond';
    }
  }

  if (!panchayatCode) {
    throw new Error('Panchayat is missing. Complete profile or pond location before booking.');
  }

  const doctorResult = await query(
    `
      SELECT *
      FROM doctors
      WHERE is_active = true
        AND $1 = ANY(assigned_panchayats)
      ORDER BY name
      LIMIT 1
    `,
    [panchayatCode]
  );

  let doctor = doctorResult.rows[0];
  let strategy = 'PANCHAYAT_EXACT';

  // Fallback 1: Same district
  if (!doctor && districtCode) {
    const districtDoctorResult = await query(
      `
        SELECT *
        FROM doctors
        WHERE is_active = true
          AND EXISTS (
            SELECT 1 FROM unnest(assigned_panchayats) ap
            WHERE ap LIKE $1
          )
        ORDER BY name
        LIMIT 1
      `,
      [`${districtCode}%`]
    );
    if (districtDoctorResult.rowCount! > 0) {
      doctor = districtDoctorResult.rows[0];
      strategy = 'DISTRICT_FALLBACK';
    }
  }

  // Fallback 2: Global active doctor
  if (!doctor) {
    const globalDoctorResult = await query(
      `
        SELECT *
        FROM doctors
        WHERE is_active = true
        ORDER BY name
        LIMIT 1
      `
    );
    if (globalDoctorResult.rowCount! > 0) {
      doctor = globalDoctorResult.rows[0];
      strategy = 'GLOBAL_FALLBACK';
    }
  }

  if (!doctor) {
    throw new Error(`No doctors available in the system.`);
  }

  return {
    doctor,
    routing: {
      source,
      panchayatCode,
      blockCode: blockCode || null,
      districtCode: districtCode || null,
      strategy,
    } as any,
  };
}
