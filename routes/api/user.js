const router = require('koa-router')()
const Db = require('../../module/db')
const Utils = require('../../utils')
const Tips = require('../../utils/tip')

// 注册
router.post('/register', async (ctx, next) => {
    const { email, password, checkPassword } = ctx.request.body;
    if (password !== checkPassword) {
        return ctx.body = Tips[500]
    }
    await Db.find('users', { email })
        .then(async res => {
            if (res.length != 0) {
                ctx.body = Tips[201]
            } else {
                await Db.insert('users', [{ email, password }])
                    .then(res => {
                        if (res.result.ok === 1) {
                            ctx.body = Tips[200]
                        }
                    })
                    .catch(err => {
                        ctx.body = Tips[500]
                    })
            }
        })
        .catch(err => {
            ctx.body = Tips[500]
        })
})

// 登录
router.post('/login', async (ctx, next) => {
    const { email, password } = ctx.request.body;
    await Db.find('users', { email, password })
        .then(res => {
            if (res && res.length > 0) {
                let uid = res[0];
                let token = Utils.generateToken({ uid });
                ctx.body = {
                    ...Tips[200],
                    data: {
                        email: res[0]['email'],
                        id: res[0]['_id'],
                        token
                    }
                }
            } else {
                ctx.body = Tips[404]
            }
        })
        .catch(err => {
            ctx.body = Tips[500]
        })
})

module.exports = router
