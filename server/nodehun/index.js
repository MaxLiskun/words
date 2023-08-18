const fs = require('fs')
const Nodehun = require('nodehun')




const enAffix = fs.readFileSync('../server/nodehun/dictionaries/en/index.aff')
const enDictionary = fs.readFileSync('../server/nodehun/dictionaries/en/index.dic')
const enNodehun = new Nodehun(enAffix, enDictionary)

const ukAffix = fs.readFileSync('../server/nodehun/dictionaries/uk/index.aff')
const ukDictionary = fs.readFileSync('../server/nodehun/dictionaries/uk/index.dic')
const ukNodehun = new Nodehun(ukAffix, ukDictionary)


async function enSuggestions(word) {
  try {
    const suggestions = await enNodehun.suggest(word);
  //  console.log(suggestions);
  return suggestions;
  } catch (error) {
    console.error('Error suggesting English word:', error);
  }
}

async function ukSuggestions(word) {
  try {
    const suggestions = await ukNodehun.suggest(word);
   // console.log(suggestions);
   return suggestions
  } catch (error) {
    console.error('Error suggesting Ukrainian word:', error);
  }
}



module.exports = {
  enSuggestions,
  ukSuggestions,
}