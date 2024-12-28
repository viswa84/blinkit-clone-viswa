import { confirmOrder, createOrder, getOrderbyId, getOrders, updateOrderStatus } from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js";


export const orderRoutes = async(fastify,options) => {
    fastify.addHook("preHandler",async (request,replay) => {
        const isAuthenticated = await verifyToken(request,replay);
        if(!isAuthenticated){
            replay.code(401).send({message:"Unauthorized"});
        }
    });


    fastify.post("/order",createOrder);
    fastify.get("/order",getOrders);
    fastify.patch("/order/:orderId/status",updateOrderStatus);
    fastify.post("/order/:orderId/confirm",confirmOrder);
    fastify.post("/order/:orderId",getOrderbyId);

}