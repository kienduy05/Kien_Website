'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyStoreModel = require('../models/keyStore.model');
const { createTokenPair } = require('../auth/authUtils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { getSqlPool, sql } = require('../dbs/init.sql');

class AccessService {
    static async login({ username, password }) {
        if (!username || !password) {
            throw new BadRequestError('Username and password are required');
        }

        // 1. Check user exists
        const pool = await getSqlPool();
        const userResult = await pool.request()
            .input('username', sql.NVARCHAR, username)
            .query('SELECT * FROM users WHERE username = @username');
        
        const user = userResult.recordset[0];
        if (!user) {
            throw new BadRequestError('Error: User not registered!');
        }

        // 2. Check password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            throw new AuthFailureError('Authentication Error');
        }

        // 3. Create PrivateKey, PublicKey
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // 4. Generate Tokens
        const tokens = await createTokenPair({ userId: user.id, username }, publicKey, privateKey);

        // 5. Save KeyStore
        await KeyStoreModel.createKeyToken({
            userId: user.id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });

        return {
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            },
            tokens
        };
    }

    static async logout(keyStore) {
        if(!keyStore || !keyStore.key_token_id) {
            throw new BadRequestError('Invalid keystore');
        }
        const delKey = await KeyStoreModel.removeKeyById(keyStore.key_token_id);
        return delKey;
    }
}

module.exports = AccessService;
