const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../keys')
const cors = require('cors')

const User = require("../models/User");



const register = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });
  if (candidate) {
    res.status(409).json({ title: "Упс еmail уже зайнятий" });
  } else {
    const newUser = await new User({
      email: req.body.email,
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    try {
      await newUser.save();
      res.status(201).json({ newUser, title: "Користувача збережено" });
    } catch (error) {
      res.status(500).json({ title: "помилка при збереженні" });
    }
  }
};


const login= async (req, res, next) => {
  const candidate = await User.findOne({ email: req.body.email });
  //console.log(candidate)
  if (candidate) {
    if (!bcrypt.compareSync(req.body.password, candidate.password)) {
      return res.status(401).json({ title: "Некоректний пароль",  isAuthorized: false,});
    } else {
      const token = jwt.sign(
        {
          name: candidate.name,
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwtKey,
        { expiresIn: 10 * 60 }
      );

      return res.status(200).json({
        message: "Ви успішно увійшли)",
        token: token,
        isAuthorized: true,
      });
    }
  } else {
    return res.status(500).json({ title: "Такого користувача не існує",
    isAuthorized: false,
  });
  }
};







module.exports = {
  
  register,
  login,
};

