module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      if(req.user)
        res.redirect('/profile')
      else
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/logout',function(req,res){
      req.logout();
      res.redirect('/');
    });

    app.get('/login',
      passport.authenticate('google', { scope:
        [ 'profile' ] }
    ));

    app.get( '/auth/google/callback',
        passport.authenticate( 'google', {
            successRedirect: '/profile',
            failureRedirect: '/login'
    }));


    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs',{user:req.user});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
