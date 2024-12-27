import express from 'express';
const router = express.Router();

import ProductController from '../controller/productController.js';



//adding product
router.post('/products', async (req, res)=>{
    const {name, description, price, stock, imageUrl,CategoryName,idfFeatured} = req.body;
    try {
        const response = await ProductController.addProduct({name, description, price, stock, imageUrl, CategoryName,idfFeatured});
        if(response.status == 'success')
        {
            res.status(201).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        res.status(500).json("error");
    }
})

//updating product
router.put('/product/:id', async (req, res) => {
    const {id} = req.params;
    const {feild} = req.body;
    try {
        const response = await ProductController.UpdateProduct({id, feild});
        if (response.status == 'success'){
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        res.status(500).json(response);
    }
})

//deleting product

router.delete('/product/:id', async (req, res)=>{
    const {id} = req.params;
    try {
        const response = await ProductController.deleteProduct(id);
        if(response.status == "success")
        {
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        res.status(500).json(response);
    }
})

//fetching all product
router.get('/product/products', async (req, res)=>{
    try {
        const response = await ProductController.getAllProduct();
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
//fecting product by id
router.get('/product/products/:id', async (req, res)=>{
    const {id} = req.params;
    try {
        const response = await ProductController.getAllProductById(id);
        if(response.status == "success")
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