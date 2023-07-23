const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const {storeReturnTo} =require('../middleware');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    //Render register form
    .get(users.renderRegister)
    //Add a new user
    .post(catchAsync(users.register))

router.route('/login')
    //Render login form
    .get(users.renderLogin)
    //Login user
    .post(storeReturnTo,passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}) , users.login)

//Logout user
router.get('/logout',users.logout);

module.exports=router;