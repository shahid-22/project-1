const razorpay=require("razorpay")


const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_xZWjPEoMfU01As',
  key_secret: 'U4EZfXR6uehFcsc1ADhzJKDw',
});

module.exports={
    generaterazorpay:async(orderId,total)=>{
        try {
            total = parseInt(total);
            const order = await instance.orders.create(
                {
                    amount: total,
                    currency: "INR",
                    receipt: "" + orderId
                })
            return order;
        } catch (err) {
            console.log(err)
        }
    }
}