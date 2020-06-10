import { Utils } from '@semo/core'

import Redis from 'ioredis'

class RedisLoader {

  getDefaultConnection() {
    const appConfig = Utils.getApplicationConfig()
    return Utils._.get(appConfig, 'semo-plugin-redis.defaultConnection')
  }

  async getConfigs() {
    const appConfig = Utils.getApplicationConfig()
    const rcRedisConfig = Utils._.get(appConfig, 'semo-plugin-redis.connection')
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

  async load(redisKey) {
    const redisConfig = this.getConfig(redisKey)
    const redis = new Redis(redisConfig)

    return redis
  }
}

export = RedisLoader