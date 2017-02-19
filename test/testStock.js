var mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_TEST)
var should = require('should')

var StockController = require('../controllers/Stock.js');
var Stock = require('../models/Stock.js');
var StockPred = require('../models/StockPred')
var User = require('../models/User');
var NASDAQ = require('../models/NASDAQ');


describe("StockController", function(){
  var user = null;
  var stock = null;

  beforeEach(function(done){
    var bobby = new User({
      google: {
        id: "1234",
        token: "secret token wow",
        name: "bobby spain"
      }
    });
    bobby.save(function(err, bobby){
      if(err)
        console.log(err);
      else{
        user = bobby;
        var AAPL = new NASDAQ({symbol: "AAPL"});
         AAPL.save(function(err, aapl){
           if(err)
            console.log(err);
           else {
             stock = aapl;
             done()
           }
         })
      }
    })

  });

  afterEach(function(done){
    mongoose.connection.db.dropDatabase(function(err){
      if(err){
        console.log(err)
      }
      else{
        done()
      }
    });
  });

  it('adds a valid stock object to a users watchlist', function(done){
    var id = user.google.id;
    var symbol = stock.symbol;

    StockController.add_stock(id, symbol, function(err, stock){
      if(err)
        console.log(err);
      else {
        Stock.find({}, function(err, stocks){
          stocks.length.should.equal(1)
          stocks[0].requested_by_user_id.should.equal(id)
          stocks[0].symbol.should.equal(symbol)

        })
        done()
      }
    })
  })

  it('adds a valid stock object to a users watchlist and doesnt duplicate on a second user', function(done){
    var id = user.google.id;
    var symbol = stock.symbol;
    var id2 = '341293493949'

    StockController.add_stock(id, symbol, function(err, stock){
      if(err)
        console.log(err);
      else {
        StockPred.find({}, function(err, stocks){
          stocks.length.should.equal(1)
          stocks[0].symbol.should.equal(symbol)
          StockController.add_stock(id2, symbol, function(err, stock){
            if(err)
              console.log(err);
            else {
              StockPred.find({}, function(err, stocks){
                stocks.length.should.equal(1)
                stocks[0].symbol.should.equal(symbol)
                done()
              })
            }
          })

        })
      }
    })
  })

  it('doesnt add valid stock object to a users watchlist', function(done){
    var id = user.google.id;
    var symbol = "dfadsfasdf";

    StockController.add_stock(id, symbol, function(err, stock){
      if(err){
        Stock.find({}, function(err, stocks){
          stocks.length.should.equal(0)
        })
        done()
      }
    })
  })

  it('can list the stocks of a users watchlist', function(done){
    var id = user.google.id;
    var symbol = stock.symbol;

    StockController.list_for_user_id(id, function(err, stocks){
      stocks.length.should.equal(0)
      StockController.add_stock(id, symbol, function(err, stock){
        if(err)
          console.log(err);
        else {
          StockController.list_for_user_id(id, function(err, stocks){
            stocks.length.should.equal(1)
            done()
          })
        }
      })
    })
  })

  it('doesnt duplicate a valid stock object to a users watchlist', function(done){
    var id = user.google.id;
    var symbol = stock.symbol;

    StockController.add_stock(id, symbol, function(err, stock){
      if(err)
        console.log(err);
      else {
        Stock.find({}, function(err, stocks){
          stocks.length.should.equal(1)
          stocks[0].requested_by_user_id.should.equal(id)
          stocks[0].symbol.should.equal(symbol)

          StockController.add_stock(id, symbol, function(err, stock){
            if(err)
              console.log(err);
            else {
              Stock.find({}, function(err, stocks){
                stocks.length.should.equal(1)
                stocks[0].requested_by_user_id.should.equal(id)
                stocks[0].symbol.should.equal(symbol)
                done()
              })
            }
          })
        })
      }
    })
  })

});
