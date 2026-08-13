'use strict';
const ProjectsModel = require('../models/projects.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class ProjectsService {
    static async getAll() {
        return await ProjectsModel.getAll();
    }
    
    static async getById(id) {
        const result = await ProjectsModel.getById(id);
        if(!result) throw new NotFoundError('projects not found');
        return result;
    }
    
    static async create(payload) {
        const result = await ProjectsModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create projects');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await ProjectsModel.getById(id);
        if(!found) throw new NotFoundError('projects not found');
        
        const result = await ProjectsModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update projects');
        return result;
    }
    
    static async delete(id) {
        const found = await ProjectsModel.getById(id);
        if(!found) throw new NotFoundError('projects not found');
        return await ProjectsModel.delete(id);
    }
}
module.exports = ProjectsService;
