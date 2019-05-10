const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

//Middleware
app.use(express.json());
app.use(function (req, res, next){
    console.log(`Got ${req.method} request on ${req.url} at ${(new Date()).toLocaleTimeString()}`);
    next();
});

//To serve static files in public folder. Express will automatically serve index.html when you go to localhost:5000/ in the browser
app.use(express.static('public'));

//Token verification middleware
app.use(function (req, res, next){
    const url = req.url;
    if(['/signup', '/login', '/'].includes(url)){
        return next();
    } else {
        let token = req.headers['x-access-token'];
        if(!token){
            return res.status(401).send('Please log in');
        };
        jwt.verify(token, 'random string', function(error, decoded){
            if(error){
                return res.status(500).send('Failed to authenticate');
            }
            if(database.users[decoded.user]){
                return next();
            }
            return res.status(401).send('Please log in');
        })
    }
});

//Database
let database = {homes: [{address: 'RBK', students: ['a','b','c']}], 
                users: {}};

//API
//sendFile example (not neccesary if using express.static middleware);
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '/public', 'index.html'));
// });

app.post('/signup', function (req, res) {
    //Get user and password from request body
    let user = req.body.user;
    let password = req.body.password;
    //Check if user already exists
    if(database.users[user]){
        return res.status(400).send(`User ${user} already exists`);
    } else {
        //Hash the password and saved it in the database
        let hashedPassword = bcrypt.hashSync(password, 10);
        database.users[user] = hashedPassword;
        res.send('ok');
    }
});

app.post('/login', function (req, res) {
    let user = req.body.user;
    let password = req.body.password;
    //Get encrypted user password from database and compare to provided password
    //If passwords match, create token and send it to frontend
    if(database.users[user] && bcrypt.compareSync(password, database.users[user])){
        jwt_token = jwt.sign({user: user}, 'random string', {expiresIn: 10});
        return res.status(200).send({ auth: true, token: jwt_token });
    };
    return res.status(401).send('Failed to login')
});

app.get('/homes', function (req, res) {
    res.send(database.homes);
});

app.post('/homes/add', function (req, res) {
    let newHome = req.body;
    database.homes.push(newHome);
    res.send(newHome);
});

// Asynchronous code example -------->
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

app.get('/working', function (req, res) {
    doLotsOfWork('coding', finishedWork, res);
});
// <---------------

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});