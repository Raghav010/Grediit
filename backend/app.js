const express=require('express');
const mongoose=require('mongoose');
const user=require('./models/userModel');
const jwt=require('jsonwebtoken');
const auth=require('./middleware/auth');


// importing all the route groups
const userDataRoutes=require('./RouteGroups/User/userRoutes');





const app=express();


// TODO
// make all responses uniform
// do server side validation too






//status 401 not authorized
//       400 error
//       200 all ok
//       errors sent back in json {error:"error message"}


// env variables

//mongodb
const dbPass="MaGWZQX41XlqANIW";
const connectionURL=`mongodb+srv://admin:${dbPass}@greddiitr.gtz5grc.mongodb.net/greddiitr?retryWrites=true&w=majority`;


const sessionTime=180;
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
app.get(apiPrefix+'/auth',(req,res)=>{
    console.log('sent username');
    try{
        res.status(200).json({username:req.username});
    }
    catch(err)
    {
        res.status(400).json({error:err.message}); // username doesnt exist
    }
})




// registering a new user
app.post(apiPrefix+'/register',async (req,res)=>{
    
    // saving data to mongo
    try{
        const userData=await user.create(req.body);
        res.status(200).json({message:"registered new user"});
        console.log('Registered new user');
    }
    catch(error)
    {
        res.status(400).json({error:error.message});
        console.log('error occured',error.message);
    }
})



//logging in a registered user
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
        res.status(400).json({error:"wrong username or password"});
    } 
})



// user data routes
app.use('/api/user',userDataRoutes);

