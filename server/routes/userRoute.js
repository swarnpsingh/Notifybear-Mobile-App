import express from 'express';
import { googleLogin, saveSelectedCreators } from '../controllers/userController.js';
const router = express.Router();
import passport from 'passport';

router.post('/google-login', googleLogin);
router.post('/save-selected-creators', saveSelectedCreators);

export default router;