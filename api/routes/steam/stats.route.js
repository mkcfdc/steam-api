import express from 'express';
const router = express.Router();

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';

import { fetchSteamData } from '../../helpers/fetchSteamData.js';
import { getPersonaStateDescription } from '../../helpers/getPersonaStateDescription.js';
import { formatDate } from '../../helpers/formatting.js';

router.get('/stats/:steamId', cacheMiddleware(1200), async (req, res) => {
    const steamId = req.params.steamId;
    const endpoint = '/ISteamUser/GetPlayerSummaries/v0002/';
    const queryParams = `steamids=${steamId}`;

    try {
        const data = await fetchSteamData(endpoint, queryParams);
        let playerSummaries = data.response.players;

        // Formatting data
        playerSummaries = playerSummaries.map(player => {
            // Formatting the account creation time
            if (player.timecreated) player.timecreated_formatted = formatDate(new Date(player.timecreated * 1000));

            // Adding readable status for personastate
            player.personastate_formatted = getPersonaStateDescription(player.personastate);

            return player;
        });

        res.json(playerSummaries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching player summaries' });
    }
});

export default router;