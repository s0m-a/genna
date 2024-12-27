import express from 'express';
import CartController from "../controller/cartController.js";
const router = express.Router();



//adding product to cart
router.post('/add', async (req, res)=>{
    const {UserId, productId, quantity} = req.body;
    try {
        const response = await CartController.addToCart({UserId, productId, quantity});
        if(response.status == 'success'){
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error adding to cart:', error);
        res.status(500).json(response);
    }

})

//updating quantity of product in cart
router.put('/update', async (req, res)=>{
    try {
        const {UserId, productId, quantity} = req.body;
        const response = await CartController.updateCartItem({UserId, productId, quantity});
        if(response.status == 'success'){
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error adding to cart:', error);
        res.status(500).json(response);
    }

})

//deleting product in cart
router.delete('/delete', async (req, res)=>{
    try {
        const {UserId, productId} = req.body;
        const response = await CartController.deleteCartItem({UserId, productId});
        if(response.status == 'success'){
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error deleting product in cart:', error);
        res.status(500).json(response);
    }
})

//retriving cart product and total price
router.get('/get', async (req, res)=>{
    try {
        const {UserId} = req.body;
        const response = await CartController.retrieveCartItems({UserId});
        if(response.status == 'success'){
            res.status(200).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error retriving product in cart:', error);
        res.status(500).json(response);
    }
})

export default router;