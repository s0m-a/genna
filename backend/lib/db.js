import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_DATABASE = process.env.DB_DATABASE || 'genna';
const DB_USER = process.env.DB_USER || 'soma';
const DB_PWD = process.env.DB_PWD || 'soma';

const DB_URL = `postgres://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

class DbStorage {
    constructor() {
        this.db = new Sequelize(DB_URL, { logging: console.log });
    }

    // Check if the connection to the database is established
    async checkLife() {
        try {
            await this.db.authenticate();
            console.log("Connection to the database successful");
            return true;
        } catch (err) {
            console.error("Unable to connect to the database:", err);
            return false;
        }
    }

    // Sync the database schema
    async sync(force = false) {
        try {
            await this.db.sync({ force });
            console.log("Database schema synchronized successfully");
        } catch (error) {
            console.error("Error synchronizing database schema:", error);
        }
    }

    // Close the database connection
    async close() {
        try {
            await this.db.close();
            console.log("Database connection closed.");
        } catch (error) {
            console.error("Error closing database connection:", error);
        }
    }
}

const dbStorage = new DbStorage();
export default dbStorage;
