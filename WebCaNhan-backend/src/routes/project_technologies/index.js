'use strict';
const express = require('express');
const project_technologiesController = require('../../controllers/project_technologies.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.get('/', asyncHandler(project_technologiesController.getAll));
router.get('/:id', asyncHandler(project_technologiesController.getById));

// Require Authentication for delete (Example)
router.use(authentication);
router.delete('/:id', asyncHandler(project_technologiesController.delete));

module.exports = router;
