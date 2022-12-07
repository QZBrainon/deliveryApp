const express = require('express');
const { saleController } = require('../controllers');

const router = express.Router();

router.post('/', saleController.createSale);
router.get('/', saleController.findSalesByRole);
router.get('/:id', saleController.findSaleById);
router.patch('/:id', saleController.updateSaleStatus);

module.exports = router;