const { Router } = require('express');
var express = require('express');
const usercontroller = require('../controllers/usercontroller');
var router = express.Router();
const userhelpers=require('../helpers/user-helpers')
const userauth=require('../middlewares/userauth')


/* GET home page. */
router.get('/',usercontroller.userviewrender);

router.get('/signup',usercontroller.renderusersignup)
router.post('/signup',usercontroller.signuppost)

router.get('/login',usercontroller.renderuserlogin)
router.post('/login',usercontroller.loginpost)

router.get('/logout',usercontroller.logout)

router.get('/shopepage',usercontroller.rendershopepage)

router.get('/productdetails/:id',usercontroller.renderproductdetail)

router.get('/categoryProducts',usercontroller.rendershopepage)

router.get('/brandproduct',usercontroller.rendershopepage)

router.get('/cart',userauth.userauth,usercontroller.rendercartpage)
router.get('/addto-cart/:id',userauth.userauth,usercontroller.addtocart)

module.exports = router;
