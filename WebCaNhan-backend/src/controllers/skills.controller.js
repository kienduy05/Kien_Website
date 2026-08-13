'use strict';
const SkillsService = require('../services/skills.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class SkillsController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get skills list success',
            metadata: await SkillsService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get skills details success',
            metadata: await SkillsService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create skills success',
            metadata: await SkillsService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update skills success',
            metadata: await SkillsService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete skills success',
            metadata: await SkillsService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new SkillsController();
