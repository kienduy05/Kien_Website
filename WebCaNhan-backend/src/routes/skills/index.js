'use strict';
const express = require('express');
const skillsController = require('../../controllers/skills.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(skillsController.getAll));
router.get('/:id', asyncHandler(skillsController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
const { uploadSkills } = require('../../middlewares/upload.middleware');

router.post('/', uploadSkills.single('icon'), asyncHandler(skillsController.create));
router.put('/:id', uploadSkills.single('icon'), asyncHandler(skillsController.update));
router.delete('/:id', asyncHandler(skillsController.delete));

module.exports = router;
