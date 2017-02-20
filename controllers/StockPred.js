var StockPred = require('../models/StockPred');
var StockController = require('../controllers/Stock');
var Stock = require('../models/Stock');

module.exports.list_predictions = function(req, res){
  module.exports.retrievePredictionsForUser(req.user._id, function(err, predictions){
    if(err){
      res.json({error: true});
    }
    else {
      res.json({error: false, predictions})
    }
  });
}

module.exports.get_prediction = function(req, res){
  module.exports.retrievePredictions([req.body.symbol.toUpperCase()], function(err, prediction){
    if(err){
      res.json({error: true});
    }
    else {
      res.json({error: false, prediction})
    }
  });
}

module.exports.retrievePredictions = function(symbols, cb) {
  StockPred.find({"symbol":{"$in": symbols}}, function(err, stock_predictions) {
    if(err){
      cb(err, null)
    }
    else {
      cb(null, stock_predictions)
    }
  })
}

module.exports.retrievePredictionsForUser = function(user_id, cb) {
  StockController.getSymbolsForUser(user_id, function(err, symbols){
    if(err){
      cb(err, null)
    }
    else {
      module.exports.retrievePredictions(symbols, function(err, predictions){
        if(err){
          cb(err, null)
        }
        else{
          cb(null, predictions)
        }
      })
    }
  })
}
