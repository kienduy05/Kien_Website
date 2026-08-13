'use strict';
const express = require('express');
const educationController = require('../../controllers/education.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(educationController.getAll));
router.get('/:id', asyncHandler(educationController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(educationController.create));
router.put('/:id', asyncHandler(educationController.update));
router.delete('/:id', asyncHandler(educationController.delete));

module.exports = router;
