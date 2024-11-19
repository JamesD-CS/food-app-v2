import { Pool } from "pg";

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'db',
  port: 5432, // default Postgres port
  database: 'postgres'
});

export default pool