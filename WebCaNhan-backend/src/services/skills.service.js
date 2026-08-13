'use strict';
const SkillsModel = require('../models/skills.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class SkillsService {
    static async getAll() {
        return await SkillsModel.getAll();
    }
    
    static async getById(id) {
        const result = await SkillsModel.getById(id);
        if(!result) throw new NotFoundError('skills not found');
        return result;
    }
    
    static async create(payload) {
        const result = await SkillsModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create skills');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await SkillsModel.getById(id);
        if(!found) throw new NotFoundError('skills not found');
        
        const result = await SkillsModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update skills');
        return result;
    }
    
    static async delete(id) {
        const found = await SkillsModel.getById(id);
        if(!found) throw new NotFoundError('skills not found');
        return await SkillsModel.delete(id);
    }
}
module.exports = SkillsService;
