var nameError = document.getElementById('name-error');
var submitError = document.getElementById('submit-error');






function validatebrand(){                                 
  var name = document.getElementById('productname').value.trim()
  if(name.length == 0){
    nameError.innerHTML = 'enter brand';
    return false;
  }
  nameError.innerHTML = '';
      return true;
}



function validateForm(){
  if(!validatebrand()){
    submitError.style.display='flex';
    submitError.style.justifyContent='center';
    submitError.innerHTML = 'Please fix all errors to submit';
    setTimeout(()=>{
      submitError.style.display='none';
    },3000);
    return false;
  }
}
