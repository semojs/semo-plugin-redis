import { ArgvExtraOptions } from '@semo/core'
import { RedisLoader } from '../common/RedisLoader.js'
import _ from 'lodash'
export const hook_hook = {
  semo: () => {
    return {
      redis_connection: 'Define redis connections, used by ioredis',
    }
  },
}

export const hook_repl = {
  semo: async ($core, argv: ArgvExtraOptions) => {
    const rcRedisConfig = argv.$core.config('$plugin.redis.connection')
    const hookRedisConfig = await argv.$core.invokeHook('redis_connection', {
      mode: 'assign',
    })
    const finalRedisConfig = _.merge(rcRedisConfig, hookRedisConfig)
    const defaultConnection = argv.$core.getPluginConfig(
      'defaultConnection',
      undefined,
      'redis'
    )
    const redisLoader = new RedisLoader(finalRedisConfig, defaultConnection)
    const redis = await redisLoader.load(defaultConnection)
    return {
      redisLoader: redisLoader,
      redis,
    }
  },
}
