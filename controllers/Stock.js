var Stock = require('../models/Stock');
var StockPred = require('../models/StockPred');
var NASDAQ = require('../models/NASDAQ');

module.exports.list_stocks = function(req,res) {
	module.exports.list_for_user_id(req.user._id, (err, stocks) => {
		if(err){
			res.json({error: true})
		}
		else {
			res.json({error: false, stocks})
		}
	})
}

module.exports.post_stock = function(req, res){
	module.exports.add_stock(req.body.symbol, req.user._id, (err, stock)=>{
		if(err){
			res.json({error: true})
		}
		else{
			res.json({error: false, stock})
		}
	})
}

module.exports.add_stock = function(user_id, symbol, cb) {
	NASDAQ.findOne({symbol}, function(err, stock) {
		if(err)
			cb(err, null);
		if(stock){
			Stock.findOne({symbol, 'requested_by_user_id': user_id}, function (err, stock) {
				if(err){
					cb(err, null)
				}
				else if(stock){
					cb(null, stock)
				}
				else {
					stock = new Stock({"requested_by_user_id": user_id, symbol})
					stock.save(function(err, stock){
						if(err)
							cb(err, null);
						else{
								StockPred.findOne({symbol}, function(err, stock_pred) {
									if(err){
										cb(err, null)
									}
									else if(stock_pred){
										cb(null, stock)
									}
									else {
										stock_pred = new StockPred({symbol});
										stock_pred.save(function(err, stock_pred){
											if(err){
												cb(err, null)
											}
											else {
												cb(null, stock)
											}
										})
									}
								})
						}
					})
				}
			});
		}
		else {
			cb(new Error("stock isnt in nasdaq"), null)
		}
	})
}

//Helpers

module.exports.list_for_user_id = function(user_id, cb){
		Stock.find({'requested_by_user_id':user_id},function(err,stocks){
			cb(err, stocks)
		});
}
