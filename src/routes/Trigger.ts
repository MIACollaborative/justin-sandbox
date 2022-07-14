import express from 'express';
import controller from '../controllers/Trigger';
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', controller.createTrigger);
router.get('/get/:triggerId', controller.readTrigger);
router.get('/get', controller.readAll);
router.patch('/update/:triggerId', controller.updateTrigger);
router.delete('/delete/:triggerId', controller.deleteTrigger);

export = router;
