'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyStoreModel = require('../models/keyStore.model');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Access token is signed with publicKey as secret (for simplicity) or privateKey
        // Note: eCommerce sample uses symmetric encryption (same secret) for both if not RS256. 
        // We'll use publicKey for access, privateKey for refresh as string secrets.
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request - Missing Client ID');

    const keyStore = await KeyStoreModel.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keystore');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request - Missing Token');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.public_key);
        if (userId != decodeUser.userId) throw new AuthFailureError('Invalid User');
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            throw new AuthFailureError('Token is invalid or expired');
        }
        throw error;
    }
});

module.exports = {
    createTokenPair,
    authentication
};
