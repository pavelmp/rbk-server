const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

//Middleware
app.use(express.json());
app.use(function (req, res, next){
    console.log('Time is', Date.now());
    next();
});
app.use(function (req, res, next){
    const url = req.url;
    console.log(url);
    next();
});

const checkToken = function(req, res, next){
    let user = req.headers['user'];
    let token = req.headers['x-access-token'];
    const savedToken = database.tokens[user];
    if(!savedToken){
        return res.status(401).send('Please log in');
    } else {
        jwt.verify(token, 'random string', function(error, decoded){
            if(error){
                return res.status(500).send('Failed to authenticate');
            }
            if(decoded == user){
                return next()
            }
            return res.status(401).send('Please log in');
        })
    }
};

//Database
let database = {homes: [{address: 'RBK', students: ['a','b','c']}], 
                users: {},
                tokens: {}};

//API
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/signup', function (req, res) {
    let user = req.body.user;
    let password = req.body.password;
    if(database.users[user]){
        return res.status(400).send(`User ${user} already exists`);
    } else {
        let hashedPassword = bcrypt.hashSync(password, 10);
        database.users[user] = hashedPassword;
        res.send('ok');
    }
});

app.post('/login', function (req, res) {
    let user = req.body.user;
    let password = req.body.password;
    if(database.users[user] && bcrypt.compareSync(password, database.users[user])){
        jwt_token = jwt.sign(user, 'random string');
        database.tokens[user] = jwt_token;
        res.status(200).send({ auth: true, token: jwt_token });
    };
});

app.get('/homes', checkToken, function (req, res) {
    res.send(database.homes);
});

function doLotsOfWork(type, tiredEshraq, res){
    console.log(`Doing lots of ${type}`);
    setTimeout(function(){
        tiredEshraq(res)
    }, 5000);
}

function finishedWork(res){
    console.log('Finished');
    res.send('ok');
}

app.get('/working', checkToken, function (req, res) {
    doLotsOfWork('coding', finishedWork, res);
});

app.post('/homes/add', checkToken, function (req, res) {
    let newHome = req.body;
    database.homes.push(newHome);
    res.send(newHome);
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});