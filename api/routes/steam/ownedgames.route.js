import express from 'express';
import axios from 'axios';
import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';
import { fetchSteamData } from '../../helpers/fetchSteamData.js';
import { formatPlaytime } from '../../helpers/formatting.js';

const router = express.Router();

router.get('/ownedgames/:steamId', cacheMiddleware(), async (req, res) => {
    let totalSpent = 0;
    const steamId = req.params.steamId;
    const queryParams = `steamid=${steamId}&include_appinfo=${req.query.include_appinfo || 'true'}&include_played_free_games=${req.query.include_played_free_games || 'false'}&format=json`;

    try {
        const endpoint = '/IPlayerService/GetOwnedGames/v0001/';
        const data = await fetchSteamData(endpoint, queryParams);
        let ownedGames = data.response;

        if (ownedGames.games && ownedGames.games.length > 0) {
            const validAppIDs = ownedGames.games.filter(game => game.appid).map(game => game.appid);

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

                // Process each game
                ownedGames.games = ownedGames.games.map(game => {
                    // Formatting image URLs
                    if (game.img_icon_url)
                        game.img_icon_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                    if (game.img_logo_url)
                        game.img_logo_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`;

                    // Formatting playtimes
                    game.playtime_2weeks_formatted = formatPlaytime(game.playtime_2weeks);
                    game.playtime_forever_formatted = formatPlaytime(game.playtime_forever);

                    // Enrich game data with the details from appDetails
                    if (appDetails[game.appid]) {

                        // we have access to all of the app data here.. so add what you want.

                        const details = appDetails[game.appid];

                        if(details.capsule_imagev5){
                            game.capsule_image = details.capsule_imagev5;
                        }
                        
                        if (details.price_overview) {
                            const price = details.price_overview.final / 100; // Price in user's currency
                            game.price = price;
                            game.discount_percent = details.price_overview.discount_percent;
                            totalSpent += price;
                        }
                    }

                    return game;
                });
            }
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
