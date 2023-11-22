const jwt  = require('jsonwebtoken');
const keys = require('../keys');

function tokenExpiredMiddleware(req, res, next){
    
   const token = req.headers.token

   
    try {
        const decoded = jwt.verify(token,keys.jwtKey)
        req.user = decoded
        next()
       
    } catch (error) {
       
        if(error.name === 'TokenExpiredError'){
            res.status(401).json({
                title:'Потрібно заново авторизуватися',
                isAuthorized: false,
            })
        }else{
            res.status(500).json({title:'Помилка перевірки токена',
            isAuthorized: false,
        })
            
        }
    }
}

module.exports = tokenExpiredMiddleware