const db=require('../config/connection')
const collection=require('../config/collection');

module.exports={
    getcategorydata:(categorydata)=>{
        return new Promise((resolve,reject)=>{
            console.log(categorydata);
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
    }

}