const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../keys");
const cors = require("cors");

const Category = require("../models/Category");
const Word = require("../models/Word");

const addCategory = async (req, res) => {
  try {
   
    const category = await Category.findOne({ name: req.body.name });
    if (category) {
      res.status(409).json({ message: "Така категорія уже існує(" });
    } else {
     
      const newCategory = new Category({
        name: req.body.name,
        userId: req.body.userId,
        categoryId: req.body.categoryId,
        categoryLength: req.body.categoryLength,
       
      });
      await newCategory.save();
      res.status(201).json({ message: "Категорію успішно збережено)" });
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ message: "Помилка при збереженні категорії(" });
    }
  }
};

const getCategories = async (req, res) => {
 
  try {
  const categories = await Category.find({ userId: req.body.userId });
    
const categoryPromises = categories.map(async(category)=>{
const wordCount = await Word.countDocuments({categoryId:category.categoryId })
return {...category.toObject(), wordCount}
})
const categoriesWithWordCount = await Promise.all(categoryPromises)


    res.status(200).json({ message: "Категорії знайдені", categoriesWithWordCount });
  } catch (error) {
    res.status(500).json({ message: "Помилка пошуку категорій" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const response = await Category.findOne({ categoryId: categoryId });
    if (response) {
      await Category.findOneAndDelete({ categoryId: categoryId });
      await Word.deleteMany({ categoryId: categoryId });
      res.status(200).json({ message: "Категорія видалена" });
    } else {
      res.status(500).json({ message: "Категорія не існує, чи вже видалена" });
    }
  } catch (error) {
    res.status(500).json({ message: "Помилка при видаленні категорії" });
  }
};

const renameCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      categoryId: req.body.data.categoryId,
    });
    if (category) {
      const sameName = await Category.findOne({
        name: req.body.data.newNameCategory,
      });
      if (sameName) {
        res.status(500).json({ message: "Така категорія уже є" });
      } else {
        category.name = req.body.data.newNameCategory;
        await category.save();
        res.status(200).json({ message: "Категорія Змінена" });
      }
    } else {
      res.status(500).json({ message: "Така категорія не існує" });
    }
  } catch (error) {
    res.status(500).json({ message: "Помилка при зміні категорії" });
  }
};



module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  renameCategory,
  
};
