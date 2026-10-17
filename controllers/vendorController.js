const Category = require('../models/categorySchema')
const SubCategory = require('../models/subCategorySchema')
const mypromise = require("../utils/mypromise");



// can create Category
let createCategory = async(req,res)=>{
  let{name,owner}= req.body
  if(!name || !owner ){
     return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
  }
  let existingName = await Category.findOne({name: name.toLowerCase()})
  if(existingName){
     return res.status(400).json({
        success: false,
        message: "Category Already exits",
      });
  }
 let category = new Category({
    name: name.toLowerCase(),
    owner: owner
    })
  await category.save()
  return res.status(201).json({
      success: true,
      message: "Category created successfully"
})
}
// can get all Category
let getAllCategory = async (req,res)=>{
  let category = await Category.find({}).populate('owner')
  if(!category){
    return res.status(400).json({
        success: false,
        message: "Category name is required",
      })
  }
    return res.status(200).json({
      success: true,
      message: `${category.length} category were found`,
      data: category
  })
}
// can create subcategory
let createSubCategory = async(req,res)=>{
  let{name,parentCategory}= req.body
  if(!name || !parentCategory ){
     return res.status(400).json({
        success: false,
        message: "SubCategory fill all is required",
      });
  }
  let existingNameAndParent = await SubCategory.findOne({name: name.toLowerCase()})
  if(existingNameAndParent){
     return res.status(400).json({
        success: false,
        message: "Category Already exits",
      });
  }
 let subcategory = new SubCategory({
    name: name.toLowerCase(),
    parentCategory: parentCategory

    })
  await subcategory.save()
  return res.status(201).json({
      success: true,
      message: "Sub Category created successfully"
})
}
// can get all sub category
let getAllSubCategory = async (req,res)=>{
  let subcategory = await SubCategory.find({}).populate('parentCategory')
  if(!subcategory){
    return res.status(400).json({
        success: false,
        message: "Category name is required",
      })
  }
    return res.status(200).json({
      success: true,
      message: `${subcategory.length} category were found`,
      data: subcategory
  })
}
let getAllOwnerWiseCategory = async (req,res) => {
  let {id}= req.params
  let allOwnerWiseCategory = await mypromise(id)
  if(!allOwnerWiseCategory || allOwnerWiseCategory.length === 0 ){
    return res.status(404).json({
      success: false,
      message: "Category not found"
    })
  }
  return res.status(200).json({
    success: true,
    message: "All Categories..",
    category : allOwnerWiseCategory
  })
  
}

// get One category under All subcategory /which category have how much subcategory
let getAllCategoryWiseSubCategory = async (req,res)=>{
  let {id}= req.params
  if(!id){
     return res.status(400).json({
        success: false,
        message: "Category id is required",
      })
  }
  let subcategory = await SubCategory.find({parentCategory: id})
  if(!subcategory){
    return res.status(400).json({
        success: false,
        message: "Category name is required",
      })
  }
    return res.status(200).json({
      success: true,
      message: `${subcategory.length} sub category were found`,
      data: subcategory
  })
} 











module.exports = {createCategory,getAllCategory,createSubCategory,getAllSubCategory,getAllOwnerWiseCategory,getAllOwnerWiseCategory,getAllCategoryWiseSubCategory}

