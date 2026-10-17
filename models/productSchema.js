const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')
const {Schema} = mongoose


const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  } ,
  description: {
    type: String,
  },
    shortDescription: {
    type: String,
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  slug:{
    type: String,
    required: true,
    unique: true
  }, 
  price:{
    type: Number
  },
 images:[
    {
        url: {
            type: String,
        },
        isMain: {
            type: Boolean,
            default: false
            
        }
    }
 ],
 discountPrice: {
    type: Number,
 },
 stock: {
    type: Number,
 },
 status:{
    type: String,
    enum: ['approve','rejected','pending'],
    default: 'pending'
 },
 category:{
    type:
        Schema.Types.ObjectId,
        ref: 'Category',
        require: true
 },
  subCategory:{
    type:Schema.Types.ObjectId,
        ref: 'SubCategory',
        require: true
       },
 owner:{
    type: Schema.Types.ObjectId,
    ref: 'User', 
    // required: true
}


},{timestamps: true})

module.exports= mongoose.model('Product',productSchema)