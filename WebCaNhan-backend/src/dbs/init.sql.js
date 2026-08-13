'use strict';

const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '123456',
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'personal_portfolio',
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        this.poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('Connected to SQL Server - Database Layer Initialized!');
                return pool;
            })
            .catch(err => {
                console.log('Database Connection Failed! Bad Config: ', err);
                process.exit(1);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async getPool() {
        return await this.poolPromise;
    }
}

const instanceSql = Database.getInstance();

module.exports = {
    sql,
    getSqlPool: async () => await instanceSql.getPool()
};
