const express = require('express')
const _ = express.Router()
const {getAllUser} = require('../controllers/userController')

_.get('/allusers',getAllUser)

module.exports = _