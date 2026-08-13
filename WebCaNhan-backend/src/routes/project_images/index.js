'use strict';
const express = require('express');
const project_imagesController = require('../../controllers/project_images.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(project_imagesController.getAll));
router.get('/:id', asyncHandler(project_imagesController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(project_imagesController.create));
router.put('/:id', asyncHandler(project_imagesController.update));
router.delete('/:id', asyncHandler(project_imagesController.delete));

module.exports = router;
