'use strict';
const SocialLinksModel = require('../models/social_links.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class SocialLinksService {
    static async getAll() {
        return await SocialLinksModel.getAll();
    }
    
    static async getById(id) {
        const result = await SocialLinksModel.getById(id);
        if(!result) throw new NotFoundError('social_links not found');
        return result;
    }
    
    static async create(payload) {
        const result = await SocialLinksModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create social_links');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await SocialLinksModel.getById(id);
        if(!found) throw new NotFoundError('social_links not found');
        
        const result = await SocialLinksModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update social_links');
        return result;
    }
    
    static async delete(id) {
        const found = await SocialLinksModel.getById(id);
        if(!found) throw new NotFoundError('social_links not found');
        return await SocialLinksModel.delete(id);
    }
}
module.exports = SocialLinksService;
