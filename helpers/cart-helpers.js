const db=require('../config/connection')
const collection=require('../config/collection');
const { ObjectId } = require('mongodb-legacy');


module.exports={
 findcart:(userId)=>{
    const cart=db.get().collection(collection.CART_COLLECTION).findOne({user:userId})
    return cart
 },
 addtocart:async(userId,productId)=>{
  const products=[]
  const cartobjects={
    productId:new ObjectId(productId),
    quantity:1
  }
  products.push(cartobjects)
  await db.get().collection(collection.CART_COLLECTION).insertOne({user:userId,products})

 },
 updatecart:async(userId,productId)=>{
   const isproductexist=await db.get().collection(collection.CART_COLLECTION).findOne({user:userId,products:{
    $elemMatch:{
        productId:new ObjectId(productId)
    }
   }})
   if(isproductexist){
    await db.get().collection(collection.CART_COLLECTION).updateOne({user:userId,products:{
        $elemMatch:{productId:new ObjectId(productId)}
    }},
    {
        $inc:{"products.$.quantity":1}
    })
   }else{
    await db.get().collection(collection.CART_COLLECTION).updateOne({user:userId},
        {
           $push:{products:{productId:new ObjectId(productId),quantity:1}} 
        })
   }
 },
 getcart:async(userId)=>{
   const cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
    {
        $match:{user:userId}
    },
    {
        $unwind:{path:"$products"}
    },
    {
     $lookup:{
        from: "product",
        localField: "products.productId",
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
        subTotal:{$multiply:["$products.quantity","$productdetails.price"]}  
      }
    }
   ]).toArray()
   return cart
 }

}