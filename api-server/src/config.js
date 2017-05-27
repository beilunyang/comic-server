export default {
  develop: {
    mongodb: {
      host: 'localhost',
      database: 'comic'
    },
    port: 8888,
  },
  production: {
    mongodb: {
      host: 'localhost',
      database: 'comic'
    },
    port: 8888,
  },
  test: {
    mongodb: {
      host: 'localhost',
      database: 'comic'
    },
    port: 12345
  },
  wx: {
    appid: 'wx238573b9edd70425',
    secret: 'a4cddfe32a7c7e360a592a910c4fb72f'
  },
  excludeUrls: ['/api/v1/comic/', '/api/v1/wxlogin'],
};
