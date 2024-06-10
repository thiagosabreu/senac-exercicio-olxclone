import { Router } from "express";
import { signin, signup, signinv2,signupv2} from "../controllers/AuthController.js";
const router = Router();

router.post('/user/signin',signin);
router.post('/user/signup',signup);
router.post('/v2/user/signup',signupv2);
router.post('/v2/user/signin',signinv2);

export default router;