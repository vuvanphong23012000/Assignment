var express = require('express');
var router = express.Router();

// thay the duong dan mongo cua cac ban
var urlDB = 'mongodb+srv://phongvvph12450:Oanhbong97@cluster0.9c8cf.mongodb.net/tinder?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected!!!!')
});

var multer = require('multer')
var path = 'uploads/'
var upload = multer({dest: path})
// username
// password
// name
// address
// number_phone

var user = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    address: String,
    number_phone: String,
    avatar: String
})

/* GET home page. */
router.post("/usersData", async (req, res) => {
    var userConnect=db.model('users',user);
    const u = new userConnect(req.body);
    try {
        await u.save();
        res.send(u);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post("/deleteData", (req, res) => {
    db.model('users',user).findByIdAndRemove(req.body.id)
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});
router.post("/updateData", (req, res) => {
    db.model('users',user).findByIdAndUpdate(req.body.id, {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        number_phone: req.body.number_phone,
    })
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});
router.get('/getUsers', function (req, res) {
    var connectUsers = db.model('users', user);
    var baseJson = {
        errorCode: undefined,
        errorMessage: undefined,
        data: undefined
    }
    connectUsers.find({}, function (err, users) {
        if (err) {
            baseJson.errorCode = 403
            baseJson.errorMessage = '403 Forbidden'
            baseJson.data = []
        } else {
            baseJson.errorCode = 200
            baseJson.errorMessage = 'OK'
            baseJson.data = users
        }
        res.send(baseJson);
    })

});


module.exports = router;
