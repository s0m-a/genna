// stockModel.js
import { DataTypes, Model } from 'sequelize';
import dbStorage from '../lib/db.js';
import Product from './product_model.js';

class Stock extends Model {}

/**
 * Stock Model Definition
 * Represents the stock of products in the fabric business.
 * 
 * Fields:
 * - id: Auto-incrementing integer that serves as the primary key for the Stock table.
 * - name: The name of the stock item, which cannot be null.
 * - price: The price of the stock item, allowing for decimal values and cannot be null.
 * - quantity: The quantity of the stock item, allowing for decimal values (for fractional measurements) and cannot be null.
 * - productId: A UUID that references the associated Product model, enforcing referential integrity.
 * - reorderLevel: An integer that indicates the stock level at which new stock should be ordered, with a default value of 10.
 * 
 * This model helps in managing and tracking stock items, ensuring that essential details 
 * such as pricing and quantity are maintained accurately.
 */


Stock.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate:{
            min: 0,
        },
      },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate:{
            min:0,
        },
    },
    productId: {
        type: DataTypes.UUID,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false,
      },
    reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
    },
}, {
    sequelize: dbStorage.db,
    modelName: 'Stock',
});

export default Stock;
