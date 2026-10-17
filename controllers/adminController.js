const User = require('../models/userSchema')
const Category = require('../models/categorySchema')
const SubCategory = require('../models/subCategorySchema')

// admin can get all users 
let getallusers= async(req,res)=>{
    let existingUsers = User.find({})

    if(!existingUsers){
         return res.status(400).json({ 
         success: false, 
         message: 'user not found' })
    }
    res.status(200).json({
    success: true,
    message: `${User.length} user found`,
 })
}
// admin can see one user
let singalUser = async (req,res)=>{
 try{
     let {id}= req.params
   let data = await User.findById({_id: id}).select('-password')
   res.status(200).json({
      success: true,
      message: `user infor`,
      data: data
   })
 }catch(error){
    return res.status(500).json({
      success: false,
      messgae: "Internal server problem"
    })
 }  
 
}
// admin can see  All active user
let activeUser = async (req,res)=>{
  try{
   let data = await User.find({status:'active'})
   res.status(200).json({
      success: true,
      message: `Active user infor`,
      data: data
   })
  }catch(error){
   return res.status(500).json({
      success: false,
      messgae: "Internal server problem"
    })
  }
}

// admin can see All deactive usre
let deactiveUser = async (req,res)=>{
 try{
      let data = await User.find({status:'deactive'})
   res.status(200).json({
      success: true,
      message: `Active user infor`,
      data: data
   })
 }catch(error){
   return res.status(500).json({
      success: false,
      messgae: "Internal server problem"
    })
 }
}
// admin can update All category 
let updateUser = async (req,res)=>{
  try{
    let {id}= req.params
   await User.findByIdAndUpdate({_id: id},req.body,{new: true})
   res.status(200).json({
      success: true,
      message: `user updated`,
   })
  }catch(error){
     return res.status(500).json({
      success: false,
      messgae: "Internal server problem"
    })
  }
}
// admin can delete All category
let deleteUser = async (req,res)=>{
   try{
   let {id}= req.params
    if (!id) {
    return req.status(400).json({
       success: false,
       message: 'User id required'
       })
   }
   await User.findByIdAndDelete({_id: id})
   if (!User) {
     return res.status(400).json({ 
      success: false,
      message: 'User not found'
    })
  }
   return res.status(200).json({
      success: true,
      message: `user deletedted`,
   })

}catch (error) {
        return res.status(500).json({ 
         success: false, 
         message: 'Internel server error'
       })
    }
}
// admin can get all Category
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
// admin can get all sub category
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






module.exports = {getallusers,singalUser,deactiveUser,activeUser,updateUser,deleteUser,getAllCategory,getAllSubCategory}
