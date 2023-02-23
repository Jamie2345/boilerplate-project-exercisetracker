const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const User = require('../models/User');

router.post('/users/:id/exercises', (req, res) => {
  User.findOne({_id: req.params.id})
  .then(user => {
    if (user) {
      let date = new Date()

      if (req.body.date) {
        date = new Date(req.body.date)
      }
   
      let dateString = date.toDateString()
      console.log(dateString)
      let exercise = new Exercise({
        user_id: req.params.id,
        description: req.body.description,
        duration: Number(req.body.duration),
        date: dateString,
      })
      exercise.save()
      
      .then(exercise => {
        let date = new Date(exercise.date)
        let dateString = date.toDateString()
        res.json({_id: exercise.user_id, username: user.username, date: dateString, duration: exercise.duration ,description: exercise.description})
      })
      .catch(err => {
        res.send(err.message)
      })
    }
    else {
      res.json({
        message: 'user not found'
      })
    }
  })
})

router.get('/users/:id/logs', (req, res) => {
  const { from, to, limit } = req.query

  User.findOne({_id: req.params.id})
  .then(user => {
    if (user) {
      const user_id = user._id
      const username = user.username

      let db_query = {user_id: req.params.id}
      let date_obj = {}

      if (from) {
        date_obj["$gte"] = new Date(from)
      }
      if (to) {
        date_obj["$lte"] = new Date(to)
      }
      if (from || to) {
        db_query['date'] = date_obj
      }
      let nonNullLimit = limit ?? 500
      Exercise.find(db_query).limit(+nonNullLimit)
      .then(exercises => {
        var arr = [];
        for (let i = 0; i < exercises.length; i++) {
          var exercise = exercises[i]
          let date = new Date(exercise.date)
          let dateString = date.toDateString()
          arr.push({description: exercise.description, duration: exercise.duration, date: dateString})
        }

        res.json({
          _id: user_id,
          username: username,
          count: arr.length,
          log: arr
        })
      })
    }
    else {
      res.json({
        message: 'not a real user'
      })
    }
  })
})

module.exports = router

