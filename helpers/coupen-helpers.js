const db=require('../config/connection')
const collection=require('../config/collection')
const { ObjectId } = require('mongodb-legacy')


module.exports={
    addcoupen:async(coupen,name,discount,createdDate,expiryDate)=>{
      expiryDate=new Date(expiryDate)
      discount=parseInt(discount)
      const isExpired=false;
      console.log(expiryDate,createdDate,discount);
      await db.get().collection(collection.COUPEN_COLLECTION).insertOne({coupen,name,discount,createdDate,expiryDate,isExpired})
      
    },
    FindAll:async(userId)=>{
        // const coupen=await await db.get().collection(collection.COUPEN_COLLECTION).find({isExpired: false}).sort({createdDate:-1}).toArray() 
        // return coupen
        console.log(userId);
        const coupen=await await db.get().collection(collection.COUPEN_COLLECTION).aggregate([
            {
                $match:{
                    isExpired: false
                }
            },
            {
                $match: {
                    users:{$nin:[new ObjectId(userId)]}
                }
            },
            {
                $sort:{createdDate:-1}
            }
        ]).toArray()
        return coupen
        
    },
    deletecoupen:async(coupenId)=>{
        await db.get().collection(collection.COUPEN_COLLECTION).deleteOne({_id:new ObjectId(coupenId)})
    },
    findOne:async(name)=>{
        const isexist= await db.get().collection(collection.COUPEN_COLLECTION).findOne({name:name})
        return isexist
    },
    adduser:async(coupencode,userId)=>{
        console.log(coupencode);
        console.log(userId);
        await db.get().collection(collection.COUPEN_COLLECTION).updateOne({name:coupencode},{
            $push:{users:userId}
           })
    },
    checkUsedCoupon:async(userId,coupencode)=>{
        userId=new ObjectId(userId)
        const coupon=await db.get().collection(collection.COUPEN_COLLECTION).findOne({name:coupencode,users:{$in:[userId]}})
        console.log("jkhjhyfdfggh");
        console.log(coupon);
       return coupon;

    },
    coupenalreadyExist:async(name)=>{
        const Exist=await db.get().collection(collection.COUPEN_COLLECTION).findOne({name:name})
        return Exist
    },

    checkCouponExpired : async ()=>{
        const currentDate= new Date()
        await db.get().collection(collection.COUPEN_COLLECTION).updateMany(
            { expiryDate: { $lt: currentDate } },
            { $set: {isExpired: true } }
          );
    
    }

}