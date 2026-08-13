'use strict';
const express = require('express');
const social_linksController = require('../../controllers/social_links.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(social_linksController.getAll));
router.get('/:id', asyncHandler(social_linksController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(social_linksController.create));
router.put('/:id', asyncHandler(social_linksController.update));
router.delete('/:id', asyncHandler(social_linksController.delete));

module.exports = router;
