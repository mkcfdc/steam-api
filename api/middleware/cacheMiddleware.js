import Redis from 'ioredis';

// Configure and create a Redis client
export const redis = new Redis({
    host: 'localhost', // Replace with your Redis server address
    port: 6379,       // Replace with your Redis server port
});

redis.on('error', (err) => console.error('Redis error:', err));

export function cacheMiddleware(expiryTime = 3600) {
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