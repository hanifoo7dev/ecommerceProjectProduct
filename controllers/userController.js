const User = require('../models/userSchema')


// get all product
let getAllUser= async(req,res)=>{
    // let{fullName,email,password,terms}= req.body
    let existinguser = await User.find({})
    if(!existinguser){
        return res.status(400).json({
            success: false,
            message: "user not exits"
        })
    }
    return res.status(200).json({
        success: true,
        message: `${existinguser.length} user found`
    })


}


module.exports={getAllUser}