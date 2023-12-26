const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  
  avatar: String,
  name: String,
  lastName: String,
  motherFatherEmail: {
    unique: true,
    type: String,
  },
  userPhone: String,
  motherFatherPhone: String,
  password: String,

});

const User = mongoose.model("User", userSchema);
module.exports = User;
