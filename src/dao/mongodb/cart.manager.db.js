
import CartModel from "../models/cart.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;

        } catch (error) {
            console.log("Error al crear el carrito:", error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            return cart;

        } catch (error) {
            console.log("Error al obtener el carrito:", error);
            throw error;
        }
    }
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: quantity });
            }

            return await cart.save();
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw new Error("Error al agregar producto al carrito");
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productExists = cart.products.some(p => p.product._id.toString() === productId);
            if (!productExists) {
                throw new Error("Producto no encontrado en el carrito");
            }

            await CartModel.findByIdAndUpdate(cartId, {
                $pull: { products: { product: productId } }
            });

            const updatedCart = await CartModel.findById(cartId);

            return updatedCart;
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            throw error;
        }
    }

    async updateCart(cartId, newProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            cart.products = newProducts;
    
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw new Error("Error al actualizar el carrito");
        }
    }
    

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }   
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
    
            if (productIndex > -1) {
                cart.products[productIndex].quantity = newQuantity;
            } else {
                cart.products.push({ product: productId, quantity: newQuantity });
            }
    
            await CartModel.findByIdAndUpdate(cartId, { products: cart.products });
    
            const updatedCart = await CartModel.findById(cartId);
            return updatedCart;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw new Error("Error al actualizar la cantidad del producto en el carrito");
        }
    }
    
    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) { 
                throw new Error("Carrito no encontrado");
            }
            cart.products = [];
            return await cart.save();
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            throw new Error("Error al vaciar el carrito");
        }
    }
    
}

export default CartManager;