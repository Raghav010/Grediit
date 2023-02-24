const express=require('express');
const user=require('../models/userModel');
const {errorResp,goodResp}=require("../helpers/responseHelpers");
const subg = require('../models/subgModel');

const router=express.Router();





// only returns back basic user info 
// returns {username,email,fName,lName,age,phNum}
router.get('/userInfo',async (req,res)=>{
    
    const {username,email,fName,lName,age,phNum}=await user.findOne({username:req.username});
    //console.log(userData);
    res.status(200).json({username,email,fName,lName,age,phNum});
})





// updating any of the basic fields of the user
// if password is updated discard the jwt token , or log him out
// send {data:""}
// returns {message:""}
router.post('/update/:field',async (req,res)=>{
    if(req.params.field=="fName" || req.params.field=="lName" || req.params.field=="age" || req.params.field=="phNum" || req.params.field=="password" || req.params.field=="email")
    {
        try{
            switch(req.params.field){
                case "fName":
                    await user.findOneAndUpdate({username:req.username},{fName:(req.body.data)});
                    break;
                case "lName":
                    await user.findOneAndUpdate({username:req.username},{lName:(req.body.data)});
                    break;
                case "age":
                    await user.findOneAndUpdate({username:req.username},{age:(req.body.data)});
                    break;
                case "phNum":
                    await user.findOneAndUpdate({username:req.username},{phNum:(req.body.data)});
                    break;
                case "password":
                    await user.findOneAndUpdate({username:req.username},{password:(req.body.data)});
                    break;
                case "email":
                    await user.findOneAndUpdate({username:req.username},{email:(req.body.data)});
                    break;
            }
            goodResp(res,"updated succefully");
            console.log("updated");
        }
        catch(err){
            console.log("Updated failed!")
            errorResp(res,err.message);
        }
    }
    else
    {
        errorResp(res,"Cant update this!");
    }
})



// gets all the followers usernames in array format
// returns {followers:[]}
router.get('/followers',async (req,res)=>{
    try{
        const data=await user.findOne({username:req.username},"followers -_id");
        res.status(200).json({followers:[...data.followers.keys()]});
    }
    catch(err){
        errorResp(res,err.message);
    }
})


// gets all the following usernames in array format
// returns {following:[]}
router.get('/following',async (req,res)=>{
    try{
        const data=await user.findOne({username:req.username},"following -_id");
        res.status(200).json({following:[...data.following]});
    }
    catch(err){
        errorResp(res,err.message);
    }
})



// send
// returns {message:""}
router.post('/unfollow/:username',async (req,res)=>{
    try{
        const data=await user.findOne({username:req.username},"following -_id");
        if(!data.following.has(req.params.username)) // checking if the following guy exists
        {
            errorResp(res,"Bad request, wrong data");
            return;
        }
        const unfollowUserData=await user.findOne({username:req.params.username},"followers -_id");
        if(!unfollowUserData.followers.has(req.username)) // checking the other way
        {
            errorResp(res,"Bad request, wrong data");
            return;
        }
        
        data.following.delete(req.params.username);
        unfollowUserData.followers.delete(req.username);
        await user.findOneAndUpdate({username:req.username},{following:data.following});
        await user.findOneAndUpdate({username:req.params.username},{followers:unfollowUserData.followers});

        goodResp(res,"successful");
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})


// remove a follower
// send
// returns {message:""}
router.post('/removeF/:username',async (req,res)=>{
    try{
        const data=await user.findOne({username:req.username},"followers -_id");
        if(!data.followers.has(req.params.username)) // checking if the following guy exists
        {
            errorResp(res,"Bad request, wrong data");
            return;
        }
        const rFollowerUserData=await user.findOne({username:req.params.username},"following -_id");
        if(!rFollowerUserData.following.has(req.username)) // checking the other way
        {
            errorResp(res,"Bad request, wrong data");
            return;
        }
        
        data.followers.delete(req.params.username);
        rFollowerUserData.following.delete(req.username);
        await user.findOneAndUpdate({username:req.username},{followers:data.followers});
        await user.findOneAndUpdate({username:req.params.username},{following:rFollowerUserData.following});

        goodResp(res,"successful");
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})


// used to follow username
// send
// returns {message:""}
router.post('/follow/:username',async (req,res)=>{
    try{
        // adding current user to followers of the other user
        const followersData=await user.findOne({username:req.params.username},"followers -_id");
        if(followersData==null)
        {
            errorResp(res,"Bad Request. Wrong data");
            return;
        }
        followersData.followers.set(req.username,1);

        // adding the other user to following of current user
        const followingData=await user.findOne({username:req.username},"following -_id");
        followingData.following.set(req.params.username,1);
        
        await user.findOneAndUpdate({username:req.params.username},{followers:followersData.followers});
        await user.findOneAndUpdate({username:req.username},{following:followingData.following});

        goodResp(res,"Follow successful")
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})



// gets the basic info on all sub greddits whos mod is the user
// lazy delete on gMod
// returns {gModName:{name,description,banned,tags,followerCount,postCount}}
router.get('/mod/getAll', async (req,res)=>{
    try{
        gModBData={};
        const gModNames=await user.findOne({username:req.username},"gMod -_id");
        for (let gModName of gModNames.gMod.keys())
        {
            const gModData=await subg.findOne({name:gModName},"description banned tags followerCount postCount -_id");
            if(gModData==null) // subg doesnt exist
            {
                gModNames.gMod.delete(gModName); // deleting
                continue;
            }
            gModBData[gModName]=gModData;
        }
        await user.findOneAndUpdate({username:req.username},{gMod:gModNames.gMod}); //updating gMods based on if the gMod was deleted
        res.status(200).json(gModBData);
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})



// gets the basic info on all sub greddits who the user follows(joined)
// lazy delete on gFollowing
// returns {gFollowingName:{name,description,banned,tags,followerCount,postCount}}
router.get('/gFollowing/getAll',async (req,res)=>{
    try{
        gFollowingBData={};
        const data=await user.findOne({username:req.username},"gFollowing -_id");
        for (let gFollowingName of data.gFollowing.keys())
        {
            if(data.gFollowing[gFollowingName]=="joined") // only subg which he has joined
            {
                const subgData=await subg.findOne({name:gFollowingName},"description banned tags followerCount postCount -_id");
                if(subgData==null) // subg doesnt exist (lazy delete)
                {
                    data.gFollowing.delete(gFollowingName);
                    continue;
                }
                gFollowingBData[gFollowingName]=subgData;
            }
        }

        //updating following subgs
        await user.findOneAndUpdate({username:req.username},{gFollowing:data.gFollowing});

        res.status(200).json(gFollowingBData);
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})




// sending a join request to a subg
// send {subg_name:""}
// returns {message:""}
router.post('/sendSubgReq', async (req,res)=>{
    try{
        const usergData=await user.findOne({username:req.username},"gFollowing gMod -_id");
        if(!(usergData.gFollowing.has(req.body.subg_name)) && !(usergData.gMod.has(req.body.subg_name)))
        {
            usergData.gFollowing[req.body.subg_name]="requested";
            await user.findOneAndUpdate({username:req.username},{gFollowing:usergData.gFollowing});

            // add in request to subg
            const requests=await subg.findOne({name:req.body.subg_name},"requested -_id");
            requests.requested[req.username]=1;
            await subg.findOneAndUpdate({name:req.body.subg_name},{requested:requests.requested});

            goodResp(res,"sent request");
        }
        else
        {
            errorResp(res,"You cant send request to this subg");
        }
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})




// leaves a subg if the user is not a mod
// send {subg_name:""}
// returns
router.post('/leaveSubg', async (req,res)=>{
    try{
        // checks 
        // does subg exist
        // can only leave if status is joined
        // should not be the mod
        const followerData=await subg.findOne({name:req.body.subg_name},"followers -_id");
        if(followerData!=null) //subg exists
        {
            if(followerData.followers.has(req.username)) // user is a member of subg
            {
                const subgUserData=await user.findOne({username:req.username},"gFollowing gMod -_id");
                if(subgUserData.gMod.has(req.body.subg_name)) // checking if the user is the mod
                {
                    errorResp(res,"User is the mod of this sub greddit");
                }
                else
                {
                    followerData.followers.delete(req.username);
                    subgUserData.gFollowing.delete(req.body.subg_name);
                    // pushing to cloud
                    await subg.findOneAndUpdate({name:req.body.subg_name},{followers:followerData.followers});
                    await user.findOneAndDelete({username:req.username},{gFollowing:subgUserData.gFollowing});

                    goodResp(res,"Successfully left sub greddit");
                }
            }
            else
                errorResp(res,"User has not joined the sub greddit");
        }
        else 
            errorResp(res,"Sub greddit doesnt exist");
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})






module.exports=router;