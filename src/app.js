import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './dao/mongodb/product.manager.db.js';
import productsRouter from './routes/productRoutes.js';
import cartsRouter from './routes/cartRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import "./database.js";
import passport from 'passport';
import initalizePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';

const PORT = 8080;
const app = express();

app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
initalizePassport();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRoutes);
app.use("/api/sessions", sessionRoutes);

const httpServer = app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto " + PORT);
});

const productManager = new ProductManager();
const io = new Server(httpServer);
io.on('connection', async (socket) => {
    console.log('Usuario conectado');

    const products = await productManager.getProducts();

    socket.emit('products', products.docs);

    socket.on("deleteProducts", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("products", await productManager.getProducts());
    });

    socket.on("newProduct", async (product) => {
        await productManager.addProduct(product);
        io.sockets.emit("products", await productManager.getProducts());
    });
});
