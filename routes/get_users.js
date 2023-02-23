const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users', (req, res) => {
  User.find()
  .then(users => {
    var arr = []
    for (var i = 0; i < users.length; i++) {
      arr.push({username: users[i].username, _id: users[i]._id})
    }
    res.send(arr)
  })
})

module.exports = router