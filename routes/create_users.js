const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/users', (req, res) => {
  let user = new User({
    username: req.body.username
  })
  user.save()
  .then(user => {
    res.json(user);
  })
})

module.exports = router