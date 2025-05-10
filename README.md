## semo-plugin-redis

A Semo plugin to provide integration with Redis.

## Usage

```shell
$ npm i semo-plugin-redis
$ semo help
$ semo redis <cmd> [arguments..] --redisKey redisKey  redis access tool
$ semo redis set hello world
$ semo redis get hello
$ semo redis ttl hello
```

## Programming

设置 .semorc.yml

```yml
$plugin:
  redis:
    defaultConnection: redis
    connection:
      redis:
        host: 127.0.0.1
        port: 6379
```

Or use hook_redis_connection

```js
export const hook_redis_connection = {
  'semo-plugin-redis': () => {
    return {
      redis2: {
        host: '127.0.0.1',
        port: 6379,
      },
    }
  },
}
```

Use in code

```js
import { RedisLoader } from 'semo-plugin-redis'

const redis = new RedisLoader(connections, defaultConnection)
const cache = await redis.load('redisKey')
await cache.set('hello', 'world')
const ret = cache.get('hello')
```

## License

MIT
