import express from 'express';
import { analyzeHealth, chatResponse, getAllPatients } from '../controllers/predictionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', analyzeHealth);
router.post('/chat', chatResponse);
router.get('/patients', getAllPatients); // Doctor view route

export default router;
