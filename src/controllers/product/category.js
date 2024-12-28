import  Category  from "../../models/category.js";

export const getAllCategories = async (req, replay) => {
    try {
        const categories = await Category.find();
        return replay.send(categories);
    } catch (error) {
        return replay.status(500).send({ message: "Failed to fetch categories", error });
    }
}