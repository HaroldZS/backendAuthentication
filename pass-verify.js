const bcrypt = require('bcrypt');

async function verifyPassword() {
  const myPassword = 'admin 123 .202';
  const hash = '$2b$10$q4kp55Fiv1to9ScueHb0GuhkMz4WRmBmJbFvXIhbgeQdba9WSCyIG';
  const isMatched = await bcrypt.compare(myPassword, hash);
  console.log(isMatched);
}

verifyPassword();
