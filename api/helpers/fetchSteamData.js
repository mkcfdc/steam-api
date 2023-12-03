import axios from 'axios';

const STEAM_API_BASE_URL = process.env.STEAM_API_BASE_URL;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

// Helper function for API calls.
export async function fetchSteamData(endpoint, queryParams) {
    const url = `${STEAM_API_BASE_URL}${endpoint}?key=${STEAM_API_KEY}&${queryParams}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Steam API:', error);
        throw error;
    }
}