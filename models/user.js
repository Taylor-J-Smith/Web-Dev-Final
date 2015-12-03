// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	    local        : {
        name         : {type: String, default: "" },
        email        : {type: String, default: "" },
        password     : {type: String, default: "" },
        score1       : {type: Number, default: 0 },
        score2		 : {type: Number, default: 0 },
        score3		 : {type: Number, default: 0 },
        score4		 : {type: Number, default: 0 }
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);