const mongoose = require('mongoose');
const config = require('./dbconfig.json');
mongoose.connect(config.connectionString, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = {
    User:require('../dbconfiguration/users.model'),
    State:require('../dbconfiguration/state.model'),
    ProfileURL:require('../dbconfiguration/profileURL.model'),
    Occupation:require('../dbconfiguration/occupation.model')
};