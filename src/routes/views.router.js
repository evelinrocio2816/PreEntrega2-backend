const express = require("express");
const ProductManager = require("../Dao/database/Product-manager.db");
const productManager = new ProductManager();
const CartManager= require("../Dao/database/Cart-manager.db")
const cartsManager= new CartManager()
const router = express.Router()
const fs = require('fs').promises;


router.get("/", async (req, res) => {
  res.render("home",{title:"home"})
 });
 router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
  
    try {
       const carts = await cartsManager.getCartById(cartId);
  
       if (!carts) {
          console.log("No existe ese carts con el id");
          return res.status(404).json({ error: "carrito no encontrado" });
       }
  
       const productsInCarts = carts.products.map(item => ({
          product: item.product,
          //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
          quantity: item.quantity
       }));
  
  
       res.render("carts", { products: productsInCarts });
    } catch (error) {
       console.error("Error al obtener el carts", error);
       res.status(500).json({ error: "Error interno del servidor" });
    }
  });

 
 
router.get("/chat", async (req, res) => {
   res.render("chat",{title:"chat"})
  });

 router.get("/products", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  try {
      const productList = await productManager.getProducts(limit, page );
      console.log(productList);

      res.render("products",{
          productList: productList.docs,
          hasPrevPage: productList.hasPrevPage,
          hasNextPage: productList.hasNextPage,
          prevPage: productList.prevPage,
          nextPage: productList.nextPage,
          currentPage: productList.page,
          totalPages: productList.totalPages,
          limit: productList.limit,
          title: "Products"
      });
      
  } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({ error: "error interno del servidor" });
  }
});
 module.exports = router;