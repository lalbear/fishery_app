import puppeteer from 'puppeteer';
import { logger } from '../utils/logger';

export interface FMPISPriceEntry {
    speciesName: string;
    size: string;
    priceInrPerKg: number;
    date: Date;
    marketName: string;
}

export class FMPISScraper {
    private url = 'https://fmpisnfdb.in/prices/dashboard';

    async scrapePrices(): Promise<FMPISPriceEntry[]> {
        logger.info('Starting Puppeteer scraper for FMPIS...');

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        const allEntries: FMPISPriceEntry[] = [];

        try {
            await page.goto(this.url, { waitUntil: 'networkidle2' });

            // The dashboard loads data dynamically. We'll target major states first.
            // 1 = Andhra Pradesh, 31 = West Bengal, 15 = Kerala (Common fishing hubs)
            const states = ['1', '31', '15'];

            for (const stateId of states) {
                try {
                    logger.info(`Fetching data for State ID: ${stateId}`);

                    await page.select('select#state', stateId);
                    await page.evaluate(() => {
                        const stateSelect = document.querySelector('select#state');
                        if (stateSelect) stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    });

                    // Set a recent date (e.g., March 4th) to ensure we find data for the sample run
                    await page.evaluate(() => {
                        const dateInput = document.querySelector('input#date') as HTMLInputElement;
                        if (dateInput) {
                            dateInput.value = '04-03-2026';
                            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                            dateInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });

                    // Wait for market options to load (timeout after 5s)
                    await page.waitForFunction(() => {
                        const options = document.querySelectorAll('select#market option');
                        return options.length > 1; // More than the "Select" option
                    }, { timeout: 5000 }).catch(() => logger.warn(`No markets found for state ${stateId}`));

                    // Get all market options
                    const markets: any[] = await page.evaluate(() => {
                        const options = Array.from(document.querySelectorAll('select#market option'));
                        return options
                            .map(o => ({ value: (o as any).value, text: (o as any).textContent }))
                            .filter(o => o.value !== '' && o.value !== '0' && o.value !== 'Select Market');
                    });

                    logger.info(`Found ${markets.length} markets for State ${stateId}`);

                    for (const market of markets.slice(0, 3)) { // Limit to top 3 for sample
                        logger.info(`  Scraping market: ${market.text}`);
                        await page.select('select#market', market.value);
                        await page.evaluate(() => {
                            const marketSelect = document.querySelector('select#market');
                            if (marketSelect) marketSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        });

                        // Intercept the next response from the filter endpoint
                        const responsePromise = page.waitForResponse(
                            response => response.url().includes('/prices/filters') && response.request().method() === 'POST',
                            { timeout: 15000 }
                        ).catch(() => null);

                        await page.click('button.getData');

                        const response = await responsePromise;
                        if (response) {
                            try {
                                const json = await (response as any).json();
                                if (json && json.data && Array.isArray(json.data)) {
                                    logger.info(`  Captured ${json.data.length} entries from API for ${market.text}`);
                                    json.data.forEach((row: any) => {
                                        // Row format from FMPIS: [slno, species, size, price, date, trend]
                                        if (row && row.length >= 5) {
                                            const price = parseFloat(row[3].toString().replace(/[^0-9.]/g, ''));
                                            if (!isNaN(price)) {
                                                allEntries.push({
                                                    speciesName: row[1].toString().trim(),
                                                    size: row[2].toString().trim(),
                                                    priceInrPerKg: price,
                                                    date: new Date(),
                                                    marketName: market.text
                                                });
                                            }
                                        }
                                    });
                                }
                            } catch (jsonErr) {
                                logger.warn(`  Failed to parse JSON for ${market.text}`);
                            }
                        } else {
                            logger.warn(`  API response timeout for ${market.text}`);
                        }
                    }
                } catch (stateErr) {
                    logger.error(`Error scraping state ${stateId}`, { error: (stateErr as Error).message });
                }
            }
        } catch (err) {
            logger.error('FMPIS Scraper Failed', { error: (err as Error).message });
        } finally {
            await browser.close();
        }

        logger.info(`Finished FMPIS scraping. Found ${allEntries.length} entries.`);
        return allEntries;
    }
}
