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
        new CREATED({
            message: 'Create posts success',
            metadata: await PostsService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update posts success',
            metadata: await PostsService.update(req.params.id, req.body)
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
