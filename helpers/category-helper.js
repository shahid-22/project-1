const db=require('../config/connection')
const collection=require('../config/collection');
const { ObjectId } = require('mongodb-legacy');

module.exports={
    getcategorydata:(categorydata)=>{
        return new Promise((resolve,reject)=>{
            console.log(categorydata);
            categorydata.status=true;
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
    listedcategory:async()=>{
      const category=await db.get().collection(collection.CATEGORY_COLLECTION).find({status:true}).toArray()
      return category

    },
    deletecategory:async(categoryId)=>{
        console.log(categoryId);  
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
      },
      categoryalreadyexist:async(categoryname)=>{
        const categorydataalreadyexist=await db.get().collection(collection.CATEGORY_COLLECTION).findOne({categoryname:categoryname})
        return categorydataalreadyexist

      }

}