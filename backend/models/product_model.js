// fabric_model.js
import { DataTypes, Model } from 'sequelize';
import dbStorage from '../lib/db.js';
import Categories from './category_model.js';

class Product extends Model {}

Product.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    CategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Categories,
            key: 'id',
        },
    },
    CategoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Categories,
            key: 'name',
        },
    },
    idfFeatured:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: dbStorage.db,
    modelName: 'Product',
    tableName: 'Products',
});

export default Product;
