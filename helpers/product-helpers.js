const db=require('../config/connection')
const collection=require('../config/collection');

module.exports={
    productdata:(productdata)=>{
        return new Promise((resolve,reject)=>{
            console.log(productdata);
            productdata.price=Number(productdata.price)
            productdata.quantity=Number(productdata.quantity)
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productdata).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    findproducts:()=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).find().toArray().then((response)=>{
            console.log(response);
            resolve(response)
        })
        })
    }
}