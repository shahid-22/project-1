const db=require('../config/connection')
const collection=require('../config/collection');

module.exports={
    addbranddata:async(branddata)=>{
     await db.get().collection(collection.BRAND_COLLECTION).insertOne(branddata)
    },
    findbranddate:async()=>{
        let brands=await db.get().collection(collection.BRAND_COLLECTION).find().toArray()
        return brands

    }
}