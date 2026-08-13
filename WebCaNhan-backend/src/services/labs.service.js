'use strict';
const LabsModel = require('../models/labs.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class LabsService {
    static async getAll() {
        return await LabsModel.getAll();
    }
    
    static async getById(id) {
        const result = await LabsModel.getById(id);
        if(!result) throw new NotFoundError('labs not found');
        return result;
    }
    
    static async create(payload) {
        const result = await LabsModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create labs');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await LabsModel.getById(id);
        if(!found) throw new NotFoundError('labs not found');
        
        const result = await LabsModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update labs');
        return result;
    }
    
    static async delete(id) {
        const found = await LabsModel.getById(id);
        if(!found) throw new NotFoundError('labs not found');
        return await LabsModel.delete(id);
    }
}
module.exports = LabsService;
