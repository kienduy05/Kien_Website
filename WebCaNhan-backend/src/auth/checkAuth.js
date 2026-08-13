'use strict';

const ApiKeyModel = require('../models/apiKey.model');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error - Missing API Key'
            });
        }

        const objKey = await ApiKeyModel.findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error - Invalid API Key'
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        next(error);
    }
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            });
        }

        // Try to parse permissions if it's a string, else array
        let permissionsArr = [];
        try {
            permissionsArr = typeof req.objKey.permissions === 'string' ? JSON.parse(req.objKey.permissions) : req.objKey.permissions;
        } catch (e) {
            permissionsArr = [];
        }

        const validPermission = permissionsArr.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission denied'
            });
        }
        return next();
    };
};

module.exports = {
    apiKey,
    permission
};
