
import { query, closePool } from '../db';
import { logger } from '../utils/logger';
import https from 'https';

function fetchWikiImage(searchTerm: string): Promise<string | null> {
    return new Promise((resolve) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(searchTerm)}&format=json&pithumbsize=500`;
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query?.pages;
                    if (pages) {
                        for (const pageId in pages) {
                            if (pages[pageId].thumbnail?.source) {
                                return resolve(pages[pageId].thumbnail.source);
                            }
                        }
                    }
                } catch (e) {
                    // Ignore
                }
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    logger.info('Fetching species from DB to update images...');
    try {
        const result = await query(`SELECT id, data FROM knowledge_nodes WHERE node_type = 'SPECIES'`);
        const speciesNodes = result.rows;
        let updateCount = 0;

        for (const species of speciesNodes) {
            if (species.data.image_url) {
                continue; // Already has an image
            }

            const scientificName = species.data.scientific_name;
            const commonName = species.data.common_names?.en;

            // First try scientific name
            let imageUrl = await fetchWikiImage(scientificName);

            // Fallback to common name if we didn't find one and it exists
            if (!imageUrl && commonName) {
                // Remove some stuff like slashes
                const cleanCommon = commonName.split('/')[0].trim();
                imageUrl = await fetchWikiImage(cleanCommon);
            }

            if (imageUrl) {
                const newData = { ...species.data, image_url: imageUrl };
                await query(
                    `UPDATE knowledge_nodes SET data = $1 WHERE id = $2`,
                    [newData, species.id]
                );
                logger.info(`✅ Updated image for ${commonName || scientificName}: ${imageUrl}`);
                updateCount++;
            } else {
                logger.warn(`❌ No image found for ${commonName || scientificName}`);
            }

            // Avoid rate limiting
            await new Promise(r => setTimeout(r, 500));
        }

        logger.info(`Finished! Updated ${updateCount} out of ${speciesNodes.length} species.`);

    } catch (error) {
        logger.error('Failed', error);
    } finally {
        await closePool();
    }
}

run();
