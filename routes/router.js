var StockController = require('../controllers/Stock')

module.exports = function(app, passport) {



    app.get('/logout',function(req,res){
      req.logout();
      res.redirect('/');
    });

    app.get('/auth/google',
      passport.authenticate('google', { scope:
        [ 'profile' ] }
    ));

    app.get( '/auth/google/callback',
        passport.authenticate( 'google', {
            successRedirect: '/dashboard',
            failureRedirect: '/login'
    }));

    app.get('/session', (req, res) => {
      if(req.user)
        res.json({user: req.user})
      else {
        res.json({state:false})
      }
    })

    app.post('/add_stock', isLoggedInAPI, StockController.post_stock);
    app.get('/list_stocks', isLoggedInAPI, StockController.list_stocks);
};

function isLoggedInAPI(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else {
    res.json({ auth : "false" })
  }
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
