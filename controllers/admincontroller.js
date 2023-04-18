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
const walletHelpers=require("../helpers/wallet-helpers")
const { ObjectId } = require("mongodb-legacy");


module.exports={
    dashboardrender:async(req,res,next)=>{
        try{
            const dashboardclass="active"
            if(req.session.adminloggedIn){
            //---------today sale------------
            let todaydate=new Date()
            todaydate = new Date(todaydate).toISOString().slice(0, 10);
            const todaysale=await orderHelpers.currentdateorder(todaydate)
            let totalamount=0
            if(todaysale){
            for(let i=0;i<todaysale.length;i++){
                totalamount=totalamount+ todaysale[i].total
            }
            totalamount=totalamount.toLocaleString('en-IN', { style: "currency", currency: "INR" })
        }else{
            totalamount="₹0.00"
        }
            //------------------------today sale end---------------

            //--------week report-----------------------
            let today = new Date();
            today.setDate(today.getDate() - 7);
            let weekdate = today.toISOString().slice(0, 10);
            const weeksale=await orderHelpers.weeksalesreport(todaydate,weekdate)
            let weektotalamount=0
            if(weeksale){
            for(let i=0;i<weeksale.length;i++){
                weektotalamount=weektotalamount+ weeksale[i].total
            }
            weektotalamount=weektotalamount.toLocaleString('en-IN', { style: "currency", currency: "INR" })
        }else{
            weektotalamount="₹0.00"
        }
            //--------------------------------------------

           //----------month report-------------
           let startMonthDate = new Date(new Date().getFullYear() ,new Date().getMonth())
           startMonthDate.setUTCHours(startMonthDate.getUTCHours() + 5, startMonthDate.getUTCMinutes() + 30); // Add 5 hours and 30 minutes for IST timezone
           startMonthDate = startMonthDate.toISOString().slice(0, 10);
    
           let endMonthDate = new Date(new Date().getFullYear(),new Date().getMonth() + 1)
           endMonthDate.setUTCHours(endMonthDate.getUTCHours() + 5, endMonthDate.getUTCMinutes() + 30); // Add 5 hours and 30 minutes for IST timezone
           endMonthDate = endMonthDate.toISOString().slice(0, 10);
    
           let monthlyAmount= await orderHelpers.filterSales(startMonthDate,endMonthDate)
           if(monthlyAmount[0]){
            monthlyAmount=monthlyAmount[0].total.toLocaleString('en-IN',{style:'currency',currency:'INR'})
           }else{
            monthlyAmount="₹0.00"
           }
        
           //----------total sale-- 
           let totalsale=await orderHelpers.totalSale()
           if(totalsale[0]){
               totalsale=totalsale[0].grandtotal.toLocaleString('en-IN', { style: "currency", currency: "INR" })
           }else{
            totalsale="₹0.00"
           }
         //----------total sale--
            res.render('admin/dashboard',{layout:"adminlayout",totalamount,weektotalamount,monthlyAmount,totalsale,dashboardclass})
        }else{
            res.redirect('/admin/adminlogin')
        }
    }catch(err){
        console.log(err);
    }
    },


    renderuserview:(req,res)=>{
        try{
            const userclass="active"
            adminHelpers.getuserdata().then((users)=>{
            res.render('admin/user-view',{layout:"adminlayout",users,userclass})
            }) 
        }catch(err){
            console.log(err);
        }    
        
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
        try{
            if(req.session.adminloggedIn){
                res.redirect('/admin')
            }else{ 
                res.render('admin/adminlogin',{layout:"adminlayout",adminlogin:true,adminlogErr:req.session.admlogErr})
                req.session.admlogErr=false;
            }
        }catch(err){
            console.log(err);
        }
    },


    postadminlogin:async(req,res)=>{
        try{
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
        }catch(err){
            console.log(err);
        }
    },


    adminlogout:(req,res)=>{
        try{
           req.session.adminloggedIn =false;
           res.redirect('/admin/adminlogin')
        }catch(err){
            console.log(err);
        }
    },


    renderproductview:(req,res)=>{
        try{
            const productclass="active"
            productHelpers.findproducts().then((products)=>{
            res.render('admin/product-view',{layout:"adminlayout",products,productclass})
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
            let images=req.files
            productHelpers.productdata(req.body,images).then((response)=>{
            })
            res.redirect("/admin/add-product")  
        }catch(err){
            console.log(err);
        } 
    },


    rendercategory:async(req,res)=>{
        try{
            const categoryclass="active"
            let alreadyexistError=await req.query.message ?? ""
            categoryHelpers.findcategory().then((category)=>{
            res.render('admin/category-list',{layout:"adminlayout",category,alreadyexistError,categoryclass})  
            })
        }catch(err){
            console.log(err);
        }
    },


    renderaddcategory:async(req,res)=>{
        try{
           let alreadyexistError=await req.query.message ?? ""
           res.render('admin/add-category',{layout:"adminlayout",alreadyexistError})
        }catch(err){
            console.log(err);
        }
    },


    postaddcategory:async(req,res)=>{
        try{
             let{categoryname}=req.body
             const catogoryalreadyexist=await categoryHelpers.categoryalreadyexist(categoryname)
           if(catogoryalreadyexist){
              res.redirect('/admin/addcategory?message=already exist')
           }else{
            if(req.body.categoryname==req.body.categoryname.toLowerCase()){
                res.redirect('/admin/addcategory?message=write capital letters')
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
            const brandclass="active"
           let alreadyexistError=await req.query.message ?? ""
           let brands= await BrandHelpers.findbranddate()
           res.render('admin/brand-list',{layout:"adminlayout",brands,alreadyexistError,brandclass})
        }catch(err){
            console.log(err);
        }
    },
    postbrandlist:async (req,res)=>{
        try{
            let {brandname}=req.body
            const brandalreadtexist=await BrandHelpers.brandalreadyexist(brandname)
            if(brandalreadtexist){
                res.redirect('/admin/Brand?message=already exist')
            }else{
                if(brandname==brandname.toLowerCase()){
                res.redirect('/admin/Brand?message=write capital letters')
                }else{
               await BrandHelpers.addbranddata(req.body)
               res.redirect('/admin/Brand')
                }
            }
        }catch(err){
            console.log(err);
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
            const orderclass="active"
            const orders=await orderHelpers.findAll()
            for(let i=0;i<orders.length;i++){
            orders[i].date=orders[i].date.toLocaleString({timeZone: 'Asia/Kolkata'});
            }
           res.render("admin/orders",{layout:"adminlayout",orders,orderclass})
        }catch(err){
           console.log(err);
        }
    },


    changeorderstatus:async(req,res)=>{
        try{
            let {orderId,status}=req.body
              if(status=="cancelled"){
                    let order=await orderHelpers.Findalldetails(new ObjectId(orderId))
                    order.forEach(async(order)=>{
                    await productHelpers.changestock(order.products.productid,order.products.quantity)
                    });
                    await orderHelpers.changeorderstatus(orderId,status)
                    res.json({
                    status:"status changed"
                    })

                }else if(status=="returned"){
                    let order=await orderHelpers.Findalldetails(new ObjectId(orderId))
                    order.forEach(async(order)=>{
                        await productHelpers.changestock(order.products.productid,order.products.quantity)
                        });
                        await orderHelpers.changeorderstatus(orderId,status)
                        await orderHelpers.changepaystatus(orderId)
                        res.json({
                        status:"status changed"
                        })
                
                }else{
                    await orderHelpers.changeorderstatus(orderId,status)
                    res.json({
                        status:"status changed"
                    })
                }
                

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
            console.log("order"+orders[0].offer);
            orders[0].total=orders[0].total.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            orders[0].offer=orders[0].offer.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            orders[0].date=orders[0].date.toLocaleString({timeZone: 'Asia/Kolkata'});
            res.render("admin/orderdetails",{layout:"adminlayout",orders})
        }catch(err){
            console.log(err);
        }
    },

    renderbannerpage:async(req,res)=>{
        try{
            const bannerclass="active"
            let banners=await bannerHelpers.getall()
           res.render("admin/banner",{layout:"adminlayout",banners,bannerclass})
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
            const coupenclass="active"
            let alreadyexistError=await req.query.message ?? ""
            await coupenHelpers.checkCouponExpired()
            const coupendetails=await coupenHelpers.FindAll()
            for(let i=0;i<coupendetails.length;i++){
                coupendetails[i].createdDate=coupendetails[i].createdDate.toLocaleString({timeZone: 'Asia/Kolkata'});
                coupendetails[i].expiryDate=coupendetails[i].expiryDate.toLocaleString({timeZone: 'Asia/Kolkata'});
            }
            res.render("admin/coupen",{layout:"adminlayout",coupendetails,alreadyexistError,coupenclass})
        }catch(err){
            console.log(err);
        }
    },

    addcoupen:async(req,res)=>{
        try{
           const createdDate=new Date() 
           const{coupen,name,discount,expiryDate}=req.body
           const isexist=await coupenHelpers.coupenalreadyExist(name)
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
           await  coupenHelpers.deletecoupen(coupenId)
           res.redirect("/admin/coupen")
        }catch(err){
           console.log(err);
        }
    },

    rendersalerreport:async(req,res)=>{
        try{
             const salesreportclass="active" 
             let deliveredproduct=await orderHelpers.delivereditems()
             let totalamount=0
        for(let i=0;i<deliveredproduct.length;i++){
             totalamount=totalamount+ deliveredproduct[i].total
             deliveredproduct[i].date=deliveredproduct[i].date.toLocaleString({timeZone: 'Asia/Kolkata'});
        }
        for(let i=0;i<deliveredproduct.length;i++){
             deliveredproduct[i].total= deliveredproduct[i].total.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            
        }

            totalamount=totalamount.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            res.render("admin/Sales-Report",{layout:"adminLayout",deliveredproduct,totalamount,salesreportclass})
        }catch(err){
            console.log(err);
        }
    },

    fiterdate:async(req,res)=>{
        try{
            let {startDate,endDate}=req.body
            startDate=new Date(startDate)
            endDate=new Date(endDate)
            const deliveredproduct=await orderHelpers.filterproduct(startDate,endDate)
            let totalamount=0
        for(let i=0;i<deliveredproduct.length;i++){
            totalamount=totalamount+ deliveredproduct[i].total
            deliveredproduct[i].date=deliveredproduct[i].date.toLocaleString({timeZone: 'Asia/Kolkata'});
        }
        for(let i=0;i<deliveredproduct.length;i++){
            deliveredproduct[i].total= deliveredproduct[i].total.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            
        }

          totalamount=totalamount.toLocaleString('en-IN', { style: "currency", currency: "INR" })
          res.render("admin/Sales-Report",{layout:"adminLayout",deliveredproduct,totalamount})
        }catch(err){
          console.log(err);
        }
    },

    addamoutwallet:async(req,res)=>{
        try{
           let{orderId}=req.body
           orderId=new ObjectId(orderId)
           const order=await orderHelpers.getorder(orderId)
           if(order.paymentstatus=="paid"){
              await walletHelpers.insertamount(order.userId,order.total)
              await orderHelpers.changepaystatus(orderId)
           }
        }catch(err){
            console.log(err);
        }
       
    },


    dashboarddata:async(req,res)=>{
        try{
            //sales permonth
            const date = new Date().getFullYear()
            let startYearDate = new Date(date, 0, 1);  // January is 0 and December is 11.
            startYearDate.setUTCHours(startYearDate.getUTCHours() + 5, startYearDate.getUTCMinutes() + 30); // Add 5 hours and 30 minutes for IST timezone
            startYearDate = startYearDate.toISOString().slice(0, 10);
            
            let  endYearDate = new Date(date+1,0,1)
            endYearDate.setUTCHours(endYearDate.getUTCHours() + 5,endYearDate.getUTCMinutes() + 30 )
            endYearDate= endYearDate.toISOString().slice(0,10)
     
            let salesPerMonth = await orderHelpers.salesPerMonth(startYearDate,endYearDate)
            if(!salesPerMonth){
              salesPerMonth=0
            }
     
            let paymentStatuscount = await orderHelpers.getpayStatusordercount()
            console.log(paymentStatuscount);
            if(!paymentStatuscount){
                paymentStatuscount=0
            }

            res.json({
             salesPerMonth,
             paymentStatuscount
            })
        }catch(err){
            console.log(err);
        }    

    }






}

