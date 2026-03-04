import axios from 'axios';

async function test() {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/geo/zones');
        console.log('API Response Success:', response.data.success);
        console.log('Nodes count:', response.data.data?.length);
        if (response.data.data?.length > 0) {
            console.log('First node:', response.data.data[0]);
        }
    } catch (error: any) {
        console.error('API Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

test();
