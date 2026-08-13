'use strict';
const ProfileService = require('../services/profile.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class ProfileController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get profile list success',
            metadata: await ProfileService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get profile details success',
            metadata: await ProfileService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create profile success',
            metadata: await ProfileService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        const payload = { ...req.body };
        if (req.files) {
            if (req.files.avatar && req.files.avatar[0]) {
                payload.avatar_url = req.files.avatar[0].filename;
            }
            if (req.files.cover_photo && req.files.cover_photo[0]) {
                payload.cover_photo_url = req.files.cover_photo[0].filename;
            }
            if (req.files.cv && req.files.cv[0]) {
                payload.cv_url = req.files.cv[0].filename;
            }
        }

        new SuccessResponse({
            message: 'Update profile success',
            metadata: await ProfileService.update(req.params.id, payload)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete profile success',
            metadata: await ProfileService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new ProfileController();
