let nameError = document.getElementById('name-error');
let submitError = document.getElementById('submit-error');






function validatebrand(){                                 
let name = document.getElementById('brandname').value.trim()
if(name.length == 0){
nameError.style.display='flex';
nameError.innerHTML = 'enter your brand';
setTimeout(()=>{
nameError.style.display='none';
},3000);
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