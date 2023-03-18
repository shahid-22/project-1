const db=require('../config/connection')
const collection=require('../config/collection');
const { ObjectId } = require('mongodb-legacy');

module.exports={
    getcategorydata:(categorydata)=>{
        return new Promise((resolve,reject)=>{
            console.log(categorydata);
            categorydata.status=false;
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(categorydata).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    findcategory:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).find().toArray().then((response)=>{
                console.log(response);
                resolve(response)
            })
            })
    },
    deletecategory:async(categoryId)=>{
        console.log(categoryId);
        console.log("mmmmmmmmmmmmm");
        let categorystatus= await db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:new ObjectId(categoryId)})
       if(categorystatus.status){
        await  db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:new ObjectId(categoryId)},{
          $set:{
            status:false
          }
        })
       }else{
        await  db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:new ObjectId(categoryId)},{
          $set:{
            status:true
          }
        })
       }
      },
      findAll:async()=>{
        let categories= await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray();
        return categories
      },
      editcategory:async(categoryId,categoryname)=>{
        await db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:new ObjectId(categoryId)},{
          $set:{categoryname}
        })
      }

}