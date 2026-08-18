'use strict';
const fs = require('fs');
const path = require('path');
const ProjectsModel = require('../models/projects.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

const ProjectImagesModel = require('../models/project_images.model');
const ProjectTechnologiesModel = require('../models/project_technologies.model');

class ProjectsService {
    static async getAll() {
        // Here we could also fetch images for each project, but for now just return projects
        return await ProjectsModel.getAll();
    }

    static async getById(id) {
        const result = await ProjectsModel.getById(id);
        if (!result) throw new NotFoundError('projects not found');

        const images = await ProjectImagesModel.getByProjectId(id);
        result.project_images = images;

        const technologies = await ProjectTechnologiesModel.getByProjectId(id);
        result.project_technologies = technologies;

        return result;
    }

    static async create(payload) {
        const { projectImages, technologies, ...projectData } = payload;
        const result = await ProjectsModel.create(projectData);
        if (!result) throw new BadRequestError('Failed to create projects');

        if (projectImages && projectImages.length > 0) {
            for (let i = 0; i < projectImages.length; i++) {
                await ProjectImagesModel.create({
                    project_id: result.id,
                    image_url: projectImages[i],
                    display_order: i
                });
            }
        }

        if (technologies && technologies.length > 0) {
            for (const techId of technologies) {
                await ProjectTechnologiesModel.create(result.id, techId);
            }
        }

        return result;
    }

    static async update(id, payload) {
        // Check if exists
        const found = await ProjectsModel.getById(id);
        if (!found) throw new NotFoundError('projects not found');

        // Delete old thumbnail if new one is uploaded
        if (payload.thumbnail_url && found.thumbnail_url && payload.thumbnail_url !== found.thumbnail_url) {
            const oldPath = path.join(__dirname, '../../public/uploads/projects', found.thumbnail_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const { projectImages, technologies, deleted_images, project_technologies, project_images, ...projectData } = payload;
        const result = await ProjectsModel.update(id, projectData);
        if (!result) throw new BadRequestError('Failed to update projects');

        if (projectImages && projectImages.length > 0) {
            // Usually we'd append or specify order. For simplicity, we just add them.
            for (let i = 0; i < projectImages.length; i++) {
                await ProjectImagesModel.create({
                    project_id: id,
                    image_url: projectImages[i],
                    display_order: i // Might need logic to append to existing display_order
                });
            }
        }

        if (deleted_images && deleted_images.length > 0) {
            for (const imageId of deleted_images) {
                // Fetch image record to delete physical file
                const imageRecord = await ProjectImagesModel.getById(imageId);
                if (imageRecord && imageRecord.image_url) {
                    const imgPath = path.join(__dirname, '../../public/uploads/projects', imageRecord.image_url);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }
                await ProjectImagesModel.delete(imageId);
            }
        }

        if (technologies !== undefined) { // allow empty array to clear all
            await ProjectTechnologiesModel.deleteByProjectId(id);
            if (technologies && technologies.length > 0) {
                for (const techId of technologies) {
                    await ProjectTechnologiesModel.create(id, techId);
                }
            }
        }

        return result;
    }

    static async delete(id) {
        const found = await ProjectsModel.getById(id);
        if(!found) throw new NotFoundError('projects not found');
        
        // Delete primary image
        if (found.thumbnail_url) {
            const oldPath = path.join(__dirname, '../../public/uploads/projects', found.thumbnail_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        
        // Delete all multi images files
        const images = await ProjectImagesModel.getByProjectId(id);
        if (images && images.length > 0) {
            for (const img of images) {
                if (img.image_url) {
                    const imgPath = path.join(__dirname, '../../public/uploads/projects', img.image_url);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }
            }
        }
        
        // We might need to delete related db records if no cascade, but model delete might just delete the project.
        return await ProjectsModel.delete(id);
    }
}
module.exports = ProjectsService;
