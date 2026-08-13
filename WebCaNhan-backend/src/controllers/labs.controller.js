'use strict';
const LabsService = require('../services/labs.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class LabsController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get labs list success',
            metadata: await LabsService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get labs details success',
            metadata: await LabsService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create labs success',
            metadata: await LabsService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update labs success',
            metadata: await LabsService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete labs success',
            metadata: await LabsService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new LabsController();
