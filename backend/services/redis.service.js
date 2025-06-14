import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('connect', () => {
    console.log('Redis connected');
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();


export default redisClient;
