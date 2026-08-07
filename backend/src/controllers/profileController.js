const { collection } = require('../utils/db');
const { toPublicUser } = require('../models/User');

const Users = collection('users');

function getProfile(req, res) {
  res.json({ user: toPublicUser(req.user) });
}

function updateProfile(req, res, next) {
  try {
    const { name, headline, bio, location, interests, skills } = req.body;
    const patch = { updatedAt: new Date().toISOString() };
    if (name !== undefined) patch.name = name;
    if (headline !== undefined) patch.headline = headline;
    if (bio !== undefined) patch.bio = bio;
    if (location !== undefined) patch.location = location;
    if (interests !== undefined) patch.interests = interests;
    if (skills !== undefined) patch.skills = skills;

    const updated = Users.update(req.user.id, patch);
    if (!updated) return res.status(404).json({ message: 'Profile not found.' });
    res.json({ user: toPublicUser(updated) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile };
