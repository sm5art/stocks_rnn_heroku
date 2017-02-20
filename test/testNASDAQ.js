var mongoose = require('mongoose')
var should = require('should')

var NASDAQController = require('../controllers/NASDAQ');

var NASDAQ = require('../models/NASDAQ');


describe("NASDAQController", function(){
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
    var AAPL = new NASDAQ({symbol: "AAPL"});
    AAPL.save(function(err, aapl){
      if(err){
        console.log(err);
      }
      else {
        var FB = new NASDAQ({symbol: "FB"});
        FB.save(function(err, fb){
          if(err)
           console.log(err);
          else {
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

  it('get stock data from symbol', function(done){
    var symbol = 'AAPL';
    NASDAQController.getInfoForSymbol('AAPL', function(err, stock){
      if(err){
        console.log(err)
      }
      else{
        stock.length.should.equal(1)
        done()
      }
    })
  })

});
