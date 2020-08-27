const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  stateCode: { type: String, required: true },
  stateName: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated:{ type: Date, default: Date.now },
  isDeleted:{type:Boolean,default:false}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('State', schema);
