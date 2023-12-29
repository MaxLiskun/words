const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const testResultsController  = require('../controllers/testResultsController') 

router.post('/add-result', testResultsController.addResult)
router.get('/get-results', testResultsController.getResults)




module.exports = router