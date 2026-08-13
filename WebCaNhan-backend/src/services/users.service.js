'use strict';
const UsersModel = require('../models/users.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class UsersService {
    static async getAll() {
        return await UsersModel.getAll();
    }
    
    static async getById(id) {
        const result = await UsersModel.getById(id);
        if(!result) throw new NotFoundError('users not found');
        return result;
    }
    
    static async create(payload) {
        const result = await UsersModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create users');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await UsersModel.getById(id);
        if(!found) throw new NotFoundError('users not found');
        
        const result = await UsersModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update users');
        return result;
    }
    
    static async delete(id) {
        const found = await UsersModel.getById(id);
        if(!found) throw new NotFoundError('users not found');
        return await UsersModel.delete(id);
    }
}
module.exports = UsersService;
