var express = require('express');
var router = express.Router();
const admincontroller=require('../controllers/admincontroller')
const upload=require('../util/multer')
const adminauth=require('../middlewares/adminauth')

/* GET users listing. */
router.get('/',adminauth.adminauth,admincontroller.dashboardrender);


router.get('/user-view',adminauth.adminauth,admincontroller.renderuserview)


router.get('/block/:id',adminauth.adminauth,admincontroller.blockuser)


router.get('/adminlogin',admincontroller.renderadminlogin)


router.post('/adminlogin',admincontroller.postadminlogin)


router.get('/adminlogout',adminauth.adminauth,admincontroller.adminlogout)


router.get('/productview',adminauth.adminauth,admincontroller.renderproductview)


router.get('/add-product',adminauth.adminauth,admincontroller.renderaddproduct)


router.post('/add-product',adminauth.adminauth,upload.array('image',4),admincontroller.postaddproduct)


router.get('/category',adminauth.adminauth,admincontroller.rendercategory)


router.get('/addcategory',adminauth.adminauth,admincontroller.renderaddcategory)


router.post('/addcategory',adminauth.adminauth,admincontroller.postaddcategory)


router.post('/editcategory/:id',adminauth.adminauth,admincontroller.editcategory)


router.get('/Brand',adminauth.adminauth,admincontroller.renderbrandlist)


router.post('/Brand',adminauth.adminauth,admincontroller.postbrandlist)


router.get('/unlistbrand/:id',adminauth.adminauth,admincontroller.unlistbrand)


router.get('/unlistcategory/:id',adminauth.adminauth,admincontroller.unlistcategory)


router.get('/editproduct/:id',adminauth.adminauth,admincontroller.rendereditproduct)


router.post('/editproduct/:id',adminauth.adminauth,upload.array('image',4),admincontroller.editproduct)


router.get('/deleteproduct/:id',adminauth.adminauth,admincontroller.deleteproduct)


router.post('/editbrand/:id',adminauth.adminauth,admincontroller.editbrand)


router.get('/orders',adminauth.adminauth,admincontroller.renderorderpage)


router.post("/changeorderstatus",adminauth.adminauth,admincontroller.changeorderstatus)


router.get("/orderdetails/:id",adminauth.adminauth,admincontroller.renderorderdetais)


router.get("/banner",admincontroller.renderbannerpage)


router.post("/banner",upload.array('image',2),admincontroller.postbanner)


router.get("/unlistbanner/:id",admincontroller.unlistbanner)


router.post("/edit-banner/:id",upload.array('image',4),admincontroller.posteditbanner)


router.get("/detetebanner/:id",admincontroller.deletebanner)


router.get("/coupen",admincontroller.rendercoupenpage)


router.post("/add-coupon",admincontroller.addcoupen)


router.get("/detetecoupen/:id",admincontroller.deletecoupen)

router.get("/SalesReport",admincontroller.rendersalerreport)

router.post("/SalesReport",admincontroller.fiterdate)

router.post("/addamoutwallet",admincontroller.addamoutwallet)



module.exports = router;
