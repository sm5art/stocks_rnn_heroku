var NASDAQ = require('../models/NASDAQ');
var StockController = require('../controllers/Stock');

module.exports.list_info = function(req, res) {
	module.exports.getInfoForUser(req.user._id, (err, stock_info) => {
		if(err){
			console.log(err)
			res.json({error: true})
		}
		else {
			res.json({error: false, stock_info})
		}
	})
}

module.exports.get_info = function(req, res){
  module.exports.getInfoForSymbol(req.body.symbol.toUpperCase(), function(err, stock){
    if(err){
			console.log(err)
			res.json({error: true})
		}
		else {
			res.json({error: false, stock})
		}
  })
}

module.exports.getInfoForUser = function(user_id, cb){
  StockController.getSymbolsForUser(user_id, function(err, symbols){
    if(err){
      cb(err, null)
    }
    else {
      NASDAQ.find({symbol: {"$in":symbols}}, function(err, stock_infos){
        if(err){
          cb(err, null)
        }
        else {
          cb(null, stock_infos)
        }
      })
    }
  })
}

module.exports.getInfoForSymbol = function(symbol, cb){
  NASDAQ.findOne({symbol}, function(err, stock){
    if(err){
      cb(err, null)
    }
    else if(stock){
      cb(null, [stock]);
    }
    else {
      cb(new Error("Stock not in nasdaq"), null)
    }
  })
}
