// buat promise
const mysql = require('mysql2/promise');
require('dotenv').config();

//cek koneksi database
const dburl = process.env.DATABASE_URL || '';
if(!dburl){
    throw new Error('database_url belum diset di .env');
    
}

const url  = new URL (dburl);

//koneksi crud
const pool =mysql.createPool ({
    host : url.hostname,
    user : url.username,
    password : url.password,
    database : url.pathname.replace(/^\//,''), // path tanpa leading slash => dbname
    port : url.port ?Number(url.port) : 3306,
    waitForConnections : true,
    connectionLimit :10,
    queueLimit :0
});

//export koneksi
module.exports = pool;