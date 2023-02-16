const mongoose=require('mongoose');
const validator=require('validator');

const schema=mongoose.Schema;

// schema for each user
// backend validations also happens
const userSchema=new schema({
    username:{ type:String , unique:true , required:true},
    password: { type: String, required: true , validate:(pass)=>(validator.isLength(pass,{min:5}))},
    email : { type:String, required: true, unique: true,validate:(em)=>(validator.isEmail(em))},
    fName : {type: String, required: true},
    lName : {type: String, required: true},
    age : {type : Number, required: true, validate:(ag)=>(ag >=18)},
    phNum : {type: String,required : true,validate:(num)=>(validator.isMobilePhone(num))}
})

const user=mongoose.model('user',userSchema);

module.exports=user;