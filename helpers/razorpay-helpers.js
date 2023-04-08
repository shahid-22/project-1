const razorpay=require("razorpay")
const crypto=require('crypto')


const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id:process.env.KEY_ID,
  key_secret:process.env.KEY_SECRET,
});

module.exports={
    generaterazorpay:async(orderId,total)=>{
        try {
            console.log(orderId);
            console.log(total);
            total = Number(total)
            const order = await instance.orders.create(
                {
                    amount: total*100,
                    currency: "INR",
                    receipt:"" + orderId
                })
            return order;
        } catch (err) {
            console.log(err)
        }
    },
    verifypayment:(details)=>{
        let hmac=crypto.createHmac('sha256',process.env.KEY_SECRET)
        hmac.update(details.payment.razorpay_order_id+'|'+details.payment.razorpay_payment_id)
        hmac=hmac.digest('hex')
        if(hmac==details.payment.razorpay_signature){
            return true
        }else{
            return false
        }
    }
}