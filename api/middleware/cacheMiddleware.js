import Redis from 'ioredis';

// Configure and create a Redis client
export const redis = new Redis("rediss://default:e267d720cbc3453f9f5c024c60064095@usw2-united-worm-30496.upstash.io:30496");

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