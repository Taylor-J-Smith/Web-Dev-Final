var User = require('../models/user');
var jwt = require('jsonwebtoken');

module.exports = function(app, express) {
 
  app.post('/api/signup', function(req, res) {
    User.find({'local.email': req.body.email}, function(err, user) {
      if (user.length == 0) {
        var user = new User();
        user.local.name = req.body.name;
        user.local.password = user.generateHash(req.body.password);
        user.local.email = req.body.email;
        user.save();
        res.json({
          success: true
        });
      } else {
        res.json({
          success: false
        });
      }
    });
  });

  app.post('/api/login', function(req, res) {
    User.findOne({
      'local.email': req.body.email
    }, function(err, user) {
      if (user){
      if (user.validPassword(req.body.password)) {
        console.log(user.local);
        var token = jwt.sign({ _id: user._id,group:user.local.group,email:user.local.email}, app.get('superSecret'), {expiresIn: 300});
        user.local.token = token;
        user.save();
        res.json({
          success: true,
          token: token
        });
      } else {
        res.json({
          success: false
        });
      }


    }
    else
    {
      res.json({
          success: false
        });
    }
    });
  });


function isLoggedIn(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;   
        next();
      }
    });
  } else {
    return res.json({ success: false, message: 'Not Authorized.'}); 
  }
}

   app.get('/api/user',isLoggedIn, function(req, res) {
 User.findOne({_id:req.decoded._id}, function(err, user) {
res.json({ success: true, message: user}); 
 });
  });

app.get('/api/*', function(req, res) {
    res.status(404).send({ 
        success: false
    });
  });


}