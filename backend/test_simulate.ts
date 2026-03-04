import axios from 'axios';

async function test() {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/economics/simulate', {
            landSizeHectares: 404.7,
            waterSourceSalinityUsCm: 500,
            availableCapitalInr: 100000,
            riskTolerance: 'MEDIUM',
            farmerCategory: 'GENERAL',
            stateCode: 'KA',
            districtCode: 'Bangalore'
        });
        console.log('Simulation working!', response.data.success);
    } catch (error: any) {
        console.error('Simulation Failed:', error.message);
        if (error.response) {
            console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

test();
