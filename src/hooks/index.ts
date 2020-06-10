import RedisLoader from '../common/RedisLoader'
const redisLoader = new RedisLoader()

export const hook_hook = {
  redis_connection: 'Define redis connections, used by ioredis'
}

export const hook_repl = async () => {
  return {
    redis: redisLoader
  }
}

export const hook_component = async () => {
  return {
    redis: redisLoader
  }
}