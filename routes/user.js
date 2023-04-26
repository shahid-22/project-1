const { Router } = require('express');
var express = require('express');
const usercontroller = require('../controllers/usercontroller');
var router = express.Router();
const userhelpers=require('../helpers/user-helpers')
const userauth=require('../middlewares/userauth');


/* GET home page. */
router.get('/',usercontroller.userviewrender);


router.get('/signup',usercontroller.renderusersignup)
router.post('/signup',usercontroller.signuppost)


router.get('/login',usercontroller.renderuserlogin)
router.post('/login',usercontroller.loginpost)


router.get('/logout',userauth.userauth,usercontroller.logout)


router.get('/shopepage',userauth.userauth,usercontroller.rendershopepage)


router.get('/productdetails/:id',userauth.userauth,usercontroller.renderproductdetail)


router.get('/categoryProducts',userauth.userauth,usercontroller.rendershopepage)


router.get('/brandproduct',userauth.userauth,usercontroller.rendershopepage)


router.get('/cart',userauth.userauth,usercontroller.rendercartpage)


router.get('/addto-cart/:id',userauth.userauth,usercontroller.addtocart)


router.get('/OTP-login',usercontroller.renderotppage)


router.post('/OTP-login',usercontroller.otppost)


router.post("/change-product-quantity",userauth.userauth,usercontroller.changeproductquantity)


router.get("/remove-cart/:id",userauth.userauth,usercontroller.removecart)


router.get("/checkout",userauth.userauth,usercontroller.rendercheckoutpage)


router.post("/add-Address",userauth.userauth,userauth.userauth,usercontroller.addaddress)


router.post("/place-order",userauth.userauth,usercontroller.orderdetais)


router.get("/orders",userauth.userauth,usercontroller.renderorderpage)


router.get("/orderdetails/:id",userauth.userauth,usercontroller.renderorderdetailspage)


router.get("/success",userauth.userauth,usercontroller.rendersuccesspage)


router.get("/profile",userauth.userauth,usercontroller.renderprofilepage)


router.post("/add-new-address",userauth.userauth,usercontroller.addnewaddress)


router.post("/edit-Address/:id",userauth.userauth,usercontroller.editaddress)


router.get("/delete-address/:id",userauth.userauth,usercontroller.deleteaddress)


router.get("/wishlist",userauth.userauth, usercontroller.renderwishlist)


router.get("/addto-wishlist/:id",userauth.userauth,usercontroller.addtowishlist)


router.get("/Rewards",userauth.userauth,usercontroller.renderRewards)


router.post("/apply_coupen",userauth.userauth,usercontroller.applycoupen)


router.post("/verify-payment",userauth.userauth,usercontroller.verifypayment)

router.post("/change-password",userauth.userauth,usercontroller.changepassword)

router.post("/edit-profile",userauth.userauth,usercontroller.editprofile)

router.get("/wallet",userauth.userauth,usercontroller.renderwallet)

router.post("/changeorderstatus",userauth.userauth,usercontroller.changeorderstatus)






module.exports = router;
