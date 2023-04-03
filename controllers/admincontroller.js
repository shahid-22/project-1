const adminHelpers = require("../helpers/admin-helpers");
const productHelpers=require("../helpers/product-helpers")
const categoryHelpers=require("../helpers/category-helper")
const BrandHelpers=require("../helpers/Brandhelpers")
const cloudinary=require('../util/cloudinary');
const db=require('../config/connection')
const collection=require('../config/collection');
const orderHelpers = require("../helpers/order-helpers");
const bannerHelpers=require("../helpers/bannerhelpers");
const coupenHelpers=require("../helpers/coupen-helpers")
const { ObjectId } = require("mongodb-legacy");


module.exports={
    dashboardrender:(req,res,next)=>{
        if(req.session.adminloggedIn){
            res.render('admin/dashboard',{layout:"adminlayout"})
        }else{
            res.redirect('/admin/adminlogin')
        }
    },


    renderuserview:(req,res)=>{
            adminHelpers.getuserdata().then((users)=>{
            res.render('admin/user-view',{layout:"adminlayout",users})
        }) 
        
    },


    blockuser:async(req,res)=>{
        try{
            let userId=req.params.id
            console.log(userId);
            await adminHelpers.changeuserstatus(userId)
            req.session.loggedIn=false
            req.session.userName=null
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
        try{
            productHelpers.findproducts().then((products)=>{
            res.render('admin/product-view',{layout:"adminlayout",products})
            })
        }catch(err){
        console.log(err);
        }
    },


    renderaddproduct:async(req,res)=>{
        try{
            let branddata= await BrandHelpers.findlistedbrand()
            let category=await categoryHelpers.listedcategory()
            res.render('admin/add-product',{layout:"adminlayout",category,branddata})
        }catch(err){
            console.log(err);
        }
       
    },


    postaddproduct:(req,res)=>{
        try{
            // console.log(req.body);
            // console.log(req.files);
            let images=req.files
            productHelpers.productdata(req.body,images).then((response)=>{
            console.log(response);
            })
            res.redirect("/admin/add-product")  
        }catch(err){
            console.log(err);
        } 
    },


    rendercategory:async(req,res)=>{
        try{
            let alreadyexistError=await req.query.message ?? ""
            categoryHelpers.findcategory().then((category)=>{
            res.render('admin/category-list',{layout:"adminlayout",category,alreadyexistError})  
            })
        }catch(err){
            console.log(err);
        }
    },


    renderaddcategory:(req,res)=>{
        res.render('admin/add-category',{layout:"adminlayout"})
    },


    postaddcategory:async(req,res)=>{
       try{
             let{categoryname}=req.body
             const catogoryalreadyexist=await categoryHelpers.categoryalreadyexist(categoryname)
           if(catogoryalreadyexist){
              res.redirect('/admin/addcategory')
           }else{
            if(req.body.categoryname==req.body.categoryname.toLowerCase()){
                res.redirect('/admin/addcategory')
            }else{
              categoryHelpers.getcategorydata(req.body).then((response)=>{
              console.log(response);
           })
           res.redirect('/admin/addcategory')
        }
           }
        }catch(err){
        console.log(err);
        }
    },


    renderbrandlist:async(req,res)=>{
        try{
           let alreadyexistError=await req.query.message ?? ""
           let brands= await BrandHelpers.findbranddate()
           res.render('admin/brand-list',{layout:"adminlayout",brands,alreadyexistError})
        }catch(err){
            console.log(err);
        }
    },
    postbrandlist:async (req,res)=>{
            let {brandname}=req.body
            const brandalreadtexist=await BrandHelpers.brandalreadyexist(brandname)
        if(brandalreadtexist){
            res.redirect('/admin/Brand')
        }else{
           await BrandHelpers.addbranddata(req.body)
           res.redirect('/admin/Brand')
        }
    },
    unlistcategory:async(req,res)=>{
        try{
            let categoryId=req.params.id
            console.log(categoryId);
            await categoryHelpers.deletecategory(categoryId)
            res.redirect('/admin/category')
        }catch(err){
            console.log(err);
        }
    },


    rendereditproduct:async(req,res)=>{
        try{
            const productId=req.params.id
            let [products, categories, brands] = await Promise.all([
            productHelpers.findsingleproductdata(productId),
            categoryHelpers.findAll(),
            BrandHelpers.findbranddate()
            ])
            res.render('admin/edit-product',{layout:"adminlayout",products,categories,brands})
        }catch(err){
            console.log(err);
        }
    },


    editproduct:async(req,res)=>{
        try{
            const productId=req.params.id
            console.log(productId);
            let imagess=req.files
            console.log(req.body);
            let {productname,description,categoryname,brandname,price,quantity} = req.body
            console.log(imagess);
            const imagesurl=[]
            console.log(imagess);
    
        for(let i=0;i<imagess.length;i++){
            const {url} = await cloudinary.uploader.upload(imagess[i].path)
            imagesurl.push(url)
        }
            console.log(imagesurl);
            const product = await productHelpers.specificproduct(productId)
            const newImages=[...product.imagesurl.slice(imagesurl.length),...imagesurl]
    
            await productHelpers.editProduct(productId,productname,description,categoryname,brandname,price,quantity, newImages)
            res.redirect('/admin/productview')
    
        }catch(err){
            console.log(err);
        }
    },


    deleteproduct:async(req,res)=>{
        try{
            const productId=req.params.id
            await productHelpers.delete(productId)
            res.redirect('/admin/productview')
        }catch(err){
            console.log(err);
        }
    },


    editcategory:async(req,res)=>{
        try{
           let{categoryname}=req.body
           const catogoryalreadyexist=await categoryHelpers.categoryalreadyexist(categoryname)
        if(catogoryalreadyexist){
            res.redirect('/admin/category?message=already exist')
        }else{
            const categoryId=req.params.id
            const{categoryname}=req.body
            await categoryHelpers.editcategory(categoryId,categoryname)
            res.redirect('/admin/category')
        }
        }catch(err){
           console.log(err);
        }
    },


    unlistbrand:async(req,res)=>{
        try{
           let brandId=req.params.id
           await BrandHelpers.unlistbrand(brandId)
           res.redirect('/admin/Brand')
        }catch(err){
          console.log(err);
        }
    },


    editbrand:async(req,res)=>{
        try{
           let  brandId=req.params.id
           console.log(brandId);
           const{brandname}=req.body
           const brandalreadtexist=await BrandHelpers.brandalreadyexist(brandname)
        if(brandalreadtexist){
            res.redirect('/admin/Brand?message=already exist')
        }else{
           await BrandHelpers.editbrand(brandId,brandname)
           res.redirect('/admin/Brand')
        }
        }catch(err){
           console.log(err);
        }

    },


    renderorderpage:async(req,res)=>{
        try{
            const orders=await orderHelpers.findAll()
            for(let i=0;i<orders.length;i++){
            orders[i].date=orders[i].date.toLocaleString({timeZone: 'Asia/Kolkata'});
            }
           res.render("admin/orders",{layout:"adminlayout",orders})
        }catch(err){
           console.log(err);
        }
    },


    changeorderstatus:async(req,res)=>{
        try{
            let {orderId,status}=req.body
            await orderHelpers.changeorderstatus(orderId,status)
            res.json({
                status:"status changed"
            })

        }catch(err){
            console.log(err);
        }
    },

    renderorderdetais:async(req,res)=>{
        try{
            const orderId=req.params.id
            let orders=await orderHelpers.findordersanduser(orderId)
            for(let i=0;i<orders.length;i++){
            orders[i].productdetails.price=orders[i].productdetails.price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            }
            orders[0].total=orders[0].total.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            orders[0].date=orders[0].date.toLocaleString({timeZone: 'Asia/Kolkata'});
            res.render("admin/orderdetails",{layout:"adminlayout",orders})
        }catch(err){
            console.log(err);
        }
    },

    renderbannerpage:async(req,res)=>{
        try{
            let banners=await bannerHelpers.getall()
           res.render("admin/banner",{layout:"adminlayout",banners})
        }catch(err){
            console.log(err);
        }
    },

    postbanner:async(req,res)=>{
        try{
            let images=req.files
            await bannerHelpers.addbannerdata(req.body,images)
            res.redirect("/admin/banner")
        }catch(err){
            console.log(err);
        }

    },
    unlistbanner:async(req,res)=>{
        try{
        const bannerId=new ObjectId(req.params.id)
        await bannerHelpers.unlistbanner(bannerId)
        res.redirect("/admin/banner")
        }catch(err){
            console.log(err);
        }
    },

    posteditbanner:async(req,res)=>{
        try{
           const bannerId=req.params.id
           let images=req.files
           let{bannerText}=req.body
           const imagesurl=[]
           for(let i=0;i<images.length;i++){
            const {url} = await cloudinary.uploader.upload(images[i].path)
            imagesurl.push(url)
        }
        const banner = await bannerHelpers.specificproduct(bannerId)
        const newImages=[... banner.banners.slice(imagesurl.length),...imagesurl]
        await bannerHelpers.editbanner(bannerId,bannerText,newImages)
         res.redirect("/admin/banner")
        }catch(err){
            console.log(err);
        }
      
    },


    deletebanner:async(req,res)=>{
        try{
        let bannerId=req.params.id
        await bannerHelpers.deletebanner(bannerId)
        res.redirect("/admin/banner")
        }catch(err){
            console.log(err);
        }
    },

    rendercoupenpage:async(req,res)=>{
        try{
            let alreadyexistError=await req.query.message ?? ""
            const coupendetails=await coupenHelpers.FindAll()
            for(let i=0;i<coupendetails.length;i++){
                coupendetails[i].createdDate=coupendetails[i].createdDate.toLocaleString({timeZone: 'Asia/Kolkata'});
                coupendetails[i].expiryDate=coupendetails[i].expiryDate.toLocaleString({timeZone: 'Asia/Kolkata'});
            }
            console.log(coupendetails);
            res.render("admin/coupen",{layout:"adminlayout",coupendetails,alreadyexistError})
        }catch(err){
            console.log(err);
        }
    },

    addcoupen:async(req,res)=>{
        try{
            console.log(req.body);
            const createdDate=new Date() 
           const{coupen,name,discount,expiryDate}=req.body
           const isexist=await coupenHelpers.coupenalreadyExist(name)
           console.log(isexist);
           if(isexist){
            res.redirect("/admin/coupen?message=coupen alreadt exist")
           }else{
           await coupenHelpers.addcoupen(coupen,name,discount,createdDate,expiryDate)
            res.redirect("/admin/coupen")
           }
        }catch(err){
            console.log(err);
        }
    },

    deletecoupen:async(req,res)=>{
        try{
        const coupenId=req.params.id
        console.log(coupenId);
        await  coupenHelpers.deletecoupen(coupenId)
        res.redirect("/admin/coupen")
        }catch(err){
            console.log(err);
        }
    }


}


