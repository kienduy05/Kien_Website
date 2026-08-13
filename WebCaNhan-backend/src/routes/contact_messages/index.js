'use strict';
const express = require('express');
const contact_messagesController = require('../../controllers/contact_messages.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Public routes (Read only) - Requires API KEY (handled in Master Route)
router.get('/', asyncHandler(contact_messagesController.getAll));
router.get('/:id', asyncHandler(contact_messagesController.getById));

// Protected routes (Create, Update, Delete) - Requires JWT Authentication
router.use(authentication);
router.post('/', asyncHandler(contact_messagesController.create));
router.put('/:id', asyncHandler(contact_messagesController.update));
router.delete('/:id', asyncHandler(contact_messagesController.delete));

module.exports = router;
