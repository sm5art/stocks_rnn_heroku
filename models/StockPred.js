var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema( {
          date: { type: Date, default: Date.now },
          symbol: String,
          prediction: Number,
          pred_date: Date,
          previous_points: [{date: Date, value: Number}]
})

module.exports = mongoose.model('stock_pred', stockSchema);
