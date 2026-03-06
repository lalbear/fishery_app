import { FMPISScraper } from './fmpisScraper';
import { logger } from '../utils/logger';

async function testRun() {
    console.log('🚀 Starting Sample FMPIS Scraper Run...');
    const scraper = new FMPISScraper();

    try {
        const results = await scraper.scrapePrices();

        console.log('\n--- 📊 SCRAPING RESULTS ---');
        console.log(`Total entries found: ${results.length}`);

        if (results.length > 0) {
            console.log('\nSample Data (First 10 entries):');
            results.slice(0, 10).forEach((entry, i) => {
                console.log(`${i + 1}. [${entry.marketName}] ${entry.speciesName} (${entry.size}): ₹${entry.priceInrPerKg}/kg`);
            });
            console.log('--- END OF SAMPLE ---\n');
        } else {
            console.warn('⚠️ No data entries were found in this run. This could be due to time of day or regional availability on FMPIS.');
        }

    } catch (err) {
        console.error('❌ Sample run failed:', err);
    }
}

testRun();
