const adminHelpers = require("../helpers/admin-helpers");
const productHelpers=require("../helpers/product-helpers")
const categoryHelpers=require("../helpers/category-helper")
const db=require('../config/connection')
const collection=require('../config/collection');


module.exports={
    dashboardrender:(req,res,next)=>{
        if(req.session.adminloggedIn){
            res.render('admin/dashboard',{layout:"adminlayout"})
        }else{
            res.redirect('/admin/adminlogin')
        }
    },
    renderuserview:(req,res)=>{
        if(req.session.adminloggedIn){
            adminHelpers.getuserdata().then((users)=>{
            res.render('admin/user-view',{layout:"adminlayout",users})
        }) 
        }else{
           res.redirect('/admin/adminlogin') 
        }
    },
    blockuser:async(req,res)=>{
        try{
        let userId=req.params.id
        console.log(userId);
        await adminHelpers.changeuserstatus(userId)
        res.redirect('/admin/user-view')
    }catch(err){
        console.log(err);
    }

    },
    renderadminlogin:(req,res)=>{
        if(req.session.adminloggedIn){
        res.redirect('/admin')
        }else{ 
        res.render('admin/adminlogin',{layout:"adminlayout",adminlogin:true,adminlogErr:req.session.admlogErr})
        req.session.admlogErr=false;
        }
    },
    postadminlogin:async(req,res)=>{
        let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:req.body.email});
        console.log(admin);
    if(admin){
        if(admin.password==req.body.password&&admin.email==req.body.email){
        req.session.admin = req.body.email;
        req.session.adminloggedIn = true;
        res.redirect('/admin')
        }else{
        req.session.admlogErr = "password not match....";
        console.log(req.session.admlogErr);
        res.redirect('/admin/adminlogin')
        }
    }else{
        req.session.admlogErr = "Invalid username or password";
        res.redirect('/admin/adminlogin')
    }
    },
    adminlogout:(req,res)=>{
        req.session.adminloggedIn =false;
        res.redirect('/admin/adminlogin')
    },
    renderproductview:(req,res)=>{
        productHelpers.findproducts().then((products)=>{
        console.log(products);
        res.render('admin/product-view',{layout:"adminlayout",products})
        })
    },
    renderaddproduct:(req,res)=>{
        res.render('admin/add-product',{layout:"adminlayout"})
    },
    postaddproduct:(req,res)=>{
        productHelpers.productdata(req.body).then((response)=>{
        console.log(response);
        })
        res.redirect("/admin/add-product")
    },
    rendercategory:(req,res)=>{
        categoryHelpers.findcategory().then((category)=>{
        res.render('admin/category-list',{layout:"adminlayout",category})  
        })
    },
    renderaddcategory:(req,res)=>{
        res.render('admin/add-category',{layout:"adminlayout"})
    },
    postaddcategory:(req,res)=>{
       categoryHelpers.getcategorydata(req.body).then((response)=>{
        console.log(response);
       })
        res.redirect('/admin/addcategory')
    }

}
