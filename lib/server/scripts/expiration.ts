export const expiringBucketScript = `
local key           = KEYS[1]
local max           = tonumber(ARGV[1])
local expiresIn     = tonumber(ARGV[2])
local cost          = tonumber(ARGV[3])
local now           = tonumber(ARGV[4])

-- Attempt to get current bucket data
local bucket = redis.call("HGETALL", key)
local count, createdAt

if #bucket == 0 then
    -- Bucket doesn't exist or is expired
    count = max
    createdAt = now
else
    for i = 1, #bucket, 2 do
        if bucket[i] == "count" then
            count = tonumber(bucket[i + 1])
        elseif bucket[i] == "created_at" then
            createdAt = tonumber(bucket[i + 1])
        end
    end
    -- Check if bucket has expired
    if (now - createdAt) >= expiresIn then
        count = max
        createdAt = now
    end
end

-- Check if cost can be deducted
if count < cost then
    return {0} -- Insufficient tokens
end

-- Deduct cost and update bucket
count = count - cost
redis.call("HSET", key, "count", count, "created_at", createdAt)
redis.call("EXPIRE", key, expiresIn) -- Set TTL for automatic expiration
return {1}
`;
