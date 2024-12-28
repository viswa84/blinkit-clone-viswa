import mongoose from "mongoose";

const categoryaSchema = new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,require:true},

});



const Category = mongoose.model("Category",categoryaSchema);


export default Category