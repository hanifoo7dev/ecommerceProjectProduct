require('node:dns').setServers(['1.1.1.1','8.8.8.8'])
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { log } = require('node:console')
const rouer = express.Router()
const dbConnection = require('./config/dbConnection')
const usreRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const vendorRouter = require('./routes/vendorRouter')


app.use(express.json())
dbConnection()

app.use('/api/v1/user',usreRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/vendor',vendorRouter)

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log("Server is running...");
    
})