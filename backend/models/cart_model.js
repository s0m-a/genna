import { DataTypes, Model } from "sequelize";
import dbStorage from "../lib/db.js";
import User from "./user_model.js";

class Cart extends Model {}
Cart.init({
    // Unique identifier for the cart item
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    UserId:{
        type: DataTypes.UUID,
        references:{
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    status:{
        type: DataTypes.ENUM('active', 'abandoned', 'purchased'),
        allowNull: false,
        defaultValue: 'active',
    },
},
{
    sequelize: dbStorage.db,
    modelName: 'Cart',
    tableName: 'Carts',
    timestamps: true,
}
);

export default Cart;
