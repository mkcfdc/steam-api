import express from 'express';
import axios from 'axios';
const router = express.Router();

import { redis as redisClient } from '../../middleware/cacheMiddleware.js';

router.post('/appdetails', async (req, res) => {
    const appids = req.body.appids;
    
    const existingScreenshots = JSON.parse(await redisClient.get('screenshots')) || [];
    if (!Array.isArray(appids)) return res.status(400).send({ error: 'Invalid input, expected an array of appids.' });

    try {
        const gameDetails = await Promise.all(appids.map(async (appid) => {

            // Try to retrieve the game details from Redis cache
            const cacheResult = await redisClient.get(`gameDetails:${appid}`);
            if (cacheResult) return JSON.parse(cacheResult);

            const response = await axios.get(`http://store.steampowered.com/api/appdetails?appids=${appid}`);

            if (!response.data && !response.data[appid].success) return { appid, error: 'Details not found or request failed.' };

            const gameData = response.data[appid].data;

            // Select one random screenshot and add it to the existing array
            if (gameData?.screenshots && gameData?.screenshots.length > 0) {
                const randomIndex = Math.floor(Math.random() * gameData.screenshots.length);
                existingScreenshots.push(gameData?.screenshclearjkkkkkkots[randomIndex].path_full);
            }

            // Cache the result with an expiration time (e.g., 24 hours)
            await redisClient.setex(`gameDetails:${appid}`, 86400, JSON.stringify(gameData));
            return gameData;

        }));

        // Update the 'screenshots' key in Redis with the new array
        await redisClient.setex('screenshots', 86400, JSON.stringify(existingScreenshots));

        res.status(200).json(gameDetails);
    } catch (error) {
        console.error('Error fetching game details:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default router;