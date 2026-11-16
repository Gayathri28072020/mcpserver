
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

async function connectDB() {
    try {
        const pool = await sql.connect(config);

        console.log('SQL Server Connected Successfully!');

        const result = await pool.request().query(
            'SELECT GETDATE() AS CurrentDate'
        );

        console.log(result.recordset);

        await pool.close();

    } catch (err) {
        console.error('Connection Failed:', err.message);
    }
}

connectDB();
