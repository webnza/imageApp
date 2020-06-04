'use strict';

const jwt       = require('jsonwebtoken');
const config    = require('./../config/config');

function UsersModel(){};

/* Get Single User by username */
UsersModel.prototype.getUserByUsername = function(username, callback) {
    if(config.credentials[username]){
        return callback(null, config.credentials[username]);    
    } else {
        return callback(null, false);
    }
};

/* Compare Password */
UsersModel.prototype.comparePassword = function(condidatePassword, hash, callback) {
    if(condidatePassword == hash){
        return callback(null, true); 
    } else {
        return callback(null, false); 
    }
};

module.exports = UsersModel;