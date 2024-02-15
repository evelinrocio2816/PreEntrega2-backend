const mongoose = require("mongoose");



 mongoose.connect(
  "mongodb+srv://evelinrocio2816:Airbag2816@cluster0.sasvmwp.mongodb.net/e-commerce?retryWrites=true&w=majority"
)
.then(()=> console.log("Conexion Exitosa"))
.catch((error)=>console.log("Error de conexion", error))
