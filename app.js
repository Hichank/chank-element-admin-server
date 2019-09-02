const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')


const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

// 设置允许跨域
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'hichankServer', // 加密字符串
  // name: 'connect.sid', // 保存在本地的session名称 默认:connect.sid
  resave: false, // 强制保存session
  saveUninitialized: true, // 强制将未初始化的session存储
  rolling: true, // 每次请求是否强行重置cookie过期时间
  cookie: {
    // maxAge: 1000, // 过期时间
    // secure: true, //是否只允许https访问
  }
}))


app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
