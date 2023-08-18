const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Category = require("./Category");


const wordSchema = new Schema({
inEnglish: String,
inUkrainian: String,
inTranscription: String,
categoryId: String,
category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Categories'},// Reference to the Category model
});

const Words = mongoose.model("words", wordSchema);
module.exports = Words;






