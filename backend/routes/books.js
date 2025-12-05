const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', bookController.listBooks);
router.get('/:id', bookController.getBook);

router.post('/', auth, authorize('admin'), bookController.createBook);
router.put('/:id', auth, authorize('admin'), bookController.updateBook);
router.delete('/:id', auth, authorize('admin'), bookController.deleteBook);

module.exports = router;
