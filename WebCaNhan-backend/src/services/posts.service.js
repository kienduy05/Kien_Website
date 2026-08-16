'use strict';
const fs = require('fs');
const path = require('path');
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
        
        // Delete old thumbnail if new one is uploaded
        if (payload.thumbnail_url && found.thumbnail_url && payload.thumbnail_url !== found.thumbnail_url) {
            const oldPath = path.join(__dirname, '../../public/uploads/posts', found.thumbnail_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        
        const result = await PostsModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update posts');
        return result;
    }
    
    static async delete(id) {
        const found = await PostsModel.getById(id);
        if(!found) throw new NotFoundError('posts not found');
        
        // Delete thumbnail
        if (found.thumbnail_url) {
            const oldPath = path.join(__dirname, '../../public/uploads/posts', found.thumbnail_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        
        return await PostsModel.delete(id);
    }
}
module.exports = PostsService;
