import { DataTypes, Model } from "sequelize";
import dbStorage from "../lib/db.js";
import Cart from "./cart_model.js";
import Product from "./product_model.js";

class CartItem extends Model{};

CartItem.init({

    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    CartId:{
        type: DataTypes.UUID,
        references:{
            model: Cart,
            key: "id",
        },
        allowNull: false,
    },

    ProductId:{
        type: DataTypes.UUID,
        references:{
            model: Product,
            key: "id",
        },
        allowNull: false,
    },

    quantity: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 1.00,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
},
{
    sequelize: dbStorage.db,
    modelName: 'CartItem',
    tableName: 'CartItems',
    timestamps: true,
}
);

export default CartItem;