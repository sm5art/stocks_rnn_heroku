var Stock = require('../models/Stock');
var StockPred = require('../models/StockPred');
var NASDAQ = require('../models/NASDAQ');

module.exports.list_stocks = function(req,res) {
	this.list_for_user_id(req.user._id, (err, stocks) => {
		res.json(stocks)
	})
}

module.exports.post_stock = function(req, res){
	this.add_stock(req.body.symbol, req.user._id, (err, stock)=>{
		if(err){
			res.json({err: true})
		}
		res.json({err: false, stock})
	})
}

module.exports.add_stock = function(symbol, user_id, cb) {
	NASDAQ.findOne({symbol}, function(err, stock) {
		if(err)
			cb(err, null);
		Stock.find({symbol, 'requested_by_user_id': user_id}, function (err, stock) {
			if(err){
				cb(err, null)
			}
			if(stock){
				cb(null, stock)
			}
			else if(!stock){
				stock = new Stock({"requested_by_user_id": user_id, symbol})
				stock.save(function(err, stock){
					if(err)
						cb(err, null);
					cb(null, stock)
				})
			}
		});
	})
}

//Helpers

module.exports.list_for_user_id = function(user_id, cb){
		Stock.find({'requested_by_user_id':user_id},function(err,stocks){
			cb(err, stocks)
		});
}
