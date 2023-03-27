const db=require('../config/connection')
const collection=require('../config/collection')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb-legacy');




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
    },
    findAll:async()=>{
      const products=await db.get().collection(collection.PRODUCT_COLLECTION).find({isdeleted:false}).toArray()
      return products
    },
    phonenumberexist:async(phonenumber)=>{
        console.log(phonenumber);
        phonenumber=Number(phonenumber)
       let phoneverify= await db.get().collection(collection.USER_COLLECTION).findOne({Phonenumber:phonenumber})
        console.log( phoneverify);
        return phoneverify
    },
    addaddrtess:async(address,userId)=>{
        address.phone=Number(address.phone)
        address.pincode=Number(address.pincode)
        address._id=new ObjectId()
        await db.get().collection(collection.USER_COLLECTION).updateOne({_id: new ObjectId(userId)},{
            $push:{address:address}
        })


    },
    findaddress:async(userId)=>{
        const user=await db.get().collection(collection.USER_COLLECTION).aggregate([
            {
                $match:{_id:new ObjectId(userId)}
            },
            {
                $unwind:{path:"$address"}
            },
            {
              $project:{
                address:1
              }
            }
        ]).toArray()
        return user
    }
}