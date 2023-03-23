const db=require('../config/connection')
const collection=require('../config/collection')
const { ObjectId } = require('mongodb-legacy')


module.exports={
    getuserdata:function(){
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).find().toArray().then((response)=>{
             console.log(response);
             resolve(response)
           })
         })
    },
    changeuserstatus:async(userId)=>{
      let userstatus= await db.get().collection(collection.USER_COLLECTION).findOne({_id:new ObjectId(userId)})
     if(userstatus.isBlocked){
      await  db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(userId)},{
        $set:{
          isBlocked:false
        }
      })
     }else{
      await  db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(userId)},{
        $set:{
          isBlocked:true
        }
      })
     }
    }
   
}