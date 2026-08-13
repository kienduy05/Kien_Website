'use strict';
const express = require('express');
const experiencesController = require('../../controllers/experiences.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(experiencesController.getAll));
router.get('/:id', asyncHandler(experiencesController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(experiencesController.create));
router.put('/:id', asyncHandler(experiencesController.update));
router.delete('/:id', asyncHandler(experiencesController.delete));

module.exports = router;
