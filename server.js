//dependencies
var express = require('express');
path = require('path'),
app = express(),
port = process.env.PORT,
bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser')
var passport = require('passport');
var flash = require('connect-flash')
var session = require('express-session');
var redisStore = require('connect-redis')(session);


//db connection
mongoose.connect(process.env.MONGODB_URI);

//configs
require('./config/passport')(passport);

//middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session( { secret: process.env.SESSION_SECRET,
                    cookie: { maxAge: 9999999999 },
                    rolling: true,
                    resave: true,
                    saveUninitialized: false,
                    store: new redisStore({ttl:9999999999, url: process.env.REDIS_URL
                  })}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


//set views and engines and routing
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
require('./routes/router')(app,passport);
app.get('*', function(req, res) {
    res.render("index.ejs");
});
app.listen(port);
console.log("server running on port "+port)
