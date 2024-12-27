import express from 'express';
import AuthController from '../controller/authController.js';
const router = express.Router();


router.post('/auth/register',async (req, res)=>{
    const {name, email, password,role} = req.body;
    try{
        const response = await AuthController.signUp({name, email, password,role});
        if(response.status === "sucess"){
            res.status(201).json(response);
        }else{
            res.status(400).json(response);
        }
    }catch (err){
        console.error('Registration error:', err);
        res.status(500).json({status: 'false', message: 'server error'});
    }
});

router.post('/auth/login', async (req, res)=>{
    const {name, password} = req.body;
    try {
        const response = await AuthController.logIn({name, password});
        if(response.status == "success"){
            res.status(201).json(response);
        }else{
            res.status(400).json(response);
        }
    } catch (error) {
        console.error('error logging in:',error);
        res.status(500).json({status: 'false', message:"server error"});
    }
})

export default router;