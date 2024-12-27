import { Model, DataTypes } from 'sequelize';
import dbStorage from '../lib/db.js';
import Product from './product_model.js';
import Order from './order_model.js';

class OrderItem extends Model {}

OrderItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        OrderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Order,
                key: 'id',
            },
        },
        ProductId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Product,
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize: dbStorage.db,
        modelName: 'OrderItem',
        tableName: 'OrderItems',
        timestamps: true,
    }
);

export default OrderItem;
