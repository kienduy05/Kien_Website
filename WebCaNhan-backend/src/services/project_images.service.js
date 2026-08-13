'use strict';
const ProjectImagesModel = require('../models/project_images.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class ProjectImagesService {
    static async getAll() {
        return await ProjectImagesModel.getAll();
    }
    
    static async getById(id) {
        const result = await ProjectImagesModel.getById(id);
        if(!result) throw new NotFoundError('project_images not found');
        return result;
    }
    
    static async create(payload) {
        const result = await ProjectImagesModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create project_images');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await ProjectImagesModel.getById(id);
        if(!found) throw new NotFoundError('project_images not found');
        
        const result = await ProjectImagesModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update project_images');
        return result;
    }
    
    static async delete(id) {
        const found = await ProjectImagesModel.getById(id);
        if(!found) throw new NotFoundError('project_images not found');
        return await ProjectImagesModel.delete(id);
    }
}
module.exports = ProjectImagesService;
