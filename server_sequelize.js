var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
//var cors = require('cors');

var sequelize = new Sequelize('mydb', 'root', 'P@ssw0rd', {
    host: 'localhost',
    dialect: 'mysql'
})

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//app.use(cors());

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

var Employee = sequelize.define('employee', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    joindate: { type: Sequelize.DATE },
    department: { type: Sequelize.STRING }
});

var User = sequelize.define('user', {
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING }
})

sequelize.sync().then(() => {
    // Table created
    console.log("Table Created");
}).catch(err => {
    console.log(err);
});

app.use(bodyParser.urlencoded({     //to support URL-encoded bodies
    extended: true
}));

//Get all data
app.get('/api/emp', function (req, res) {

    //res.json("Call");
    Employee.findAll().then(function (employee) {
        res.json(employee);
    }).catch(function (err) {
        console.log(err);
    });
})

//Create
app.post('/api/emp', function (req, res) {
    var postData = req.body;
    var name = req.body.name; //bodyParser does the magic
    var joindate = req.body.joindate;
    var department = req.body.department;

    Employee.build({ name: name, joindate: joindate, department: department })
        .save().then(res.json({ message: 'Employee created!' })).error(res.json({ message: 'Employee not created!' }));
});

//Update
app.put('/api/emp/:id', function (req, res) {
    //var user = User.build();

    //user.username = req.body.username;
    //user.password = req.body.password;

    var name = req.body.name;
    var joindate = req.body.joindate;
    var department = req.body.department;

    Employee.update({ username: name, joindate: joindate, department: department },
        { where: { id: req.params.id } })
        .then(function (user) {
            if (user) {
                res.send(401, "Employee Updated");
            } else {
                res.send(401, "Employee not found");
            }
        })
});

//Delete
app.delete('/api/emp/:id', function (req, res) {
    Employee.destroy(
        { where: { id: req.params.id } })
        .then(function (user) {
            if (user) {
                res.send(401, "Employee Deleted");
            } else {
                res.send(401, "Employee not found");
            }
        })
});

//Get By Id
app.get('/api/emp/:id', function (req, res) {

    Employee.findById(req.params.id)
        .then(function (employee) {
            if (employee) {
                res.json(employee);
            } else {
                res.send(401, "employee not found");
            }
        })
});

app.get('/auth/google',
    passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

var server = app.listen(8081, "localhost", function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});