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
  console.log(productId);
  //-------------------------------
  const product=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(productId)})
  console.log("product"+product.quantity);

   const isproductexist=await db.get().collection(collection.CART_COLLECTION).findOne({user:userId,products:{
    $elemMatch:{
        productId:new ObjectId(productId)
    }
   }})

   if(isproductexist){
    const cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
      {
        $match:{user:userId}
      },
      {
        $unwind:{path:"$products"}
      },
      {
        $match: {
          "products.productId":new ObjectId(productId)
        }
      }
     ]).toArray()
     console.log("cart"+cart[0].products.quantity);
     //------------------------
     if((product.quantity - (cart[0].products.quantity+ 1)) >= 0){
     
    await db.get().collection(collection.CART_COLLECTION).updateOne({user:userId,products:{
        $elemMatch:{productId:new ObjectId(productId)}
    }},
    {
        $inc:{"products.$.quantity":1}
    })
    return "success"
  }else{
    return "failed"
  }

   }else{
    await db.get().collection(collection.CART_COLLECTION).updateOne({user:userId},
        {
           $push:{products:{productId:new ObjectId(productId),quantity:1}} 
        })
        return "success"
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
 },
 getcartcount:async(userId)=>{
  let count=0
  let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
  if(cart){
    count=cart.products.length
  }
  return count

 },
 changecartproductquantity:async(cartId,proId,count)=>{
  await db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(cartId),'products.productId':new ObjectId(proId)},{
    $inc:{"products.$.quantity":count}
  })
    const res=await db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(cartId)},{
      $pull:{products:{productId:new ObjectId(proId),quantity:0}}
    })
    return res;
     
 },
 removecartproduct:async(userId,proId)=>{
  await db.get().collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userId)},{
    $pull:{products:{productId:new ObjectId(proId)}}
  })
 },
 deletecart:async(userId)=>{
   const deletecart=await db.get().collection(collection.CART_COLLECTION).deleteOne({user:userId})
   console.log(deletecart);
 },
 findusercart:async(userId)=>{
  let usercart=await db.get().collection(collection.CART_COLLECTION).aggregate([
    {
      $match: {
        user:new ObjectId(userId)
      }
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
  console.log("myyyy");
  console.log(usercart);
  return usercart
 }


 

}