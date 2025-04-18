import { registerUser, loginUser } from '../services/auth.js';
export const registerController = async (req, res) => {
  await registerUser(req.body);

  res.json({
    message: 'Successfully registered a user!',
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);
};
