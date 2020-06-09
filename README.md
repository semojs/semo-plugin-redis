semo-plugin-redis
------------------------

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
semo-plugin-redis:
  redisKey: redis
  connection:
    redis:
      host: 127.0.0.1
      port: 6379
```

或者用钩子的方式声明配置：

```js
export const hook_redis_connection = async () => {
  return {
    redis2: {
      host: '127.0.0.1',
      port: 6379
    }
  }
}
```

支持 Promise，所以也可以在这里去跟配置中心要配置。

代码中使用：

```js
import { redis } from 'semo-plugin-redis'

const cache = await redis.load('redisKey')
await cache.set('hello', 'world')
const ret = cache.get('hello')
```

