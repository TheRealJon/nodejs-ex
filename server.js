//  OpenShift sample Node application
const express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    persona = require('./data/persona.json'),
    personas = require('./data/personas.json'),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser');

Object.assign=require('object-assign')

// Use handlebars template engine
app.engine('handlebars', handlebars({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

// Serve static files from assets folder
app.use('/assets', express.static('assets'));

// Server logging
app.use(morgan('combined'))

// Required to parse form data into request body
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }
    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';
    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

// TODO break out route handlers into separate js files for organization

app.get('/', function (req, res) {
  navItems = [
    {
      active: true,
      path: "/",
      name: "Persona List"
    },
    {
      active: false,
      path: "/persona/card",
      name: "Persona Card"
    },
    {
      active: false,
      path: "/persona/details",
      name: "Persona Details"
    },
    {
      active: false,
      path: "/create",
      name: "Add/Edit persona"
    },
  ];
  res.render('home', {personas, navItems});
});

// TODO add id url param and get from mongodb
app.get('/persona/card', function(req, res){
  // TODO retrieve persona from mongodb
  navItems = [
    {
      active: false,
      path: "/",
      name: "Persona List"
    },
    {
      active: true,
      path: "/persona/card",
      name: "Persona Card"
    },
    {
      active: false,
      path: "/persona/details",
      name: "Persona Details"
    },
    {
      active: false,
      path: "/create",
      name: "Add/Edit persona"
    },
  ];
  res.render('persona-card', {persona, navItems});
});

// TODO add id url param and get from mongodb
app.get('/persona/details', function(req, res){
  // TODO retrieve persona from mongodb
  navItems = [
    {
      active: false,
      path: "/",
      name: "Persona List"
    },
    {
      active: false,
      path: "/persona/card",
      name: "Persona Card"
    },
    {
      active: true,
      path: "/persona/details",
      name: "Persona Details"
    },
    {
      active: false,
      path: "/create",
      name: "Add/Edit persona"
    },
  ];
  res.render('persona-details', {persona, navItems});
})

app.get('/create', function(req, res){
  navItems = [
    {
      active: false,
      path: "/",
      name: "Persona List"
    },
    {
      active: false,
      path: "/persona/card",
      name: "Persona Card"
    },
    {
      active: false,
      path: "/persona/details",
      name: "Persona Details"
    },
    {
      active: true,
      path: "/create",
      name: "Add/Edit persona"
    },
  ];
  res.render('create-persona', {navItems});
});

// TODO implement endpoint to create new persona in mongodb
app.post('/create', function(req, res){
  var persona = {};
  Object.keys(req.body).forEach(function(key){
    if(key !== "submit"){
      persona[key] = req.body[key];
    }
  });
  res.redirect('/persona/details');
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
