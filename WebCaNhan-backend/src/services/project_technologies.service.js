'use strict';
const ProjectTechnologiesModel = require('../models/project_technologies.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class ProjectTechnologiesService {
    static async getAll() {
        return await ProjectTechnologiesModel.getAll();
    }
    static async getById(id) {
        const result = await ProjectTechnologiesModel.getById(id);
        if(!result) throw new NotFoundError('project_technologies not found');
        return result;
    }
    static async delete(id) {
        return await ProjectTechnologiesModel.delete(id);
    }
}
module.exports = ProjectTechnologiesService;
