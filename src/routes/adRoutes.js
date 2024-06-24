import { Router } from 'express';
import { authPrivate } from '../middlewares/Auth.js';
import { getCategories } from '../controllers/AdController.js';
import { create } from '../controllers/AdController.js';

const router = Router();

router.post('ads/add', authPrivate, create);
// router.get('ads/list', getList);
// router.get('ad/:id', getItem);

// router.post('ad/:id', authPrivate, update);

// Categories

router.get('/categories', getCategories)


export default router;