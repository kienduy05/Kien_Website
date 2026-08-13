'use strict';
const ProjectTechnologiesService = require('../services/project_technologies.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class ProjectTechnologiesController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get project_technologies success',
            metadata: await ProjectTechnologiesService.getAll()
        }).send(res);
    }
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get project_technologies by id success',
            metadata: await ProjectTechnologiesService.getById(req.params.id)
        }).send(res);
    }
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete project_technologies success',
            metadata: await ProjectTechnologiesService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new ProjectTechnologiesController();
