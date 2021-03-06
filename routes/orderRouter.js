let router = require('express').Router();
let OrderController = require('../controllers/orderController');

router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.get('/user/:id', OrderController.getOrdersByUser);
router.get('/get/forAllProducts/from/:dateFrom/to/:dateTo', OrderController.getAmountOfOrdersForAllProducts);
router.put('/order/setDelivered/:id', OrderController.setDelivered);
router.put('/order/setPaid/:id', OrderController.setPaid);
router.put('/order/setClosed/:id', OrderController.setClosed);
router.put('/order/setOrdered/:id', OrderController.setOrdered);
router.post('/', OrderController.create);
router.put('/:id', OrderController.update);
router.delete('/:id', OrderController.delete);

module.exports = router;