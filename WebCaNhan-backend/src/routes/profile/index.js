'use strict';
const express = require('express');
const profileController = require('../../controllers/profile.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const { uploadProfile } = require('../../middlewares/upload.middleware');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(profileController.getAll));
router.get('/:id', asyncHandler(profileController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(profileController.create));
router.put('/:id', uploadProfile.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
]), asyncHandler(profileController.update));
router.delete('/:id', asyncHandler(profileController.delete));

module.exports = router;
