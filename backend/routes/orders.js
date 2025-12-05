const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/my', auth, orderController.getUserOrders);

router.get('/', auth, authorize('admin'), orderController.getAllOrders);
router.put('/:id/status', auth, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
