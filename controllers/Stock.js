var Stock = require('../models/Stock');
var StockPred = require('../models/StockPred');

module.exports.list_stocks = function(req,res) {
	this.list_for_user_id(req.user._id, (err, stocks) => {
		res.json(stocks)
	})
}

module.exports.post_stock = function(req, res){
	this.add_stock(req.body.symbol, req.user._id, (err, stock)=>{
		if(err){
			console.log(err)
		}
		res.json(stock)
	})
}

module.exports.add_stock = function(symbol, user_id, cb) {
	Stock.findOne({symbol, 'requested_by_user_id': user_id}, function (err, stock) {
		if(err){
			cb(err, stock)
		}
		if(stock){
			cb(err, stock)
		}
		else if(!stock){
			stock = new Stock({"requested_by_user_id": user_id, symbol})
			stock.save(function(err, stock){
				cb(err, stock)
			})
		}
	});
}



//Helpers

module.exports.list_for_user_id = function(user_id, cb){
		Stock.find({'requested_by_user_id':user_id},function(err,stocks){
			cb(err, stocks)
		});
}
