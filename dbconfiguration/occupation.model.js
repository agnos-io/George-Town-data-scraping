const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    occupationCode: { type: String, required: true ,unique:true },
    occupationName: { type: String, required: true },
    isDeleted:{type:Boolean,default:false}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Occupation', schema);
