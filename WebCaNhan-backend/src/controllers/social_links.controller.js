'use strict';
const SocialLinksService = require('../services/social_links.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class SocialLinksController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get social_links list success',
            metadata: await SocialLinksService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get social_links details success',
            metadata: await SocialLinksService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create social_links success',
            metadata: await SocialLinksService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update social_links success',
            metadata: await SocialLinksService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete social_links success',
            metadata: await SocialLinksService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new SocialLinksController();
