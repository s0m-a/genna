import { Model, DataTypes } from 'sequelize';
import dbStorage from '../lib/db.js';
import Order from './order_model.js';

class Payment extends Model {}

Payment.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Order,
                key: 'id',
            },
        },
        payment_method: {
            type: DataTypes.STRING(50),
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: dbStorage.db,
        modelName: 'Payment',
        tableName: 'Payments',
        timestamps: true,
    }
);

export default Payment;
