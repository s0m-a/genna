import { DataTypes, Model } from 'sequelize';
import dbStorage from '../lib/db.js';

class User extends Model {}


User.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('customer', 'admin'),
            defaultValue: 'customer',
        },
    },
    {
        sequelize: dbStorage.db,
        modelName: 'User',
        tableName: 'Users', // Specify the table name explicitly
    }
);
console.log(User === dbStorage.db.models.User); // true
export default User;
