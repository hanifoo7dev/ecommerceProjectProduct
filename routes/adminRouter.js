const express = require('express')
const _ = express.Router()
const {getallusers,singalUser,deactiveUser,activeUser,updateUser,deleteUser,getAllCategory,getAllSubCategory} = require('../controllers/adminController')

// user routes
_.get('/allusers',getallusers)
_.get('/user/:id',singalUser)
_.get('/active/user',activeUser)
_.get('/deactive/user',deactiveUser)
_.post('/update/user/:id',updateUser)
_.delete('/delete/user/:id',deleteUser)

// category and sunCategory routes
_.get('/all/category',getAllCategory)
_.get('/all/subcategory',getAllSubCategory)



module.exports = _