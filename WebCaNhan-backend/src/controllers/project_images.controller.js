'use strict';
const ProjectImagesService = require('../services/project_images.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class ProjectImagesController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get project_images list success',
            metadata: await ProjectImagesService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get project_images details success',
            metadata: await ProjectImagesService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create project_images success',
            metadata: await ProjectImagesService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update project_images success',
            metadata: await ProjectImagesService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete project_images success',
            metadata: await ProjectImagesService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new ProjectImagesController();
