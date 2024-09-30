// Router de products
import ProductManager from "../dao/db/product-manager-db.js" ;
import {Router} from "express";
import ProductModel from "../dao/models/product.model.js";
const productRouter = Router();

//Instanciamos nuestro manager de productos con el model.
const manager = new ProductManager();


// GET

//http://localhost:8080/api/products?limit=(numero que da el limite a mostrar).
// FALTA PODER APLICAR FILTROS EN LA API

productRouter.get('/', async (req, res) => {
    try {
        // Query params
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'price';
        const order = req.query.order === 'desc' ? -1 : 1;
        const category = req.query.category || '';

        // Filtro por categoría si se pasa en los query params
        const filter = {};
        if (category) {
            filter.category = category;
        }

        // Configuración de opciones para el método paginate
        const options = {
            limit,
            page,
            sort: { [sort]: order }, // Ordenamos por el campo y dirección especificados
            lean: true
        };

        // usamos paginacion
        const products = await ProductModel.paginate(filter, options);

        // Si no hay productos en la página actual
        if (products.docs.length === 0) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontraron productos en esta página'
            });
        }

       // respuesta con los datos con paginate.
        res.status(200).send({
            status: 'success',
            products: products.docs,
            pagination: {
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage
            }
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error del servidor al obtener los productos'
        });
        throw error;
    }
});






productRouter.get("/:pid", async (req,res) => {
    const {pid} = req.params;

    try {
        const productFound = await manager.getProductById(pid);
        if(!productFound) {
            res.send(`No hay productos con el id ${pid}`);
        } else {
            res.send(productFound);
        }
    } catch (error) {
        throw error;
        res.status(204).send("Error al buscar porductos con ese id")
    }
});

// POST

productRouter.post("/", async (req,res) => {
    const newProduct = req.body;

    try {
        if(!newProduct) {
            res.send("El producto que intenta crear esta vacio");
        } else {
            await manager.addProduct(newProduct);
            res.send("Se envio la solicitud exitosamente");
        }
    } catch (error) {
        throw error;
        res.status(500).send("No puede crearse el producto");
    }
});

// PUT

productRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const updateProduct = req.body;

    try {
        if (!updateProduct) {
        res.status(400).send("Se encuentra vacia la informacion a actualizar");
        return;
    }
    const productFound = await manager.getProductById(pid);
    if (!productFound) {
        res.status(404).send(`No se encontró producto con el id ${pid}`);
        return;
    }
        await manager.updateProduct(pid, updateProduct);
        res.send("Producto actualizado con exito!");
    } catch (error) {
        throw error;
        res.status(500).send("Error al actualizar el producto");
    }
});


// DELETE

productRouter.delete("/:pid", async (req,res) => {
    const {pid} = req.params;
    // Revisamos primero si hay un producto con ese id.
    const productFound = await manager.getProductById(pid);
    try {
        if(!pid){
            res.send("es necesario el id para poder eliminar el producto");
            return;
        }
        if(!productFound){
                res.status(404).send(`No se encontró producto con el id ${pid}`);
                return;
            } else {
                await manager.deleteProduct(pid);
                res.send("Producto eliminado de forma exitosa");
            }

    } catch (error) {
        throw error;
        res.send("No se pudo eliminar el producto");
    }
})

export default productRouter;