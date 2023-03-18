const db=require('../config/connection')
const collection=require('../config/collection');
const { ObjectId } = require('mongodb-legacy');

module.exports={
    addbranddata:async(branddata)=>{
     branddata.islisted=true
     await db.get().collection(collection.BRAND_COLLECTION).insertOne(branddata)
    },
    findbranddate:async()=>{
        let brands=await db.get().collection(collection.BRAND_COLLECTION).find().toArray()
        return brands

    },
    unlistbrand:async(brandId)=>{
    let brandlist= await db.get().collection(collection.BRAND_COLLECTION).findOne({_id:new ObjectId(brandId)})
    if(brandlist.islisted){
        await db.get().collection(collection.BRAND_COLLECTION).updateOne({_id:new ObjectId(brandId)},{
            $set:{
                islisted:false
            }
        })
    }else{
        await db.get().collection(collection.BRAND_COLLECTION).updateOne({_id:new ObjectId(brandId)},{
            $set:{
                islisted:true
            }
        })
    }
    },
    editbrand:async(brandId,brandname)=>{
        await db.get().collection(collection.BRAND_COLLECTION).updateOne({_id:new ObjectId(brandId)},{
            $set:{brandname}
          })
    }
}