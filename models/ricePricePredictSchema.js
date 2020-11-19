const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ricePricePredictSchema = new schema({
  rice_price_type: { type: Number, default: 0 },
  rice_price_name: { type: String, default: '' },
  rice_price_log: [
    {
      month: Date,
      price: { type: String, default: '' },
    },
  ],
  rice_price_predict: [
    {
      month: Date,
      price: { type: String, default: '' },
    },
  ],
});

mongoose.model('trme_rice_price_all', ricePricePredictSchema);
