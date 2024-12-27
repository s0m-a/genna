import Product from "../models/product_model.js";
import Cart from "../models/cart_model.js";
import User from "../models/user_model.js";
import CartItem from "../models/cartItem_model.js";
import Joi from 'joi';
import { Sequelize, Transaction } from "sequelize";
import dbStorage from "../lib/db.js";
import Categories from "../models/category_model.js";

export default class CartController {

    // validation schema for input data
    static validateCartData(data){

        const schema = Joi.object({
            UserId: Joi.string().guid({ version: ['uuidv4'] }).required(),
            productId: Joi.string().guid({ version: ['uuidv4'] }),
            quantity: Joi.number().integer().positive(),
        });
        return schema.validate(data)
    }

    //helper to fetch product by Id
    static async getProductById(data){
        const product = await Product.findByPk(data);
        if(!product){
            return ({status: 'error', message:`product not found`});
        }
        return product;
    }

    //helper to fetch existing cart by id
    static async getCartItem({ cartId, productid, transaction }){
        const cart = await CartItem.findOne({ where: { CartId: cartId, ProductId: productid}, transaction});
        return cart;
    }
    
    // helper to fetch card id
    static async getCart({userId, transaction}){
        let userCart = await Cart.findOne({ where: { UserId: userId }, transaction});
        // If not found, create a new cart
        if(!userCart){
            userCart = await Cart.create({UserId: userId}, { transaction});
            return userCart
    }
    return userCart;
}

    

    //method to add product to cart
    static async addToCart(data)
    {
        //validating the incoming data
        const {err}  = CartController.validateCartData(data);
        if (err) {
            return { status: 'error', message: err.details[0].message };
        }

    const { UserId, productId, quantity } = data;
    //start a transaction
     const transaction = await dbStorage.db.transaction();

try {
   // Validate product
    const product = await CartController.getProductById(productId);
    if (product.status === 'error') {
        return product;
    }
     // Validate user
    const user = await User.findByPk(UserId);
    if (!user) {
        await transaction.rollback();
        return { status: 'error', message: 'User not found.' };
        }
     // Get or create cart
    const userCart = await CartController.getCart({userId: UserId,
                                                  transaction
    });
    
    // Check if cart item exists
    console.log(` user id = ${userCart.id}`)
    let cartItem = await CartController.getCartItem({cartId:userCart.id, 
                                                     productid:productId,
                                                     transaction:transaction});
  
    if(cartItem){
     // Update quantity
    cartItem.quantity = parseFloat(cartItem.quantity) + parseFloat(quantity);
    cartItem.quantity = parseFloat(cartItem.quantity).toFixed(2);
     //saving the updated quantity
     await cartItem.save({transaction});
     await transaction.commit();
     return { status: 'success', 
              message: 'Product quantity updated in cart.',
              cartItem: cartItem };
    };
     // Add new cart item
    const createData={
        CartId: userCart.id,
        ProductId: productId,
        quantity,
        price: product.price
    }
    cartItem = await CartItem.create(createData, {transaction});
    await transaction.commit();

    return { status: 'success', 
        message: 'Product added to cart.', 
        cartItem: cartItem };
    } catch (error) {
    console.error('Error adding to cart:', error);
    return {
        status: 'error',
        message: 'Error adding to cart.',
        error: error.message,
    };
    }
 }


 static async updateCartItem(data){
    const {error} = CartController.validateCartData(data);
    if (error){
        return { status: 'error', message: error.details[0].message };
    }
    const{UserId, productId, quantity} = data;
    console.log(`user id is ${UserId}`);
    //starting transaction
   const transaction = await dbStorage.db.transaction();
try{
    // checking if quantity is a positive number
        if (quantity <= 0) {
            return { status: 'error', message: 'Quantity must be greater than zero.' };
        }

        // Find cart and cart item
        const userCart = await CartController.getCart({userId:UserId, transaction});
        if(!userCart){
            await transaction.rollback();
            return { status: 'error', message: 'Cart not found.' };
        }
        
        const cartItem = await CartController.getCartItem({cartId:userCart.id, 
                                                           productid:productId,
                                                     transaction:transaction});
        if (!cartItem) { 
           return { status: 'error', message: 'Cart item not found.' };
            }
        // Update quantity
        cartItem.quantity = quantity.toFixed(2);
        await cartItem.save({transaction});
        await transaction.commit();
        return { status: 'success', message: 'Cart updated successfully.' };    
        }    
    catch (error) {
            await transaction.rollback();
            return { status: 'error', message: 'Error updating cart.', error: error.message };
        }
    }
 

static async deleteCartItem(data){
    const {error} = CartController.validateCartData(data);
    if(error){
        return { status: 'error', message: error.details[0].message };
    }
    const{UserId, productId} = data;
    //start transaction
    const transaction = await dbStorage.db.transaction();
    try {
        const userCart = await CartController.getCart({userId: UserId, transaction});
        console.log(`cart id is ${userCart.id}`);
        let cartItem = await CartController.getCartItem({cartId:userCart.id, 
                                                         productid:productId,
                                                         transaction:transaction});
        await cartItem.destroy({transaction});
        await transaction.commit();
        return { status: 'success', message: `Product with ID ${productId} deleted from cart for user ${UserId}.` };
    } catch (error) {
        console.error('error deleting product from cart');
        return { status: 'error', message: `Error deleting product in cart: ${error.message}` };
    }

}


static async retrieveCartItems(data) {
    const { error } = CartController.validateCartData(data);
    if (error) {
        return { status: 'error', message: error.details[0].message };
    }
    const transaction = await dbStorage.db.transaction();
    try {
        const { UserId } = data;
        const user = await User.findByPk(UserId);
        if (!user) {
            transaction.rollback();
            return { status: 'error', message: 'User not found.' };
            }

        // Retrieve the user's cart
        const cart = await Cart.findOne({
            where: { UserId },
            include: [
                {
                    model: Product,
                    through: { attributes: ['quantity', 'price'] }, // Include the CartItem details
                    attributes: ['name', 'price','CategoryName'], //product column we want to access
                },
            ],
            transaction,
        });

        if (!cart) {
            await transaction.rollback(); 
            return { status: 'error', message: "Error retrieving cart items, empty cart" };
        }

        // Prepare the cart items and calculate the total price

        // Using Products (plural) instead of Product (singular) in retrieveCartItems reflects the relationship 
       // between the Cart and Product models in Sequelize, indicating that a cart can contain multiple products.

        const cartItems = cart.Products.map((item) => ({
            productName: item.name,
            quantity: item.CartItem.quantity, // Accessing CartItem's quantity
            unitPrice: item.price,
            totalPrice: item.CartItem.quantity * item.price, // Calculate total price
            CategoryName: item.CategoryName,
        }));
        if(cartItems == 0){
            transaction.rollback();
            return { status: 'error', message: "Error: cart empty" };
        }
        const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        await transaction.commit();
        return {
            status: "success",
            message: "Retrieved cart items",
            cartId: cart.id,
            items: cartItems,
            totalPrice,
        };
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return { status: 'error', message: "Error retrieving cart items" };
    }
}






}