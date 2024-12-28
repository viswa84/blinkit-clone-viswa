import mongoose from "mongoose";


const productaSchema = new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,require:true},
    price:{type:Number,require:true},
    discountPrice:{type:Number},
    quantity:{type:String,required:true},
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true}

});



const Product = mongoose.model("Product",productaSchema);


export default Product