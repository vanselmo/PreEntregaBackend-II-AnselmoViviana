import { Router } from "express";
import ProductManager from "../dao/mongodb/product.manager.db.js";


const productManager = new ProductManager();
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

productsRouter.get("/:pid", async (req, res) => {

    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.status(404).json("No se encontro el producto");
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto: " });
    }
});

productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

productsRouter.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedFields = req.body;

    try {
        await productManager.updateProduct(id, updatedFields);
        res.json({
            message: "Producto actualizado"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar el producto: "
        });
    }
});
productsRouter.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el producto"
        });
    }
});

export default productsRouter;
