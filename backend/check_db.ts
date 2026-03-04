import { query, closePool } from './src/db';

async function checkData() {
    try {
        console.log('--- Checking knowledge_nodes ---');
        const nodes = await query('SELECT node_type, count(*) FROM knowledge_nodes GROUP BY node_type');
        console.log('Nodes summary:', nodes.rows);

        const economicModels = await query("SELECT data->>'system_type' as system_type FROM knowledge_nodes WHERE node_type = 'ECONOMIC_MODEL'");
        console.log('Economic Models:', economicModels.rows);

        const species = await query("SELECT data->>'scientific_name' as name FROM knowledge_nodes WHERE node_type = 'SPECIES' LIMIT 5");
        console.log('Sample Species:', species.rows);

        await closePool();
    } catch (error) {
        console.error('Error checking data:', error);
    }
}

checkData();
