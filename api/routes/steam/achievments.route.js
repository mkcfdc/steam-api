import express from 'express';
const router = express.Router();

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';
import { fetchSteamData } from '../../helpers/fetchSteamData.js';

router.get('/api/playerachievements/:appId/:steamId', cacheMiddleware(), async (req, res) => {
    const steamId = req.params.steamId;
    const appId = req.params.appId;
    const queryParams = `appid=${appId}&steamid=${steamId}&l=${req.query.l || 'english'}`;

    try {
        const endpoint = '/ISteamUserStats/GetPlayerAchievements/v0001/';
        const playerAchievements = await fetchSteamData(endpoint, queryParams);

        res.json(playerAchievements.playerstats);
    } catch (error) {
        console.error('Error fetching player achievements:', error);
        res.status(500).json({ error: 'Error fetching player achievements' });
    }
});

router.get('/api/userstatsforgame/:appId/:steamId', cacheMiddleware(), async (req, res) => {
    const steamId = req.params.steamId;
    const appId = req.params.appId;
    const queryParams = `appid=${appId}&steamid=${steamId}&l=${req.query.l || 'english'}`;

    try {
        const endpoint = '/ISteamUserStats/GetUserStatsForGame/v0002/';
        const userStatsForGame = await fetchSteamData(endpoint, queryParams);

        res.json(userStatsForGame.playerstats);
    } catch (error) {
        console.error('Error fetching user stats for game:', error);
        res.status(500).json({ error: 'Error fetching user stats for game' });
    }
});

export default router;