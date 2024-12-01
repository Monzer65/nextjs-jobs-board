export class RefillingTokenBucket<_Key> {
  public max: number;
  public refillIntervalSeconds: number;

  constructor(max: number, refillIntervalSeconds: number) {
    this.max = max;
    this.refillIntervalSeconds = refillIntervalSeconds;
  }

  private storage = new Map<_Key, RefillBucket>();

  public check(key: _Key, cost: number): boolean {
    const bucket = this.storage.get(key) ?? null;
    if (bucket === null) {
      return true;
    }
    const now = Date.now();
    const refill = Math.floor(
      (now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000)
    );
    if (refill > 0) {
      return Math.min(bucket.count + refill, this.max) >= cost;
    }
    return bucket.count >= cost;
  }

  public consume(key: _Key, cost: number): boolean {
    let bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      bucket = {
        count: this.max - cost,
        refilledAt: now,
      };
      this.storage.set(key, bucket);
      return true;
    }
    const refill = Math.floor(
      (now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000)
    );
    bucket.count = Math.min(bucket.count + refill, this.max);
    bucket.refilledAt = now;
    if (bucket.count < cost) {
      return false;
    }
    bucket.count -= cost;
    this.storage.set(key, bucket);
    return true;
  }
}

export class Throttler<_Key> {
  public timeoutSeconds: number[];

  private storage = new Map<_Key, ThrottlingCounter>();

  constructor(timeoutSeconds: number[]) {
    this.timeoutSeconds = timeoutSeconds;
  }

  public consume(key: _Key): boolean {
    let counter = this.storage.get(key) ?? null;
    const now = Date.now();
    if (counter === null) {
      counter = {
        timeout: 0,
        updatedAt: now,
      };
      this.storage.set(key, counter);
      return true;
    }
    const allowed =
      now - counter.updatedAt >= this.timeoutSeconds[counter.timeout] * 1000;
    if (!allowed) {
      return false;
    }
    counter.updatedAt = now;
    counter.timeout = Math.min(
      counter.timeout + 1,
      this.timeoutSeconds.length - 1
    );
    this.storage.set(key, counter);
    return true;
  }

  public reset(key: _Key): void {
    this.storage.delete(key);
  }
}

export class ExpiringTokenBucket<_Key> {
  public max: number;
  public expiresInSeconds: number;

  private storage = new Map<_Key, ExpiringBucket>();

  constructor(max: number, expiresInSeconds: number) {
    this.max = max;
    this.expiresInSeconds = expiresInSeconds;
  }

  public check(key: _Key, cost: number): boolean {
    const bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      return true;
    }
    if (now - bucket.createdAt >= this.expiresInSeconds * 1000) {
      return true;
    }
    return bucket.count >= cost;
  }

  public consume(key: _Key, cost: number): boolean {
    let bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      bucket = {
        count: this.max - cost,
        createdAt: now,
      };
      this.storage.set(key, bucket);
      return true;
    }
    if (now - bucket.createdAt >= this.expiresInSeconds * 1000) {
      bucket.count = this.max;
    }
    if (bucket.count < cost) {
      return false;
    }
    bucket.count -= cost;
    this.storage.set(key, bucket);
    return true;
  }

  public reset(key: _Key): void {
    this.storage.delete(key);
  }
}

interface RefillBucket {
  count: number;
  refilledAt: number;
}

interface ExpiringBucket {
  count: number;
  createdAt: number;
}

interface ThrottlingCounter {
  timeout: number;
  updatedAt: number;
}

// import { client } from "../redis-client";
// import { bucketScript } from "./scripts/bucket";
// import { expiringBucketScript } from "./scripts/expiration";

// const BUCKET_SCRIPT_SHA = await client.scriptLoad(bucketScript);
// const THROTTLING_SCRIPT_SHA = await client.scriptLoad(bucketScript);
// const EXPIRING_BUCKET_SCRIPT_SHA = await client.scriptLoad(
//   expiringBucketScript
// );

// export class TokenBucket {
//   private storageKey: string;

//   public max: number;
//   public refillIntervalSeconds: number;

//   constructor(storageKey: string, max: number, refillIntervalSeconds: number) {
//     this.storageKey = storageKey;
//     this.max = max;
//     this.refillIntervalSeconds = refillIntervalSeconds;
//   }

//   public async consume(key: string, cost: number): Promise<boolean> {
//     const result = await client.EVALSHA(BUCKET_SCRIPT_SHA, {
//       keys: [`${this.storageKey}:${key}`],
//       arguments: [
//         this.max.toString(),
//         this.refillIntervalSeconds.toString(),
//         cost.toString(),
//         Math.floor(Date.now() / 1000).toString(),
//       ],
//     });
//     return Boolean(result && Array.isArray(result) && result[0]);
//   }
// }

// export class Throttler {
//   private storageKey: string;

//   constructor(storageKey: string) {
//     this.storageKey = storageKey;
//   }

//   public async consume(key: string): Promise<boolean> {
//     const result = await client.EVALSHA(THROTTLING_SCRIPT_SHA, {
//       keys: [`${this.storageKey}:${key}`],
//       arguments: [Math.floor(Date.now() / 1000).toString()],
//     });
//     return Boolean(result && Array.isArray(result) && result[0]);
//   }

//   public async reset(key: string): Promise<void> {
//     await client.DEL(key);
//   }
// }

// export class ExpiringTokenBucket {
//   private storageKey: string;
//   private max: number;
//   private expiresInSeconds: number;

//   constructor(storageKey: string, max: number, expiresInSeconds: number) {
//     this.storageKey = storageKey;
//     this.max = max;
//     this.expiresInSeconds = expiresInSeconds;
//   }

//   public async consume(key: string, cost: number): Promise<boolean> {
//     const result = await client.EVALSHA(EXPIRING_BUCKET_SCRIPT_SHA, {
//       keys: [`${this.storageKey}:${key}`],
//       arguments: [
//         this.max.toString(),
//         this.expiresInSeconds.toString(),
//         cost.toString(),
//         Math.floor(Date.now() / 1000).toString(),
//       ],
//     });
//     return Boolean(result && Array.isArray(result) && result[0]);
//   }
// }
