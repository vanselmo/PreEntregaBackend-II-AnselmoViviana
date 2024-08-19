import fs from 'fs/promises';

class ProductManager {
    static lastId = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async loadProducts() {
        try {
            const products = await this.readFile();
            if (products && products.length > 0) {
                this.products = products;
                ProductManager.lastId = Math.max(...products.map(product => product.id));
            }
        } catch (error) {
            console.log("Error al cargar los productos: ", error);
        }
    }

    async addProduct({title, description, price, thumbnails, code, stock, category, status}) {
        if (!title || !description || !price || !code || !stock || !category || !status) {
            console.log("Todos los campos son obligatorios, excepto thumbnails");
            return;
        }

        const data = await fs.readFile(this.path, 'utf-8').catch(() => '[]');
        this.products = JSON.parse(data);

        if (this.products.some(product => product.code === code)) {
            console.log("El código del producto ya existe");
            return;
        }

        const newProduct = {
            title,
            description,
            price,
            thumbnails: thumbnails || [],
            code,
            stock,
            category,
            status,
        };

        if (this.products.length > 0) {
            ProductManager.lastId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        }

        newProduct.id = ++ProductManager.lastId;


        this.products.push(newProduct);
        await this.saveFile(this.products);

        return newProduct;
    }

    async getProducts(limit) {
        const data = await fs.readFile(this.path, 'utf-8').catch(() => '[]');
        this.products = JSON.parse(data);
        return limit ? this.products.slice(0, limit) : this.products;
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === parseInt(id));
        if (!product) {
            console.log("Not found");
        } else {
            console.log("El producto buscado:", product);
        }
        return product;
    }

    async deleteProduct(id) {
        const data = await fs.readFile(this.path, 'utf-8').catch(() => '[]');
        this.products = JSON.parse(data);

        const index = this.products.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            console.log("Not found");
        } else {
            this.products.splice(index, 1);
            await this.saveFile(this.products);
        }
    }

    async updateProduct(id, fields) {
        const data = await fs.readFile(this.path, 'utf-8').catch(() => '[]');
        this.products = JSON.parse(data);

        const index = this.products.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            console.log("Not found");
        } else {
            const product = this.products[index];
            Object.keys(fields).forEach(field => {
                if (field !== 'id') {
                    product[field] = fields[field];
                }
            });
            await this.saveFile(this.products);
        }
    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
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

export default ProductManager;
