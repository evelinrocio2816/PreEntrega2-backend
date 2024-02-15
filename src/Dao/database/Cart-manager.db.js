const CartModels = require("../models/cart.models.js");


class CartManager {
  async createCart() {
    try {
      const newCart = new CartModels({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("error al crear el carrito");
    }
  }
  async getCartById(cartId) {
    try {
        const cart = await CartModels.findById(cartId);
        if (!cart) {
            console.log("No existe ese carrito");
            return { status: 404, message: "No existe ese carrito" };
        }
        return cart
        // { status: 200, cart };
    } catch (error) {
        console.log("error al traer el carrito");
        return { status: 500, message: "Error interno del servidor" };
    }
}

 async productsAddToCarts(cartId, productId, quantity = 1) {
   try {
     const cart = await this.getCartById(cartId);
 
     // Verificar si el carrito existe y tiene la propiedad products
     if (!cart || !cart.products) {
       console.log("Error: El carrito no existe o no tiene la propiedad 'products'");
       return null;
     }
 
      // Verificar si el producto ya existe en el carrito
      const productExistIndex = cart.products.findIndex(
        (item) => item.product && item.product.toString() === productId
      );
  
      if (productExistIndex !== -1 && cart.products[productExistIndex]) {
        // El producto ya existe en el carrito, actualizar la cantidad
        cart.products[productExistIndex].quantity += quantity;
      } else {
        // El producto no existe o no está inicializado, agregarlo al carrito
        cart.products.push({ product: productId, quantity });
      }
  
      // Marcar la propiedad products como modificada antes de guardar
      cart.markModified("product");
  
      // Guardar el carrito actualizado
      await cart.save();
  
      return cart;
    } catch (error) {
      console.log("Error al agregar productos al carrito", error);
      return null;
    }
  }
  
}

module.exports = CartManager;
