'use strict';
const PostsService = require('../services/posts.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class PostsController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get posts list success',
            metadata: await PostsService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get posts details success',
            metadata: await PostsService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        const payload = { ...req.body };
        if (payload.is_published !== undefined) payload.is_published = payload.is_published === 'true' || payload.is_published === '1' || payload.is_published === 1 ? 1 : 0;
        
        if (req.file) {
            payload.thumbnail_url = req.file.filename;
        }

        new CREATED({
            message: 'Create posts success',
            metadata: await PostsService.create(payload)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        const payload = { ...req.body };
        if (payload.is_published !== undefined) payload.is_published = payload.is_published === 'true' || payload.is_published === '1' || payload.is_published === 1 ? 1 : 0;
        
        if (req.file) {
            payload.thumbnail_url = req.file.filename;
        }

        new SuccessResponse({
            message: 'Update posts success',
            metadata: await PostsService.update(req.params.id, payload)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete posts success',
            metadata: await PostsService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new PostsController();
