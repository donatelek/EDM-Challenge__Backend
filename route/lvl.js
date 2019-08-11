const server = require('../server')



exports.lvleasy = (req, res) => {
    const db = server.db
    const {
        id
    } = req.body;
    if (!id) {
        return res.json('something wrong with increment lvl')
    }
    db('users').where('id', '=', id).increment('lvl', 1).returning('*').then(lvl => {
        res.json(lvl[0])
    }).catch(err => res.status(400).json('unable to update lvl'))
}
exports.lvlhard = (req, res) => {
    const db = server.db
    const {
        id
    } = req.body;
    if (!id) {
        return res.json('something wrong with increment lvl')
    }
    db('users').where('id', '=', id).increment('lvlhard', 1).returning('*').then(lvl => {
        res.json(lvl[0])
    }).catch(err => res.status(400).json('unable to update lvl'))
}

exports.geteasylvl = (req, res) => {
    const db = server.db
    const {
        id
    } = req.params;
    if (!id) {
        return res.json('something wrong with getting lvl')
    }
    db.select('lvl').from('users').where('id', '=', id).then(result => {
        db.select('*').from('questions').where('lvlnumber', '=', result[0].lvl).then(question => {
            if (question.length !== 0) {
                res.json(question[0])
            } else {
                res.json('END')
            }
        }).catch(err => res.status(400).json('Error getting lvl'))
    })
}
exports.gethardlvl = (req, res) => {
    const db = server.db
    const {
        id
    } = req.params;
    if (!id) {
        return res.json('something wrong with getting lvl')
    }
    db.select('lvlhard').from('users').where('id', '=', id).then(result => {
        db.select('*').from('questionshard').where('lvlnumber', '=', result[0].lvlhard).then(question => {
            if (question.length !== 0) {
                res.json(question[0])
            } else {
                res.json('END')
            }
        }).catch(err => res.status(400).json('Error getting lvl'))
    })
}
exports.password = (req, res) => {
    const db = server.db
    const {
        lvl,
        password,
        lvlDifficulty
    } = req.body;
    if (!lvl || !lvlDifficulty) {
        return res.json('something wrong with lvlpassword')
    }
    if (lvlDifficulty === 'easy') {
        db.select('*').from('lvlpasswords').where('lvl', '=', lvl).then(result => {
            if (result[0].password === password) {
                res.json('true')
            } else {
                res.json('false')
            }
        })
    } else if (lvlDifficulty === 'hard') {
        db.select('*').from('lvlpasswordshard').where('lvl', '=', lvl).then(result => {
            if (result[0].password === password) {
                res.json('true')
            } else {
                res.json('false')
            }
        })
    }

}

exports.getLvlPassword = (req, res) => {
    const db = server.db
    const {
        lvl,
    } = req.params;
    if (!lvl) {
        return res.json('something wrong with getting lvl password')
    }
    db.select('*').from('lvlpasswords').where('lvl', '=', lvl).then(result => {
        res.json(result[0].password)
    })

}
exports.getLvlPasswordHard = (req, res) => {
    const db = server.db
    const {
        lvl,
    } = req.params;
    if (!lvl) {
        return res.json('something wrong with getting lvl password')
    }
    db.select('*').from('lvlpasswordshard').where('lvl', '=', lvl).then(result => {
        res.json(result[0].password)
    })
}