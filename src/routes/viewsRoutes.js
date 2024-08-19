import { Router } from 'express';
import ProductManager from '../dao/mongodb/product.manager.db.js';
import CartManager from '../dao/mongodb/cart.manager.db.js';

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/realtimeproducts', async (req, res) => {
   const { limit = 10, page = 1, sort, query } = req.query;

   try {
      const products = await productManager.getProducts({
         limit: parseInt(limit),
         page: parseInt(page),
         sort,
         query,
      });

      const newArray = products.docs.map(product => {
         return product._doc;
      });

      res.render(
         'realtimeproducts',
         {
            products: newArray,
            totalPages: products.totalPages,
            prevPage: products.prevPage || 1,
            nextPage: products.nextPage || null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null
         }
      );

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/", async (req, res) => {
   try {
      const { page = 1, limit = 10 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const newArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      res.render("home", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }

});

router.get("/carts/:cid", async (req, res) => {
   const id = req.params.cid;

   try {
      const cart = await cartManager.getCartById(id);
      if (!cart) {
         return res.status(404).json({ error: "No existe un carrito con ese ID" });
      }

      const products = cart.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));
      res.render("cart", { products: products });
   } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
   }

});


router.get("/login", (req, res) => {
   res.render("login");
});

router.get("/register", (req, res) => {
   res.render("register");
});

export default router