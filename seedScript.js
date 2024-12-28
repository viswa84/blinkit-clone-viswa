
import "dotenv/config.js";
import mongoose from "mongoose";
import { Category ,Product} from "./src/models/index.js";
import { categories, products } from "./seedData.js";





async function seddDataBase() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        await Product.deleteMany({})
        await Category.deleteMany({})
        console.log("Deleteed documents sucessfullY",process.env.MONGO_URI)
        const categoryDocs = await Category.insertMany(categories);

        const categoryMap =categoryDocs.reduce((map,category)=>{
          map[category.name]=category._id;
          return map
        },{});

  const productWithCategoryIds = products.map((product)=>({
    ...product,
    category:categoryMap[product.category]
  }))
      await Product.insertMany(productWithCategoryIds)

      console.log("database seeded sucessfullY 👌")

    } catch (error) {
        console.log("seedimngError",error)
    } finally{
        console.log("seedimngError")
        mongoose.connection.close();
    }
}
seddDataBase()