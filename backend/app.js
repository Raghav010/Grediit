const express=require('express');
const mongoose=require('mongoose');
const user=require('./models/userModel');
const jwt=require('jsonwebtoken');
const auth=require('./middleware/auth');
const {errorResp,goodResp}=require("./helpers/responseHelpers");


// importing all the route groups
const userDataRoutes=require('./Routes/userRoutes');
const subgRoutes=require('./Routes/subgRoutes');
const postRoutes=require('./Routes/postRoutes');



const app=express();








//status 401 not authorized
//       400 error
//       200 all ok
//       errors sent back in json {error:"error message"}


// env variables

//mongodb
const dbPass="iPFGK7YwQHgIZ4jS";
const connectionURL=`mongodb+srv://admin:${dbPass}@greddiitr.gtz5grc.mongodb.net/greddiitr?retryWrites=true&w=majority`;



const secret_token='05aa57440a1206a1d84cc4e9003f95ca47630ecff0f07942edeb68f2298f95eb3d3d97615a20d64cf6caa944b4c826ee387bbc374994736cfb61e1a03f6d1f7b';
const sessionTime=40000;
const apiPrefix='/api';

// connecting to the database
mongoose.connect(connectionURL,{useNewUrlParser:true,useUnifiedTopology:true})
    .then((result)=>{
        console.log("Connected to the database");
        app.listen(4000);})
    .catch((err)=>console.log(err));




// middleware------------------------------------------------
// authenticates if the header is present
app.use((req,res,next)=>(auth(req,res,next,apiPrefix)));
app.use(express.json())



// Routes for authentication/login/register-----------------------------------


// route for authenticating the user and returns the username
// returns {username:""}
app.get(apiPrefix+'/auth',(req,res)=>{
    console.log('sent username');
    try{
        res.status(200).json({username:req.username});
    }
    catch(err)
    {
        errorResp(res,err.message); // username doesnt exist
    }
})




// registering a new user
// send {username:"",fName:"",lName:"",password:"",age:,phNum:"",email:""}
// returns {message:""}
app.post(apiPrefix+'/register',async (req,res)=>{
    
    // saving data to mongo
    try{
        req.body.following={}; 
        req.body.followers={}; 
        req.body.gFollowing={};
        req.body.gMod={};
        req.body.savedPosts={};
        const userData=await user.create(req.body);
        goodResp(res,"registered new user");
        console.log('Registered new user');
    }
    catch(error)
    {
        errorResp(res,error.message);
        console.log('error occured',error.message);
    }
})



//logging in a registered user
// send {username:"",password:""}
// returns {token:""}
app.post(apiPrefix+'/login',async (req,res)=>{
    let dbPass=null;

    // if username doesnt exist it will throw an error
    // console.log(req.body.username);
    try{
        dbPass= await user.findOne({username:req.body.username},'password');
    }
    catch(error)
    {
        dbPass=null;
    }


    
    // console.log(dbPass.password);
    // return 200 if authenticated or 400
    if(dbPass!=null && dbPass.password==req.body.password)
    {
        // generating jwt token, session time
        const token=jwt.sign({username:req.body.username},secret_token,{expiresIn:`${sessionTime}s`});
        console.log('login succesfull and token sent back');
        res.status(200).json({token});
    }
    else
    {
        console.log('login failed');
        errorResp(res,"wrong username or password");
    } 
})



// user data routes--------------------------------------
app.use('/api/user',userDataRoutes);

// sub greddiit routes-----------------------------
app.use('/api/subg',subgRoutes);

// post routes
app.use('/api/post',postRoutes);