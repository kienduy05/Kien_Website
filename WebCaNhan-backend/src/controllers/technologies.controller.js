'use strict';
const TechnologiesService = require('../services/technologies.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class TechnologiesController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get technologies list success',
            metadata: await TechnologiesService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get technologies details success',
            metadata: await TechnologiesService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        const payload = { ...req.body };
        if (req.file) {
            payload.icon_url = req.file.filename;
        }

        new CREATED({
            message: 'Create technologies success',
            metadata: await TechnologiesService.create(payload)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        const payload = { ...req.body };
        if (req.file) {
            payload.icon_url = req.file.filename;
        }

        new SuccessResponse({
            message: 'Update technologies success',
            metadata: await TechnologiesService.update(req.params.id, payload)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete technologies success',
            metadata: await TechnologiesService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new TechnologiesController();
