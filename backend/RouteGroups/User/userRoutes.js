const express=require('express');
const user=require('../../models/userModel');


const router=express.Router();


router.get('/userInfo',async (req,res)=>{
    
    const {username,email,fName,lName,age,phNum}=await user.findOne({username:req.username});
    //console.log(userData);
    res.status(200).json({username,email,fName,lName,age,phNum});
})


module.exports=router;