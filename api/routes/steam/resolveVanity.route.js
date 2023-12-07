import express from 'express';
const router = express.Router();

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';
import { fetchSteamData } from '../../helpers/fetchSteamData.js';

router.get('/resolveVanity/:vanityUrl', cacheMiddleware(1200), async (req, res) => {
    const vanityUrl = req.params.vanityUrl;
    const endpoint = '/ISteamUser/ResolveVanityURL/v0001/';
    const queryParams = `vanityurl=${vanityUrl}`;

    try {
        const data = await fetchSteamData(endpoint, queryParams);
        const steamId = data.response.steamid;

        if(!steamId) return res.status(404).json({ error: 'Vanity URL not found' });
        return res.json({ steamId: steamId });
        
    } catch (error) {
        res.status(500).json({ error: 'Error resolving vanity URL' });
    }
});

export default router;