const db=require('../config/connection')
const collection=require('../config/collection');
const { ObjectId } = require('mongodb-legacy');


module.exports={
    insertorderdata:async(products,address,userId,status,date,total,paymentmethod)=>{
      const paymentstatus="pending"
      const result= await db.get().collection(collection.ORDER_COLLECTION).insertOne(
           { userId:userId,deliverydetails:address,products:products,date:date,total:total,paymentmethod,status,paymentstatus}
        )
         return result
    },
    getorderdetails:async(userId)=>{
      const orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{userId:userId}
        },
        {
          $project:{
            date:1,
            status:1,
            paymentmethod:1
          }
        },
        {
          $sort:{date:-1}
        }
      ]).toArray()
      return orders
    },
    Findalldetails:async(orderId)=>{
      const findallorderdetails= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{_id:orderId}
        },
        {
          $unwind:{path:"$products"}
        },
        {
          $lookup:{
            from:"product",
            localField:"products.productid",
            foreignField:"_id",
            as: "productdetails"
          }
        },
        {
          $unwind:{path:"$productdetails"}
        },
        {
          $project:{
            products:1,
            productdetails:1,
            subTotal:{$multiply:["$products.quantity","$productdetails.price"]},
            status:1,
            paymentmethod:1,
            total:1,
            date:1,
            deliverydetails:1,
            userId:1

          }
        }
      ]).toArray()

      return findallorderdetails
    },
    findAll:async()=>{
      let orders=await db.get().collection(collection.ORDER_COLLECTION).find({}).toArray()
      console.log(orders);
      return orders
    },
    changeorderstatus:async(orderId,status)=>{
      const changeorderstatus=await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:new ObjectId(orderId)},{
        $set:{status:status}
      })
      console.log(changeorderstatus);
    },
    findordersanduser:async(orderId)=>{
      let orderanduser=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{_id:new ObjectId(orderId)}
        },
        {
          $lookup:{
            from:"user",
            localField:"userId",
            foreignField:"_id",
            as:"userdetails"
          }
        },
        {
          $unwind:{path:"$userdetails"}
        },
        {
          $addFields:{
            username:"$userdetails.name",
            useremail:"$userdetails.email",
            userphonenumber:"$userdetails.Phonenumber",
          }
        },
        {
          $unset:"userdetails"
        },
        {
          $unwind:{path:"$products"}
        },
        {
          $lookup:{
            from:"product",
            localField:"products.productid",
            foreignField:"_id",
            as: "productdetails"
          }
        },
        {
          $unwind:{path:"$productdetails"}
        }
      ]).toArray()
      console.log(orderanduser);
      return orderanduser
    }
}