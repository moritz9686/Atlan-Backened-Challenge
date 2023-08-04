
import mysql from 'mysql2';
const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mohit123",
  database: "atlan",
});

pool.connect();

export default pool;