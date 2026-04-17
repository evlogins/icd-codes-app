const express = require('express');
const router = express.Router();
const icdController = require('../controllers/icdController');

// Search ICD codes: GET /api/icd/search?q=diabetes&context=billing&version=10
router.get('/search', icdController.search);

// Get specific code: GET /api/icd/E11.9?context=research
router.get('/:code', icdController.getCode);

module.exports = router;
