import fs from 'fs/promises';

class CartManager {
    static lastId = 0;
    constructor(path) {
        this.carts = [];
        this.path = path;
    }
    async loadCarts() {
        try {
            const carts = await this.readFile();
            if (carts && carts.length > 0) {
                this.carts = carts;
                CartManager.lastId = Math.max(...carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carritos:", error);
        }
    }
    async createCart() {
        const data = await fs.readFile(this.path, 'utf-8').catch(() => '[]');
        this.carts = JSON.parse(data);

        const newCart = {
            id: ++CartManager.lastId,
            products: []
        };

        this.carts.push(newCart);
        await this.saveFile(this.carts);

        return newCart;
    }

    async getCartById(id) {
        const data = await fs.readFile(this.path, 'utf-8').catch(() => '[]');
        this.carts = JSON.parse(data);

        const cart = this.carts.find(cart => cart.id === parseInt(id));
        return cart || null;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const data = await fs.readFile(this.path, 'utf-8').catch(() => '[]');
        this.carts = JSON.parse(data);

        const cart = this.carts.find(cart => cart.id === parseInt(cartId));
        if (!cart) {
            console.log("Carrito no encontrado");
            return null;
        }

        const productInCart = cart.products.find(product => product.product === parseInt(productId));
        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveFile(this.carts);
        return cart;
    }

    async saveFile(arrayCarts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo:", error);
        }
    }
    async readFile() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            const array = JSON.parse(data);
            return array;
        } catch (error) {
            console.log("Error al leer el archivo:", error);
            return [];
        }
    }
}

export default CartManager;