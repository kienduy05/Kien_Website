'use strict';
const AccessService = require('../services/access.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login success',
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
    
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }
}
module.exports = new AccessController();
