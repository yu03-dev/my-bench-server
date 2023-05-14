const express = require('express')
const router = express.Router()
const passport = require("passport")
const bcrypt = require("bcrypt")
const db = require('../models')
const User = db.User


router.post('/signin', passport.authenticate('local'), (req, res) => {
  const user = req.user
  if (user) {
    res.json({
      success: true,
      message: '正常にサインインしました',
      user: user,
      records: null,
      error: null,
      isAuth: true
    });
  }
  else {
    res.json({
      success: false,
      message: '正常にサインインできませんでした',
      user: user,
      records: null,
      error: null,
      isAuth: false
    });
  }
});

router.post('/signout', function(req, res) {
  req.logout((error) => {
    if (error) {
      console.error(error)
      rerturn
    }
    res.json({
      success: true,
      message: '正常にログアウトしました',
      user: null,
      records: null,
      error: null,
      isAuth: false
    });
  })
})

router.post('/signup', async function(req, res) {
  const username = req.body.username
  const password = req.body.password
  const repassword = req.body.repassword

  try {
    const user = await User.findOne({
      where: {username: username}
    })
    if (user) {
      res.json({
        success: false,
        message: 'すでにユーザーが存在します',
        user: null,
        records: null,
        error: null,
        isAuth: false
      });
    } else if (password == repassword) {
      const hashedPassword = await bcrypt.hash(password, 10)
      try {
        const newUser = await User.create({
          username: username,
          password: hashedPassword
        })
        res.json({
          success: true,
          message: '正常にサインアップできました',
          user: null,
          records: null,
          error: null,
          isAuth: false
        });
      } catch(error) {
        console.error(err)
        res.json({
          success: false,
          message: 'ユーザーの作成に失敗しました',
          user: null,
          records: null,
          error: err,
          isAuth: false
        });
      }
    } else {
      res.json({
        success: false,
        message: 'パスワードが一致しませんでした',
        user: null,
        records: null,
        error: null,
        isAuth: false
      });
    }
  } catch(error) {
    console.error(err);
    res.json({
      success: false,
      message: 'ユーザーの検索に失敗しました',
      user: null,
      records: null,
      error: null,
      isAuth: false
    });
  }
})

  module.exports = router;