const user=require('../models/userModel');
const jwt=require('jsonwebtoken');



// jwt secret_token
const secret_token='05aa57440a1206a1d84cc4e9003f95ca47630ecff0f07942edeb68f2298f95eb3d3d97615a20d64cf6caa944b4c826ee387bbc374994736cfb61e1a03f6d1f7b';



// jwt verifies the token and add the username into the request object
// x-auth-token should not be present when you dont need authorization
// when x-auth-token is present it gets verified and checks if the user exists
// all other cases responds with an error
async function auth(req,res,next,apiPrefix)
{
    const jwtToken=req.headers['x-auth-token'];
    
    if(jwtToken)
    {
        try{
            const decodedUser=jwt.verify(jwtToken,secret_token);
            //console.log(decodedUser);
            req.username=decodedUser.username;

            // checking if the user exists(rare case)
            const userExists=await user.exists({username:req.username});
            if(userExists==null)
            {
                res.status(403).json({error:"User doesnt exist :("})
            }
            else
            {
                console.log('authenticated using jwt');
                next();
            }
        }
        catch(err){
            console.log('jwt auth failed');
            //console.log(err.message);
            res.status(401).json({error:err.message}); // session expired or wrong token , not authorized
        }
    }
    else
    {
        // only the register and login routes dont need jwt token
        if(req.url==(apiPrefix+"/register") || req.url==(apiPrefix+"/login"))
            next();
        else
            res.status(401).json({error:"auth token not sent!"});
        
    }
}

module.exports=auth;