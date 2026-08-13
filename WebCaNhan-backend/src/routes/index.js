'use strict';

const express = require('express');
const { apiKey } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey);

router.use('/v1/api/access', require('./access'));
router.use('/v1/api/users', require('./users'));
router.use('/v1/api/profile', require('./profile'));
router.use('/v1/api/social_links', require('./social_links'));
router.use('/v1/api/experiences', require('./experiences'));
router.use('/v1/api/projects', require('./projects'));
router.use('/v1/api/technologies', require('./technologies'));
router.use('/v1/api/project_technologies', require('./project_technologies'));
router.use('/v1/api/project_images', require('./project_images'));
router.use('/v1/api/education', require('./education'));
router.use('/v1/api/skills', require('./skills'));
router.use('/v1/api/labs', require('./labs'));
router.use('/v1/api/posts', require('./posts'));
router.use('/v1/api/contact_messages', require('./contact_messages'));

module.exports = router;
