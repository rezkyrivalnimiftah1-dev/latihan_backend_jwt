//import
const jwt = require('jsonwebtoken');
const { on } = require('../config/db');
require('dotenv').config();

//cek jwt
const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret) throw new Error('jwt_secret belum diset di .env');

module.exports = function auth(req, res, next) {
    try {
        //ambil header authorization ; bearer <token>
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({message: 'no token provided'}); 

        const parts = authHeader.split(' ');
        if(parts.length!==2 || parts[0] !=='Bearer') {
            return res.status(401).json({message: 'invalid authorization header'});
        }
        const token = parts[1];

          // Verifikasi token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        // Simpan payload user pada req.user untuk controller
        req.user = { id: decoded.id, email: decoded.email };
        next();
    });
} catch (err) {
    next(err);
}
};