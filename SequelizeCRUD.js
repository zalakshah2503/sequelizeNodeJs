var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var app = express()

var port = process.env.PORT || 8080;

//Database Config
var sequelize = new Sequelize("mydb", "root", "P@ssw0rd", {
    host: "localhost",
    dialect: "mysql"
});

var User = sequelize.define('users', {   
   username: {
       type: Sequelize.STRING        
   },
   password: { type: Sequelize.STRING }
});

sequelize.sync({ force: true }).then(function () {
    // Table created    
});

app.use(bodyParser.json());       //to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     //to support URL-encoded bodies
    extended: true
}));

var server = app.listen(3000, "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

//rest api to get all results
app.get('/api/users', function (req, res) {
    User.findAll().then(function (user) {
        res.json(user);
    });
});

//rest api to get a single employee data
app.get('/api/users/:id', function (req, res) {
    User.findOne(
        { where: { id: req.params.id } })
        .then(function (user) {
            if (user) {
                res.json(user);
            } else {
                res.send(401, "User not found");
            }
        })
});

//rest api to create a new record into mysql database
app.post('/api/users', function (req, res) {
    var postData = req.body;
    var username = req.body.username; //bodyParser does the magic
    var password = req.body.password;

    User.build
        ({ username: username, password: password })
        .save()
        .success(res.json({ message: 'User created!' }))
        .error(res.json({ message: 'User not created!' }));
});

//rest api to update record into mysql database
app.put('/api/users/:id',
    function (req, res) {  
    user.username = req.body.username;
    user.password = req.body.password;

    User.update({
        username: user.username,
        password: user.password
    },
        {
            where: {
                id: req.params.id
            }
        })
        .then(function (user) {
            if (user) {
                res.json(user);
            } else {
                res.send(401, "User not found");
            }
        })
});

//rest api to update record into mysql database
app.delete('/api/users/:id', function (req, res) {
    User.destroy(
        {
            where: { id: req.params.id }
        })
        .then(function (user) {
            if (user) {
                res.send(401, "User Deleted");
            } else {
                res.send(401, "User not found");
            }
        })
});
