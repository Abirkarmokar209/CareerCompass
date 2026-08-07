const express = require('express');
const { listTemplates, getTemplate } = require('../controllers/roadmapController');

const router = express.Router();

router.get('/templates', listTemplates);
router.get('/templates/:id', getTemplate);

module.exports = router;
