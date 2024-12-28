import jwt from "jsonwebtoken";


export const verifyToken = async(req,reply)=>{
  try {
    const authHeader = req.headers["authorization"]
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return reply.status(401).send({message:"Access token required"})
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     req.user=decoded;
     console.log(process.env.ACCESS_TOKEN_SECRET, "process.env.ACCESS_TOKEN_SECRET1")
     return true 
  } catch (error) {
    console.log(error,process.env.ACCESS_TOKEN_SECRET, "process.env.ACCESS_TOKEN_SECRET2")
    return reply.status(403).send({message:"Invalid or expired token",error})
  }
}