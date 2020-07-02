import { redis } from '..'

export const plugin = 'redis'
export const command = 'redis <cmd> [arguments..]'
export const desc = 'Redis access tool'

export const builder = function(yargs: any) {
  yargs.option('json', {
    describe: 'Parse json before output'
  })
  yargs.option('silent', {
    describe: 'Not output the result'
  })
  yargs.option('redis-key', {
    describe: 'Set redis connection key to access',
    alias: 'key'
  })
}

export const handler = async function(argv: any) {
  const { Utils } = argv.$semo
  try {
    const redisKey = argv.redisKey || Utils.pluginConfig('defaultConnection')
    const redisInstance = await redis.load(redisKey)

    if (argv.cmd === 'monitor') {
      const monitor = await redisInstance.monitor()
      monitor.on("monitor", (time, args, source, database) => {
        Utils.log({ time, args, source, database })
        Utils.log('-------------------------------------')
      })
      return
    }

    const ret = await redisInstance[argv.cmd].apply(redisInstance, argv.arguments)
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
