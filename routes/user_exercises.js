const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise')

router.post('/users/:id/exercises', (req, res) => {
  let exercise = new Exercise({
    user_id: req.params.id,
    description: req.body.description,
    duration: Number(req.body.duration),
    date: Date(req.body.date),
  })
  exercise.save()
  .then(exercise => {
    res.json(exercise)
  })
  .catch(err => {
    res.send(err.message)
  })
})

router.get('/users/:id/logs', (req, res) => {
  const { from, to, limit } = req.query

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
    res.json(exercises)
  })
})

module.exports = router

