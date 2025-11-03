// demo user store - replace with DB calls
const bcrypt = require('bcryptjs');

const demoPasswordHash = bcrypt.hashSync('admin!@#123', 10);

const users = [
  { id: '1', email: 'rockharoon8200@gmail.com', passwordHash: demoPasswordHash, name: 'Haroon' },
  { id: '2', email: 'm.asad1856079@gmail.com', passwordHash: demoPasswordHash, name: 'Muhammad Asad' },
];

module.exports = {
  findByEmail: (email) => users.find(u => u.email === email),
};
