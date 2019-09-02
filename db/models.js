// 引入mongoose包
const mongoose = require('mongoose')
// 连接数据库
mongoose.connect('mongodb://localhost:27017/chank-element-admin', { useNewUrlParser: true });
const conn = mongoose.connection
conn.on('connected', () => {
    console.log("db connect success!")
})

const userSchema = mongoose.Schema({
    email: { type: String, required: true }, // 邮箱
    password: { type: String, required: true }, // 密码
})

const UserModel = mongoose.model('user', userSchema);

exports.UserModel = UserModel