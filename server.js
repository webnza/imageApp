'use strict';

const express 	    = require('express');
const cookieParser 	= require('cookie-parser');
const bodyParser 	= require('body-parser');
const jwt           = require('jsonwebtoken');
const cors          = require('cors');
const fs            = require('fs');
const multer        = require('multer');
const imageThumbnail = require('image-thumbnail');

const config        = require('./src/config/config');
var upload          = multer({ dest: '/tmp/'});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const AuthMiddleware = require('./src/middlewares/auths');
const authMiddleware = new AuthMiddleware();

const UsersModel = require('./src/models/users');
const usersModel = new UsersModel();

const logger = require('./src/helpers/loggers');

app.use(express.static('public'));

let options = { percentage: 25, width:50, height:50, responseType: 'base64' }

app.post('/api/create-thumb', authMiddleware.verifyTokenAuth, upload.single('file'), function (req, res) {
    const file = "public/images/" + req.file.originalname;
    fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
            if(err){
                console.log(err);
            } else {
                try {
                    imageThumbnail(file, options).then(thumbnail => { 
                        res.end(thumbnail);
                    }).catch(err => console.error(err));
                } catch (err) {
                    console.error(err);
                }  
            }
        });
    });
});

app.post('/api/login', authMiddleware.loginRequestValidate, function(req, res){
    usersModel.getUserByUsername(req.body.username, function (err, user) {
        if (err) { 
            throw err; 
        }
        if (!user || user == false) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            usersModel.comparePassword(req.body.password, user, function(err, isMatch) {
                if(err) {
                    throw err;
                }
                if(isMatch){
                    const token = jwt.sign({data: user}, config.secret, { expiresIn: 60 * 1 });
                    res.json({success: true, token: token});   
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

// Main Application Route
app.get('/*', authMiddleware.htmlHeader, function(req, res){
    res.send(__dirname + '/public/index.html');
});

app.set('port', (config.port || 3000));
app.listen(app.get('port'), function(){
    console.log('I\'m Listening... on port number '+ app.get('port'));
});