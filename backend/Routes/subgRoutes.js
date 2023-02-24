const express=require('express');
const subg=require('../models/subgModel');
const {errorResp,goodResp}=require("../helpers/responseHelpers");
const user=require('../models/userModel')

const router=express.Router();



// checks if user is authorized(is a mod) to see details of these sub greddiits
// this implies the sub greddiit exists
// req needs to have a name param
// returns 1 if authorized
// returns 0 if unauthorized and sends an error response
async function gModAuth(user,gName,res)
{   
    try{
        // check if the user is authorized to do this
        const data=await user.findOne({username:user},"gMod -_id");
        if(data.gMod.has(gName))
        {
            return 1;
        }
        else
        {
            res.status(401).json({message:"Not authorized"});
            return 0;
        }
    }
    catch(err)
    {
        errorResp(res,err.message);
        return 0;
    }
}






// creates a new sub greddit
// send {name:"",description:"",tags:[],banned={word:1}}
// returns {message:""}
router.post('/create',async (req,res)=>{
    try{
        req.body.followers={};
        req.body.followers[req.username]=0;
        req.body.followerCount=1;
        req.body.postCount=0;
        req.body.requested={};
        req.body.reports={};
        await subg.create(req.body);

        const modSubgs=await user.findOne({username:req.username},"gMod -_id");
        modSubgs.gMod.set(req.body.name,1);
        await user.findOneAndUpdate({username:req.username},{gMod:modSubgs.gMod});

        // add subg into tags collection

        goodResp(res,"Created sub greddit")
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})



// deletes that subg
// send 
// returns {message:""}
router.post('/delete/:name',async (req,res)=>{
    try{
        const auth=await gModAuth(req.username,req.params.name,res);
        if(auth)
        {
            // delete related reports here
            data.gMod.delete(req.params.name);
            await user.findOneAndUpdate({username:req.username},{gMod:data.gMod}); // updating gMod
            await subg.deleteOne({name:req.params.name});
            goodResp(res,"deleted successfully");
        }
        
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})



// gets all followers(blocked and unblocked separated)
// returns {normal:[usernames],blocked:[usernames]}
router.get('/getFollowers/:name',async (req,res)=>{
    try{
        const auth=await gModAuth(req.username,req.params.name,res);
        if(auth)
        {
            let blocked=[];
            let normal=[];
            const data=await subg.findOne({name:req.params.name},"followers -_id");
            for (let followerName of data.followers.keys())
            {
                if(data.followers[followerName]==0) // not blocked
                    normal.push(followerName);
                else
                    blocked.push(followerName);
            }
            res.status(200).json({normal:normal,blocked:blocked});
        }
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})




// gets all usernames that have requested to join the subgreddit
// returns {requests:[usernames]}
router.get('/getReq/:name',async (req,res)=>{
    try{
        const auth=await gModAuth(req.username,req.params.name,res);
        if(auth)
        {
            const data=await subg.findOne({name:req.params.name},"requested -_id");
            let requests=[ ...data.requested.keys() ];
            res.status(200).json({requests:requests});   
        }
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})


// accepting or rejecting a request
// action="accept" or action="reject"
// send {subg_name:"",username:""}
// returns {message:""}
router.post('/req/:action', async (req,res)=>{
    // maybe check if post fields are actually present?
    try{
        const auth= await gModAuth(req.username,req.body.subg_name,res);
        if(auth)
        {   
            const data=await subg.findOne({name:req.body.subg_name},"requested followers followerCount -_id");
            if(data.requested.has(req.body.username) && !(data.followers.has(req.body.username))) // user has actually requested (and user is not in the subg ; not needed but extra check) since while requesting if user has joined , the request cant be sent
            {
                // update user gFollowing
                const usergFollowing=await user.findOne({username:req.body.username},"gFollowing -_id");

                if(req.params.action=="accept")
                {
                    // increase follower count
                    data.followerCount+=1;
                    // add to folloewers
                    data.followers[req.body.username]=0;
                    usergFollowing.gFollowing[req.body.subg_name]="joined";
                }
                else if(req.params.action=="reject")
                {
                    usergFollowing.gFollowing.delete(req.body.subg_name);
                }
                // pushing
                await user.findOneAndUpdate({username:req.body.username},{gFollowing:usergFollowing.gFollowing});
                // pushing changes to db
                data.requested.delete(req.body.username);
                await subg.findOneAndUpdate({name:req.body.subg_name},data);

                goodResp(res,"request transacted");
            }
            else
                errorResp(res,"Bad Request. Wrong Data");
        }
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})



// gets basic info on all subgs except joined subgs
// returns {allSubgs:[{followerCount,postCount,name,description,banned,tags}]}
router.get('/getAll',async (req,res)=>{
    try{
        const joinedSubgs=await user.findOne({username:req.username},"gFollowing gMod -_id");
        const following=[];
        for (let joinedName of joinedSubgs.gFollowing.keys())
        {
            if(joinedSubgs.gFollowing[joinedName]=="joined")
                following.push(joinedName);
        }
        const joined=following.concat([...joinedSubgs.gMod.keys()]);
        const allSubgs=await subg.find({name:{$nin:joined}},"followerCount postCount name description banned tags -_id");
        res.status(200).json({allSubgs:allSubgs});
    }
    catch(err)
    {
        errorResp(res,err.message);
    }
})




module.exports=router;