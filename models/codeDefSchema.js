const mongoose = require('mongoose');
const schema = mongoose.Schema;

const codedefSchema = new schema({
  code: Number,
  code_type: Number,
  definition: String,
  picture_url: String,
});

mongoose.model('code_definition', codedefSchema);
