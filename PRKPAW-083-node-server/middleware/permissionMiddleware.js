const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'RA_SECRET_KEY_2024'; 
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (!authHeader) {
    return res.status(401).json({ message: 'Akses ditolak: Token tidak disediakan.' });
  }


  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
  
    return res.status(401).json({ message: 'Format token tidak valid. Gunakan format "Bearer <token>".' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      
      console.error('JWT Error:', err.message);
      return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
    }

    
    req.user = decoded; 
    next();
  });
};


exports.isAdmin = (req, res, next) => {
  
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
   
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin.' });
  }
};


exports.generateToken = (userPayload) => {
  
  return jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1d' });
};