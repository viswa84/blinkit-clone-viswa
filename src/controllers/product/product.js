import  Product  from "../../models/product.js";

export const getAllProductsByCategory = async (req, replay) => {

    const { categoryId } = req.params;   // Get the category id from the request parameters
    try {
        const products = await Product.find({ category: categoryId }).select("-category").exec()
          // Find all products with the given category id
          return replay.send(products);
    }
    catch (error) {
        return replay.status(500).send({ message: "Failed to fetch products", error });
    }

}
 