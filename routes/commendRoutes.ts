
import express from 'express';
const router = express.Router();
const commendeController = require('../controllers/commendeController');
export =(()=>{
        router.post('/commende', commendeController.newCommende);
        router.get('/commende/:commendeId', commendeController.getCommendeByID);
        router.get('/commende', commendeController.getAllCommende);
        router.delete('/commende/:id_commende', commendeController.deletecommende)

    return router;
})();


