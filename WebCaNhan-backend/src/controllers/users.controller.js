'use strict';
const UsersService = require('../services/users.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class UsersController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get users list success',
            metadata: await UsersService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get users details success',
            metadata: await UsersService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create users success',
            metadata: await UsersService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update users success',
            metadata: await UsersService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete users success',
            metadata: await UsersService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new UsersController();
