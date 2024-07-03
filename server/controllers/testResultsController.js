
const WordTestResult = require("../models/Results");
const Category = require("../models/Category");
const Words = require("../models/Word");
const { format } = require('date-fns');
const transporter = require('../nodemailer');



const repeatCategory = 'Потрібно повторити' // назва категорії яка зберігається якщо ти




const addResult = async (req, res) => {

  const testResult = req.body.testResult;



  try {
        
    //Якщо користувач відповідає правильно то з сатегорії 'Повтори ще' видаляються слова які були додані раніше
    if (testResult.trueAnswerArr.length > 0) {
        const findRepeatCategory = await Category.findOne({ name: `${repeatCategory}` }) // знаходемо категорію 'Повтори ще'
        
        if (findRepeatCategory) { // Якщо вона існує то продовжуємо
          //  console.log('Є кетегорія для повторення');
           // console.log(findRepeatCategory.categoryId) // беремо id категорії для повторення
            
            for (const el of testResult.trueAnswerArr) { 
                        try {
                            console.log(el)
                            const deleteWord = await Words.findOneAndDelete({ // перебираємо кожне слово  і якщо вонно є то видаляємо
                                inEnglish: el.inEnglish,
                                inUkrainian: el.inUkrainian,
                                inTranscription: el.inTranscription,
                                categoryId: findRepeatCategory.categoryId,
                            });
            
                            if (deleteWord) {
                               // console.log('Слово видалено з категорії для повторення');
                            }
                        } catch (error) {
                            console.error('Помилка при видаленні слова:', error);
                        }
            }
        } else {
           // console.log('Немає категорії для повторення');
        }
    } else {
       // console.log('У користувача немає правильних відповідей');
    }


 


    //створюємо масив обєктів з неправельними словами
      const falseAnswersArr = req.body.testResult.falseAnswersArr.map(item => ({
          _id: item._id,
          inEnglish: item.inEnglish,
          inUkrainian: item.inUkrainian,
          inTranscription: item.inTranscription,
          categoryId: item.categoryId,
          category: item.category,
          __v: item.__v,
      }));
    //перевіряємо чи є категорія для збереження неправельних слів, якщо немає то створюємо її
      const category = await Category.findOneAndUpdate(
        
          { name: `${repeatCategory}`},
          { $setOnInsert: { userId: testResult.userInfo.userId, categoryId: Date.now(), canChange: false } },
          { upsert: true, new: true }
      );

   


     //Первіряємо чи є в створеному масиві з неправильних слів обєкти
      if (falseAnswersArr.length) {
          console.log('Є неправильні слова');
          
          for (const element of falseAnswersArr) {
              try {
                //перевіряємо чи є такі слова в категорії з неправельними словами, яку ми раніше перевірили
                  const sameWord = await Words.find({
                      inEnglish: element.inEnglish,
                      inUkrainian: element.inUkrainian,
                      inTranscription: element.inTranscription,
                      categoryId: category.categoryId, //!!!!!!!!!
                  });
                 //якщо немає таких слів то зберігаємо їx в категорії з неправилиними словами 
                  if (!sameWord.length){
                      console.log(' Такого слова немає, отож збережу)');
                      const word = new Words({
                          inEnglish: element.inEnglish,
                          inUkrainian: element.inUkrainian,
                          inTranscription: element.inTranscription,
                          categoryId: category.categoryId, //!!!!
                          category: category._id, //!!!!
                      });
                      await word.save();
                  }
              } catch (error) {
                  console.error(error);
                  // Добавьте обработку ошибок внутри цикла.
              }
          }
      } else {
          console.log('неправильних немає');
      }



      ////////////////////////////////////////////////////////////////
      // Зберігаємо результат
      const result = new WordTestResult({
          dateOfWordsTest: testResult.dateOfWordsTest,
          userInfo: {
              name: testResult.userInfo.name,
              lastName: testResult.userInfo.lastName,
              userPhone: testResult.userInfo.userPhone,
              avatar: testResult.userInfo.avatar,
              motherFatherEmail: testResult.userInfo.motherFatherEmail,
              motherFatherPhone: testResult.userInfo.motherFatherPhone,
              userId: testResult.userInfo.userId,
          },
          selectedCategory: {
              _id: testResult.selectedCategory._id,
              name: testResult.selectedCategory.name,
              userId: testResult.selectedCategory.userId,
              categoryId: testResult.selectedCategory.categoryId,
              __v: testResult.selectedCategory.__v,
              wordCount: testResult.selectedCategory.wordCount,
          },
            leftTimeOfWordsTest: testResult.leftTimeOfWordsTest,
            testLangVariant:testResult.testLangVariant,
            trueAnswersCount: testResult.trueAnswersCount,
            falseAnswersCount: testResult.falseAnswersCount,
            falseAnswersArr: falseAnswersArr,
            resultId: testResult.userInfo.userId,
            timeOfWordsTest: format(new Date(), 'HH:mm:ss'), // Текущее время в формате xx-xx-xx
            rating: testResult.rating,
            ratingInPercent: testResult.ratingInPercent,
      });


      await result.save();
      res.status(200).json({ message: "Результат успішно збережено)" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ title: "Помилка при збереженні результату" });
  }
};

//================================================================
const sendResult = async (req, res) => {
    
try {
  const testResult = req.body.testResult;


  if (testResult){
   
   //Устанавливаем таймер на 30 секунд (30000 миллисекунд)
    let timer = setTimeout(() => {
    console.error('Timeout: Невдалося надіслати за 30 секунд');
    return res.status(500).json({ message: 'Невдалося надіслати за 30 секунд' });
  }, 30000);




     const date = format(new Date(), 'dd-MM-yyyy');
     const time = format(new Date(), 'HH:mm:ss');
     const normalRating =  Math.round((testResult.rating/5)*100); // конвертуємо назад з 5 зіркового
 
    const falseanswers = testResult.falseAnswersArr.map(el=>el.inEnglish);
    


                    const msg = {
                      from: 'mywords996@gmail.com',
                      to: testResult.userInfo.motherFatherEmail,
                      subject: 'Результат тесту',
                      
                      text: 
                      
                      `${testResult.dateOfWordsTest}       ${time}  \n\n` +


                      `Учень: ${testResult.userInfo.name} ${testResult.userInfo.lastName}\n\n` +
                      
                      `Категорія: ${testResult.selectedCategory.name}(${testResult.selectedCategory.wordCount})\n\n`+

                      `Варіант тесту: ${testResult.testLangVariant}\n\n`+
                   
                      `Витрачений час: ${testResult.leftTimeOfWordsTest}\n\n`+


                      `Правильних відповідей: ${testResult.trueAnswersCount}\n` +
                      `Неправильних відповідей: ${testResult.falseAnswersCount}\n\n` +

                      `Результат: ${normalRating}%\n\n`+
                      
                      `Потрібно повторити слова: ${falseanswers.join(',  ')}\n`
                    };


                      transporter.sendMail(msg, (err) =>{

                            clearTimeout(timer); // очищаем таймер при успешной отправке

                            if(err){
                                console.error('Помилка в надісланні емейла:', err);
                                return res.status(500).json({message:'Невдалося надіслати'})
                            }else{
                                console.log('Повідомлення надіслано успішно');
                                res.status(200).json({message:'Повідомлення надіслано успішно'})
                              }})

  }else{
    return res.status(400).json({message: 'Немає данних для надсилання'})
  }
  

} catch (error) {
    clearTimeout(timer); // очищаем таймер при ошибке
    console.error('Невідома помилка надсилання:', error);
    res.status(500).json({ message: 'Невідома помилка надсилання' });
}
    
}
//================================================================

const getResults = async (req, res) => {
    try {
      const id = req.query.userId
        if (!id){
            return res.status(400).json({ message: "Не вказан Id користувача" });
        }
      const results = await WordTestResult.find({ resultId: id })
   //console.log(results)
 
   const groupedByDate = ({});
          results.forEach((result) => {
            const date = result.dateOfWordsTest

            if(!groupedByDate[date]){
                groupedByDate[date] = []
            }
            groupedByDate[date].push(result)
    
   })
  


   //================================================================
   //Сортируєм по последнему добавленому результату
   const groupedByDateKeys = await Object.entries(groupedByDate)



   groupedByDateKeys.sort((a, b) => {
         const dateA = a[0].split('.').reverse().join('-');
         const dateB = b[0].split('.').reverse().join('-');
         return new Date(dateA) - new Date(dateB);
});



   const groupedByDateSortedFromNew = await Object.fromEntries(groupedByDateKeys.reverse());

  


//============================================================================






      res.status(200).json({ message: "Результати знайдені", groupedByDateSortedFromNew });
    } catch (error) {
      res.status(500).json({ message: "Помилка при пошуку результатів" });
    }
  };
module.exports = {
  addResult,
  getResults,
  sendResult,
};





