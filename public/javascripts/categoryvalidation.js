let categoryError = document.getElementById('category-error');
let submitError = document.getElementById('submit-error');



function validatecategory(){                                 
let categoryname = document.getElementById('categoryname').value.trim()
if(categoryname.length == 0){
categoryError.style.display='flex';
categoryError.innerHTML = 'enter category..';
setTimeout(()=>{
    categoryError.style.display='none';
  },3000);
return false;
}
nameError.innerHTML= '';
  return true;
}



function validateForm(){
if(!validatecategory()){
submitError.style.display='flex';
submitError.style.justifyContent='center';
submitError.innerHTML = 'Please fix all errors to submit';
setTimeout(()=>{
  submitError.style.display='none';
},3000);
return false;
}else{
return true;
}
}