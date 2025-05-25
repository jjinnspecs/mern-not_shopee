import express from 'express';
import { adminLogin,
    requestOTP,
    verifyOTP,
} from '../controller/auth.controller.js';

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/user/request-otp", requestOTP);
router.post("/user/verify-otp", verifyOTP);

export default router;