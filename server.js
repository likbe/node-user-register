var config = require("./config.js");
var http = require("http");
var flash = require("connect-flash");
var express = require("express");
var redisStore = require("connect-redis")(express);
var path = require("path");
var mongoose = require("mongoose");
var errors = require("./apis/errors.js");
var accountService = require("./apis/accountService.js");
var passwordService = require("./apis/passwordService.js");
var authorizationService = require("./apis/authorizationService.js")

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

mongoose.connect('mongodb://'+config.mongodb.user + ':'+ config.mongodb.password+'@'+config.mongodb.host+':'+config.mongodb.port +'/'+config.mongodb.database);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  accountService.findUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {   
        passwordService.validatePassword(username, password, function(err, user) {
            if (err) {
              if (err == errors.INVALID_PASSWORD_USER_DOES_NOT_EXIST) { return done(null, false, {message: 'Unknown user ' + username}); }
              else if (err == errors.INVALID_PASSWORD_USER_IS_NOT_ACTIVE) { return done(null, false, {message: 'User is inactive'}); }
              else if (err == errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH) { return done(null, false, {message: 'Invalid password'}); }
            }
            else
            {
              return done(null, user)
            }
        });
  }
));

var app = module.exports = express();
var server = http.createServer(app);

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  // Configure session to use Redis as store
  app.use(express.session({ store: new redisStore({
    host:config.redis.host, 
    port:config.redis.port, 
    pass:config.redis.password,
    prefix:config.redis.prefix}), 
    secret:config.redis.secret })
  );
 
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use(app.router);

  // Serve static files like CSS, JS, ... placed in the folder named 'static'
  app.use("/static", express.static(path.join(__dirname, "static")));

  // Help to debug things
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  // Set views directory and associated view engine (jade)
  app.set('views', path.join(__dirname, "views"));  
  app.set('view options', { layout: true }); 
  app.set('view engine', 'jade');
});

var home = require('./routes/homeRoute.js');
var registerRouter = require('./routes/registerRoute.js');
var accountRouter = require('./routes/accountRoute.js');
var workspaceRouter = require('./routes/workspaceRoute.js');
var dashboardRouter = require('./routes/dashboardRoute.js');

var workspaceService = require('./services/workspaceRestService.js');

app.get('/', home.index);

app.get('/user/register', registerRouter.index);
app.get('/user/activate/:activationKey', registerRouter.activate);
app.get('/user/desactivateUser/:activationKey', registerRouter.desactivateUser);
app.get('/users', authorizationService.ensureSecurity, registerRouter.listUsers);
app.post('/user/register', registerRouter.registerUser);
app.post('/user/activate', registerRouter.activateUser);
app.get('/user/dashboard', authorizationService.ensureSecurity, dashboardRouter.dashboard);
app.get('/user/account', authorizationService.ensureSecurity, accountRouter.myAccount);
app.post('/user/changePassword', authorizationService.ensureSecurity, accountRouter.changePassword);

app.get('/user/login', function(req, res, next) {
  res.render('signin', {message: req.flash('error')});
});
app.post('/user/login',
 passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }),
  function(req, res) {
    accountRouter.login(res, req.user);
  });
app.post('/user/logout', accountRouter.logout);

app.post('/user/resend-activation-link', registerRouter.resendActivationLink)

app.get('/workspace/create', authorizationService.ensureSecurity, workspaceRouter.createNew);
app.post('/workspace/create', authorizationService.ensureSecurity, workspaceRouter.create);
app.get('/workspace/:workspaceId', authorizationService.ensureSecurity, workspaceRouter.view);
app.get('/services/workspacesList', authorizationService.ensureSecurity, workspaceService.getWorkspacesByOwner);

server.listen(config.node.port);
console.log("NodeJS is listening on http:/"+config.node.host+":"+config.node.port);

