'use strict';
const express = require('express');
const technologiesController = require('../../controllers/technologies.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(technologiesController.getAll));
router.get('/:id', asyncHandler(technologiesController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(technologiesController.create));
router.put('/:id', asyncHandler(technologiesController.update));
router.delete('/:id', asyncHandler(technologiesController.delete));

module.exports = router;
