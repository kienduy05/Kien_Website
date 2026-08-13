'use strict';
const PostsModel = require('../models/posts.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class PostsService {
    static async getAll() {
        return await PostsModel.getAll();
    }
    
    static async getById(id) {
        const result = await PostsModel.getById(id);
        if(!result) throw new NotFoundError('posts not found');
        return result;
    }
    
    static async create(payload) {
        const result = await PostsModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create posts');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await PostsModel.getById(id);
        if(!found) throw new NotFoundError('posts not found');
        
        const result = await PostsModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update posts');
        return result;
    }
    
    static async delete(id) {
        const found = await PostsModel.getById(id);
        if(!found) throw new NotFoundError('posts not found');
        return await PostsModel.delete(id);
    }
}
module.exports = PostsService;
