var express = require('express');
const Controller = require('../controller/controller')
const router = express.Router();
let app = express();

app.use("/v1/", router)
router.get('/info', Controller.getInfo)

module.exports = app;
