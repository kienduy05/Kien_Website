'use strict';
const ExperiencesService = require('../services/experiences.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class ExperiencesController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get experiences list success',
            metadata: await ExperiencesService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get experiences details success',
            metadata: await ExperiencesService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create experiences success',
            metadata: await ExperiencesService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update experiences success',
            metadata: await ExperiencesService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete experiences success',
            metadata: await ExperiencesService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new ExperiencesController();
