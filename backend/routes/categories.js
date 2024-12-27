import express from 'express';
const router = express.Router();

import CategoriesController from '../controller/categoriesController.js';



// adding categories
router.post('/categories', async (req, res)=>{
    const {name, description} = req.body;
    try {
        const response = await CategoriesController.CreateCategories({name, description});
            if(response.status == "success"){
                res.status(201).json(response);
            }else{
                res.status(400).json(response);
            }
        } 
    catch (error) {
            console.error('error logging in:',error);
            res.status(500).json({status: 'false', message:"server error"});
        }

    })

    
//deleting categories
    router.delete('/category/:id', async (req, res)=>{
        const {id} = req.params;
        try {
            const response = await CategoriesController.deleteCategories({id});
            if(response.status == 'success')
            {
                res.status(200).json(response);
            }else{
                res.status(404).json(response);
            }

        } catch (err) {
            res.status(500).json(response);
        }
        

    })

//updating catergories
router.put('/category/:id', async (req, res)=>{
    const {id} = req.params;
    const {name, description} = req.body;
    try{
        const response = await CategoriesController.updateCategories({id, name, description});
        if(response.status == 'error')
        {
           return  res.status(404).json(response);
        }
        if(response.status == 'success')
        {
            return res.status(200).json(response);
        }
    }catch(err)
    {
        res.status(500).json(response);
    }
 })

//retriving all the categories
router.get('/categories', async (req, res)=>{
    try {
        const response = await CategoriesController.getAllCategories();
        if(response.status == 'success')
        {
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        res.status(500).json(response);
    }
})

//get categories by id
router.get('category/:id', async (req, res)=>{
    const {id} = req.params;
    try {
        const response = await CategoriesController.getCategoryById(id);
        if(response.status == 'success')
        {
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        res.status(500).json(response);
    }
})



export default router;