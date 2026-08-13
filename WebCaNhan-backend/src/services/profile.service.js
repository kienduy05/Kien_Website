'use strict';
const fs = require('fs');
const path = require('path');
const ProfileModel = require('../models/profile.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class ProfileService {
    static async getAll() {
        return await ProfileModel.getAll();
    }
    
    static async getById(id) {
        const result = await ProfileModel.getById(id);
        if(!result) throw new NotFoundError('profile not found');
        return result;
    }
    
    static async create(payload) {
        const result = await ProfileModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create profile');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await ProfileModel.getById(id);
        if(!found) throw new NotFoundError('profile not found');
        
        // Handle old file deletion if new files are uploaded
        if (payload.avatar_url && found.avatar_url && payload.avatar_url !== found.avatar_url) {
            const oldPath = path.join(__dirname, '../../public/uploads/profile', found.avatar_url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            } else {
                console.warn(`Old avatar file not found to delete: ${oldPath}`);
            }
        }
        if (payload.cover_photo_url && found.cover_photo_url && payload.cover_photo_url !== found.cover_photo_url) {
            const oldPath = path.join(__dirname, '../../public/uploads/profile', found.cover_photo_url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            } else {
                console.warn(`Old cover_photo file not found to delete: ${oldPath}`);
            }
        }
        if (payload.cv_url && found.cv_url && payload.cv_url !== found.cv_url) {
            const oldPath = path.join(__dirname, '../../public/uploads/profile', found.cv_url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            } else {
                console.warn(`Old CV file not found to delete: ${oldPath}`);
            }
        }

        const result = await ProfileModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update profile');
        return result;
    }
    
    static async delete(id) {
        const found = await ProfileModel.getById(id);
        if(!found) throw new NotFoundError('profile not found');
        return await ProfileModel.delete(id);
    }
}
module.exports = ProfileService;
