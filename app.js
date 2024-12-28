import  Fastify from "fastify";
import { config } from 'dotenv'
import {connectDB} from "./src/config/connect.js"
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

config();

const start = async ()=>{
  console.log(process.env.MONGO_URI, ":urlllllllllllllllllllllllllllll")
  await connectDB(process.env.MONGO_URI)
    const app = Fastify();

    app.register(fastifySocketIO,{
      cors:{
        origin:"*"
      },
      pingInterval:1000,
      pingTimeout:5000,
      transports:["websocket"],
    });

    await registerRoutes(app)
    await buildAdminRouter(app);


    
    const PORT = process.env.PORT || 3000 ;
    app.listen({port:PORT},
        (err,addr)=>{
          if(err){
            console.log(err)
          } else {
                console.log(`Blinkit Started on htttp://localhost:${PORT}${admin.options.rootPath}`)
          }

        }
    )

    app.ready().then(()=>{
      app.io.on("connection",(socket)=>{
        console.log("🔴 User Connected");

        socket.on("joinRoom", (orderId)=>{
          socket.join(orderId);
          console.log(`User Joined room ${orderId}`)
        });
        socket.on("disconnect",()=>{
          console.log("User Disconnected 📵 ");

        })
      })
    })
}

start()