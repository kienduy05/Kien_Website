'use strict';

const { getSqlPool, sql } = require('../dbs/init.sql');

class ApiKeyModel {
    static async findById(key) {
        const pool = await getSqlPool();
        const result = await pool.request()
            .input('key', sql.NVARCHAR, key)
            .query(`SELECT * FROM api_keys WHERE [key] = @key AND status = 1`);
        
        return result.recordset[0] || null;
    }
}

module.exports = ApiKeyModel;
