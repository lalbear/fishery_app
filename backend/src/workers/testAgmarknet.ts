import { MarketDataIngestionWorker } from './marketDataIngestion';
import { logger } from '../utils/logger';

async function testRun() {
    console.log('🚀 Starting Sample Market Ingestion (Agmarknet Focus)...');
    const worker = new MarketDataIngestionWorker();

    try {
        // Override ingestMarketData to just run Agmarknet for testing
        console.log('--- 📊 SCRAPING AGMARKNET ---');

        // We need to pass target species
        const targets = [
            { scientific: 'Labeo rohita', common: 'Rohu' },
            { scientific: 'Catla catla', common: 'Catla' }
        ];

        // Manually trigger AGMARKNET scrape
        // Note: scrapeAGMARKNET is private, so we'll use a hack or just run the whole thing
        await (worker as any).scrapeAGMARKNET(targets);

        console.log('--- TEST COMPLETED ---');
    } catch (err) {
        console.error('❌ Sample run failed:', err);
    }
}

testRun();
