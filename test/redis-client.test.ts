import {
  client,
  getValue,
  initializeRedis,
  setValue,
} from "../lib/redis-client";

jest.mock("redis", () => {
  const mClient = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    on: jest.fn(),
  };
  return {
    createClient: jest.fn(() => mClient),
  };
});

describe("Redis Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should connect to Redis successfully", async () => {
    console.log("Testing Redis connection...");
    await initializeRedis();
    expect(client.connect).toHaveBeenCalled();
  });

  test("should set a value in Redis", async () => {
    console.log("Setting value in Redis...");
    const key = "testKey";
    const value = "testValue";

    await setValue(key, value);
    console.log(`Set value "${value}" with key "${key}" in Redis`);
    expect(client.set).toHaveBeenCalledWith(key, value);
  });

  test("should get a value from Redis", async () => {
    console.log("Getting value from Redis...");
    const key = "testKey";
    const value = "testValue";
    (client.get as jest.Mock).mockResolvedValue(value); // Mock the return value of get
    const result = await getValue(key);
    console.log(`Got value "${result}" from Redis with key "${key}"`);
    expect(result).toBe(value);
    expect(client.get).toHaveBeenCalledWith(key);
  });

  test("should return null if key does not exist", async () => {
    console.log("Getting non-existent value from Redis...");
    const key = "nonExistentKey";
    (client.get as jest.Mock).mockResolvedValue(null); // Mock the return value of get
    const result = await getValue(key);
    console.log(`Got value "${result}" from Redis with key "${key}"`);
    expect(result).toBeNull();
    expect(client.get).toHaveBeenCalledWith(key);
  });
});
