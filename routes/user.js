var express = require('express');
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a index user');
});

/* register User*/
router.post('/register', function(req, res, next) {

    var email = req.body.email;
    var username = req.body.userName;
    var password = req.body.password;

    models.User.findOne({
        attributes: ['email'],
        where: { email: email },
    })
    .then(function(userFound){
        if (!userFound){
            bcrypt.hash(password, 5, function(err, bcryptedPassword){
                let newUser = models.User.create({
                    email: email,
                    userName: username,
                    password: bcryptedPassword,
                    isAdmin: 0
                })
                .then(function(newUser){
                  return res.status(201).json({
                      'userId': newUser.id
                  })
                })
                .catch(function(err){
                    return res.status(500).json({ 'error': err});
                });
            });
        }
        else{
            return res.status(409).json({ 'error': 'user already exist'});
        }
    })
    .catch(function(err){
        return res.status(500).json({'error': 'unable to verify user'});
    });


});

/* Login User*/
router.post('/login', function(req, res, next) {
    let email =  req.body.email;
    let password = req.body.password;

    models.User.findOne({
        where: { email: email }
    })
    .then(function(userFound){
        if(userFound){
            bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                if(resBycrypt){
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    });
                }
                else{
                    return res.status(403).json({ 'error': 'invalid password'});
                }
            });
        }
        else{
            return res.status(404).json({ 'error': 'user not exist in DB'});
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user'});
    })
});

module.exports = router;
