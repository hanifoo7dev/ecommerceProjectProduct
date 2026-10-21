const express = require('express')
const _ = express.Router()
const { createCategory, getAllCategory, createSubCategory, getAllSubCategory, getAllCategoryWiseSubCategory, getAllOwnerWiseCategory } = require('../controllers/vendorController')
const {createPorduct,getAllProduct,getSingleProducts,getProductsByOwner,getProductsByCategory,getProductsBySubCategory,deleteProduct,bulkProducrUpload,exportProductsExcel}= require('../controllers/productController')
const multer = require('multer')

// image uploaded
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
   let uniqName = `eco-${Date.now()}`
      cb(null, uniqName + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })





// Category and SubCategory
_.post('/create/category', createCategory)
_.get('/all/category', getAllCategory)
_.post('/create/subcategory', createSubCategory)
_.get('/all/subcategory', getAllSubCategory)
_.get('/all/user/:id/category', getAllOwnerWiseCategory)
_.get('/all/category/:id/subcategory', getAllCategoryWiseSubCategory)

// Product
_.post('/create/product',upload.array('photo'),createPorduct)
_.post('/bulk/products',upload.single('file'),bulkProducrUpload)
_.get('/bulk/upload/products',exportProductsExcel)
_.get('/all/product',getAllProduct)
_.get('/product/:id',getSingleProducts)
_.get('/owner/:ownerId',getProductsByOwner)
_.get('/category/:categoryId',getProductsByCategory)
_.get('/subcategory/:subcategoryId/',getProductsBySubCategory)
_.delete('/:productId',deleteProduct)


module.exports = _