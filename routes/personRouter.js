const Router = require('express');
const PersonController = require('../controllers/PersonController');
const router = new Router();

router.post('/person', PersonController.create);
router.get('/list', PersonController.getAll);


module.exports = router;