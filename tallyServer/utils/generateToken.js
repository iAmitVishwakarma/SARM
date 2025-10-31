import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Pehle, apne .env file mein ek JWT_SECRET add karein.
// Jaise: JWT_SECRET=yoursecretkey123
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token 30 din mein expire hoga
  });

  // Hum token ko ek HTTP-Only cookie mein set karenge (yeh zyada secure hai)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Production mein HTTPS
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 din
  });
};

export default generateToken;