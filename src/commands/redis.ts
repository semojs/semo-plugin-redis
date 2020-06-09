import { Utils } from '@semo/core'
import { redis } from '..'

export const command = 'redis <cmd> [arguments..]'
export const desc = 'redis access tools'

export const builder = function(yargs: any) {
  yargs.option('json', {
    describe: 'Parse json before output'
  })
  yargs.option('silent', {
    describe: 'Not output the result'
  })
  yargs.option('redis-key', {
    describe: 'Set redis connection key to access'
  })
}

export const handler = async function(argv: any) {
  try {
    const appConfig = Utils.getApplicationConfig(argv)
    const redisKey = Utils._.get(appConfig, 'semo-plugin-redis.redisKey')
    const cache = await redis.load(redisKey)
    const ret = await cache[argv.cmd].apply(cache, argv.arguments)
    if (!argv.silent) {
      if (argv.json) {
        Utils.log(JSON.parse(ret))
      } else {
        Utils.log(ret)
      }
    }
    process.exit(0)
  } catch (e) {
    Utils.error(e.stack)
  }
}
