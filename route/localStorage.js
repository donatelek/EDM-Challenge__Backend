const server = require('../server')
let cryptedVar
let decryptedVar

function encrypt(text, crypto) {
    var cipher = crypto.createCipher('aes-256-ctr', 'Your-Password')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    cryptedVar = crypted
}

function decrypt(text, crypto) {
    var decipher = crypto.createDecipher('aes-256-ctr', 'Your-Password')
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    decryptedVar = dec
}

exports.saveLocalStorage = (req, res) => {
    const db = server.db
    const crypto = server.crypto
    const {
        id
    } = req.body;
    if (!id) {
        return res.json('something wrong with saving local storage')
    }
    let string
    db.select('*').from('users').where('id', '=', id).then(result => {
        string = `${result[0].id},${result[0].easymode},${result[0].hardmode},${result[0].username},${result[0].lvl},${result[0].easylvl},${result[0].usedhints},${result[0].failedattempts},${result[0].usedhintshard},${result[0].failedattemptshard},${result[0].lvlhard}`;
        encrypt(string, crypto)
        res.json(cryptedVar)
    })
}

exports.getLocalStorage = (req, res) => {
    const db = server.db
    const crypto = server.crypto
    if (!req.body.hash) {
        return res.json('something wrong with getting local storage')
    }
    const hashh = JSON.parse(req.body.hash)
    decrypt(hashh, crypto);
    res.json(decryptedVar)
}