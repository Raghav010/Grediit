const express=require('express');
const {errorResp,goodResp}=require("../helpers/responseHelpers");
const post=require('../models/postModel');

const router=express.Router();


// creates a post
// send {subg_name:"",username:"",text:""}
// returns
router.post("/create", async (req,res)=>{
    try{
        
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})


module.exports=router;