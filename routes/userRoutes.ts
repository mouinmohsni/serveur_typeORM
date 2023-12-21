const express = require('express');
 const router = express.Router();
 const userController=require("../controllers/userController")
// const commendeController = require('../controllers/commendeController');

export =(()=>{
 router.get('/users',userController.getAllUsers);
 router.post('/register', userController.register)
 router.post("/login",userController.login)
 router.get('/user/:id_user',userController.getuserbyId);
 router.delete('/user/:id_user' ,userController.deleteUser)

 return router;
})();



