import Product from "../models/product_model.js";
import Categories from "../models/category_model.js";
import Stock from "../models/stock_model.js";
import dbStorage from "../lib/db.js";
export default class ProductController{
 
/**
 * Adds a new product and its corresponding stock entry to the database.
 * 
 * This method performs the following actions:
 * 1. Validates that all required fields are provided in the input data.
 * 2. Checks if the specified category exists in the Categories table.
 * 3. Ensures that a product with the same name does not already exist.
 * 4. Creates a new product entry in the Product table.
 * 5. Creates a corresponding stock entry in the Stock table, linking it to the newly created product.
 * 6. Uses a database transaction to ensure atomicity; if any part of the process fails, all changes are rolled back.
 * 
 * @param {Object} data - The product data to be added.
 * @returns {Object} - An object indicating success or failure, with a message and the created product if successful.
 */
    static async addProduct(data){
         // Validate required fields
        const {name, description, price, stock, imageUrl,CategoryName,idfFeatured} = data;
        const transaction = await dbStorage.db.transaction(); // Start a transaction
        try {
            for(const key of ['name', 'description', 'price', 'stock','CategoryName','idfFeatured'])
            {
                if(!data[key]){
                    return ({status: 'error', message:`feild '${key}' is required`});
                }
            }
            
            // Check if category exists
            const category= await Categories.findOne({where:{name:CategoryName}, transaction})
            if(!category)
            {
                return ({status: 'error', message:`category not found, please check the name`});
            }
            
             // Check if product name already exists
            const categoryId = category.id;
            const categoryName = category.name;
          const product = await Product.findOne({where: {name:name}});
          if (product){
            return ({status: 'error', message:`product name aready exits, please check the name`});
          }
        
         // Prepare product creation data
            const createData = 
            {
                name,
                description,
                price,
                stock,
                imageUrl,
                CategoryId: categoryId,  // Use CategoryId, as defined in your model
                CategoryName: categoryName,
                idfFeatured,
            }

            const newProduct = await Product.create(createData, {transaction});

            //Create corresponding stock entry
            await Stock.create({
                productId: newProduct.id,
                price:price,
                quantity: stock,
                name: newProduct.name
            }, {transaction});

            await transaction.commit();
            return ({status: 'success', message:`product created:`, newProduct});
        } catch (err) {
            await transaction.rollback();
            return ({status: 'error', message:`error creating product, error: ${err}`});
        }
        
    }

  /**
 * Updates an existing product in the database.
 * @param {Object} data - The product data containing the fields to be updated.
 * @param {number} data.id - The ID of the product to be updated.
 * @param {Object} data.field - The fields to update (e.g., name, description, price).
 * @returns {Object} - The status of the update operation and any relevant messages.
 * 
 * This method checks if the product exists by its ID, validates the fields to update,
 * and applies the changes. If successful, it returns a success message; otherwise,
 * it returns an error message.
 */

    static async UpdateProduct(data){
        const {id, feild} = data;
        try {
            const product = await Product.findByPk(id);
            if(!product)
            {
            return ({status: 'error', message:`cant find product`});
            }
            const updateData = {}; // Update only the provided fields
            if(feild.name) updateData.name = feild.name; //Update if the name is provided
            if(feild.description) updateData.description = feild.description; //Update if the description is provided
            if(feild.price) updateData.price = feild.price; //Update if the price is provided
            if(feild.stock) updateData.stock = feild.stock; //Update if the stock is provided
            if(feild.imageUrl) updateData.imageUrl = feild.imageUrl; //Update if the imageurl is provided
            if(feild.CategoryName) updateData.CategoryName = feild.CategoryName; //Update if the categoryName is provided
            if(feild.idfFeatured) updateData.idfFeatured = feild.idfFeatured;
         // only Update if there are feilds to update
         if (Object.keys(updateData).length > 0){
            await Product.update(updateData, {where: {id: product.id}});

        // Update stock if stock field is provided
                if (feild.stock) {
                    const stock = await Stock.findOne({ where: { productId: product.id } });
                    if (stock) {
                        await Stock.update({ quantity: feild.stock }, { where: { productId: product.id } });
                    }
                }
            
            return { status: 'success', message: 'Product updated successfully' };
         }else {
            return { status: 'error', message: 'No fields provided for update' };
        }
        } catch (error) {
            console.error("Error updating product:", error);
            return res.status(500).json({ status: 'error', message: 'Error updating product', error });
        }
    }
/**
 * Deletes a product from the database.
 * @param {number} id - The ID of the product to be deleted.
 * @returns {Object} - The status of the delete operation and any relevant messages.
 * 
 * This method checks if the product exists before attempting to delete it.
 * If the product is successfully deleted, it returns a success message; 
 * if not, it returns an error message indicating the failure.
 */


   static async  deleteProduct (data)
   {
    const id = data;
    if(!id){
        return ({status: 'error', message:`product id not provided:`});
    }
    try {
        const product = await Product.findByPk(id);
        if(!product){
            return ({status: 'error', message:`cant find product`});
        }
        const productName = product.name;

        // Find and delete associated stock entry
        await Stock.destroy({ where: { productId: id } });

        await product.destroy({where: {id}});
        return ({status: 'success', message:` '${productName}' product has been deleted`});
    } catch (error) {
        return ({status: 'error', message:`error deleting product, error: ${error}`});
    }
   }
/**
 * Retrieves all products from the database.
 * @returns {Object} - The status of the retrieval operation and the list of products.
 * 
 * This method fetches all products along with their attributes 
 * (name, price, stock, description). It returns a success message with the products 
 * if found; otherwise, it returns an error message.
 */


   static async getAllProduct()
   {
    try {
        const products = await Product.findAll(
            {attributes:['name', 'price', 'stock', 'description']}
        );
        if(!products){
            return ({status: 'error', message:`no products found`});
        }
        return ({status: 'success', message:`products:`,products});
    } catch (error) {
        return ({status: 'error', message:`error deleting product, error: ${error}`});
    }
   }

  /**
 * Retrieves a specific product by its ID from the database.
 * @param {Object} data - The request data containing the product ID.
 * @param {number} data.id - The ID of the product to retrieve.
 * @returns {Object} - The status of the retrieval operation and the product details.
 * 
 * This method checks if the product exists by its ID and returns the product details 
 * if found; otherwise, it returns an error message indicating the product was not found.
 */


   static async getAllProductById(data){
    const {id} = data;
    if(!id){
        return ({status: 'error', message:`product id not provided:`});
    }
    try {
        const productId = await Product.findByPk(id);
        if(!productId){
            return ({status: 'error', message:`product not found`});
        }
        return ({status: 'success', message:`product found:`, productId});
    } catch (error) {
        return ({status: 'error', message:`error fetching product, error: ${error}`});
    }


   }

}