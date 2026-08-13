'use strict';
const express = require('express');
const postsController = require('../../controllers/posts.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(postsController.getAll));
router.get('/:id', asyncHandler(postsController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(postsController.create));
router.put('/:id', asyncHandler(postsController.update));
router.delete('/:id', asyncHandler(postsController.delete));

module.exports = router;
