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
    phNum : {type: String,required : true,validate:(num)=>(validator.isMobilePhone(num))},
    followers:{type:Map,of:Number}, // username:1
    following:{type:Map,of:Number}, // username:1
    gFollowing:{type:Map,of:String}, // g_name:status
    gMod:{type:Map,of:Number}, // g_name:1
    savedPosts:{type:Map,of:Number} // post_id:1
})


userSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
  });
  

const user=mongoose.model('user',userSchema);

module.exports=user;