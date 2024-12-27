import dbStorage from "../lib/db.js";
import User from "./user_model.js";
import { Model, DataTypes } from "sequelize";

class UserProfile extends Model{};

UserProfile.init(
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
                model: User,
                key: 'id',
            },
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
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

    },
    {
        sequelize: dbStorage.db,
        modelName: 'UserProfile',
        tableName: 'UserProfiles',
        timestamps: true,
    }
)

export default UserProfile;
