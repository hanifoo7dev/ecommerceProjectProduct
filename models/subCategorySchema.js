const mongoose = require('mongoose')
const {Schema} = mongoose

const subCategorySchema = new Schema({

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
    parentCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
      }

})

module.exports= mongoose.model('SubCategory',subCategorySchema)