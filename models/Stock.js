var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema( {
          requested_by_user_id: String,
          date: { type: Date, default: Date.now },
          symbol: String
})

module.exports = mongoose.model('stock', stockSchema);
