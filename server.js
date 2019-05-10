const express = require('express');
const app = express();
const port = 5000;

//Middleware
app.use(express.json());
app.use(function (req, res, next){
    console.log('Time is', Date.now());
    next();
});

//Database
let database = {homes: [{address: 'RBK', students: ['a','b','c']}]};

//API
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/homes', function (req, res) {
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

app.get('/working', function (req, res) {
    doLotsOfWork('coding', finishedWork, res);
});

app.post('/homes/add', function (req, res) {
    let newHome = req.body;
    database.homes.push(newHome);
    res.send(newHome);
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});