'use strict';
const ProjectsService = require('../services/projects.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class ProjectsController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get projects list success',
            metadata: await ProjectsService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get projects details success',
            metadata: await ProjectsService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create projects success',
            metadata: await ProjectsService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update projects success',
            metadata: await ProjectsService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete projects success',
            metadata: await ProjectsService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new ProjectsController();
