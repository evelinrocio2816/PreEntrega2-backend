const ProductModels= require("../models/product.model.js");

class ProductManager {
  async addProduct(newObject) {
    let { title, description, price, image, code, stock, category } =
      newObject;
    try {
      if (!title || !description || !price || !image || !code || !stock || !category) {
        console.log("Todos los campos deben ser completados");
        return;
      }

      //Validacion

      const productExist = await ProductModels.findOne({code:code });

      if (productExist) {
        console.log("El ya codigo Existe, debe ser unico");
        return;
      }
      const newProduct = new ProductModels({
        title,
        description,
        price,
        image,
        code,
        stock,
        category,
        status: true,
       
      });
      await newProduct.save();

    } catch (error) {
      console.log("Error al agregar el producto", error);
    }
  }
  async getProducts(limit , page) {
    try {
        const products = await ProductModels.paginate({},{limit , page})
        return products
    } catch (error) {
        console.log("Error al obtener los productos",error);
    }
  }
  async getProductsById(id){
    try {
        const product = await ProductModels.findById(id)
        if(!product){
            console.log("Producto no encontrado");
            return null
        }
        console.log("Producto encontradoo");
        return product
    } catch (error) {
        console.log("error al traer un producto por id");
    }
  
  }
  async upDateProducts(id, productUpdated) {
    try {
    const updatedProduct= await ProductModels.findByIdAndUpdate(id, productUpdated)

    if(!updatedProduct){
console.log("no se encuentra el product");
return null;

    }
    console.log("Producto actualizado ");
    return updatedProduct

    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
     const Delete = await ProductModels.findByIdAndDelete(id);

      if(!Delete){
        console.log("Producto no encontrado");
        return null;
      }
      console.log("Producto eliminado correctamente");

    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager  ;
