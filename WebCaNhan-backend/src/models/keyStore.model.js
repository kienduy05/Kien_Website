'use strict';

const { getSqlPool, sql } = require('../dbs/init.sql');

class KeyStoreModel {
    static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
        try {
            const pool = await getSqlPool();
            const result = await pool.request()
                .input('userId', sql.INT, userId)
                .input('publicKey', sql.NVARCHAR, publicKey)
                .input('privateKey', sql.NVARCHAR, privateKey)
                .input('refreshToken', sql.NVARCHAR, refreshToken)
                .query(`
                    IF EXISTS (SELECT * FROM key_tokens WHERE user_id = @userId)
                    BEGIN
                        UPDATE key_tokens 
                        SET public_key = @publicKey, private_key = @privateKey, refresh_token = @refreshToken, updated_at = GETDATE()
                        WHERE user_id = @userId
                    END
                    ELSE
                    BEGIN
                        INSERT INTO key_tokens (user_id, public_key, private_key, refresh_token, refresh_tokens_used)
                        VALUES (@userId, @publicKey, @privateKey, @refreshToken, '[]')
                    END
                `);
            return result;
        } catch (error) {
            return error;
        }
    }

    static async findByUserId(userId) {
        const pool = await getSqlPool();
        const result = await pool.request()
            .input('userId', sql.INT, userId)
            .query(`SELECT * FROM key_tokens WHERE user_id = @userId`);
        
        return result.recordset[0] || null;
    }

    static async removeKeyById(id) {
        const pool = await getSqlPool();
        const result = await pool.request()
            .input('id', sql.INT, id)
            .query(`DELETE FROM key_tokens WHERE key_token_id = @id`);
        return result;
    }
}

module.exports = KeyStoreModel;
