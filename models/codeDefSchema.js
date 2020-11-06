const mongoose = require('mongoose');
const schema = mongoose.Schema;

const codeDefSchema = new schema({
  code: { type: Number, default: 0 },
  code_type: { type: Number, default: 0 },
  definition: { type: String, default: '' },
  picture_url: { type: String, default: '' },
});

module.exports.codeDefModel = mongoose.model('code_definition', codeDefSchema);
