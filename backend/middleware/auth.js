const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret-key';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token tidak ditemukan' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid' });

    req.user = user;
    next();
  });
};
