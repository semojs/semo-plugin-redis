import { Redis } from 'ioredis'
import _ from 'lodash'

export class RedisLoader {
  configs: Record<string, Record<string, any>> = {}
  defaultConnection: string = ''

  constructor(configs, defineConnection = null) {
    this.configs = configs
    if (defineConnection) {
      this.defaultConnection = defineConnection
    }
  }

  async getConfig(redisKey) {
    const redisConfigs = this.configs

    const redisConfig = redisConfigs[redisKey]
    if (!redisConfig) {
      throw new Error(`${redisKey} not found in redis config`)
    }

    if (_.isObject(redisConfig)) {
      redisConfig.keyPrefix =
        redisConfig.keyPrefix || redisConfig.prefix || undefined
    }

    return redisConfig
  }

  async load(redisKey = '') {
    if (!redisKey) {
      redisKey = this.defaultConnection
    }

    let redisConfig
    if (_.isObject(redisKey)) {
      redisConfig = redisKey
    } else {
      redisConfig = await this.getConfig(redisKey)
    }

    const redis = new Redis(redisConfig)

    return redis
  }
}
