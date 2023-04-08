const userHelpers = require("../helpers/user-helpers");
const categoryHelpers=require("../helpers/category-helper")
const BrandHelpers=require("../helpers/Brandhelpers");
const productHelpers = require("../helpers/product-helpers");
const cartHelpers=require("../helpers/cart-helpers");
const orderHelpers=require("../helpers/order-helpers")
const bannerHelpers=require("../helpers/bannerhelpers")
const wishlistHelpers=require("../helpers/wishlist-helpers")
const { ObjectId } = require("mongodb-legacy");
const bcrypt = require('bcrypt');
const cloudinary=require('../util/cloudinary');
const coupenHelpers = require("../helpers/coupen-helpers");
const RazorpayHelpers=require("../helpers/razorpay-helpers");
const { response } = require("express");

module.exports={
  userviewrender:async(req,res,next)=>{
    let user=req.session.user
    let userName = req.session.userName;

    //cart count---------------------------------
    let cartcount=null
    if(userName){
    cartcount=await cartHelpers.getcartcount(req.session.userId)
    }
    //-------------cartcount-----------------------------------

    let banners=await bannerHelpers.findOne()
    res.render('user/userview',{user,userName,cartcount,banners});
  },


  renderusersignup:(req,res)=>{
    if(req.session.loggedIn==true){
      res.redirect('/')
    }else{
      res.render('user/usersignup');
    }

  },


  renderuserlogin:(req,res)=>{
    if(req.session.loggedIn){
      res.redirect('/')
    }else{
      res.render('user/userlogin',{loginErr:req.session.loginErr})
      req.session.loginErr=false;

    }
  },


  signuppost:(req,res)=>{
  userHelpers.dosignup(req.body).then((response)=>{
    req.session.userId=response._id
    console.log(req.session.userId);
    req.session.loggedIn=true;
    req.session.user=response;
    req.session.userName=response.name;
    // console.log(req.session.user);
    res.redirect('/');
    })
  },


  loginpost:(req,res)=>{
    userHelpers.dologin(req.body).then((response)=>{
    // console.log(response);
   if(response.status){
     req.session.loggedIn=true;
     req.session.userId=response.user._id
     console.log(req.session.userId);
     req.session.user=response;
     req.session.userName=response.user.name;
     res.redirect('/')
    }else{
     req.session.loginErr='invalid username or password'
     res.redirect('/login')
    }
    })
  },


  logout:(req,res)=>{
    req.session.destroy();
    res.redirect('/');
  },


  rendershopepage:async(req,res)=>{
      let  userName=req.session. userName
      const brandId=req.query.brandId
      const categoryId=req.query.categoryId
      if(categoryId){
            let products=await  productHelpers.findcategoryproduct(categoryId)
            for(let i=0;i<products.length;i++){
              products[i].price=products[i].price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            }
              let categories=await categoryHelpers.listedcategory()
              let brands= await BrandHelpers.findlistedbrand()
              //cart count---------------------------------
              let cartcount=null
              if(userName){
              cartcount=await cartHelpers.getcartcount(req.session.userId)
              }
              //-------------cartcount-----------------------------------
              res.render("user/shop",{products,categories,brands, userName,cartcount})
      }else if(brandId){
              let products=await productHelpers.findbrandproduct(brandId)
              for(let i=0;i<products.length;i++){
                products[i].price=products[i].price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
              }
              let categories=await categoryHelpers.listedcategory()
              let brands= await BrandHelpers.findlistedbrand()
              //cart count---------------------------------
              let cartcount=null
              if(userName){
              cartcount=await cartHelpers.getcartcount(req.session.userId)
              }
              //-------------cartcount-----------------------------------
              res.render("user/shop",{products,categories,brands, userName,cartcount})

      }else{
              let products=await userHelpers.findAll()
              for(let i=0;i<products.length;i++){
                products[i].price=products[i].price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
              }
              let categories=await categoryHelpers.listedcategory()
              let brands= await BrandHelpers.findlistedbrand()
              //cart count---------------------------------
              let cartcount=null
              if(userName){
              cartcount=await cartHelpers.getcartcount(req.session.userId)
              }
              //-------------cartcount-----------------------------------
              res.render("user/shop",{products,categories,brands,userName,cartcount})
       }
  },

  renderproductdetail:async(req,res)=>{
      let  userName=req.session. userName
      const productId=req.params.id
      const product=await productHelpers.findsingleproductdata(productId)
      product[0].price=product[0].price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
      //cart count---------------------------------
      let cartcount=null
      if(userName){
      cartcount=await cartHelpers.getcartcount(req.session.userId)
      }
      //-------------cartcount-----------------------------------
      res.render('user/productdetails',{product, userName,cartcount})
  },

rendercartpage:async(req,res)=>{
      let  userName=req.session. userName
      let userId= new ObjectId(req.session.userId)
      const cart=await cartHelpers.getcart(userId)
      let totalprice=0
  for(let i=0;i<cart.length;i++){
      totalprice=totalprice+cart[i].subTotal
      cart[i].productdetails.price= cart[i].productdetails.price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
      cart[i].subTotal= cart[i].subTotal.toLocaleString('en-IN', { style: "currency", currency: "INR" })
    }
      totalprice=totalprice.toLocaleString('en-IN', { style: "currency", currency: "INR" })
      //cart count---------------------------------
      let cartcount=null
      if(userName){
      cartcount=await cartHelpers.getcartcount(req.session.userId)
      }
      //-------------cartcount-----------------------------------

      res.render("user/cart-page",{userName,cart,totalprice,cartcount})
},

addtocart:async(req,res)=>{
     const productId=req.params.id
     const userId= new ObjectId(req.session.userId)
     const iscartexist=await cartHelpers.findcart(userId)
  if(iscartexist){
     await cartHelpers.updatecart(userId,productId)
  }else{
     await cartHelpers.addtocart(userId,productId)
  }
  res.json({
    status:"success",
    message:"added to cart"
  })
},

renderotppage:(req,res)=>{
     res.render("user/otpverification")
},

otppost:async(req,res)=>{
     
     let otpdetails=req.body.number
     const isalreadyexist=await userHelpers.phonenumberexist(otpdetails)
  if(isalreadyexist){
    req.session.loggedIn=true;
    req.session.userId=isalreadyexist._id
    req.session.user=isalreadyexist
    req.session.userName=isalreadyexist.name;
     res.redirect('/')
  }else{
    res.redirect('/OTP-login')
  }
},
changeproductquantity:async(req,res)=>{
    let{cartId,proId,count}=req.body
    const changequantity=await cartHelpers.changecartproductquantity(cartId,proId,count)
   if(changequantity. modifiedCount===1){
    res.json({
     status:"removed",
     message:"item removed"
    })
   }else{
    res.json({
      status:"changed",
      message:"product quantity changed"
    })
   }

},
removecart:async(req,res)=>{
     const productId=req.params.id
     const userId=req.session.userId
     await cartHelpers.removecartproduct(userId,productId)
     res.redirect("/cart")
},
rendercheckoutpage:async(req,res)=>{
     let  userName=req.session. userName
     const userId=new ObjectId(req.session.userId)
     const cartproductdetails=await cartHelpers.getcart(userId)
     console.log(cartproductdetails);
     let totalprice=0
  for(let i=0;i<cartproductdetails.length;i++){
     totalprice=totalprice+cartproductdetails[i].subTotal
     cartproductdetails[i].productdetails.price=cartproductdetails[i].productdetails.price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
     cartproductdetails[i].subTotal= cartproductdetails[i].subTotal.toLocaleString('en-IN', { style: "currency", currency: "INR" })
    }
     totalprice=totalprice.toLocaleString('en-IN', { style: "currency", currency: "INR" })
     let user=await userHelpers.findaddress(req.session.userId)
     //cart count---------------------------------
    let cartcount=null
    if(userName){
    cartcount=await cartHelpers.getcartcount(req.session.userId)
   }
   //-------------cartcount-----------------------------------
     res.render("user/checkout",{userName,cartproductdetails,totalprice,user,cartcount})
},
addaddress:async(req,res)=>{
     const address=req.body
     const userId=req.session.userId
     await userHelpers.addaddrtess(address,userId)
     res.redirect("/checkout")
},
addnewaddress:async(req,res)=>{
  const address=req.body
  const userId=req.session.userId
  await userHelpers.addaddrtess(address,userId)
  res.redirect("/profile")
},
editaddress:async(req,res)=>{
  const addressId=req.params.id
  const userId=req.session.userId
  await userHelpers.editaddress(addressId,userId,req.body)
  res.redirect("/profile")

},
deleteaddress:async(req,res)=>{
  const addressId=req.params.id
  const userId=req.session.userId
  await userHelpers.deleteaddress(addressId,userId)
  res.redirect("/profile")
},

orderdetais:async(req,res)=>{
    let{products,addressid,paymentMethod,total,coupencode}=req.body
    console.log(paymentMethod);
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");
    console.log(coupencode);
    let userId=req.session.userId
    let address=await userHelpers.findOneaddress(userId,addressid)
    userId=new ObjectId(userId)
    address=address[0].address
    
   for(let i=0;i<products.length;i++){
    products[i].productid=new ObjectId( products[i].productid)
    products[i].quantity=Number(products[i].quantity)
   }
    let status
    if(paymentMethod==='COD'){
     status="PLACED"
    }else{
      status="Pending"
    }
    const date = new Date()
   let result=await orderHelpers.insertorderdata(products,address,userId,status,date,total,paymentMethod)
      const orderId=result.insertedId
      if(paymentMethod=="COD"){
      await cartHelpers.deletecart(userId)
      await coupenHelpers.adduser(coupencode,userId)
      console.log("kkkkkk");
      console.log(products);
      products.forEach(async(product)=>{
        product.quantity=product.quantity*-1
       await productHelpers.changestock(product.productid,product.quantity)
      });
        res.json({
          status:"success",
          message:"order placed"
        })
        
      }else if(paymentMethod=="online"){
    
           total=total.replace(/,/g,"")
           total=total.replace('₹','')
           total = parseInt(total)
       let onlineresult= await RazorpayHelpers.generaterazorpay(orderId,total)
       res.json({onlineresult,coupencode})
        if(onlineresult){
          console.log(onlineresult);
        }

        
      }
      
},
 renderorderpage:async(req,res)=>{
    let  userName=req.session. userName
    //cart count---------------------------------
    let cartcount=null
    if(userName){
    cartcount=await cartHelpers.getcartcount(req.session.userId)
    }
    //-------------cartcount-----------------------------------
   let userId=new ObjectId(req.session.userId)
   let orders= await orderHelpers.getorderdetails(userId)
   console.log(orders);
   for(let i=0;i<orders.length;i++){
   orders[i].date=orders[i].date.toLocaleString({timeZone: 'Asia/Kolkata'});
  }
   res.render("user/orders",{orders,userName,cartcount})
 },


  renderorderdetailspage:async(req,res)=>{
    try{
          const orderId=new ObjectId(req.params.id)
          let orderdetails=await orderHelpers.Findalldetails(orderId)
          console.log(orderdetails);
          //-------------------------------------
          // let totalprice=0
        for(let i=0;i<orderdetails.length;i++){
            // totalprice=totalprice+orderdetails[i].subTotal
            orderdetails[i].productdetails.price=orderdetails[i].productdetails.price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            orderdetails[i].subTotal= orderdetails[i].subTotal.toLocaleString('en-IN', { style: "currency", currency: "INR" })
            orderdetails[i].date=orderdetails[i].date.toLocaleString({timeZone: 'Asia/Kolkata'});
        }
            // totalprice=totalprice.toLocaleString('en-IN', { style: "currency", currency: "INR" })
          //-------------------------------------
            console.log(orderdetails);
            let  userName=req.session. userName
           //cart count---------------------------------
            let cartcount=null
        if(userName){
            cartcount=await cartHelpers.getcartcount(req.session.userId)
        }
           //-------------cartcount-----------------------------------
           res.render("user/orderdetails",{orderdetails,userName,cartcount})
     }catch(err){
          console.log(err);
     }
  },

  rendersuccesspage:(req,res)=>{
   try{

      res.render("user/success")
     }catch(err){
        console.log(err);
   }
  },

  renderprofilepage:async(req,res)=>{
    try{
        let userId=req.session.userId
        let userdetails=await userHelpers.finduser(userId)
        res.render("user/userprofile",{userdetails})
      }catch(err){
        console.log(err);
      }
  },

  renderwishlist:async(req,res)=>{
    try{
      let userId=new ObjectId(req.session.userId)
      let wishlist=await wishlistHelpers.FindAll(userId)
      console.log(wishlist);
      for(let i=0;i<wishlist.length;i++){
      wishlist[i].productdetails.price=wishlist[i].productdetails.price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
      }
       res.render("user/wishlist",{wishlist})
    }catch(err){
      console.log(err);
    }
  },


  addtowishlist:async(req,res)=>{
    try{
      const proId= new ObjectId(req.params.id)
      const userId=new ObjectId(req.session.userId)
      console.log(proId)
      console.log(userId);
      const isalreadyExist=await wishlistHelpers.finduser(userId)
      if(isalreadyExist){
      let result=  await wishlistHelpers.updatewishlist(proId,userId)
         if(result=="success"){
           res.json({
            status:"success",
            message:"added to wish list"
           })
         }else{
          res.json({
          status:"Removed",
          message:"Removed From wish list"
          })
         }
      }else{
        await wishlistHelpers.addtowishlist(proId,userId)
        res.json({
         status:"success",
         message:"added to wishlist"
       })
      }
    }catch(err){
      console.log(err);
    }

  },

  renderRewards:async(req,res)=>{
    try{
      await coupenHelpers.checkCouponExpired()
      const rewards=await coupenHelpers.FindAll()
       res.render("user/Rewards",{rewards})
    }catch(err){
      console.log(err);
    }
  },

  applycoupen:async(req,res)=>{
    const userId=req.session.userId
    const{coupencode}=req.body
    const coupen=await coupenHelpers.findOne(coupencode)
     if(!coupen){
         res.json({
              status:"Nocoupen"
        })

      }else if(coupen.expiryDate<new Date()||coupen.isExpired){
          res.json({
               status:"Expired"
             })

      }else{
     
            const isUsedcoupen=await coupenHelpers.checkUsedCoupon(userId,coupencode)
            if(isUsedcoupen){
                  res.json({
                      status:"already used"
                    })
            }else{
                 res.json({
                   status:"success",
                   percentage:coupen.discount
                 })
            }
      }
   
  },

  verifypayment:async(req,res)=>{
    let userId= new ObjectId(req.session.userId)

   const successfull= RazorpayHelpers.verifypayment(req.body)
      if(successfull){
          await orderHelpers.changepaymentstatus(req.body.order.receipt)
          await cartHelpers.deletecart(userId)
          await coupenHelpers.adduser(req.body.coupencode,userId)
          // console.log("success full");

            res.json({
              status:true
            })

        }else{
            res.json({
              status:false
            })
          //  console.log("payment failed");
        }
  },
  
  changepassword:async(req,res)=>{
    let UserId=req.session.userId
    let{currentpassword, newpassword}=req.body
    const user=await userHelpers.finduser(UserId)
    const ispasswordiscorrect=await bcrypt.compare(currentpassword,user.password)
    if(ispasswordiscorrect){
      await userHelpers.changepassword(UserId,newpassword)
      res.json({
        status:"success",
        message:"password changed"
      })
    }else{
      res.json({
        status:"failed",
        message:"password not match"
      })
    }

  },

  editprofile:async(req,res)=>{
    const userId=req.session.userId
    let{name,email,phone}=req.body
    let user=await userHelpers.finduser(userId)
    if(user.name==name&&user.email==email&&user.Phonenumber==phone){
      res.json({
        status:false,
        message:"No changes"
       })
    }else{
    let phonenumberExist=await userHelpers.phonenumberexist(phone)
    // let emailexist=await userHelpers.emailexist(email)
    if(phonenumberExist){
      if(phonenumberExist.Phonenumber==user.Phonenumber){
        await userHelpers.updateProfile(name,user.Phonenumber,email,userId)
        res.json({
         status:true,
         message:'profile updated'
        })
      }else{
        res.json({
          status:false,
          message:'phone number already exist'
         })
      }
    }else{
     await userHelpers.updateProfile(name,phone,email,userId)
     res.json({
      status:true,
      message:'profile updated'
     })
    }
  }
   
  }






    
}