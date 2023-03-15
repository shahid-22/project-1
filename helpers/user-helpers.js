const db=require('../config/connection')
const collection=require('../config/collection')
const bcrypt = require('bcrypt');




module.exports={
    dosignup:( userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Phonenumber=Number(userData.Phonenumber)
            userData.password = await bcrypt.hash(userData.password,10);
            userData.isBlocked=false
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(async(data)=>{
                // resolve(data);
                dataDoc = await db.get().collection(collection.USER_COLLECTION).findOne({_id:data.insertedId});
                resolve(dataDoc);
             
            })
        })
            
    },
    dologin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={};
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email});
            if(user){
                if(user.isBlocked){
                    resolve({status:false});
                }
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        response.user=user;
                        response.status=true;
                        resolve(response);
                    }else{
                        resolve({status:false});
                    }
                })
            }else{
                resolve({status:false});
            }
        })
    }
}