const songList = require('../songList')
exports.getMusic = (req, res) => {
    res.json(songList)
}