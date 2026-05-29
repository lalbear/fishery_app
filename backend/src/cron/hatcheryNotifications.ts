import cron from 'node-cron';
import { query } from '../db';
import { logger } from '../utils/logger';

function daysBetween(date1: Date, date2: Date): number {
  return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

export function startHatcheryCron() {
  // Run every day at 6:00 AM IST
  cron.schedule('0 0 6 * * *', async () => {
    logger.info('Running Hatchery Stage-by-Stage Notifications cron job');
    try {
      const now = new Date();

      // Find all active batches (current stage not 'sold')
      const { rows: batches } = await query(`
        SELECT b.*, sl.started_at as stage_started_at,
               h.name as hatchery_name, h.operator_id
        FROM hatchery_batches b
        JOIN hatcheries h ON b.hatchery_id = h.id
        JOIN hatchery_stage_logs sl ON sl.batch_id = b.id
        WHERE b.current_stage = sl.stage
          AND sl.ended_at IS NULL
          AND b.current_stage != 'sold'
      `);

      for (const batch of batches) {
        const daysInStage = daysBetween(new Date(batch.stage_started_at), now);
        let message: string | null = null;
        let severity: 'info' | 'warning' | 'critical' = 'info';

        switch (batch.current_stage) {
          case 'broodstock':
            if (daysInStage > 0 && daysInStage % 30 === 0) {
              message = `Batch ${batch.species_name} (Broodstock): Water check reminder. Keep water temperature optimal (26-32°C) for induced spawning readiness.`;
              severity = 'warning';
            } else if (daysInStage > 0 && daysInStage % 15 === 0) {
              message = `Batch ${batch.species_name} (Broodstock): Conditioning reminder. Ensure high-protein feed (30-35% protein) at 1-2% body weight daily. Target sex ratio is 1:1.`;
            }
            break;

          case 'spawning':
            if (daysInStage === 1) {
              message = `Batch ${batch.species_name} has been in Spawning stage for 24 hours. Ensure hormone injection is complete, and eggs/milt are released. Advance to Hatching stage.`;
              severity = 'warning';
            }
            break;

          case 'hatching':
            if (daysInStage === 1) {
              message = `Batch ${batch.species_name} (Hatching): Larvae (sac fry) yolk-sac absorption period. Do NOT feed externally for next 48-72 hours. Maintain DO and water circulation.`;
              severity = 'warning';
            } else if (daysInStage === 3) {
              message = `Batch ${batch.species_name} (Hatching): Yolk-sac absorption is complete. Transfer advanced spawn to prepared nursery ponds immediately.`;
              severity = 'critical';
            }
            break;

          case 'nursery':
            if (daysInStage === 5) {
              message = `Batch ${batch.species_name} (Nursery): Start supplemental feeding today (rice bran + mustard cake at 1:1 ratio, twice daily).`;
            } else if (daysInStage === 10) {
              message = `Batch ${batch.species_name} (Nursery): Water quality test reminder. Ensure DO > 5 mg/L and pH is 7.5-8.5.`;
              severity = 'warning';
            } else if (daysInStage === 15) {
              message = `Batch ${batch.species_name} (Nursery): Day 15 sampling check. Measure fry growth (should be 15-20 mm).`;
            } else if (daysInStage === 21) {
              message = `Batch ${batch.species_name} (Nursery): Day 21. Fry should be 25-35 mm and ready for transfer. Prepare rearing ponds.`;
              severity = 'warning';
            }
            break;

          case 'rearing':
            if (daysInStage === 10) {
              message = `Batch ${batch.species_name} (Rearing): Water quality check. Ensure DO > 5 mg/L and test ammonia levels.`;
              severity = 'warning';
            } else if (daysInStage === 30) {
              message = `Batch ${batch.species_name} (Rearing): Rearing progress check. Ensure twice daily feeding.`;
            } else if (daysInStage === 45) {
              message = `Batch ${batch.species_name} (Rearing): 50% completed (Day 45). Begin identifying buyers for fingerlings.`;
            } else if (daysInStage === 60) {
              message = `Batch ${batch.species_name} (Rearing): 80% completed (Day 60). List available fingerlings on MatsyaMitra marketplace now.`;
              severity = 'warning';
            } else if (daysInStage === 75 - 10) {
              message = `URGENT: Batch ${batch.species_name} is 10 days from fingerling readiness. Sample-weigh fingerlings (target 8-15g) and confirm buyer delivery.`;
              severity = 'critical';
            } else if (daysInStage === 75) {
              message = `Batch ${batch.species_name} has completed rearing. Fingerlings are ready for sale. Record fingerling sales.`;
              severity = 'warning';
            }
            break;

          case 'fingerling_ready':
            if (daysInStage > 0 && daysInStage % 7 === 0) {
              message = `Batch ${batch.species_name} (Fingerling Ready): Record sale transactions to clear batch and generate farmer grow-out QR code.`;
              severity = 'warning';
            }
            break;
        }

        if (message) {
          // Insert notification for the operator
          await query(`
            INSERT INTO farmer_notifications (farmer_id, type, title, message, is_read, created_at)
            VALUES ($1, 'hatchery_alert', $2, $3, FALSE, NOW())
          `, [batch.operator_id, `Hatchery Alert (${severity.toUpperCase()})`, message]);

          // Notify Admin users
          await query(`
            INSERT INTO farmer_notifications (farmer_id, type, title, message, is_read, created_at)
            SELECT id, 'hatchery_alert', $1, $2, FALSE, NOW()
            FROM users WHERE role = 'ADMIN'
          `, [`Hatchery Alert — ${batch.hatchery_name}`, message]);
        }
      }
    } catch (error: any) {
      logger.error('Hatchery Notifications cron job error', { error: error.message });
    }
  });
}
