const authController = require('../controllers/authControllers')
const express = require('express');
//Instantiating the Router Module
const routerx = express.Router();

// GET|POST Requests 
routerx.get('/signup', authController.signup_get);
routerx.post('/signup',authController.signup_post);
routerx.get('/login',authController.login_get);
routerx.post('/login',authController.login_post);
routerx.get('/logout',authController.logout_get);
module.exports = routerx;