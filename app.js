const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const createError = require('http-errors');
const cors = require('cors')
const cookieParser = require('cookie-parser');


app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true
}));
app.use(express.json())

// authorization
require("./config/passport")(app);

// ルーティング
app.use('/api/auth', require('./routes/auth'))
app.use('/api/mypage', require('./routes/mypage'))
// app.use('/api/history', require('./routes/history'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error response as JSON
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`App listening on ${port}`)
    console.log('NODE_ENV:', process.env.NODE_ENV)
  }
})

module.exports = app;

