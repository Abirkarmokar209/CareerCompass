const bcrypt = require('bcryptjs');
const { collection } = require('../utils/db');
const { createUser, toPublicUser } = require('../models/User');
const { signToken } = require('../utils/jwt');

const Users = collection('users');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are all required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const existing = Users.find((u) => u.email === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({ name, email, passwordHash });
    Users.insert(user);
    const token = signToken({ id: user.id });
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = Users.find((u) => u.email === (email || '').toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    const token = signToken({ id: user.id });
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({ user: toPublicUser(req.user) });
}

module.exports = { register, login, me };
