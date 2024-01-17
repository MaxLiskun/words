
const WordTestResult = require("../models/Results");
const Category = require("../models/Category");
const Words = require("../models/Word");
const { format } = require('date-fns');




const addResult = async (req, res) => {
  const testResult = req.body.testResult;
  try {
      const falseAnswersArr = req.body.testResult.falseAnswersArr.map(item => ({
          _id: item._id,
          inEnglish: item.inEnglish,
          inUkrainian: item.inUkrainian,
          inTranscription: item.inTranscription,
          categoryId: item.categoryId,
          category: item.category,
          __v: item.__v,
      }));

      const category = await Category.findOneAndUpdate(
          { name: 'Повтори ще)' },
          { $setOnInsert: { userId: testResult.userInfo.userId, categoryId: Date.now() } },
          { upsert: true, new: true }
      );

      if (falseAnswersArr.length) {
          console.log('є неправильні');
          
          for (const element of falseAnswersArr) {
              try {
                  const sameWord = await Words.find({
                      inEnglish: element.inEnglish,
                      inUkrainian: element.inUkrainian,
                      inTranscription: element.inTranscription,
                      categoryId: category.categoryId,
                  });

                  if (!sameWord.length){
                      console.log('слова немає');
                      const word = new Words({
                          inEnglish: element.inEnglish,
                          inUkrainian: element.inUkrainian,
                          inTranscription: element.inTranscription,
                          categoryId: category.categoryId,
                          category: category._id,
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
          trueAnswersCount: testResult.trueAnswersCount,
          falseAnswersCount: testResult.falseAnswersCount,
          falseAnswersArr: falseAnswersArr,
          resultId: testResult.userInfo.userId,
          timeOfWordsTest: format(new Date(), 'HH:mm:ss'), // Текущее время в формате xx-xx-xx
          rating: testResult.rating
      });


      await result.save();
      res.status(200).json({ message: "Результат успішно збережено)" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ title: "Помилка при збереженні результату" });
  }
};

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
  
};




