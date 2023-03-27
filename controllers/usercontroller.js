const userHelpers = require("../helpers/user-helpers");
const categoryHelpers=require("../helpers/category-helper")
const BrandHelpers=require("../helpers/Brandhelpers");
const productHelpers = require("../helpers/product-helpers");
const cartHelpers=require("../helpers/cart-helpers");
const { ObjectId } = require("mongodb-legacy");

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
    res.render('user/userview',{user,userName,cartcount});
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
     }
     else{
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
      res.render('user/productdetails',{product, userName})
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
    // const userId=req.session.userId
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
  res.render("user/checkout",{userName,cartproductdetails,totalprice,user})
 },
 addaddress:async(req,res)=>{
const address=req.body
 const userId=req.session.userId
  await userHelpers.addaddrtess(address,userId)
  res.redirect("/checkout")
 }
    
}