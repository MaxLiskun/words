const express = require("express");
const router = express.Router();


const audioController = require("../controllers/audioController")

router.post('/save-audio', audioController.saveAudio);  
router.get('/get-audio/:filename', audioController.getAudioPath)


module.exports = router
