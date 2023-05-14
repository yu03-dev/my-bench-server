const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record


const getRecord = async(user) => {
  const records = await Record.findAll({
    where: {
      userId: user.id
    },
    order: [['createdAt', 'DESC']]
  });

  return records.reduce((result, record) => {
    const date = record.createdAt.toISOString().slice(0, 10)
      if (!result[date]) {
        result[date] = []
      }
      result[date].push(record)
      return result
  }, {});
}

router.get('/', async function(req, res) {
  const isAuth = req.isAuthenticated()
  if (isAuth) {
    const user = req.user
    try {
      const groupedRecords = await getRecord(user)
      res.json({
        success: true,
        message: 'レコードの取得に成功しました',
        user: user,
        records: groupedRecords,
        error: null,
        isAuth: isAuth
      });
    } catch (err) {
      console.error(err)
      res.json({
        success: false,
        message: 'レコードの取得に失敗しました',
        user: user,
        records: null,
        error: err,
        isAuth: isAuth
      });
    }

  } else {
    res.json({
      success: false,
      message: 'データを取得できませんでした',
      user: null,
      records: null,
      error: null,
      isAuth: isAuth
    });
  }
});

router.post('/', async function(req, res) {
  const isAuth = req.isAuthenticated()
  const weight = req.body.weight
  const reps = req.body.reps

  if (isAuth) {
    const user = req.user
    const newRecord = {
      weight: weight,
      reps: reps,
      userId: user.id
    }
    try {
      await Record.create(newRecord)
      const groupedRecords = await getRecord(user)
      res.json({
        success: true,
        message: '正常にレコードを作成できました',
        user: user,
        records: groupedRecords,
        error: null,
        isAuth: isAuth
      });
    } catch(err) {
      console.error(err)
      res.json({
        success: false,
        message: 'レコードの作成に失敗しました',
        user: user,
        records: await getRecord(user) || null,
        error: null,
        isAuth: isAuth
      });
    }
  } else {
    res.json({
      success: false,
      message: 'データを取得できませんでした',
      user: null,
      records: null,
      error: null,
      isAuth: isAuth
    });
  }
});


router.put('/:id', async function(req, res) {
  const recordId = req.params.id
  const isAuth = req.isAuthenticated()
  const user = req.user
  const record = await Record.findByPk(recordId)

  if (isAuth && user.id == record.userId) {
    try {
      record.weight = req.body.weight
      record.reps = req.body.reps
      await record.save()
      const groupedRecords = await getRecord(user)
      res.json({
        success: true,
        message: 'レコードの更新に成功しました',
        user: user,
        records: groupedRecords,
        error: null,
        isAuth: isAuth
      });
    } catch (err) {
      res.json({
        success: false,
        message: 'レコードを更新できませんでした',
        user: user,
        records: await getRecord(user) || null,
        error: err,
        isAuth: isAuth
      });
    }
  } else {
    res.json({
      success: false,
      message: 'データの取得ができませんでした',
      user: user,
      records: null,
      error: null,
      isAuth: isAuth
    });
  }
});

router.delete('/:id', async function(req, res) {
  const recordId = req.params.id
  const isAuth = req.isAuthenticated()
  const user = req.user
  const record = await Record.findByPk(recordId)

  if (isAuth && user.id == record.userId) {
    try {
      await record.destroy()
      const groupedRecords = await getRecord(user)
      res.json({
        success: true,
        message: 'レコードの削除に成功しました',
        user: user,
        records: groupedRecords,
        error: null,
        isAuth: isAuth
      });
    } catch (err) {
      res.json({
        success: false,
        message: 'レコードの削除に失敗しました',
        user: user,
        records: await getRecord(user) || null,
        error: err,
        isAuth: isAuth
      });
    }
  } else {
    res.json({
      success: false,
      message: 'データを取得できませんでした',
      user: user,
      records: null,
      error: null,
      isAuth: isAuth
    });
  }

});

module.exports = router;