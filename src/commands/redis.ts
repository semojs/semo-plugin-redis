import { ArgvExtraOptions, error, log, logJson } from '@semo/core'
import { RedisLoader } from '../common/RedisLoader.js'
import _ from 'lodash'

export const plugin = 'redis'
export const command = 'redis <cmd> [arguments..]'
export const desc = 'Redis access tool'
export const middlewares = []

export const builder = function (yargs: any) {
  yargs.option('json', {
    describe: 'Parse json before output',
  })
  yargs.option('silent', {
    describe: 'Not output the result',
  })
  yargs.option('redis-key', {
    describe: 'Set redis connection key to access',
    alias: 'key',
  })
}

export const handler = async function (argv: ArgvExtraOptions) {
  try {
    const redisKey =
      argv.redisKey ||
      argv.$core.getPluginConfig('defaultConnection', undefined)

    if (!redisKey) {
      throw new Error('No redis connection key provided')
    }
    const rcRedisConfig = argv.$core.config('$plugin.redis.connection')
    const hookRedisConfig = await argv.$core.invokeHook('redis_connection')
    const finalRedisConfig = _.merge(rcRedisConfig, hookRedisConfig)
    const defaultConnection = argv.$core.getPluginConfig('defaultConnection')

    if (!finalRedisConfig || !finalRedisConfig[redisKey]) {
      throw new Error(`${redisKey} not found in redis config`)
    }

    const redisLoader = new RedisLoader(finalRedisConfig, defaultConnection)
    const redisInstance = await redisLoader.load(redisKey)

    if (argv.cmd === 'monitor') {
      const monitor = await redisInstance.monitor()
      monitor.on('monitor', (time, args, source, database) => {
        log({ time, args, source, database })
        log('-------------------------------------')
      })
      return
    }

    const ret = await redisInstance[argv.cmd](...argv.arguments)
    if (!argv.silent) {
      if (argv.json) {
        logJson(JSON.parse(ret))
      } else {
        log(ret)
      }
    }
    process.exit(0)
  } catch (e) {
    if (argv.verbose) {
      error(e.stack)
    } else {
      error(e.message)
    }
  }
}
