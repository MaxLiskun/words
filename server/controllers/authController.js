const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../keys')
const cors = require('cors')
const path = require('path');
const multer = require('multer');


const User = require("../models/User");





// конфигурация мултер
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/usersAvatars'); // Upload files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });








const register = async (req,  res) => {

  try {
  

    // Use multer middleware to handle file upload
    upload.single('avatar')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ title: 'Multer error' });
      } else if (err) {
        return res.status(500).json({ title: 'Server error' });
      }

    
      const { name, lastName, motherFatherEmail, userPhone, password } = req.body;
     
      const candidateEmail = await User.findOne({motherFatherEmail});
      const candidatePhone = await User.findOne({userPhone});
            if (candidateEmail) {
                  res.status(409).json({ title: 'Упс Email уже зайнятий' });
            }else if(candidatePhone){
                  res.status(409).json({ title: 'Упс Номер телефону уже зайнятий' });

            }else {
       
                  const newUser = new User({
                      avatar: req.file ? req.file.filename : null, // Assuming the file field is named 'avatar'
                      name: req.body.name,
                      lastName: req.body.lastName,
                      motherFatherEmail: req.body.motherFatherEmail,
                      userPhone: req.body.userPhone,
                      motherFatherPhone: req.body.motherFatherPhone,
                      password: bcrypt.hashSync(req.body.password, 10),
                    
                  });
         

                  try {
                    await newUser.save();
                    res.status(201).json({ newUser, title: 'Користувача збережено' });
                  } catch (error) {
                    res.status(500).json({ title: 'помилка при збереженні' });
                  }
            }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ title: 'Помилка серверу' });
  }
};













const login= async (req, res, next) => {
  console.log(req.body)
  const candidate = await User.findOne({ userPhone: req.body.userPhone });

  if (candidate) {
    if (!bcrypt.compareSync(req.body.userPassword, candidate.password)) {
      return res.status(401).json({ title: "Некоректний пароль",  isAuthorized: false,});
    } else {
      const token = jwt.sign(
        {
          name: candidate.name,
          lastName: candidate.lastName,
          userPhone: candidate.userPhone,
          avatar: candidate.avatar,
          userId: candidate._id,

          motherFatherEmail: candidate.motherFatherEmail,
          motherFatherPhone: candidate.motherFatherPhone,
       
        },
        keys.jwtKey,
        { expiresIn: 60 * 60 }
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

