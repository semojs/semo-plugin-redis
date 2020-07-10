import { Utils } from '@semo/core'
import RedisLoader from '../common/RedisLoader'
const redisLoader = new RedisLoader()

export const hook_hook = new Utils.Hook('semo', {
  redis_connection: 'Define redis connections, used by ioredis'
})

export const hook_repl = new Utils.Hook('semo', async () => {
  return {
    redis: redisLoader
  }
})

export const hook_component = new Utils.Hook('semo', async () => {
  return {
    redis: redisLoader
  }
})