var nameError = document.getElementById('name-error');
var discError=document.getElementById("disc-Error");
var priceError=document.getElementById("price-Error");
var quantityError=document.getElementById("quantiy-Error")
var submitError = document.getElementById('submit-error');

function validatename(){                                 
  var name = document.getElementById('productname').value.trim()
  if(name.length == 0){
    nameError.innerHTML = 'Name is required';
    return false;
  }
  if(name.length<4) {
      nameError.innerHTML = 'Write full name';
      return false;
  }
  nameError.innerHTML = '';
      return true;
}

function validatedescription(){                                 
  var description= document.getElementById('description').value.trim()
  if(description.length == 0){
    discError.innerHTML = 'description is required';
    return false;
  }
  if(description.length<4) {
    discError.innerHTML = 'Enter more than 4 character';
      return false;
  }
  discError.innerHTML = '';
      return true;
}

function validateprice(){
    var price = document.getElementById('price').value.trim()
    if(price.length==0){
        priceError.innerHTML='price required'
    return false
  }else if(isNaN(price)){
    priceError.innerHTML='enter numeric value'
    return false
  }else if(price<0){
    priceError.innerHTML='enter positive integer'
    return false
  }
  priceError.innerHTML=''
  return true
}

function validatequantity(){
    var quantity = document.getElementById('quantity').value.trim()
    if(quantity.length==0){
        quantityError.innerHTML='quantity required'
    return false
  }else if(isNaN(quantity)){
    quantityError.innerHTML='enter numeric value'
    return false
  }else if(quantity<0){
    quantityError.innerHTML='enter positive integer'
    return false
  }
  quantityError.innerHTML=''
  return true
}

function validateForm(){
  if(!validatename() || !validatedescription()|| !validateprice()|| !validatequantity()){
    submitError.style.display='flex';
    submitError.style.justifyContent='center';
    submitError.innerHTML = 'Please fix all errors to submit';
    setTimeout(()=>{
      submitError.style.display='none';
    },3000); 
    return false;
  }
}

