const bcrypt = require("bcryptjs");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: String,
    password: String,
    email: String,
    loginHistory: [ 
        {dateTime: Date, userAgent: String}
    ]
});

let User;



module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        let uri = "mongodb+srv://dbUser:dbUser@senecaweb.przehd8.mongodb.net/?retryWrites=true&w=majority";
        let db = mongoose.createConnection(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        db.on('error', (err) => {
            reject(err); 
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};




module.exports.registerUser = function(userData) {
    return new Promise(function(resolve, reject) {
        if (userData.password == "" || userData.password == null) {
            reject("Error: user name cannot be empty or only white spaces!");
        } else if (userData.password != userData.password2) {
            reject("Error: Passwords do not match");
        } else {
            bcrypt.hash(userData.password, 10).then((hash) => {
                userData.password = hash;
            let newUser = new User(userData);
            newUser.save((err) => {
                if (err) {
                    if (err.code == 11000) {
                        reject("User Name already taken");
                    } else {
                        reject("There was an error creating the user: " + err);
                    }
                } else {
                    resolve();
                }
            });
        }).catch((err) => {
            reject("There was an error encrypting the password");
        });
        }
    });
};





module.exports.checkUser = function(userData) {
    return new Promise(function(resolve, reject) {
        User.findOne({userName: userData.userName}).exec().then((foundUser) => {
            if (foundUser == null) {
                reject("Unable to find user: " + userData.userName);
            } 
            bcrypt.compare(userData.password, foundUser.password).then((res) => {
                if (res == true) {
                    foundUser.loginHistory.push(
                        {dateTime: (new Date()).toString(), userAgent: userData.userAgent}
                        );
                    User.update({userName: foundUser.userName}, {$set: {loginHistory: foundUser.loginHistory}}).exec().then(() => {
                        resolve(foundUser);
                    }).catch((err) => {
                        reject("There was an error verifying the user: " + err);
                    });
                } else {
                    reject("Incorrect Password for user: " + userData.userName);
                }
            }).catch((err) => {
                reject("There was an error encrypting the password");
            });
        }).catch((err) => {
            reject("Unable to find user: " + userData.userName);
        }
        );
    });
};

