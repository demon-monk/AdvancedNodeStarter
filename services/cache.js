const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://localhost:6379";
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const originExec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
  const redisKey = JSON.stringify({
    ...this.getQuery(),
    ...{ collection: this.mongooseCollection.name }
  });
  const cacheValue = await client.get(redisKey);
  if (cacheValue) {
    console.log("FROM REDIS");
    const cacheValueObj = JSON.parse(cacheValue);
    console.log(cacheValue)
    return Array.isArray(cacheValueObj)
      ? cacheValueObj.map(obj => new this.model(obj))
      : new this.model(cacheValueObj);
  }
  const result = await originExec.apply(this, arguments);
  console.log(result)
  client.set(redisKey, JSON.stringify(result));
  return result;
};
