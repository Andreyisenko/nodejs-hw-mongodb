import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { registerController } from '../controllers/auth.js';
import { authRegisterSchema } from '../validation/auth.js';
const authRouter = Router();

authRouter.post(
  '/register',
  // validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

export default authRouter;
