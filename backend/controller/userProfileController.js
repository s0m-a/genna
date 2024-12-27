import User from "../models/user_model.js";
import UserProfile from "../models/userProfile.js";
import dbStorage from "../lib/db.js";
import Joi from "joi";

export default class UserProfileController{


static validationProfile(data){
    const schema = Joi.object({
        
        UserId: Joi.string()
        .guid({version: ['uuidv4']})
        .message("invaild user id"),

        fullName: Joi.string()
        .min(3)
        .max(100)
        .messages({
            "string.empty": "Full name is required",
            "string.min": "Full name must be at least 3 characters long",
            "string.max": "Full name must be less than 100 characters",
        }),
        email: Joi.string()
        .email()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
        phoneNumber: Joi.string()
        .pattern(/^\+?\d+$/)
        .messages({
        "string.pattern.base": "Phone number must contain only numbers and can optionally start with a '+'",
        }),
        streetAddress: Joi.string()
        .max(200)
        .messages({
            "string.empty": "Street address is required",
            "string.max": "Street address must be less than 200 characters",
        }),
        city: Joi.string()
        .messages({
            "string.empty": "City is required",
        }),
    state: Joi.string()
        .optional()
        .messages({
            "string.empty": "State is optional but cannot be empty",
        }),
    country: Joi.string()
        .messages({
            "string.empty": "Country is required",
        }),
});
return schema.validate(data);
}


static async profile(data){
    const {error} = UserProfileController.validationProfile(data);
    if(error){
        return {status: 'error', message: error.details[0].message};
    };
    try{
    const{
        UserId,
        fullName,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        country,
    } = data;
    const transaction = await dbStorage.db.transaction();
    const user = await User.findByPk(UserId);
    if(!user){
        transaction.rollback();
        return {status: 'error', message: 'user not found'};
    }
    const existingProfile = await UserProfile.findOne({where: {UserId : UserId}});
    const profileData = {};

    // Only add fields to profileData if they are provided in the request
    if (fullName) profileData.fullName = fullName;
    if (email) profileData.email = email;
    if (phoneNumber) profileData.phoneNumber = phoneNumber;
    if (streetAddress) profileData.streetAddress = streetAddress;
    if (city) profileData.city = city;
    if (state) profileData.state = state;
    if (country) profileData.country = country;

    if(existingProfile){
        profileData.UserId = UserId;
        const userProfile = await UserProfile.update(profileData, { where: { UserId: UserId }});
        transaction.commit();
        return {status: 'success', message: 'user profile updated:', userProfile};
    }else{        
        profileData.UserId = UserId;
        const userProfile = await UserProfile.create(profileData);
        transaction.commit();
        return {status: 'success', message: 'user profile created:', userProfile};
    }
}catch(error){
    transaction.rollback();
    return {status: 'error', message: `error creating profile, error: ${error}`};
}


}








}