const server = require('../server')

exports.register = (req, res) => {
    const {
        username,
        password
    } = req.body;


    if (username.length < 3 || password < 6) {
        res.json('Your password should be at least 6 characters')
    } else {
        const db = server.db
        const bcrypt = server.bcrypt

        db.select('*').from('users').where('username', '=', username).then(data => {
            if (data.length) {
                res.json('user exist')
            } else {
                const hash = bcrypt.hashSync(password);
                db.transaction(trx => {
                    trx.insert({
                        hash,
                        username
                    }).into('login').returning('username').then(loginUsername => {
                        return trx('users').returning('*').insert({
                            username: loginUsername[0],
                            joined: new Date()
                        }).then(user => {
                            res.json('success')
                        })
                    }).then(trx.commit).catch(trx.rollback)
                }).catch(err => res.status(400).json('user exist'))
            }
        })
    }
}