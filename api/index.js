import express from 'express';
import Redis from 'ioredis';
import axios from 'axios';

import cors from 'cors';
import 'dotenv/config';


const app = express();

// Configure and create a Redis client
const redis = new Redis({
    host: 'localhost', // Replace with your Redis server address
    port: 6379,       // Replace with your Redis server port
});

redis.on('error', (err) => console.error('Redis error:', err));

const STEAM_API_BASE_URL = process.env.STEAM_API_BASE_URL;
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

app.use(cors());

app.use(express.json());



function cacheMiddleware(expiryTime = 3600) {
    return async function(req, res, next) {
        const key = `__api__${req.originalUrl || req.url}`;

        try {
            const cachedBody = await redis.get(key);
            if (cachedBody) return res.send(cachedBody);

            // Overwrite res.json to cache the response
            res.json = async (body) => {
                const formattedBody = JSON.stringify(body, null, 4);
                await redis.set(key, formattedBody, 'EX', expiryTime);
                res.send(formattedBody);
            };

            next();
        } catch (error) {
            console.error('Redis error:', error);
            next(error);
        }
    };
}



// Helper function to format playtime in minutes to hours and minutes
function formatPlaytime(minutes) {
    if (minutes == null || minutes === 0) return '0 hrs';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hrs ${remainingMinutes} mins`;
}

// Helper function to format Date
const formatDate = (date) => date.toLocaleDateString("en-US") + ' ' + date.toLocaleTimeString("en-US");

// Helper function to get descriptive status from personastate
function getPersonaStateDescription(personastate) {
    const states = {
        0: 'Offline',
        1: 'Online',
        2: 'Busy',
        3: 'Away',
        4: 'Snooze',
        5: 'Looking to trade',
        6: 'Looking to play'
    };
    return states[personastate] || 'Unknown';
}

// Helper function for API calls.
async function fetchSteamData(endpoint, queryParams) {
    const url = `${STEAM_API_BASE_URL}${endpoint}?key=${STEAM_API_KEY}&${queryParams}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Steam API:', error);
        throw error;
    }
}

app.get('/api/stats/:steamId', cacheMiddleware(1200), async (req, res) => {
    const steamId = req.params.steamId || STEAM_ID;
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

app.get('/api/totalplaytime/:steamId', cacheMiddleware(), async (req, res) => {
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
  
app.get('/api/recentlyplayedgames/:steamId', cacheMiddleware(), async (req, res) => {
    const steamId = req.params.steamId || STEAM_ID;
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


app.get('/api/ownedgames/:steamId', cacheMiddleware(), async (req, res) => {
    const steamId = req.params.steamId;
    const queryParams = `steamid=${steamId}&include_appinfo=${req.query.include_appinfo || 'true'}&include_played_free_games=${req.query.include_played_free_games || 'false'}&format=json`;

    try {
        const endpoint = '/IPlayerService/GetOwnedGames/v0001/';
        const data = await fetchSteamData(endpoint, queryParams);
        let ownedGames = data.response;

        // Process games for formatting and image URLs
        if (ownedGames.games) {
            ownedGames.games = ownedGames.games.map(game => {
                // Formatting image URLs
                if (game.img_icon_url)
                    game.img_icon_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                if (game.img_logo_url)
                    game.img_logo_url = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`;

                // Formatting playtimes
                game.playtime_2weeks_formatted = formatPlaytime(game.playtime_2weeks);
                game.playtime_forever_formatted = formatPlaytime(game.playtime_forever);

                return game;
            });
        }

        res.json(ownedGames);
    } catch (error) {
        console.error('Error fetching owned games:', error);
        res.status(500).json({ error: 'Error fetching owned games' });
    }
});

app.get('/api/playerachievements/:appId/:steamId', cacheMiddleware(), async (req, res) => {
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

app.get('/api/userstatsforgame/:appId/:steamId', cacheMiddleware(), async (req, res) => {
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


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));