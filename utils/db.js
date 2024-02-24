import mysql from "serverless-mysql";
const dbConfig={
  host:process.env.MYSQL_HOST,
  port:process.env.MYSQL_PORT,
  database:process.env.MYSQL_DATABASE,
  user:process.env.MYSQL_USER,
  password:process.env.MYSQL_PASSWORD
}
const db=mysql({
    config:dbConfig
})

export default async function executeQuery({ query, params }) {
    try {
      const results = await db.query(query, params);
      await db.end();
      return results;
    } catch (error) {
      return { error };
    }
  }