const express = require("express");
const ProductManager = require("../Dao/database/Product-manager.db");
const productManager = new ProductManager();
const CartManager= require("../Dao/database/Cart-manager.db")
const cartsManager= new CartManager()
const router = express.Router()
const fs = require('fs').promises;

//Home
router.get("/", async (req, res) => {
  res.render("home",{title:"home"})
 });

//Carts
router.get("/carts", async (req, res) => {
   res.render("carts",{title:"carts"})
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

 //Chat
 
router.get("/chat", async (req, res) => {
   res.render("chat",{title:"chat"})
  });
//Products



  router.get("/products", async (req, res) => {
   try {
      const { page = 4, limit = 4 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });
 
      const newArray = products.docs.map(prod => {
         const { _id, ...rest } = prod.toObject();
         return rest;
      });
 
      res.render("products", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });
 
   } catch (error) {
      console.error("Error al obtener products", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
 });
 module.exports = router;