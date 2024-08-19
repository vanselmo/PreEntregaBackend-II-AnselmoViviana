import { Router } from 'express';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../util/util.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import ProductManager from '../dao/mongodb/product.manager.db.js';

const router = Router();

router.post("/register", async (req, res) => {

    const { username, password, first_name, last_name, age, email, role } = req.body;
    try {
        console.log("Entre aca");
        const usernameExist = await UserModel.findOne({ username });
        if (usernameExist) {
            return res.status(400).send("El usuario ya existe");
        }
        const newUser = new UserModel({
            username,
            password: createHash(password),
            first_name,
            last_name,
            age,
            email,
            role,
            cart: null
        })

        console.log("Antes del save");
        await newUser.save();
        console.log("Despues del save");

        const token = jwt.sign({ username: newUser.username, role: newUser.role }, 'codersecret', { expiresIn: '2h' });

        res.cookie('coderCookieToken', token, { httpOnly: true, secure: true, maxAge: 3600000 });

        res.redirect('/api/sessions/current');

    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userFounded = await UserModel.findOne({ username });
        if (!userFounded) {
            return res.status(401).send("Usuario no válido");
        }

        if (!isValidPassword(userFounded, password)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        const token = jwt.sign({ username: userFounded.username, role: userFounded.role }, 'codersecret', { expiresIn: '2h' });

        res.cookie('coderCookieToken', token, { httpOnly: true, secure: true, maxAge: 3600000 });

        res.redirect('/api/sessions/current');

    } catch (error) {
        console.error("Error al iniciar sesión", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
})


router.get("/current", passport.authenticate('jwt', { session: false }), async (req, res) => {

    if (req.user && req.user.role === "admin") {
        res.render("admin");
    }
    else {
        if (req.user) {
            try {
                const { page = 1, limit = 10 } = req.query;
                const productManager = new ProductManager();
                const products = await productManager.getProducts({
                    page: parseInt(page),
                    limit: parseInt(limit)
                });

                const newArray = products.docs.map(product => {
                    const { _id, ...rest } = product.toObject();
                    return rest;
                });

                res.render("home", {
                    user: req.user.username,
                    products: newArray,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    currentPage: products.page,
                    totalPages: products.totalPages
                });
            } catch (error) {
                console.error('Error al obtener los productos:', error);
                res.status(500).send('Error al obtener los productos');
            }
        } else {
            res.status(401).send("No autorizado");
        }
    }
});


router.post("/logout", (req, res) => {
    res.clearCookie('coderCookieToken');
    res.redirect('/login');
});

router.get("/admin", passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).send("No autorizado");
    }
    res.render("admin");
});

export default router