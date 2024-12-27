import dbStorage from "../lib/db.js";
import User from "../models/user_model.js";
import Product from "../models/product_model.js";
import Joi from "joi";
import CartItem from "../models/cartItem_model.js";
import Cart from "../models/cart_model.js";
import { Model } from "sequelize";
import Order from "../models/order_model.js";
import OrderItem from "../models/orderItem_model.js";
import UserProfile from "../models/userProfile.js";

export default class OrderController{
    //validating schema for input data
    static validateOrderData(data){
    const schema = Joi.object({
        UserId: Joi.string().guid({version: ['uuidv4']}),
        OrderId: Joi.string().guid({ version: ['uuidv4'] }),
        productId: Joi.string().guid({version: ['uuidv4']}),
 
    });
    return schema.validate(data);
    }


    static validateUdateOrderData(data){
        const schema = Joi.object({
            OrderId: Joi.string().guid({ version: ['uuidv4'] }).required(),
            status: Joi.string().valid(
                'pending',
                'paid',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'returned'
            ).optional(),
            shippedAt: Joi.string().optional(),
            deliveredAt: Joi.string().optional()
        }).custom((value, helpers) => {
            const { status, shippedAt, deliveredAt } = value;
            if (!status && !shippedAt && !deliveredAt) {
                return helpers.message('At least one of status, shippedAt, or deliveredAt must be provided');
            }
            return value; // Validation passed
        });
        return schema.validate(data);
    }

    static async createOrder(data){
        const{error} = OrderController.validateOrderData(data);
        if(error){
            return {status: 'error', message: error.details[0].message};
        }
      // Destructure required fields from the input data
        const {UserId} = data;
        const transaction = await dbStorage.db.transaction();
        try {
            //retrieve users
            const user = await User.findByPk(UserId);
            if(!user){
                await transaction.rollback();
                return {status: 'error', message: 'user not found'};
            }

            // retriving user's profile
            const userProfile = await UserProfile.findOne({ where: {UserId}});
            console.log(`user profile name ${userProfile.phoneNumber}`);
            if(!userProfile){
                await transaction.rollback();
                return {status: 'error', message: 'userProfile is incomplete, please complete your profile first'};
            }
            
            //retrieve user's cart
            const cart = await Cart.findOne({
                where:{UserId},
                include:{
                    model: Product,
                    through: {attributes: ['quantity', 'price']},
                },
            transaction,
            });
            if(!cart || !cart.Products.length){
                await transaction.rollback();
            return {status: 'error', message: 'cart is empty'};
            }
            //calculating total price
            const totalAmount = cart.Products.reduce( (sum, product) =>
            sum + product.CartItem.quantity * product.CartItem.price,
            0);


            //create order
            const createData = {
                UserId,
                totalAmount,
                phoneNumber: userProfile.phoneNumber,
                streetAddress: userProfile.streetAddress,
                city: userProfile.city,
                state: userProfile.state,
                country: userProfile.country,
            }
            const order = await Order.create(createData, {transaction});
            //add order items
            const orderItems = cart.Products.map( (items)=>({
                OrderId: order.id,
                ProductId: items.id,
                quantity:  parseInt(items.CartItem.quantity,10),
                price: items.price,
            }));
            await OrderItem.bulkCreate(orderItems,{transaction});
            //clear users's cart
            await cart.setProducts([], { transaction });
            await transaction.commit();
            return { status: 'success', message: 'Order created successfully.', orderId: order.id };

        } catch (error) {
            await transaction.rollback();
            return {status: 'error', message: 'Failed to create order, error:', error};
        }

    }



static async getOrder(data){
    const {error} = OrderController.validateOrderData(data);
    if(error){
        return {status: 'error', message: error.details[0].message};
    };
   const transaction = await dbStorage.db.transaction();
    try {
        const{OrderId} = data;
        console.log("Order not found for ID:", OrderId);
        const order = await Order.findOne({
            where: {id : OrderId},
            include:[
                {
                    model: Product,
                    through: {
                        attributes:['ProductId', 'quantity', 'price'],
                    },
                },
            ],
        });
        if(!order){
            await transaction.rollback();
            return {status: "error", message:"error order does not exist"};
        }
        await transaction.commit();
        return {status: "success", message:"user's order :",
            orderDetails: {
                UserId: order.UserId,
                status: order.status,
                shippedAt: order.shippedAt,
                deliveredAt: order.deliveredAt,
                products: order.Products.map(product => ({
                    productId: product.id,
                    name: product.name,
                    quantity: product.OrderItem.quantity, // Quantity from OrderItem
                    price: product.OrderItem.price, // P
            })),
            totalAmount: order.totalAmount,
        }
        };
    } catch (error) {
        await transaction.rollback();
        return {status: "error", message:"error reteriving user's order, error:",error}
    }
}


static async getOrderStatus(data){
    const{status} = data;
    const transaction = await dbStorage.db.transaction();
    try {
        if(status == 0){
            await transaction.rollback();
            return {status: 'error', message:"empty status input"};
        }
        const orderStatus = await Order.findAll({
            where: {status: status},
            transaction,
        });
        if(orderStatus.length === 0){
            await transaction.rollback();
            return {status: 'error', message:`No order found with ${status} status`};
        }
        await transaction.commit();
        return {status: 'success', message:"status retrived:", orderStatus};
    } catch (error) {
        await transaction.rollback();
        return {status: 'error', message:"error retrived order status"};
    }
}


static async updateOrder(data){
    const {error} = OrderController.validateUdateOrderData(data);
    if(error){
        return {status: 'error', message: error.details[0].message};
    };
    const{OrderId, status, shippedAt, deliveredAt} = data;

    try {
        //retrieve the order
        const order = await Order.findByPk(OrderId);
        if(!order){
            return {status: "error", message:`order not found`};
        }
        const updateData = {};
        if(status) updateData.status = status;
        if(shippedAt) updateData.shippedAt = shippedAt;
        if(deliveredAt) updateData.deliveredAt = deliveredAt;
        const update = await Order.update(updateData, {where: {id: OrderId}});
        return {status: "success", message:`order updated ${update}`};
    } catch (error) {
        return {status: "error", message:`error updating order:  ${error}`};
    }

}


}