const { v4: uuid } = require('uuid');

/**
 * Creates a new user record.
 * @param {{name:string,email:string,passwordHash:string}} data
 */
function createUser({ name, email, passwordHash }) {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    headline: '',
    bio: '',
    location: '',
    interests: [],
    skills: [], // [{ name, level }] level: 1-5
    avatarColor: pickAvatarColor(name),
    createdAt: now,
    updatedAt: now,
  };
}

function pickAvatarColor(name = '') {
  const palette = ['#C08A3E', '#4C6E5D', '#B5573B', '#5B6470', '#8C6A9C', '#2E6E8E'];
  const code = name.charCodeAt(0) || 0;
  return palette[code % palette.length];
}

// Never send the password hash to the client.
function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { createUser, toPublicUser };
