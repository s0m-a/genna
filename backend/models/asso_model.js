import User from "./user_model.js";
import Categories from "./category_model.js";
import Product from "./product_model.js";
import Cart from "./cart_model.js";
import Order from "./order_model.js";
import Stock from "./stock_model.js";
import CartItem from "./cartItem_model.js";
import OrderItem from "./orderItem_model.js";
import Payment from "./payment_model.js";
import UserProfile from "./userProfile.js";

// Associations
Categories.hasMany(Product, { foreignKey: 'CategoryId' });
Product.belongsTo(Categories, { foreignKey: 'CategoryId' });

User.hasMany(Cart, { foreignKey: 'UserId' });
Cart.belongsTo(User, { foreignKey: 'UserId' });

// Cart and Product Association (Many-to-Many)
Cart.belongsToMany(Product, { through: CartItem, foreignKey: 'CartId' });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: 'ProductId' });

// User to Order Association
User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });

// Order and Product Association (Many-to-Many), junction table: OrderItem
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'OrderId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'ProductId' });

// Order to Payment Association
Order.hasOne(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

// Stock to Product Association
Stock.belongsTo(Product, { foreignKey: 'productId' });

//user and userprofile association
User.hasOne(UserProfile, {foreignKey: 'UserId'});
UserProfile.belongsTo(User, {foreignKey: 'UserId'});

export { User, Categories, Product, Cart, Order, Stock, CartItem, OrderItem, Payment };
