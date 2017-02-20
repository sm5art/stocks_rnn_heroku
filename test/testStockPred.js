var mongoose = require('mongoose')
var should = require('should')

var StockController = require('../controllers/Stock');
var StockPredController = require('../controllers/StockPred')
var Stock = require('../models/Stock');
var StockPred = require('../models/StockPred')
var User = require('../models/User');
var NASDAQ = require('../models/NASDAQ');


describe("StockPredController", function(){
  var user = null;
  var stock = null;

  before(function(done){
    mongoose.connect(process.env.MONGODB_TEST)
    mongoose.connection.once('connected', () => {
      mongoose.connection.db.dropDatabase(function(err){
        if(err){
          console.log(err)
        }
        else{
          done()
        }
      });
    });
  });


  after(function(done){
    mongoose.disconnect();
    done()
  })

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
             var FB = new NASDAQ({symbol: "FB"});
              FB.save(function(err, fb){
                if(err)
                 console.log(err);
                else {
                  StockController.add_stock(user._id, aapl.symbol, function(err, stock){
                    if(err)
                      console.log(err);
                    else {
                      StockController.add_stock(user._id, fb.symbol, function(err, stock){
                        done()
                      })
                    }
                  })
                }
              })
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

  it('creates a list of stock predictions of a list of stock symbols', function(done){
    var id = user._id.toString();
    var symbols = ['AAPL', 'FB'];

    StockPredController.retrievePredictions(symbols, function(err, predictions){
      if(err){
        console.log(err)
      }
      else {
        predictions.length.should.equal(2)
        done()
      }
    })
  })

  it('creates a list of stock predictions for a user', function(done){
    var id = user._id.toString();
    StockPredController.retrievePredictionsForUser(id, function(err, predictions){
      if(err){
        console.log(err)
      }
      else {
        predictions.length.should.equal(2)
        done()
      }
    })
  })

});
