const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ricevaritiesSchema = new schema({
  ID: Number,
  rice_varieties_name: String,
  rice_price_type: Number,
  rice_year_release: Number,
  rice_light_refraction: String,
  rice_flour_types: String,
  rice_product: Number,
  rice_life_time: Number,
  rice_height: Number,
  rice_amylose_content: String,
  rice_cooking_qualities: String,
  rice_aroma: String,
  rice_blast_resistant: Number,
  bacterial_leaf_blight_resistant: Number,
  brown_spot_resistant: Number,
  rice_ragged_stunt_resistant: Number,
  yellow_orange_leaf_resistant: Number,
  brown_planthopper_resistant: Number,
  whitebacked_planthopper_resistant: Number,
  green_rice_leafhopper_resistant: Number,
  rice_gall_midge_resistant: Number,
  rice_stem_borers_resistant: Number,
  rice_recommended_area: String,
  rice_caution: String,
});

mongoose.model('rice_varieties_data', ricevaritiesSchema);
