var express = require('express');
var router = express.Router();
const admincontroller=require('../controllers/admincontroller')
const upload=require('../util/multer')

/* GET users listing. */
router.get('/',admincontroller.dashboardrender);
router.get('/user-view',admincontroller.renderuserview)
router.get('/block/:id',admincontroller.blockuser)
router.get('/adminlogin',admincontroller.renderadminlogin)
router.post('/adminlogin',admincontroller.postadminlogin)
router.get('/adminlogout',admincontroller.adminlogout)
router.get('/productview',admincontroller.renderproductview)
router.get('/add-product',admincontroller.renderaddproduct)
router.post('/add-product',upload.array('image',4),admincontroller.postaddproduct)
router.get('/category',admincontroller.rendercategory)
router.get('/addcategory',admincontroller.renderaddcategory)
router.post('/addcategory',admincontroller.postaddcategory)
router.post('/editcategory/:id',admincontroller.editcategory)
router.get('/Brand',admincontroller.renderbrandlist)
router.post('/Brand',admincontroller.postbrandlist)
router.get('/unlistbrand/:id',admincontroller.unlistbrand)
router.get('/unlistcategory/:id',admincontroller.unlistcategory)
router.get('/editproduct/:id',admincontroller.rendereditproduct)
router.post('/editproduct/:id',upload.array('image',4),admincontroller.editproduct)
router.get('/deleteproduct/:id',admincontroller.deleteproduct)
router.post('/editbrand/:id',admincontroller.editbrand)

module.exports = router;
