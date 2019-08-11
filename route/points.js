const server = require('../server')


exports.incrementPoints = (req, res) => {
    const db = server.db
    const id = req.body.id;
    const lvl = req.body.lvl
    let calculate = []
    if (!id || !lvl) {
        return res.json('something wrong with increment points')
    }
    if (lvl === 'easy') {
        db('users').where('id', '=', id).then(res => {
            calculate.push(res[0].usedhints)
            calculate.push(res[0].failedattempts)
        }).then(update => {
            const x2 = calculate[0] * 2;
            const final = 6 - (x2 + calculate[1]);
            if (final > 0) {
                db('users').where('id', '=', id).increment('easylvl', final).returning('*').then(user => {
                    res.json(user[0])
                }).catch(err => res.status(400).json('unable to update points <0'))
            } else {
                db('users').where('id', '=', id).increment('easylvl', 0).returning('*').then(user => {
                    res.json(user[0])
                }).catch(err => res.status(400).json('unable to update points 0'))
            }
        })
    } else if (lvl === 'hard') {
        db('users').where('id', '=', id).then(res => {
            calculate.push(res[0].usedhintshard)
            calculate.push(res[0].failedattemptshard)
        }).then(update => {
            const x2 = calculate[0] * 2;
            const final = 6 - (x2 + calculate[1]);
            if (final > 0) {
                db('users').where('id', '=', id).increment('hardmode', final).returning('*').then(user => {
                    res.json(user[0])
                }).catch(err => {
                    res.status(400).json('unable to update points <0')
                })
            } else {
                db('users').where('id', '=', id).increment('hardmode', 0).returning('*').then(user => {
                    res.json(user[0])
                }).catch(err => res.status(400).json('unable to update points 0'))
            }
        })
    }

}
exports.failedAttempts = (req, res) => {
    const db = server.db
    const id = req.body.id;
    const lvl = req.body.lvl
    if (!id || !lvl) {
        return res.json('something wrong with failed attempts')
    }
    if (lvl === 'easy') {
        db('users').where('id', '=', id).update('failedattempts', 0).returning('*').then(user => {
            res.json(user[0])
        })
    } else if (lvl === 'hard') {
        db('users').where('id', '=', id).update('failedattemptshard', 0).returning('*').then(user => {
            res.json(user[0])
        })
    }

}

exports.updateFailedAttempts = (req, res) => {
    const db = server.db
    const id = req.body.id;
    const lvl = req.body.lvl
    if (!id || !lvl) {
        return res.json('something wrong with updating failed attempts')
    }
    if (lvl === 'easy') {
        db('users').where('id', '=', id).increment('failedattempts', 1).returning('*').then(user => {
            res.json(user[0])
        }).catch(err => res.status(400).json('unable to update failed attempts'))
    } else if (lvl === 'hard') {
        db('users').where('id', '=', id).increment('failedattemptshard', 1).returning('*').then(user => {
            res.json(user[0])
        }).catch(err => res.status(400).json('unable to update failed attempts'))
    }

}

exports.updateHints = (req, res) => {
    const db = server.db
    const id = req.body.id;
    const lvl = req.body.lvl
    if (!id || !lvl) {
        return res.json('something wrong with updating hints')
    }
    if (lvl === 'easy') {
        db('users').where('id', '=', id).increment('usedhints', 1).returning('*').then(lvl => {
            res.json(lvl[0])
        }).catch(err => res.status(400).json('unable to update lvl'))
    } else if (lvl === 'hard') {
        db('users').where('id', '=', id).increment('usedhintshard', 1).returning('*').then(lvl => {
            res.json(lvl[0])
        }).catch(err => res.status(400).json('unable to update lvl'))
    }

}

exports.resetHints = (req, res) => {
    const db = server.db
    const id = req.body.id;
    const lvl = req.body.lvl
    if (!id || !lvl) {
        return res.json('something wrong with reseting hints')
    }
    if (lvl === 'easy') {
        db('users').where('id', '=', id).update('usedhints', 0).returning('*').then(user => {
            res.json(user[0])
        })
    } else if (lvl === 'hard') {
        db('users').where('id', '=', id).update('usedhintshard', 0).returning('*').then(user => {
            res.json(user[0])
        })
    }

}

exports.scoreboard = (req, res) => {
    const db = server.db
    db.select('*').from('users').then(result => {
        res.json(result)
    })
}