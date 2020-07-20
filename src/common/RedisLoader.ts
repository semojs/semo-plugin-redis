import { Utils } from '@semo/core'

import Redis from 'ioredis'

class RedisLoader {

  get defaultConnection() {
    return Utils.config('$plugin.redis.defaultConnection')
  }

  async getConfigs() {
    const rcRedisConfig = Utils.config('$plugin.redis.connection')
    const hookRedisConfig = await Utils.invokeHook('redis_connection')
    const finalRedisConfig = Utils._.merge(rcRedisConfig, hookRedisConfig)
    return finalRedisConfig
  }

  async getConfig(redisKey) {
    const redisConfigs = await this.getConfigs()

    const redisConfig = redisConfigs[redisKey]
    if (!redisConfig) {
      throw new Error(`${redisKey} not found in redis config`)
    }

    if (Utils._.isObject(redisConfig)) {
      redisConfig.keyPrefix = redisConfig.keyPrefix || redisConfig.prefix || undefined
    }

    return redisConfig
  }

  async load(redisKey = '') {

    if (!redisKey) {
      redisKey = this.defaultConnection
    }

    let redisConfig
    if (Utils._.isObject(redisKey)) {
      redisConfig = redisKey
    } else {
      redisConfig = await this.getConfig(redisKey)
    }

    const redis = new Redis(redisConfig)

    return redis
  }
}

export = RedisLoader