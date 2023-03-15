var express = require('express');
const usercontroller = require('../controllers/usercontroller');
var router = express.Router();
const userhelpers=require('../helpers/user-helpers')


/* GET home page. */
router.get('/',usercontroller.userviewrender);
router.get('/signup',usercontroller.renderusersignup)
router.post('/signup',usercontroller.signuppost)
router.get('/login',usercontroller.renderuserlogin)
router.post('/login',usercontroller.loginpost)
router.get('/logout',usercontroller.logout)
module.exports = router;
