/**
 *  handles user authentication logic, such as
 * registering users,
 * logging in,
 * logging out.
 */
import bcrypt from 'bcrypt'
import jwt, { decode } from 'jsonwebtoken'
import User from "../models/user_model.js";
import dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();

export default class AuthController{

    static SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';
    static EXPIRATION = process.env.EXPIRATION || '1h'


    // static validateAuthData(data){
    //     const schema = Joi.object({
    //         name: Joi.string().alphanum().min(3).max(40).required(),
    //         email: Joi.string().email().required(),
    //         password: Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/)).required(),
    //         role: Joi.string(),
    //     });
    //     return schema.validate(data)
    // }



    /**
     * signup function to register users
     * @param {*} data users input
     */
    static async signUp(data){
    /**
     * The line below  uses destructuring assignment, a convenient way to extract properties from objects in JavaScript.
    */
        const { name, email, password, role } = data;

        for (const key of ['name','email','password']){
            if(!data[key]){
                return ({status: 'error', message:`feild ${key} is required`});
            }
        }

    // Check if role is valid (optional, but good for safety)
        const validRoles = ['customer', 'admin'];
        const userRole = validRoles.includes(role) ? role : 'customer'; // Default to customer if invalid
    /** checking if the username is already in the database  */
        if (await User.findOne({where: {name}})){
            return ({status: 'error', message:`username already exists`});
        }


    /** checking if the email is already in the database */
       if (await User.findOne({where: {email}})){
        return ({status: 'error', message:`email already exists`});
       }
    
    /**  checking the strength of the password
     * - password must be 8-20 characters long and contain at least one letter
     * - and one number
    */
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if(!passwordRegex.test(password))
    {
        return ({status: 'error', message:`password must be 8-20 characters long and contain at least one letter and one number`});
    }
    /** hashing the password */
    const hashedPassword = await bcrypt.hash(password, 10);

       const createData = {
        name,
        email,
        password : hashedPassword,
        role : userRole,
       };
       

       try {

        const user = await User.create(createData);
        return ({status: 'success', message:`user created`, id: user.id});

       } catch (error) {
        console.error('error creating user, error:',error);
        return ({status: 'error', message:"failed to create user"});
       }
}

static async logIn(data){
    /**
     * user authnatication
     */
    const {name, password} = data;
    for(const key of ['name', 'password']){
        if(!data[key]){
            return ({status: 'error', message:`feild ${key} is required`});
        }
    }
    const user = await User.findOne({where: {name}});
    if(!user){
        return ({status: 'error', message:`username or password is not correct`});
    };

    const comparePassword = await bcrypt.compare(password, user.password);
    if(!comparePassword){
        return ({status: 'error', message:`username or password is not correct`});
    };
/**
 * generating token
 */
const token = jwt.sign(
    {
        id: user.id,
        name: user.name,
        role: user.role,   
    },
    this.SECRET_KEY,
    {expiresIn: '1h'}
);
return ({ status: 'success', message: `Welcome back ${user.name}, token: `, token });
        
}


static async verifyToken(data)
{
    const{token} = data;
    if(!token)
    {
        return ({status: 'error', message:`no token was provided`});
    }
   //verifying token
   try {
    const decoded = jwt.verify(token, this.SECRET_KEY);
    return ({status: 'success', message:`token is valid`, decoded});
   } catch (err) {
    return ({status: 'error', message:`Unauthorized: ${err.message}`});
   }
 
}

}


