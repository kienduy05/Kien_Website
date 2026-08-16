'use strict';
const ProjectImagesModel = require('../models/project_images.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

const fs = require('fs');
const path = require('path');

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
        
        // Delete physical file
        if (found.image_url) {
            const filePath = path.join(__dirname, '../../public/uploads/projects', found.image_url);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch(err) {
                    console.error("Error deleting image file", err);
                }
            }
        }

        return await ProjectImagesModel.delete(id);
    }
}
module.exports = ProjectImagesService;
