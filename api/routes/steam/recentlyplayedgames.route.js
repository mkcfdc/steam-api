import express from 'express';
const router = express.Router();

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';

import { fetchSteamData } from '../../helpers/fetchSteamData.js';
import { formatPlaytime } from '../../helpers/formatting.js';

router.get('/recentlyplayedgames/:steamId', cacheMiddleware(), async (req, res) => {
    const steamId = req.params.steamId;
    const queryParams = `steamid=${steamId}&format=json&count=${req.query.count || ''}`;

    try {
        const endpoint = '/IPlayerService/GetRecentlyPlayedGames/v0001/';
        const data = await fetchSteamData(endpoint, queryParams);
        let recentlyPlayedGames = data.response;

        // Constructing full image URLs and formatting playtimes
        if (recentlyPlayedGames.games) {
            recentlyPlayedGames.games = recentlyPlayedGames.games.map(game => {
                if (game.img_icon_url) game.img_icon_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

                game.playtime_2weeks_formatted = formatPlaytime(game.playtime_2weeks);
                game.playtime_forever_formatted = formatPlaytime(game.playtime_forever);

                return game;
            });
        }

        res.json(recentlyPlayedGames);
    } catch (error) {
        console.error('Error fetching recently played games:', error);
        res.status(500).json({ error: 'Error fetching recently played games' });
    }
});

export default router;