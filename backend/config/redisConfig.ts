import Redis from "ioredis"

const client = new Redis(process.env.REDIS_URI as string);

export default client;
