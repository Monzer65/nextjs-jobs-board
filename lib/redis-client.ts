import { createClient } from "redis";

// Create and configure Redis client
export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18119,
    connectTimeout: 20000,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

// Function to initialize Redis connection
export const initializeRedis = async (): Promise<void> => {
  try {
    await client.connect();
    console.log("Connected to Redis successfully.");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
};

await initializeRedis();

// Function to set a key-value pair in Redis
export const setValue = async (key: string, value: string): Promise<void> => {
  await client.set(key, value);
};

// Function to retrieve a value by key from Redis
export const getValue = async (key: string): Promise<string | null> => {
  const value = await client.get(key);
  return value;
};

// Health check function
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    await client.set("health", "ok");
    const reply = await client.get("health");
    return reply === "ok";
  } catch (error) {
    console.error("Redis Health Check Failed:", error);
    return false;
  }
};
