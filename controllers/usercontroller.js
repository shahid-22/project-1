const userHelpers = require("../helpers/user-helpers");

module.exports={
  userviewrender:(req,res,next)=>{
    let user=req.session.user
    console.log(user);
    res.render('user/userview',{user});
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
    req.session.loggedIn=true;
    req.session.user=response;
    // console.log(req.session.user);
    res.redirect('/');
  })
  
},
loginpost:(req,res)=>{
  userHelpers.dologin(req.body).then((response)=>{
    // console.log(response);
    
   if(response.status){
    req.session.loggedIn=true;
    req.session.user=response;
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
}

}