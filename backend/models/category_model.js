// category_model.js
import { DataTypes, Model } from 'sequelize';
import dbStorage from '../lib/db.js';

class Categories extends Model {}

Categories.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: dbStorage.db,
    modelName: 'Category',
    tableName: 'Categories',
});

export default Categories;
