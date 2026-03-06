/**
 * Market Data Ingestion Worker
 * Scrapes market prices from NFDB FMPIS and AGMARKNET
 * Runs as background job for continuous price updates
 */

import cron from 'node-cron';
import { query } from '../db';
import { logger } from '../utils/logger';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { FMPISScraper, FMPISPriceEntry } from './fmpisScraper';

// Constants for data sources
const DATA_SOURCES = {
  NFDB_FMPI: 'https://nfdb.fishmarket.gov.in',
  AGMARKNET: `https://agmarknet.gov.in/SearchCMM1.aspx?Tx_Commodity=Fish&Tx_State=0&Tx_District=0&Tx_Market=0&DateFrom=${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}&DateTo=${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}&Fr_Date=${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}&To_Date=${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}&Trend=0&CurrentSession=1`
};

interface MarketPriceEntry {
  speciesId?: string;
  speciesName: string;
  marketName: string;
  stateCode: string;
  priceInrPerKg: number;
  grade: string;
  date: Date;
  source: 'NFDB_FMPI' | 'AGMARKNET' | 'MANUAL_ENTRY';
  volumeKg?: number;
}

export class MarketDataIngestionWorker {
  private isRunning = false;

  start(): void {
    logger.info('Starting Market Data Ingestion Worker');

    cron.schedule('0 */6 * * *', () => {
      this.ingestMarketData();
    });

    this.ingestMarketData();
  }

  async ingestMarketData(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Ingestion already in progress, skipping');
      return;
    }

    this.isRunning = true;
    logger.info('Starting market data ingestion job');

    try {
      // 1. Get all unique species from our knowledge base
      const speciesResult = await query(`
        SELECT id,
               data->>'scientific_name' as scientific_name, 
               data->'common_names'->>'en' as common_name,
               data->'economic_parameters'->'market_price_per_kg_inr'->>'min' as min_price_1,
               data->'economic_parameters'->'market_price_per_kg_inr'->>'max' as max_price_1,
               data->'economic_parameters'->'market_price_inr_per_kg'->>'min' as min_price_2,
               data->'economic_parameters'->'market_price_inr_per_kg'->>'max' as max_price_2
        FROM knowledge_nodes 
        WHERE node_type = 'SPECIES'
      `);

      const targetSpecies = speciesResult.rows.map(r => {
        let minPrice = parseFloat(r.min_price_1 || r.min_price_2 || '100');
        let maxPrice = parseFloat(r.max_price_1 || r.max_price_2 || '150');
        if (isNaN(minPrice)) minPrice = 100;
        if (isNaN(maxPrice)) maxPrice = 150;

        return {
          id: r.id,
          scientific: r.scientific_name,
          common: r.common_name || r.scientific_name,
          basePrice: (minPrice + maxPrice) / 2
        };
      });

      logger.info(`Targeting ${targetSpecies.length} species for price updates`);

      // 2. Perform scraping
      await this.scrapeAGMARKNET(targetSpecies);
      await this.scrapeFMPIS(targetSpecies);

      // 3. Simulated data fallback has been strictly removed by user request
      // We rely 100% on real scraped data now.

      logger.info('Market data ingestion completed successfully');
    } catch (error) {
      logger.error('Market data ingestion failed', { error: (error as Error).message });
    } finally {
      this.isRunning = false;
    }
  }

  private async scrapeAGMARKNET(targets: any[]): Promise<void> {
    logger.info('Scraping from AGMARKNET for the last 7 days...');
    let count = 0;

    // Fetch real data sequentially for the last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      // Format date to DD-MMM-YYYY for Agmarknet's specific URL format
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const dateStr = `${day}-${month}-${year}`;

      const url = `https://agmarknet.gov.in/SearchCMM1.aspx?Tx_Commodity=Fish&Tx_State=0&Tx_District=0&Tx_Market=0&DateFrom=${dateStr}&DateTo=${dateStr}&Fr_Date=${dateStr}&To_Date=${dateStr}&Trend=0&CurrentSession=1`;

      try {
        const response = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(response.data);

        $('table tr').each((_, el) => {
          const cols = $(el).find('td');
          if (cols.length > 5) {
            const commodity = $(cols[1]).text().trim();
            const market = $(cols[2]).text().trim();
            const price = parseFloat($(cols[7]).text().trim()); // Modal Price

            const match = targets.find(t =>
              commodity.toLowerCase().includes(t.common.toLowerCase()) ||
              t.common.toLowerCase().includes(commodity.toLowerCase())
            );

            if (match && !isNaN(price)) {
              this.insertMarketPrice({
                speciesId: match.id,
                speciesName: match.common,
                marketName: market,
                stateCode: 'IN', // Generic for now
                priceInrPerKg: price,
                grade: 'Standard',
                date: d,
                source: 'AGMARKNET'
              });
              count++;
            }
          }
        });
      } catch (err) {
        logger.error(`AGMARKNET SCRAPE FAILED FOR ${dateStr}`, { error: (err as Error).message });
      }
    }
    logger.info(`Scraped ${count} real entries from AGMARKNET`);
  }

  private async scrapeFMPIS(targets: any[]): Promise<void> {
    logger.info('Scraping from FMPIS NFDB...');
    const scraper = new FMPISScraper();
    try {
      const results = await scraper.scrapePrices();
      let count = 0;

      for (const result of results) {
        // Find best match for species name
        const match = targets.find(t =>
          result.speciesName.toLowerCase().includes(t.common.toLowerCase()) ||
          t.common.toLowerCase().includes(result.speciesName.toLowerCase())
        );

        if (match) {
          await this.insertMarketPrice({
            speciesName: match.common,
            marketName: result.marketName,
            stateCode: 'IN',
            priceInrPerKg: result.priceInrPerKg,
            grade: result.size,
            date: result.date,
            source: 'NFDB_FMPI'
          });
          count++;
        }
      }
      logger.info(`Scraped ${count} matched entries from FMPIS`);
    } catch (err) {
      logger.error('FMPIS SCRAPE FAILED', { error: (err as Error).message });
    }
  }

  private async ingestSimulatedData(): Promise<void> {
    logger.info('Updating baseline research benchmarks');

    const simulatedPrices: MarketPriceEntry[] = [
      { speciesName: 'Rohu', marketName: 'Kolkata', stateCode: 'WB', priceInrPerKg: 145, grade: 'A', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 500 },
      { speciesName: 'Rohu', marketName: 'Hyderabad', stateCode: 'TG', priceInrPerKg: 150, grade: 'A', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 750 },
      { speciesName: 'Catla', marketName: 'Kolkata', stateCode: 'WB', priceInrPerKg: 155, grade: 'A', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 450 },
      { speciesName: 'Vannamei Shrimp', marketName: 'Visakhapatnam', stateCode: 'AP', priceInrPerKg: 375, grade: '60-count', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 1200 },
      { speciesName: 'Black Tiger Shrimp', marketName: 'Kochi', stateCode: 'KL', priceInrPerKg: 650, grade: 'Standard', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 800 },
      { speciesName: 'Pangasius', marketName: 'Nadia', stateCode: 'WB', priceInrPerKg: 175, grade: 'A', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 2000 },
      { speciesName: 'Tilapia', marketName: 'Bengaluru', stateCode: 'KA', priceInrPerKg: 160, grade: 'A', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 600 },
      { speciesName: 'Striped Murrel', marketName: 'Chennai', stateCode: 'TN', priceInrPerKg: 525, grade: 'Premium', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 150 },
      { speciesName: 'Pabda', marketName: 'Kolkata', stateCode: 'WB', priceInrPerKg: 600, grade: 'Premium', date: new Date(), source: 'MANUAL_ENTRY', volumeKg: 100 }
    ];

    for (const price of simulatedPrices) {
      await this.insertMarketPrice(price);
    }
  }

  private async insertMarketPrice(entry: MarketPriceEntry): Promise<void> {
    await query(`
      INSERT INTO market_prices 
      (species_id, species_name, market_name, state_code, price_inr_per_kg, grade, date, source, volume_kg)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (species_id, market_name, date) 
      DO UPDATE SET 
        price_inr_per_kg = EXCLUDED.price_inr_per_kg,
        volume_kg = EXCLUDED.volume_kg
    `, [
      entry.speciesId, entry.speciesName, entry.marketName, entry.stateCode,
      entry.priceInrPerKg, entry.grade,
      entry.date.toISOString().split('T')[0],
      entry.source, entry.volumeKg
    ]).catch(err => {
      logger.error('Failed to insert/update market price', { error: err.message, species: entry.speciesName });
    });
  }
}

if (require.main === module) {
  const worker = new MarketDataIngestionWorker();
  worker.start();
}
