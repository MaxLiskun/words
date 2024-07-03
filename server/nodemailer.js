const nodemailer = require('nodemailer')
const passGoogle = 'jzyi pnkq molr cyri' // yhuhfalxrzwkekke




// const msg = {
//     from: '',
//     to: 'maximliskyn@gmail.com',
//     subject: 'Hello gggg ggg  vvvvv 3332 ',
//     text: '12.39'
// }


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mywords996@gmail.com', // liskunmaxim92@gmail.com
        pass: passGoogle
    },
    port: 465,
    host:'smtp.gmail.com'
})


// transporter.sendMail(msg, (err) =>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log('email sent');
//     }
// })


module.exports = transporter


