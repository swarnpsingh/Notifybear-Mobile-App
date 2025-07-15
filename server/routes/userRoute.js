import express from 'express';
import { googleLogin, saveSelectedCreators, getSelectedCreators, getUser } from '../controllers/userController.js';
const router = express.Router();
import passport from 'passport';

router.post('/google-login', googleLogin);
router.post('/save-selected-creators', saveSelectedCreators);
router.get('/get-selected-creators', getSelectedCreators);
router.get('/get-user', getUser);

export default router;