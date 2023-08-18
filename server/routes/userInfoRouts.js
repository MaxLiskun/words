const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const userInfoController = require('../controllers/userInfoController')

router.get('/info', userInfoController.userInfo)


module.exports = router