import express from 'express';
import axios from 'axios';

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

            const validAppIDs = recentlyPlayedGames.games.filter(game => game.appid).map(game => game.appid);

            // Check if there are valid appIDs to process
            if (validAppIDs.length > 0) {
                // Fetch details for all valid games in one request
                const appDetailsResponse = await axios.post(process.env.API_URL + `/appdetails`, {
                    appids: validAppIDs
                });

                const appDetailsArray = appDetailsResponse.data;
                const appDetails = appDetailsArray.reduce((acc, gameDetail) => {
                    if (gameDetail && gameDetail.hasOwnProperty('steam_appid')) {
                        acc[gameDetail.steam_appid] = gameDetail;
                    }
                    return acc;
                }, {});

                recentlyPlayedGames.games = recentlyPlayedGames.games.map(game => {
                    if (game.img_icon_url) game.img_icon_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

                    game.playtime_2weeks_formatted = formatPlaytime(game.playtime_2weeks);
                    game.playtime_forever_formatted = formatPlaytime(game.playtime_forever);

                    // Enrich game data with the details from appDetails
                    if (appDetails[game.appid]) {

                        // we have access to all of the app data here.. so add what you want.

                        const details = appDetails[game.appid];

                        if (details.capsule_imagev5) {
                            game.capsule_image = details.capsule_imagev5;
                        }

                        if (details.price_overview) {
                            const price = details.price_overview.final / 100; // Price in user's currency
                            game.price = price;
                            game.discount_percent = details.price_overview.discount_percent;
                        }
                    }

                    return game;
                });
            }
        }

        res.json(recentlyPlayedGames);
    } catch (error) {
        console.error('Error fetching recently played games:', error);
        res.status(500).json({ error: 'Error fetching recently played games' });
    }
});

export default router;