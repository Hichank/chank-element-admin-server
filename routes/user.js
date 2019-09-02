const express = require('express')
const router = express.Router()
const { UserModel } = require('../db/models')

// 获取 cookie
function GET_COOKIE(cookie) {
    req.cookie(cookie)
}
// 设置 cookie
function SET_COOKIE(cookie, value) {
    const setting = {
        // domain: '域名', // 设置域名下获取cookie
        maxAge: 1000 * 60 * 60 * 24 * 7, // 过期时间
        // path: "", // cookie影响的路径
        // expires: new Date(Date.now() + 900000) // 过期时间
        httpOnly: true, // cookie只允许服务端获取 防止XSS攻击
        // singed: false, // 是否加密cookie信息 如果设置请使用 res.signedCookies获取
    }
    res.cookie(cookie, value, setting)
}
// 注册
router.post('/register', (req, res, next) => {
    // 获取请求参数
    const { email, password } = req.body
    // 处理
    UserModel.findOne({ email }, (err, data) => {
        if (data) {
            // 返回响应数据
            res.send({
                code: 100,
                message: "邮箱已存在"
            })
        } else {
            new UserModel({ email, password }).save((err, data) => {
                // 返回响应数据
                res.send({
                    code: 200,
                    message: "注册成功"
                })
            })
        }
    })
});
// 登录
router.post('/login', (req, res, next) => {
    // 获取请求参数
    const { email, password } = req.body
    // 处理
    UserModel.findOne({ email }, (err, data) => {
        if (data) {
            UserModel.findOne({ email, password }, (err, data) => {
                if (data) {
                    res.send({
                        code: 200,
                        message: "登录成功",
                        data: {
                            token: "123"
                        }
                    })
                } else {
                    res.send({
                        code: 100,
                        message: "密码错误"
                    })
                }
            })
        } else {
            res.send({
                code: 100,
                message: "此邮箱不存在"
            })
        }
    })
});


module.exports = router;