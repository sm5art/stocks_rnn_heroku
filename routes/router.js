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
            successRedirect: '/profile',
            failureRedirect: '/login'
    }));

    app.get('/session', (req, res) => {
      if(req.user)
        res.json({user: req.user})
      else {
        res.json({state:false})
      }
    })


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
