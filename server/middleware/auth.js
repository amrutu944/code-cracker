import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.',
    });
  }

  const jwtSecret = process.env.JWT_SECRET || 'code_cracker_super_secret_jwt_key_2026';

  jwt.verify(token, jwtSecret, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token. Please log in again.',
      });
    }

    req.user = decodedUser;
    next();
  });
}
