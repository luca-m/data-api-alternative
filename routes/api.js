const express = require('express');
const dbController = require('../controllers/dbController');

const router = express.Router();

router.post('/insertOne', dbController.insertOne);
router.post('/findOne', dbController.findOne);
router.post('/find', dbController.find);
router.post('/updateOne', dbController.updateOne);
router.post('/deleteOne', dbController.deleteOne);
router.post('/aggregate', dbController.aggregate);

module.exports = router;
