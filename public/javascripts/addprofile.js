
jQuery('#formValidate').validate({
    rules:{
      firstName:{
        required:true,
        minlength:3,
        normalizer: function(value) {
           return $.trim(value);
         }
      },
      lastName:{
        required:true,
        minlength:1,
        normalizer: function(value) {
            return $.trim(value);
          }
      },
      address:{
        required:true,
        minlength:8,
        normalizer: function(value) {
            return $.trim(value);
          }
      },
      district:{
        required:true
      },
      city:{
        required:true,
        minlength:3,
        normalizer: function(value) {
            return $.trim(value);
          }
      },
      pincode:{
        required:true,
        minlength:5,
        digits:true
      },
      phone:{
        required:true,
        minlength:10,
        maxlength:10,
        digits:true
      }
      

    },
    messages:{
      firstName:{
        required:"First Name reqired",
      },
      lastName:{
        required:"Last Name required"
      },
      address:{
        required:"address is required"
      },
      district:{
        required:"district is required"
      },
      city:{
        required:"city is required"
      },
      pincode:{
        required:"pincode is required"
      },
      phone:{
        required:"phone is required",
        digits:"only number is required"
      }
    },
    submitHandler: function(form) {
        // do something here
        form.submit();
    }
  })