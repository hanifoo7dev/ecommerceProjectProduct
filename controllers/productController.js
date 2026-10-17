const mongoose = require('mongoose')
const Product = require('../models/productSchema')

// create product with images
let createPorduct = async(req,res)=>{
  let{title, description,shortDescription,price,discountPrice,isMain,category,subCategory,owner}= req.body
  if (!title?.trim() ||!description?.trim() ||!shortDescription?.trim() || price === undefined || price === '' || discountPrice === undefined || discountPrice === '' || !category || !subCategory || !owner){
       return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }
// 2. Check uploaded files
    const files = Array.isArray(req.files) ? req.files : [];
  // to see image  
  console.log(req.files);

  let images = []
  req.files.map((item,index)=>{
     images.push({
      url: item.path,
      isMain: index == isMain ? true :false
     })
  })
  // console.log(images);
    
// make slug
let slug = (title.toLowerCase().split(" ").join("-"))
let existingSlug = await Product.findOne({slug: slug})
if(existingSlug){
    return  res.status(400).json({
     success: false,
     mesage: "Slug is already exits"
  })
}
//  if not found then generate sku 
let sku = `eco-${Date.now()}`
let existingSku = await Product.findOne({sku: sku})
if(existingSku){
   return  res.status(400).json({
     success: false,
     mesage: "Sku is already exits"
  })  
}
let product = new Product({
   title: title,
   description: description,
   shortDescription: shortDescription,
   price: price,
   slug: slug,
   sku: sku,
   images: images,
   discountPrice: discountPrice,
   category: category,
   subCategory: subCategory,
   owner: owner 
})
await product.save()
res.status(201).json({
    success : true,
    message: "Product created successfully..",
    product: product
})
}
// get All product 
let getAllProduct = async (req,res)=>{
let product = await Product.find({}).populate('category').populate('subCategory').populate('owner','-password')
res.status(200).json({
  success: true,
  message: "All Product",
  product: product
})
}

// get singla product
const getSingleProducts = async (req, res) => {
        const { id } = req.params
        const product = await Product.findById(id).populate(['owner', 'category', 'subCategory'])
        if (!product){
            return res.status(404).json({
              success: false,
              message: 'Product was not found !' })
        }
        return res.status(200).json({
          success: true,
          message:'Product found successfully..',
          data: product
       })
    }
// get categories wise product
const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
     const products = await Product.find({category: categoryId}).populate('category subCategory owner', '-password');
      return res.status(200).json({
      success: true,
      message: 'Products fetched by category',
      products
    });
  }
// get owner  wise all  product
const getProductsByOwner = async (req, res) => {
    const { ownerId } = req.params;
    const products = await Product.find({owner: ownerId}).populate('category subCategory owner', '-password');
    return res.status(200).json({
      success: true,
      message: 'Products fetched by owner',
      products
    });
  } 

// get  subcategory wise All product
const getProductsBySubCategory = async (req, res) => {
    const { subCategoryId } = req.params;

    const products = await Product.find({subCategory: subCategoryId}).populate('category subCategory owner', '-password');

    return res.status(200).json({
      success: true,
      message: 'Products fetched by subCategory',
      products
    });
  }
// Delete one product by ID
const deleteProduct = async (req, res) => {

    const { productId } = req.params;

    // Validate Product ID
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Product ID'
      });
    }

    // Find and delete product
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      product
    });
};







module.exports={createPorduct,getAllProduct,getSingleProducts,getProductsByOwner,getProductsByCategory,getProductsBySubCategory,deleteProduct}