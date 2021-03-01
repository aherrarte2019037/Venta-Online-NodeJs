import express from 'express';
import UserController from '../controllers/user.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import Passport from 'passport';


const router = express.Router();


router.get('/bill', AuthMiddleware.authorizeClient, async(req, res) => {

    try {
        const id = req.user.id;
        const response = await UserController.getBills( id );
        res.status(200).send(response);

    } catch (error) {
        res.status(500).send(error)
    }

});


router.get('/bill/:id', AuthMiddleware.authorizeClient, async(req, res) => {

    try {
        const userId = req.user.id;
        const billId = req.params.id;
        const response = await UserController.getBillById( userId, billId );
        res.status(200).send(response);

    } catch (error) {
        res.status(500).send(error)
    }

});


router.post('/register', AuthMiddleware.registerAdmin, async(req, res) => {

    try {
        const data = req.body;
        const response = await UserController.register( data );
        res.status(200).send(response);
        
    } catch(error) {
        res.status(500).send({ registered: false, error: error });
    }
    
});


router.post('/login', (req, res) => {

    Passport.authenticate( 'authenticate_user', {session: false}, (error, user, message) =>{
        
        if(error || !user) {
            res.status(500).send(message);

        } else {
            res.status(200).send(message);
        }

    })(req, res);

});


router.put('/:id', AuthMiddleware.checkUserRole, async(req, res) => {

    try {
        const id = req.params.id
        const data = req.body;
        const response = await UserController.updateById( id, data );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({  updated: false, error: error });
    }

});


router.delete('/:id', AuthMiddleware.checkUserRole, async(req, res) => {

    try {
        const id = req.params.id
        const response = await UserController.deleteById( id );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({  deleted: false, error: error });
    }

});


router.post('/cart', AuthMiddleware.authorizeClient, async(req, res) => {

    try {
        const id = req.user.id;
        const product = req.body.product;
        const quantity = req.body.quantity;
        const response = await UserController.addProduct( id, product, quantity );

        res.status(200).send(response);

    } catch(error) {
        res.status(200).send({ productAdded: false, error: error });
    }

});


router.delete('/cart/:product', AuthMiddleware.authorizeClient, async(req, res) => {

    try {
        const id = req.user.id;
        const product = req.params.product;
        const quantity = req.body.quantity;
        const response = await UserController.deleteProductById( id, product, quantity );

        res.status(200).send(response);

    } catch(error) {
        res.status(200).send({ productDeleted: false, error: error });
    }

});


export default router;