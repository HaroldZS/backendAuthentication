const jwt = require('jsonwebtoken');

const secret = 'myCat';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY5MTQ0NDk3M30.dCNv_UPGwKx9kzRUrO_KZVU-v8wqqlCknMXizIC8MAA'

function verifyToken(token, secret) {
  return jwt.verify(token, secret)
}

const payload = verifyToken(token, secret);
console.log(payload)
