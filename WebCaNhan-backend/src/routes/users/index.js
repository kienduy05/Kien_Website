'use strict';
const express = require('express');
const usersController = require('../../controllers/users.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(usersController.getAll));
router.get('/:id', asyncHandler(usersController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(usersController.create));
router.put('/:id', asyncHandler(usersController.update));
router.delete('/:id', asyncHandler(usersController.delete));

module.exports = router;
