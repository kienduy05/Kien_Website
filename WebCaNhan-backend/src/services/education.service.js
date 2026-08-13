'use strict';
const EducationModel = require('../models/education.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class EducationService {
    static async getAll() {
        return await EducationModel.getAll();
    }
    
    static async getById(id) {
        const result = await EducationModel.getById(id);
        if(!result) throw new NotFoundError('education not found');
        return result;
    }
    
    static async create(payload) {
        const result = await EducationModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create education');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await EducationModel.getById(id);
        if(!found) throw new NotFoundError('education not found');
        
        const result = await EducationModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update education');
        return result;
    }
    
    static async delete(id) {
        const found = await EducationModel.getById(id);
        if(!found) throw new NotFoundError('education not found');
        return await EducationModel.delete(id);
    }
}
module.exports = EducationService;
