import { Router } from "express";
import CartManager from "../dao/mongodb/cart.manager.db.js";
import CartModel from "../dao/models/cart.model.js";

const cartsRouter = Router();
const cartManager = new CartManager();

cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const id = req.params.cid;

    try {
        const cart = await CartModel.findById(id).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: "No existe un carrito con ese ID" });
        }
        return res.json(cart.products);
    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const cart = await cartManager.addProductToCart(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(400).send("Error: no se puede agregar el producto al carrito");
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const id = req.params.cid;
    try {
        await cartManager.emptyCart(id);
        res.json({
            message: "El carrito ha sido vaciado",
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al vaciar el carrito"
        });
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        await cartManager.deleteProductFromCart(cartId, productId);
        res.json({
            message: "El producto ha sido eliminado del carrito",
        });
    } catch (error) {
        res.status(400).json({
            error: "Error: no se pudo eliminar el producto del carrito",
        });
    }
});
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = parseInt(req.body.quantity);

    if (newQuantity < 0) {
        return res.status(400).json({ error: 'Por favor, proporciona una cantidad válida.' });
    }

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
        res.json({
            message: "La cantidad del producto ha sido actualizada correctamente.",
            cart: updatedCart
        });
    } catch (error) {
        res.status(400).json({
            error: "Hubo un problema al actualizar la cantidad del producto. Por favor, intenta de nuevo.",
        });
    }
});


cartsRouter.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    if (!Array.isArray(newProducts)) {
        return res.status(400).json({ error: 'Por favor, proporciona una lista de productos válida.' });
    }

    try {
        await cartManager.updateCart(cartId, newProducts);
        res.json({
            message: "El carrito ha sido actualizado",
        });
    } catch (error) {
        res.status(400).json({
            error: "Error: no se pudo actualizar el carrito",
        });
    }
});

export default cartsRouter;
