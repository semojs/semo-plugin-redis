import RedisLoader from '../common/RedisLoader'

export const hook_hook = {
  redis_connection: 'Define redis connections, used by ioredis'
}

export const hook_repl = async () => {
  const redisLoader = new RedisLoader()
  return {
    redis: redisLoader
  }
}