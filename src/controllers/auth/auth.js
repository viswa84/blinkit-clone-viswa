import jwt from "jsonwebtoken";
import { Customer, DeliveryPartner } from "../../models/user.js";



const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    )
    const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    )
    return { accessToken, refreshToken }
}
export const loginCustomer = async (req, reply) => {

    try {
        const { phone } = req.body;
        let customer = await Customer.findOne({ phone })
        if (!customer) {
            customer = new Customer({
                phone,
                role: "Customer",
                isActivated: true,
            })
        }

        await customer.save()
        const { accessToken, refreshToken } = generateTokens(customer);

        return reply.send({
            message: customer ? "Login Sucessful" : "Customer created and logged in",
            accessToken,
            refreshToken,
            customer,
        })

    } catch (error) {
        return reply.status(500).send({message:"An error occurred",error})
    }
}

export const loginDeliveryPartner = async (req, reply) => {

    try {
        const { email,password } = req.body;
        let deliveryPartner = await DeliveryPartner.findOne({ email })
        if (!deliveryPartner) {
            return reply.status(404).send({message:"Delivery Partener not found"})
        }
              
           const isMatch = password === deliveryPartner.password ;
             if(!isMatch){
                return reply.status(400).send({message:"Invalid Credentials"})
             }
        const { accessToken, refreshToken } = generateTokens(deliveryPartner);

        return reply.send({
            message:  "Login Sucessful" ,
            accessToken,
            refreshToken,
            deliveryPartner,
        })

    } catch (error) {
        return reply.status(500).send({message:"An error occurred",error})
    }
}

export const refreshToken = async(req,reply)=>{

    const {refreshToken}= req.body ;

    if(refreshToken){
        return reply.stats(401).send({message:"Refresh token required"})
    }
    try {
          const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
            let user;
          if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId)

          } else if (decoded.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId)
          } else {
            return reply.stats(403).send({message:"Invalid Role"})
          }

          if(!user){
            return reply.stats(403).send({message:"Invalid refresh token"})
          };
          const {accessToken,refreshToken:newRefreshToken}=generateTokens(user);

          return reply.send({
            message:"Tokem Refresh",
            accessToken,
            refreshToken:newRefreshToken
          })

    } catch (error) {
        return reply.stats(403).send({message:"Invalid Refresh Token"})
    }

}


export const fetchUser =async (req,reply)=>{
    try {
        const {userId,role}=req.user;

        let user;
        if(role === "Customer"){
          user = await Customer.findById(userId)

        } else if (role === "DeliveryPartner"){
          user = await DeliveryPartner.findById(userId)
        } else {
          return reply.stats(403).send({message:"Invalid Role"})
        }
          if(!user){
            return RemotePlayback.stats(404).send({message:"user not found"})
          }
        return reply.send({
            message:"User fetched sucessfully",
            user,

        })

    } catch (error) {
        return reply.stats(500).send({message:"An error occurred",error})
    }
}