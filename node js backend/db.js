
require('dotenv').config();

const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString:
        `Driver={ODBC Driver 17 for SQL Server};` +
        `Server=${process.env.DB_SERVER};` +
        `Database=${process.env.DB_NAME};` +
        `Trusted_Connection=Yes;` +
        `TrustServerCertificate=Yes;`
};

let poolPromise;

async function connectDB() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('SQL Server Connected Successfully!');
                return pool;
            })
            .catch(error => {
                poolPromise = null;
                throw error;
            });
    }

    return poolPromise;
}

module.exports = { sql, connectDB };
