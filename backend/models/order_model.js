// order_model.js
import { DataTypes, Model } from 'sequelize';
import dbStorage from '../lib/db.js';
import User from './user_model.js';

class Order extends Model {}

Order.init(
    { 
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        UserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User, // Reference to User model
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM(
                'pending',
                'paid',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'returned'
            ),
            defaultValue: 'pending',
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        streetAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shippedAt: {
            type: DataTypes.DATE,
            allowNull: true, // Timestamp when marked as shipped
        },
        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true, // Timestamp when marked as delivered
        },
    },
    {
        sequelize: dbStorage.db,
        modelName: 'Order',
        tableName: 'Orders',
        timestamps: true,
    }
);

export default Order;

