'use strict';
const express = require('express');
const labsController = require('../../controllers/labs.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(labsController.getAll));
router.get('/:id', asyncHandler(labsController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(labsController.create));
router.put('/:id', asyncHandler(labsController.update));
router.delete('/:id', asyncHandler(labsController.delete));

module.exports = router;
