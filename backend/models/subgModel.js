const mongoose=require('mongoose');


const schema=mongoose.Schema;


const subgSchema=new schema({
    name:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    tags:[String],
    banned:{type:Map,of:Number},
    followers:{type:Map,of:Boolean},
    followerCount:{type:Number},
    postCount:{type:Number},
    requested:{type:Map,of:Number},
    reports:{type:Map,of:String}
},{timestamps:true})


const subg=mongoose.model("subg",subgSchema);

module.exports=subg;