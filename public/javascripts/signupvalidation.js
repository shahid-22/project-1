
var nameError = document.getElementById('name-error');
var emailError = document.getElementById('email-error');
var passwordError = document.getElementById('password-error');
var submitError = document.getElementById('submit-error');
var conformpasswordError=document.getElementById('conformpassword-error')
var mobileError=document.getElementById('mobile-error')





function validateName(){                                 
  var name = document.getElementById('name').value.trim()
  if(name.length == 0){
    nameError.innerHTML = 'Name is required';
    return false;
  }
  if(!name.match(/^[A-Za-z]+ [A-Za-z]+$/)) {
      nameError.innerHTML = 'Write full name';
      return false;
  }
  nameError.innerHTML = '';
      return true;
}

function validateEmail(){
  var email = document.getElementById('email').value.trim()
  if(email.length==0){
      emailError.innerHTML = 'Email is required';
      return false;
  }
  if(!email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)){
    emailError.innerHTML = 'Email invalid';
    return false;
  }
  emailError.innerHTML = '';
  return true;
}

function validatePassword(){
  var password = document.getElementById('password').value.trim()
  if(password.length==0){
    passwordError.innerHTML='password required'
    return false
  }
  else if(password.length<8){
    passwordError.innerHTML="password must be 8 charecter"
    return false
  }
  passwordError.innerHTML='';
  return true
}
function validatePassword2(){
  var passsword2 = document.getElementById('conformpassword').value.trim()
  var password1= document.getElementById('password').value;
  if(passsword2.length==0){
    conformpasswordError.innerHTML='password required'
    return false
  }else if(password1!=passsword2){
    conformpasswordError.innerHTML='password not match'
    return false
  }
  conformpasswordError.innerHTML=''
  return true

}
function validatemobilenumber(){
  var Phonenumber = document.getElementById('Phonenumber').value.trim()
  if(Phonenumber.length==0){
    mobileError.innerHTML='password required'
    return false
  }else if(isNaN(Phonenumber)){
    mobileError.innerHTML='enter numeric value'
    return false
  }else if(Phonenumber.length>10){
    mobileError.innerHTML='enter 10 numbers'
    return false
  }else if(Phonenumber.length<10){
    mobileError.innerHTML='must be 10 numbers'
    return false
  }
  mobileError.innerHTML=''
  return true

}

function validateForm(){
  if(!validateName() || !validateEmail() || !validatePassword() || !validatePassword2() ||!validatemobilenumber()){
    submitError.style.display='flex';
    submitError.style.justifyContent='center';
    submitError.innerHTML = 'Please fix all errors to submit';
    setTimeout(()=>{
      submitError.style.display='none';
    },3000);
    return false;
  }
}
