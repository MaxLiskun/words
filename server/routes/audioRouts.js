const express = require("express");
const router = express.Router();


const audioController = require("../controllers/audioController")

router.post('/getLongBinaryAudio', audioController.getLongBinaryAudio);  
router.post('/getShortBinaryAudio', audioController.getShortBinaryAudio);  
router.get('/get-audio/:filename', audioController.getAudioPath)


module.exports = router
