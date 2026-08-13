'use strict';
const express = require('express');
const projectsController = require('../../controllers/projects.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(projectsController.getAll));
router.get('/:id', asyncHandler(projectsController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(projectsController.create));
router.put('/:id', asyncHandler(projectsController.update));
router.delete('/:id', asyncHandler(projectsController.delete));

module.exports = router;
