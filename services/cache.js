const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://localhost:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const originExec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this._useCache = true;
  this._hashKey = JSON.stringify(options.key || '')
  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this._useCache) {
    return originExec.apply(this, arguments);
  }
  const redisKey = JSON.stringify({
    ...this.getQuery(),
    ...{ collection: this.mongooseCollection.name }
  });
  const cacheValue = await client.hget(this._hashKey, redisKey);
  if (cacheValue) {
    console.log("FROM REDIS");
    const cacheValueObj = JSON.parse(cacheValue);
    console.log(cacheValue);
    return Array.isArray(cacheValueObj)
      ? cacheValueObj.map(obj => new this.model(obj))
      : new this.model(cacheValueObj);
  }
  const result = await originExec.apply(this, arguments);
  client.hset(this._hashKey, redisKey, JSON.stringify(result));
  return result;
};

module.exports = {
  clearCache(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
