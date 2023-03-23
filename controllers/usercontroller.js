const userHelpers = require("../helpers/user-helpers");
const categoryHelpers=require("../helpers/category-helper")
const BrandHelpers=require("../helpers/Brandhelpers");
const productHelpers = require("../helpers/product-helpers");
const cartHelpers=require("../helpers/cart-helpers")

module.exports={
  userviewrender:(req,res,next)=>{
    let user=req.session.user
    let userName = req.session.userName;
    console.log(user);
    res.render('user/userview',{user,userName});
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
        res.render("user/shop",{products,categories,brands, userName})
     }else if(brandId){
      let products=await productHelpers.findbrandproduct(brandId)
      for(let i=0;i<products.length;i++){
        products[i].price=products[i].price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
      }
      let categories=await categoryHelpers.listedcategory()
      let brands= await BrandHelpers.findlistedbrand()
      res.render("user/shop",{products,categories,brands, userName})
     }
     else{
        let products=await userHelpers.findAll()
        for(let i=0;i<products.length;i++){
          products[i].price=products[i].price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
        }
        let categories=await categoryHelpers.listedcategory()
        let brands= await BrandHelpers.findlistedbrand()
        res.render("user/shop",{products,categories,brands,userName})
    }
},
renderproductdetail:async(req,res)=>{
  let  userName=req.session. userName
  const productId=req.params.id
  const product=await productHelpers.findsingleproductdata(productId)
  console.log(product);
  product[0].price=product[0].price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
  res.render('user/productdetails',{product, userName})
},
rendercartpage:async(req,res)=>{
  let  userName=req.session. userName
  let userId=req.session.userId
  const cart=await cartHelpers.getcart(userId)
  let totalprice=0
  for(let i=0;i<cart.length;i++){
    totalprice=totalprice+cart[i].subTotal
    cart[i].productdetails.price= cart[i].productdetails.price.toLocaleString('en-IN', { style: "currency", currency: "INR" })
    cart[i].subTotal= cart[i].subTotal.toLocaleString('en-IN', { style: "currency", currency: "INR" })
  }
  totalprice=totalprice.toLocaleString('en-IN', { style: "currency", currency: "INR" })
  res.render("user/cart-page",{userName,cart,totalprice})
},
 addtocart:async(req,res)=>{
  const productId=req.params.id
  const userId=req.session.userId
  const iscartexist=await cartHelpers.findcart(userId)
  if(iscartexist){
   await cartHelpers.updatecart(userId,productId)
  }else{
    await cartHelpers.addtocart(userId,productId)
  }
  res.redirect("/shopepage")
 }
    
}