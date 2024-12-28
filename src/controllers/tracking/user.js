import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, replay) => {
    try {
        const { userId } = req.user;
        const updateData = req.body;
        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);

        if (!user) {
            return replay.status(404).send({ message: "User not found" });
        }

        let UserModel;
        if (user instanceof Customer) {
            UserModel = Customer;
        } else if (user instanceof DeliveryPartner) {
            UserModel = DeliveryPartner;
        } else {
            return replay.status(400).send({ message: "Invalid user role" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return replay.status(404).send({ message: "User not found" });
        }

        return replay.send({
            message: "User updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        return replay.status(500).send({ message: "Failed to update user", error });
    }
}