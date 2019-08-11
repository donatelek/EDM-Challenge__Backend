const server = require('../server')

exports.signin = (req, res) => {
    const db = server.db
    const bcrypt = server.bcrypt
    const {
        username
    } = req.body;
    const {
        password
    } = req.body;
    if (username.length < 3 || password.length < 6) {
        return res.json('Write proper credentials')
    }

    db.select('username', 'hash').from('login').where('username', '=', username).then(data => {
        const validation = bcrypt.compareSync(password, data[0].hash);
        if (validation) {
            return db.select('*').from('users').where('username', '=', username).then(user => {
                res.json(user[0])
            })
        } else {
            res.status(400).json('wrong password')
        }
    }).catch(err => res.status(400).json('wrong password'))
}

exports.anonymous = (req, res) => {
    const db = server.db
    db.transaction(trx => {
        trx.insert({
            joined: new Date()
        }).into('users').returning('*').then(loginUsername => {
            res.json(loginUsername[0])
        }).then(trx.commit).catch(trx.rollback)

    }).catch(err => res.json('error creating anonymous user'))
}