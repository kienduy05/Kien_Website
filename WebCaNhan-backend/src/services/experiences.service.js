'use strict';
const ExperiencesModel = require('../models/experiences.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class ExperiencesService {
    static async getAll() {
        return await ExperiencesModel.getAll();
    }
    
    static async getById(id) {
        const result = await ExperiencesModel.getById(id);
        if(!result) throw new NotFoundError('experiences not found');
        return result;
    }
    
    static async create(payload) {
        const result = await ExperiencesModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create experiences');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await ExperiencesModel.getById(id);
        if(!found) throw new NotFoundError('experiences not found');
        
        const result = await ExperiencesModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update experiences');
        return result;
    }
    
    static async delete(id) {
        const found = await ExperiencesModel.getById(id);
        if(!found) throw new NotFoundError('experiences not found');
        return await ExperiencesModel.delete(id);
    }
}
module.exports = ExperiencesService;
