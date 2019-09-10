const Koa = require('koa')
const cors = require('@koa/cors');
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const api = require('./routes/api')
const Utils = require('./utils');
const Tips = require('./utils/tip');

app.use(cors());

// token验证
app.use(async (ctx, next) => {
  let { url } = ctx
  if (url.indexOf('/api/user/') === -1) {
    // 需要验证token
    let { authorization } = ctx.request.header
    if (authorization) {
      let result = Utils.verifyToken(authorization);
      let { uid } = result
      if (uid) {
        await next()
      } else {
        return ctx.body = Tips[404]
      }
    } else {
      return ctx.body = Tips[404]
    }
  } else {
    await next()
  }
});


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
