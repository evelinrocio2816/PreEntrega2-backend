const express = require("express");
const router = express.Router();

const CartsManager = require("../Dao/database/Cart-manager.db.js");
const CartManager = require("../Dao/database/Cart-manager.db.js");
const cartsManager = new CartsManager();


//Routes
//lista de productos de cada carrito

router.get("/:cid", async (req, res) => {
  const cartsId = req.params.cid
  try {
    const cart = await cartsManager.getCartById(cartsId)

    if (!cart) {
      res.json({ message: "El ID de carrito es invalido" })

    } else {
      res.json(cart.products)
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "error interno del servidor" })
  }
})



//agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const quantity = req.body.quantity !== undefined ? Number(req.body.quantity) : 1;

    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ status: "error", message: "La cantidad debe ser un número entero positivo." });
    }


    const updateCart = await cartsManager.productsAddToCarts(cartId, productId, quantity);
    res.status(200).json({ status: "success", data: updateCart.products });
  } catch (error) {
    console.error("Error al actualizar el carrito", error);
    res.status(404).json({ status: "error", message: "No se puede agregar el producto a un carrito no existente." });
  }
});


// Ruta para crear un nuevo carrito

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.json(newCart);
    console.log(newCart)
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.json({ error: "Error del servidor" });
  }
});

//Borrar productos en el carrito
// Delete product from cart
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartsManager.removeProductFromCart(cartId, productId);

    res.status(200).json(updatedCart.products);

  }
  catch (error) {
    console.error("Error al eliminar el producto del carrito", error);
   
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//actualizar productos en el cart
// Update cart with products
router.put("/:cid", async (req, res) => {
  try {
const cartId = req.params.cid;
const products = req.body.products;
const updatedCart = await cartsManager.updateCartWithProducts(cartId, products);
    res.status(200).json(updatedCart.products);
  }  
catch (error) {
console.error("Error al actualizar el carrito con productos", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



//actualzar  cantidad de productos en el carrito 
// Update product quantity in cart
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
const productId = req.params.pid;
const quantity = req.body.quantity;
const updatedCart = await cartsManager.updateProductQuantityInCart(cartId, productId, quantity);
    res.status(200).json(updatedCart.products);
  
  }
catch (error) {
console.error("Error al actualizar la cantidad del producto en el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // DELETE para eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
try {
const cartId = req.params.cid;
// Encuentra el carrito por su ID y utiliza "populate" para obtener los productos completos

const cart = await cartsManager.findById(cartId).populate("products");
if (!cart) {
return res.status(404).json({ error: "Carrito no encontrado" });
    }

// Limpia el array de productos del carrito
    cart.products = [];
    
    
await cart.save();

res.json({ message: "Todos los productos del carrito han sido eliminados" });
  } 
  
catch (error) {
console.error("Error al eliminar los productos del carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});




module.exports = router;