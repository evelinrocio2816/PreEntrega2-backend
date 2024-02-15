const express = require("express");
const app =express()
const PORT = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter =require("./routes/carts.router.js")
const viewRouter = require("./routes/views.router.js")
const socket = require("socket.io");
require("./db/index.db.js")



//handlebars

const { engine, create} = require('express-handlebars');
//otras config handlebars
const hbs = create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});
app.engine("handlebars", hbs.engine)
app.set("view engine","handlebars")
app.set("views", "./src/views")


//Middelware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("./src/public"))


//Routes
app.use("/api", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewRouter)


//INICIO EL SERVIDOR

 const httpServer= app.listen(PORT, ()=>{
  console.log(`Escuchando en http://localhost:${PORT}`);
})
const MessageModel= require("./Dao/models/message.models.js")

const io =new socket.Server(httpServer);



io.on("connection",(socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async data => {
           await MessageModel.create(data)
     

    const messages = await MessageModel.find()
    io.sockets.emit("message", messages)
    
  
  })
 
})


 