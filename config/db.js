import mysql2 from "mysql2";
import { env } from "./env.js";

const db = mysql2
  .createPool({
    connectionLimit: 10,
    host: env.host, // Use this instead of "localhost"
    user: env.user,
    password: env.password, // The same password
    database: env.database,
    connectTimeout: 30000, // Increase timeout to 30 seconds
    timezone: "local",
  })
  .promise();

export default db;
