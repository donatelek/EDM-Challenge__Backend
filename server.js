const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const crypto = require('crypto');

const register = require('./route/register');
const signin = require('./route/signin');
const lvl = require('./route/lvl');
const points = require('./route/points');
const localStorage = require('./route/localStorage');
const music = require('./route/music')

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});

// const db = knex({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: 'postgres',
//         password: 'password',
//         database: 'postgres'
//     }
// });


const app = express();

// exports
exports.db = db;
exports.crypto = crypto;
exports.bcrypt = bcrypt;
exports.app = app;


app.use(cors())
app.use(bodyParser.json());
app.set('x-powered-by', false)


// routes
app.get('/', (req, res) => {
    res.send('App is running')
})
app.put('/updatehints', points.updateHints)
app.put('/updatefailedattempts', points.updateFailedAttempts)
app.put('/resethints', points.resetHints)
app.put('/resetattempts', points.failedAttempts)
app.post('/anonymous', signin.anonymous)
app.post('/saveLocalStorage', localStorage.saveLocalStorage)
app.post('/getLocalStorage', localStorage.getLocalStorage)
app.get('/scoreboard', points.scoreboard)
app.get('/music', music.getMusic)
app.post('/register', register.register)
app.post('/signin', signin.signin)
app.put('/lvleasy', lvl.lvleasy)
app.put('/lvlhard', lvl.lvlhard)
app.get('/geteasylvl/:id', lvl.geteasylvl)
app.get('/gethardlvl/:id', lvl.gethardlvl)
app.get('/getlvlpassword/:lvl', lvl.getLvlPassword)
app.get('/getlvlpasswordhard/:lvl', lvl.getLvlPasswordHard)
app.post('/easymodePoints', points.incrementPoints)
app.post('/password', lvl.password)
app.get('*', (req, res) => {
    res.status(404)
    res.json('route not found')
})
app.use((err, req, res, next) => {
    res.status(500)
    res.send('We have encountered an error. We will try to fix it as soon as possible')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})