var express = require('express');
var router = express.Router();
const admincontroller=require('../controllers/admincontroller')

/* GET users listing. */
router.get('/',admincontroller.dashboardrender);
router.get('/user-view',admincontroller.renderuserview)
router.get('/block/:id',admincontroller.blockuser)
router.get('/adminlogin',admincontroller.renderadminlogin)
router.post('/adminlogin',admincontroller.postadminlogin)
router.get('/adminlogout',admincontroller.adminlogout)
router.get('/productview',admincontroller.renderproductview)
router.get('/add-product',admincontroller.renderaddproduct)
router.post('/add-product',admincontroller.postaddproduct)
router.get('/category',admincontroller.rendercategory)
router.get('/addcategory',admincontroller.renderaddcategory)
router.post('/addcategory',admincontroller.postaddcategory)

module.exports = router;
