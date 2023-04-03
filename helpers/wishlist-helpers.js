const db=require('../config/connection')
const collection=require('../config/collection');
const { ObjectId } = require('mongodb-legacy');

module.exports={
    addtowishlist:async(proId,userId)=>{
        const products=[]
        const product={
              productId:proId
           }
          products.push(product)
          await db.get().collection(collection.WISHLIST_COLLECTION).insertOne({user:userId,products})
          
    },
    finduser:async(userId)=>{
        const wishlist=db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:userId})
        return wishlist
    },
    updatewishlist:async(proId,userId)=>{
        const isproductexist= await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:userId,products:{
            $elemMatch:{
                productId:proId
            }
        }})
        if(!isproductexist){
            await db.get().collection(collection.WISHLIST_COLLECTION).updateOne({user:userId},
                {
                    $push:{products:{productId:proId}}
             })
             return "success"
        }else{
            await db.get().collection(collection.WISHLIST_COLLECTION).updateOne({user:userId},{
                $pull:{products:{productId:proId}}
            })
            return "Removed"
          
        }
    },
    FindAll:async(userId)=>{
        let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
            {
                $match:{user:userId}
            },
            {
                $unwind:{path:"$products"}
            },
            {
                $lookup:{
                    from:"product",
                    localField:"products.productId",
                    foreignField:"_id",
                    as:"productdetails"
                }
            },
            {
                $unwind:{path:"$productdetails"}
            }
        ]).toArray()
        console.log("myyyyyyyyyyyyyyyyyy");
        console.log(wishlist);
        return wishlist
    }
}