import rateLimit from 'express-rate-limit';


export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  keyGenerator: (req) => {
    // Use the userId from the headers as the key
    return req.headers['x-user-id'] || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
  },
});
