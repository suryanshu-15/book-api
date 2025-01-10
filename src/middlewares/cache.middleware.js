import redisClient from '../client.js';

const cacheMiddleware = async (req, res, next) => {
  try {
    const cacheKey = 'books';
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Cache hit');
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log('Cache miss');
    next();
  } catch (err) {
    console.error('Cache error:', err);
    next(); 
  }
};

export {cacheMiddleware}