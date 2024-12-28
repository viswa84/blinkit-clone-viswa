import { Customer, DeliveryPartner } from "../../models/user.js";
import  Branch from "../../models/branch.js";
import Order  from "../../models/order.js";


export const createOrder = async (req, replay) => {
  try {
    const  {userId}=req.user
    const { items,branch, totalPrice } = req.body;

    const  customerData = await Customer.findById(userId);
    const branchData =await Branch.findById(branch);
    if(!customerData){
      return replay.status(404).send({ message: "Customer not found" });
    }
    const newOrder = new Order({
        customer: userId,
      items:items.map((item) => ({
        id:item.id,
        item:item.item,
        count:item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || "No address available",
      },
      pickupLocation: {
        latitude: branchData.location.latitude,
        longitude: branchData.location.longitude,
        address: branchData.address || "No address available",
      },

    });

    const savedOrder = await newOrder.save();
    replay.send(savedOrder);

  } catch (error) {
    replay.status(500).send({ message: "Failed to create order.." ,error});
  }
}
export const confirmOrder = async (req, replay) => {
    try {
         const { orderId } = req.params;
         const { userId } = req.user;
         const {deliveryPersonLocation} = req.body;

         const deliveryPerson = await DeliveryPartner.findById(userId);
          if(!deliveryPerson){
              return replay.status(404).send({message:"Delivery person not found"});
          }
         const order = await Order.findById(orderId);
         if(!order){
             return replay.status(404).send({message:"Order not found"});
         }
         if(order.status !== "available"){
             return replay.status(400).send({message:"Order is not available"});
         }  
         order.status = "confirmed";
            order.deliveryPartner = userId;
            order.deliveryPersonLocation = {
                latitude: deliveryPersonLocation.latitude,
                longitude: deliveryPersonLocation.longitude,
                address: deliveryPersonLocation.address || "",
            };
            req.server.io.to(orderId).emit("OrderConfirmed",order)
            await order.save();
            return replay.send(order);
    } catch (error) {
      replay.status(500).send({ message: "Failed to confirm order.." ,error});  
    } 
    };

export const updateOrderStatus = async (req, replay) => {
try {
    const { orderId } = req.params;
    const { status,deliveryPersonLocation } = req.body;
    const { userId } = req.user;
      const deliveryPerson = await DeliveryPartner.findById(userId);

      if(!deliveryPerson){
          return replay.status(404).send({message:"Delivery person not found"});
      }
      const order = await Order.findById(orderId);
      if(!order){
          return replay.status(404).send({message:"Order not found"});
      }
      if(["delivered","cancelled"].includes(order.status)){
          return replay.status(400).send({message:"Order is already delivered or cancelled con't update status"});
      }  
      if(order.deliveryPartner.toString() !== userId){
        return replay.status(403).send({message:"You are not allowed to update status of this order"});
      }

         order.status = status;
         order.deliveryPartner = userId;
         order.deliveryPersonLocation = deliveryPersonLocation ;
         await order.save();
         req.server.io.to(orderId).emit("liveTrackingUpdates",order)
         return replay.send(order);
} catch (error) {
    return replay.status(500).send({message:"Failed to update order status",error});
}
};


export const getOrders = async (req, replay) => {
    try {
   const {status,customerId,deliveryPartenerId,branchId} = req.query;

    const query = {};
    if(status){
        query.status = status;
    }
    if(customerId){
        query.customer = customerId;    
    }
    if(deliveryPartenerId){
        query.deliveryPartner = deliveryPartenerId;         
        query.branch = branchId;

    }

    const orders = await Order.find(query).populate("customer branch deliveryPartner items.item");
 

        return replay.status(200).send(orders);
    } catch (error) {
        return replay.status(500).send({message:"Failed to get orders",error});
    }
};


export const getOrderbyId = async (req, replay) => {
    try {
   const {orderId} = req.query;



    const order = await Order.findById(orderId).populate("customer branch deliveryPartner items.item");

      if(!order){
          return replay.status(404).send({message:"Order not found"});  
        }
        return replay.status(200).send(order);
    } catch (error) {
        return replay.status(500).send({message:"Failed to get order",error});
    }
};
