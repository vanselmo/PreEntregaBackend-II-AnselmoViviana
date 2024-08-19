import ProductModel from "../models/product.model.js";

class ProductManager {
    async addProduct({ title, description, price, thumbnails, code, stock, category, status }) {
        try {
            if (!title || !description || !price || !code || !stock || !category || !status) {
                console.log("Todos los campos son obligatorios, excepto thumbnails");
                return;
            }

            const productExist = await ProductModel.findOne({ code: code });

            if (productExist) {
                console.log("El código del producto ya existe");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                thumbnails: thumbnails || [],
                code,
                stock,
                category,
                status: true,
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar el producto: ", error);
            throw error;
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }
            return product;
        } catch (error) {
            console.log("Error al traer un producto por id")
            throw error;
        }
    }

    async deleteProduct(id) {
        try {

            const erased = await ProductModel.findByIdAndDelete(id);

            if (!erased) {
                console.log("No es posible eliminar el producto");
                return null;
            } else {
                console.log("El producto ha sido eliminado");
                return erased;
            }
        } catch (error) {
            console.log("Error al eliminar el producto: ", error);
            throw error;
        }
    }

    async updateProduct(id, fields) {

        try {

            const product = await ProductModel.findByIdAndUpdate(id, fields);

            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }
            return product;

        } catch (error) {
            console.log("Error al actualizar el producto:", error);
            throw error;
        }
    }
}

export default ProductManager;
