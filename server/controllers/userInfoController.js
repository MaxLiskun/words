const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../keys')
const cors = require('cors')

const User = require("../models/User");






const userInfo = async (req, res) => {
  try {
    const authorizationHeader = await req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ title: "Відсутній heder authorization" });
    }
    const token = await authorizationHeader.split(" ")[1];
    const decoded = await jwt.verify(token, keys.jwtKey);
  
    res.status(200).json({ decoded });
  } catch (error) {
    res.status(500).json({ title: "Помилка розшифрування токена" });
  }
};




module.exports = {
  
  userInfo,
};

