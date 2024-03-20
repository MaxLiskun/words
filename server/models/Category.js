const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,

  userId: { type: String, unique: false },
  
  categoryId: { type: String, unique: false },

  
  canChange: { type: Boolean },
 
});

const Category = mongoose.model("Categories", categorySchema);
module.exports = Category;



