var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nasdaqSchema = new Schema( {
          sector: String,
          symbol: String,
          summary_quote: String,
          market_cap: String,
          name: String,
          industry: String
})

module.exports = mongoose.model('NASDAQ', nasdaqSchema, 'NASDAQ');
