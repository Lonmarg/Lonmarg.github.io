const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    let context = {};

    res.render('equipments', context);
});

module.exports = router;