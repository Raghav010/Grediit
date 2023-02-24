const mongoose=require('mongoose');
const validator=require('validator');

const schema=mongoose.Schema;

const postSchema=new schema({
    text:{type:String,required:true,validate:(tx)=>validator.isLength(tx,{min:1})},
    postedBy:{type:String,required:true},
    postedIn:{type:String,required:true},
    upvotes:{type:Number,validate:(uv)=>(uv>=0)},
    downvotes:{type:Number,validate:(dv)=>(dv>=0)}
})


postSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
  });



const post=mongoose.model("post",postSchema);


module.exports=post;