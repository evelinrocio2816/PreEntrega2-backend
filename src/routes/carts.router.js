const express = require("express");
const router = express.Router();

const CartsManager = require("../Dao/database/Cart-manager.db.js");
const cartsManager = new CartsManager();
const CartModels= require("../Dao/models/cart.models.js")

//1)- Ruta para crear un nuevo carts

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.json(newCart);
    console.log(newCart)
  } catch (error) {
    console.error("Error al crear un nuevo carts", error);
    res.json({ error: "Error del servidor" });
  }
});


//Routes
//2)-lista de productos de cada carts

router.get("/:cid", async (req, res) => {
  const cartsId = req.params.cid
  try {
    const cart = await CartModels.findById(cartsId)

    if (!cart) {
      res.status(404).json({ message: "El ID es invalido" })
    //  return res.status(404).json({ error: "Carrito no encontrado" });

    }else{

        res.json(cart.products)
    }
    
  } catch (error) {
    console.error("Error al obtener el carts", error);
    res.status(500).json({ error: "error interno del servidor" })
  }
})

//3)-agregar productos al carts
router.post("/:cid/products/:pid", async (req, res) => {
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
    console.error("Error al actualizar el carts", error);
    res.status(404).json({ status: "error", message: "No se puede agregar el producto a un carts no existente." });
  }
});



//4)-Borrar producto especifiico en el carts
// Delete product from cart
router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  // Verificar si el producto existe en el carrito antes de intentar eliminarlo
  const cart = await cartsManager.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ message: "El carrito no existe, ingrese un ID válido" });
  }

  const productIndex = cart.products.findIndex(product => product.productId === productId);
  if (productIndex === -1) {
    return res.status(404).json({ message: "El ID de producto ingresado no existe en este carrito" });
  }

  // Si el producto existe en el carrito, procedemos a eliminarlo
  const updatedCart = await cartsManager.removeProductFromCart(cartId, productId);
  res.json({
    status: 'success',
    message: 'Producto eliminado del carrito correctamente',
    updatedCart,
  });
});

 
 


//5)-actualizar productos en el cart
// Update cart with products
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body;

  // Verificar si el carrito existe antes de intentar actualizarlo
  const cart = await cartsManager.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ message: "El carrito no existe, ingrese un ID válido" });
  }

  try {
    const updatedCart = await cartsManager.updateCart(cartId, products);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al actualizar el carrito', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
    });
  }
});



//6)-actualzar  cantidad de productos en el carts 
// Update product quantity in cart
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    // Verifico si el carrito existe antes de actualizar Quantity
    const cart = await cartsManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "El carrito no existe, ingrese un ID válido" });
    }

    // Verifico si el producto existe en el carrito
    const productIndex = cart.products.findIndex(product => product.productId === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "El producto no existe en el carrito" });
    }

    // Si el carrito y el producto existen, actualizo la cantidad de producto
    const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, quantity);
    res.json({
      status: 'success',
      message: 'Cantidad del producto actualizada correctamente',
      updatedCart
    });
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito', error);
    res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
    });
  }
});


  //7)-  DELETE para eliminar todos los productos del carts(Vaciar carrito)
  router.delete('/:cid', async (req, res) => {
    try {
      const cartId = req.params.cid;
  
      // Verificar si el carrito existe antes de intentar vaciarlo
      const cart = await cartsManager.getCartById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "El carrito que desea vaciar no existe" });
      }
  
      const updatedCart = await cartsManager.emptyCart(cartId);
  
      res.json({
        status: 'success',
        message: 'Todos los productos del carrito fueron eliminados correctamente',
        updatedCart,
      });
    } catch (error) {
      console.error('Error al vaciar el carrito', error);
      res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
      });
    }
  });
  


module.exports = router;