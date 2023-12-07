import express from 'express';
const router = express.Router();
import axios from 'axios';

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';

import { fetchSteamData } from '../../helpers/fetchSteamData.js';
import { formatPlaytime } from '../../helpers/formatting.js';

router.get('/ownedgames/:steamId', cacheMiddleware(), async (req, res) => {
    const steamId = req.params.steamId;
    const queryParams = `steamid=${steamId}&include_appinfo=${req.query.include_appinfo || 'true'}&include_played_free_games=${req.query.include_played_free_games || 'false'}&format=json`;

    try {
        const endpoint = '/IPlayerService/GetOwnedGames/v0001/';
        const data = await fetchSteamData(endpoint, queryParams);
        let ownedGames = data.response;

        // Initialize total spent
        let totalSpent = 0;

        // Process games for formatting and image URLs
        if (ownedGames.games) {
            ownedGames.games = await Promise.all(ownedGames.games.map(async (game) => {
                // Formatting image URLs
                if (game.img_icon_url)
                    game.img_icon_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                if (game.img_logo_url)
                    game.img_logo_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`;

                // Formatting playtimes
                game.playtime_2weeks_formatted = formatPlaytime(game.playtime_2weeks);
                game.playtime_forever_formatted = formatPlaytime(game.playtime_forever);

                try {
                    // Fetch pricing information for the game using Axios
                    const appDetailsResponse = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${game.appid}`);
                    const appDetails = appDetailsResponse.data[game.appid];

                    if (appDetails.success) {
                        const priceOverview = appDetails.data.price_overview;

                        if (priceOverview) {
                            const price = priceOverview.final / 100; // Price in the user's currency
                            game.price = price;

                            // Calculate total spent
                            totalSpent += price;
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching app details for app ID ${game.appid}:`, error);
                }

                return game;
            }));
        }

        // Add total spent to the response
        ownedGames.total_spent = totalSpent;

        res.json(ownedGames);
    } catch (error) {
        console.error('Error fetching owned games:', error);
        res.status(500).json({ error: 'Error fetching owned games' });
    }
});

export default router;