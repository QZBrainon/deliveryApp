const express = require('express');
const { saleController } = require('../controllers');

const router = express.Router();

router.post('/', saleController.createSale);
router.get('/', saleController.findSalesById);
router.get('/:id', saleController.detailedSale);
router.patch('/:id', saleController.updateSaleStatus);

module.exports = router;