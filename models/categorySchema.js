const mongoose = require('mongoose')
const {Schema} = mongoose

const categorySchema = new Schema({

    name:{
        type: String,
        require: true,
        unique: true
    },
    status:{
       type: String,
       enum: ['active','deactive','reject'],
       default: 'deactive'
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
       }

})

module.exports= mongoose.model('Category',categorySchema)