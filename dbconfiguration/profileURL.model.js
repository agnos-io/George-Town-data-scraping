const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    url: { type: String, required: true ,unique:true },
    mid: { type: Number, required: true },
    index:{ type: Number, required: true },
    occupationCode: { type: String, required: true },
    stateCode: { type: String, required: true },
    updated:{ type: Date, default: Date.now },
    dataRecorded:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ProfileURL', schema);
