'use strict';
const EducationService = require('../services/education.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class EducationController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get education list success',
            metadata: await EducationService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get education details success',
            metadata: await EducationService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create education success',
            metadata: await EducationService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update education success',
            metadata: await EducationService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete education success',
            metadata: await EducationService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new EducationController();
