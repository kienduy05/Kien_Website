'use strict';
const ProjectsService = require('../services/projects.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class ProjectsController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get projects list success',
            metadata: await ProjectsService.getAll()
        }).send(res);
    }

    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get projects details success',
            metadata: await ProjectsService.getById(req.params.id)
        }).send(res);
    }

    create = async (req, res, next) => {
        const payload = { ...req.body };
        const projectImages = [];

        // Force cast bit columns
        if (payload.is_featured !== undefined) payload.is_featured = payload.is_featured === 'true' || payload.is_featured === '1' || payload.is_featured === 1 ? 1 : 0;
        if (payload.is_published !== undefined) payload.is_published = payload.is_published === 'true' || payload.is_published === '1' || payload.is_published === 1 ? 1 : 0;

        if (req.body.technologies) {
            try {
                payload.technologies = JSON.parse(req.body.technologies);
            } catch (e) {
                payload.technologies = [];
            }
        }

        if (req.files) {
            if (req.files.primary_image && req.files.primary_image[0]) {
                payload.thumbnail_url = req.files.primary_image[0].filename;
            }
            if (req.files.project_images && req.files.project_images.length > 0) {
                req.files.project_images.forEach(file => {
                    projectImages.push(file.filename);
                });
            }
        }

        // Pass projectImages to service if needed, or handle it in service
        payload.projectImages = projectImages; // Attach for service to handle

        new CREATED({
            message: 'Create projects success',
            metadata: await ProjectsService.create(payload)
        }).send(res);
    }

    update = async (req, res, next) => {
        const payload = { ...req.body };
        const projectImages = [];

        // Force cast bit columns
        if (payload.is_featured !== undefined) payload.is_featured = payload.is_featured === 'true' || payload.is_featured === '1' || payload.is_featured === 1 ? 1 : 0;
        if (payload.is_published !== undefined) payload.is_published = payload.is_published === 'true' || payload.is_published === '1' || payload.is_published === 1 ? 1 : 0;

        if (req.body.technologies) {
            try {
                payload.technologies = JSON.parse(req.body.technologies);
            } catch (e) {
                payload.technologies = [];
            }
        }

        if (req.files) {
            if (req.files.primary_image && req.files.primary_image[0]) {
                payload.thumbnail_url = req.files.primary_image[0].filename;
            }
            if (req.files.project_images && req.files.project_images.length > 0) {
                req.files.project_images.forEach(file => {
                    projectImages.push(file.filename);
                });
            }
        }

        payload.projectImages = projectImages;

        new SuccessResponse({
            message: 'Update projects success',
            metadata: await ProjectsService.update(req.params.id, payload)
        }).send(res);
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete projects success',
            metadata: await ProjectsService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new ProjectsController();
