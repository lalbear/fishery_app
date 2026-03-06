import { pool } from '../db';
import axios from 'axios';

const userAgent = 'FisheryApp/1.0 (contact@fisheryapp.local)';

async function fetchWikipediaImage(query: string): Promise<string | null> {
  try {
    const titleResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      headers: { 'User-Agent': userAgent },
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        utf8: 1,
        format: 'json',
        srlimit: 1
      }
    });

    if (titleResponse.data.query.search.length === 0) return null;
    const pageTitle = titleResponse.data.query.search[0].title;

    const imageResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      headers: { 'User-Agent': userAgent },
      params: {
        action: 'query',
        prop: 'pageimages',
        titles: pageTitle,
        pithumbsize: 600,
        format: 'json'
      }
    });

    const pages = imageResponse.data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
  } catch (err) {
    console.error("Wikipedia search failed for", query);
  }
  return null;
}

async function run() {
  try {
    const result = await pool.query(`
      SELECT id, data->>'scientific_name' as scientific_name, data->'common_names'->>'en' as en_name, data->>'image_url' as image_url
      FROM knowledge_nodes
      WHERE node_type = 'SPECIES' AND 
        (data->>'image_url' IS NULL OR data->>'image_url' = '' OR data->>'image_url' LIKE '%ui-avatars%');
    `);

    console.log(`Found ${result.rows.length} species with missing or placeholder images.`);

    for (const row of result.rows) {
      let imageUrl = null;

      console.log(`Processing ${row.scientific_name || row.en_name}...`);

      if (row.scientific_name) {
        imageUrl = await fetchWikipediaImage(row.scientific_name);
      }

      if (!imageUrl && row.en_name) {
        imageUrl = await fetchWikipediaImage(`${row.en_name} fish`);
      }

      if (imageUrl) {
        console.log(`Updating ${row.scientific_name || row.en_name} with ${imageUrl}`);
        await pool.query(`
                UPDATE knowledge_nodes
                SET data = jsonb_set(data, '{image_url}', $1::jsonb)
                WHERE id = $2
            `, [JSON.stringify(imageUrl), row.id]);
      } else {
        console.log(`Could not find image for ${row.scientific_name || row.en_name}`);
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
