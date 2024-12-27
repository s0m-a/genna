import express, { response } from 'express';
import dbStorage from './lib/db.js';
import { User, Categories, Product } from './models/asso_model.js'; // Assuming models are imported from a single file
import AuthController from './controller/authController.js';
import authRoutes from './routes/auth.js';              // Import auth routes
import categoriesRoutes from './routes/categories.js';  // Import categories routes
import productRoutes from './routes/product.js'; // import product routes
import cartRoutees from './routes/cart.js'; //import cart routes
import OrderController from './controller/orderController.js';
import UserProfileController from './controller/userProfileController.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello world soma');
});


app.use('/api/', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutees);




app.post('/api/order/create', async (req, res)=>{
    const {UserId} = req.body;
    const response = await OrderController.createOrder({UserId});
    try {
        if(response.status == 'success'){
            res.status(201).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error creating order, error:', error);
        res.status(500).json(response);
    }
})



app.get('/api/order/get', async (req, res)=>{
    const {OrderId} = req.body;
    const response = await OrderController.getOrder({OrderId});
    try {
        if(response.status == 'success'){
            res.status(201).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error creating order, error:', error);
        res.status(500).json(response);
    }
})


app.get('/api/order/getStatus', async (req, res) => {
    const {status} = req.body;
    const response = await OrderController.getOrderStatus({status});
    try {
        if(response.status == 'success'){
            res.status(201).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error creating order, error:', error);
        res.status(500).json(response);
    }
})

app.put('/api/order/updateOrder', async (req, res) => {
    const {OrderId, status, shippedAt, deliveredAt} = req.body;
    const response = await OrderController.updateOrder({OrderId, status, shippedAt, deliveredAt});
    try {
        if(response.status == 'success'){
            res.status(201).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error creating order, error:', error);
        res.status(500).json(response);
    }
})





// token verification
const verifyToken = async (req, res, next)=>{
    const token = req.headers['authorization']?.split(' ')[1]; // extract token from header
    const response =  await AuthController.verifyToken({token});
    
    if(response.status == 'success'){
        req.user = response.decoded;
        res.status(201).json(response);
        next();
    }else{
        res.status(401).json(response);
    }
}






app.post('/api/user/profile', async (req, res)=>{
    const {
        UserId,
        fullName,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        country,
    } = req.body;
    const response = await UserProfileController.profile({
        UserId,
        fullName,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        country,
    });
    try {
        if(response.status == 'success'){
            res.status(201).json(response);
        }else{
            res.status(404).json(response);
        }
    } catch (error) {
        console.error('error creating order, error:', error);
        res.status(500).json(response);
    }
})


// Example of a protected route
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ status: 'success', message: 'Access granted', user: req.user });
});
























// Sync database and start server
app.listen(PORT, async () => {
    // Check if the database connection is alive
    const isDbAlive = await dbStorage.checkLife();
    if (!isDbAlive) {
        console.error('Database connection failed. Server cannot start.');
        return;
    }

    // Sync database schema after confirming connection
    try {
        await dbStorage.sync(false); // force = false for production-like behavior (no table drops)
        console.log('Database & tables created successfully!');
    } catch (error) {
        console.error('Error syncing the database:', error);
    }

    console.log(`Server is running on port ${PORT}`);
});
