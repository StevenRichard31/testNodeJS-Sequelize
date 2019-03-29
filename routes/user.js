
var express = require('express');
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');
var models = require('../models');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a index user');
});


router.get('/register', function(req, res, next) {
    res.status(200).json({'csrfToken': req.csrfToken()});
});
/* register User*/
router.post('/register', function(req, res, next) {

    var email = req.body.email;
    var username = req.body.userName;
    var password = req.body.password;


    /*CODE avec Waterfall test*/
    asyncLib.waterfall(
        [
            function(done){
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email },
                })
                .then(function(userFound){
                    done(null, userFound);
                })
                .catch(function(err){
                    return res.status(501).json({'error': 'unable to verify user'});
                })
            },
            function(userFound, done){
                if (!userFound){
                    bcrypt.hash(password, 5, function(err, bcryptedPassword){
                        done(null, userFound, bcryptedPassword);
                    });
                }
                else{
                    return res.status(500).json({ 'error': 'user already exist'});
                }
            },
            function(userFound, bcryptedPassword, done){

                let newUser = models.User.create({
                    email: email,
                    userName: username,
                    password: bcryptedPassword,
                    isAdmin: 0
                })
                .then(function(newUser){
                    done(newUser);
                })
                .catch(function(err){
                    return res.status(502).json({ 'error': err});
                });
            }
        ],
        function(newUser){
            if (newUser){
                return res.status(201).json({
                    'userId': newUser.id
                });
            }
            else{
                return res.status(503).json({ 'error': 'cannot add user'});
            }
        }
    );


    /*CODE Sans Waterfall test*/
    /*
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
    */

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
                        res.cookie('access_token', jwtUtils.generateTokenForUser(userFound), {httpOnly:true, secure:true});
                        res.cookie('XS');
                        res.status(200).json({
                            'userId': userFound.id
                        })
                        .end();
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

/* Info User*/
router.get('/info', function(req, res, next) {

    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth)

    if(userId < 0){
        return res.status(400).json({ 'error': 'wrong token'});
    }

    models.User.findOne({
        attributes: ['id', 'userName','email'],
        where: { id: userId },
    })
    .then(function(userFound){
        if (userFound){
            res.status(200).json(userFound);
        }
        else{
            return res.status(404).json({ 'error': 'user not found'});
        }
    })
    .catch(function(err){
        return res.status(500).json({'error': 'cannot fetch user'});
    });

});

router.post('/appareil', function(req, res, next) {

    var email = 'noihfvubkvi@hotmail.fr';
    var username = 'euhub';
    var password = 'tralalalala';

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

/* GET users listing. */
router.get('/test', function(req, res, next) {

    //cette promesse est LANCER meme si elle est stocker dans une variable
    /*
    let prom1 = new Promise((resolve, reject) => {
                    let variable = true;

                    if(variable){
                        resolve('good')
                    }else{
                        reject(
                            new Error('erreur !!!')
                        )
                    }
                })
                .then((result) => {console.log(result)})
                .catch((err) => {
                    return res.status(500).json({'error': err.message})
                });

    
    console.log('salut3');

*/
    // Affiche tous les utilisateur
    models.User.findAll()
    .then(function(userFound){
        //res.cookie('access_token', {token: "34568"})
        res.status(200).json(userFound)
    })


});


module.exports = router;
