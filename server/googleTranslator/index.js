const { GoogleTranslator } = require('@translate-tools/core/translators/GoogleTranslator');
const translator = new GoogleTranslator();
const { GoogleTTS }= require('@translate-tools/core/tts/GoogleTTS') ;

// // Translate single string
// translator
// 	.translate('Hello world', 'en', 'de')
// 	.then((translate) => console.log('Translate result', translate));

// // Translate multiple strings
// translator
// 	.translateBatch(
// 		['Hello world', 'Some another text to translate', 'Yet another text'],
// 		'en',
// 		'de',
// 	)
// 	.then((translatedTexts) => console.log('Translate result', translatedTexts));

 async function translateOneFromEnToUk(){
    const trans = await translator.translate('dog', 'en', 'uk')
    //console.log(trans)
 }
 translateOneFromEnToUk()


 




  module.exports = translator;