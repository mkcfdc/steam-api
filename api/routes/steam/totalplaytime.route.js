import express from 'express';
const router = express.Router();

import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';
import { fetchSteamData } from '../../helpers/fetchSteamData.js';

router.get('/api/totalplaytime/:steamId', cacheMiddleware(), async (req, res) => {
    const steamId = req.params.steamId;
    const queryParams = `steamid=${steamId}&include_appinfo=${req.query.include_appinfo || 'true'}&include_played_free_games=${req.query.include_played_free_games || 'false'}&format=json`;
  
    try {
      const endpoint = '/IPlayerService/GetOwnedGames/v0001/';
      const data = await fetchSteamData(endpoint, queryParams);
      let ownedGames = data.response.games;
  
      // Calculate the total playtime in minutes for the week and forever
      const totalPlaytimeMinutesWeek = ownedGames.reduce((acc, game) => acc + (game.playtime_2weeks || 0), 0);
      const totalPlaytimeMinutesForever = ownedGames.reduce((acc, game) => acc + game.playtime_forever, 0);
  
      // Calculate the total playtime in hours for the week and forever
      const totalPlaytimeHoursWeek = (totalPlaytimeMinutesWeek / 60).toFixed(2);
      const totalPlaytimeHoursForever = (totalPlaytimeMinutesForever / 60).toFixed(2);
  
      res.json({
        total_playtime_week_minutes: totalPlaytimeMinutesWeek,
        total_playtime_week_hours: totalPlaytimeHoursWeek,
        total_playtime_forever_minutes: totalPlaytimeMinutesForever,
        total_playtime_forever_hours: totalPlaytimeHoursForever,
      });
    } catch (error) {
      console.error('Error fetching owned games:', error);
      res.status(500).json({ error: 'Error fetching owned games' });
    }
  });

  export default router;