const { verifyToken } = require('../utils/jwt');
const { collection } = require('../utils/db');

const Users = collection('users');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'You need to sign in to continue.' });
  }

  try {
    const payload = verifyToken(token);
    const user = Users.find((u) => u.id === payload.id);
    if (!user) {
      return res.status(401).json({ message: 'This session is no longer valid. Please sign in again.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'This session has expired. Please sign in again.' });
  }
}

module.exports = { requireAuth };
