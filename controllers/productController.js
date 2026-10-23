const mongoose = require('mongoose')
const Product = require('../models/productSchema')
const { readSheet }= require('read-excel-file/node')
const XLSX = require("xlsx");


const schema = {
  title: {
    column: 'title',
    type: String
  },
  description: {
    column: 'description',
    type: String
  },
  shortDescription: {
    column: 'shortDescription',
    type: String
  },
  price: {
    column: 'price',
    type: Number
  },
  discountPrice: {
    column: 'discountPrice',
    type: Number
  },
  stock: {
    column: 'stock',
    type: Number
  },
  status: {
    column: 'status',
    type: String
  },
  imageUrl: {
    column: 'imageUrl',
    type: String
  },
  isMain: {
    column: 'isMain',
    type: Boolean
  },
  sku:{
    column: 'sku',
    type: String
  },
   slug:{
    column: 'slug',
    type: String
  }
}

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
  // console.log(req.files);

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
        const product = await Product.findById(id).populate([{path: 'owner', select:'-password'},{ path: 'category'}, { path: 'subCategory'}])
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

// upload data from excel
const bulkProducrUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await readSheet(req.file.path, { schema });
    const objects = result.objects || result.rows || result.data || result;

    if (!objects || !Array.isArray(objects) || objects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid data found in the sheet",
      });
    }

    const products = objects.map((product) => ({
      ...product,
      slug: product.slug ? product.slug :product.title.toLowerCase().split(" ").join("-"),
      sku:product.sku ? product.sku : `eco-${product.title.substring(0,4)}-${Date.now()}`,
      images: [                       
        {
          url: product.imageUrl,        
          isMain: true,
        },
      ],
    }));

    const saved = await Product.insertMany(products);

    res.status(201).json({
      success: true,
      message: "All products uploaded successfully",
      count: saved.length,
    });
  } catch (error) {
    console.log("Bulk upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Get data from Database in excel fomat
const exportProductsExcel = async (req, res) => {
  try {
    const products = await Product.find({}).lean();

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    const data = products.map((p) => ({
      title: p.title || "",
      description: p.description || "",
      shortDescription: p.shortDescription || "",
      price: p.price || 0,
      discountPrice: p.discountPrice || 0,
      stock: p.stock || 0,
      status: p.status || "",
      imageUrl: p.images?.[0]?.url || "",
      isMain: p.images?.[0]?.isMain || false,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition","attachment; filename=all-products.xlsx");
    res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
   } catch (error) {
    console.log("Export error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports={createPorduct,getAllProduct,getSingleProducts,getProductsByOwner,getProductsByCategory,getProductsBySubCategory,deleteProduct,bulkProducrUpload,exportProductsExcel}