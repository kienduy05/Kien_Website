'use strict';
const TechnologiesModel = require('../models/technologies.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class TechnologiesService {
    static async getAll() {
        return await TechnologiesModel.getAll();
    }
    
    static async getById(id) {
        const result = await TechnologiesModel.getById(id);
        if(!result) throw new NotFoundError('technologies not found');
        return result;
    }
    
    static async create(payload) {
        const result = await TechnologiesModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create technologies');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await TechnologiesModel.getById(id);
        if(!found) throw new NotFoundError('technologies not found');
        
        const result = await TechnologiesModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update technologies');
        return result;
    }
    
    static async delete(id) {
        const found = await TechnologiesModel.getById(id);
        if(!found) throw new NotFoundError('technologies not found');
        return await TechnologiesModel.delete(id);
    }
}
module.exports = TechnologiesService;
