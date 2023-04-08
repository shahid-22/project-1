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
        phonenumber=Number(phonenumber)
       let phoneverify= await db.get().collection(collection.USER_COLLECTION).findOne({Phonenumber:phonenumber})
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
    },
    findOneaddress:async(userId,addressId)=>{
        const address=await db.get().collection(collection.USER_COLLECTION).aggregate([
            {
                $match:{_id:new ObjectId(userId)}
            },
            {
                $unwind:{path:"$address"}
            },
            {
               $match:{ "address._id":new ObjectId(addressId)} 
            },
            {
                $project:{
                    address:1,
                    _id:0
                }
            }
        ]).toArray()
        return address

    },
    finduser:async(userId)=>{
       const userdetails=await db.get().collection(collection.USER_COLLECTION).findOne({_id:new ObjectId(userId)})
       return userdetails
    },
    editaddress:async(addressId,userId,address)=>{
        addressId=new ObjectId(addressId)
        userId=new ObjectId(userId)
        
        await db.get().collection(collection.USER_COLLECTION).updateOne({_id:userId,address:{$elemMatch:{_id:addressId}}},{
            $set:{
                "address.$.firstName":address.firstName,
                "address.$.lastName":address.lastName,
                "address.$.address":address.address,
                "address.$.district":address.district,
                "address.$.city":address.city,
                "address.$.pincode":address.pincode,
                "address.$.phone":address.phone,
            }
        })
    },
    deleteaddress:async(addressId,userId)=>{
        addressId=new ObjectId(addressId)
        userId=new ObjectId(userId)
        await db.get().collection(collection.USER_COLLECTION).updateOne({_id:userId,address:{$elemMatch:{_id:addressId}}},{
            $pull:{address:{_id:addressId}}
        })
    
    },
    changepassword:async(UserId,newpassword)=>{
        newpassword = await bcrypt.hash(newpassword,10);
        await db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(UserId)},{
            $set:{password:newpassword}
        })
    },

    phonenumberexist:async(phonenumber)=>{
        phonenumber=Number(phonenumber)
        const isexist= await db.get().collection(collection.USER_COLLECTION).findOne({Phonenumber:phonenumber})
        return isexist
    },

    emailexist:async(email)=>{
        const isexist= await db.get().collection(collection.USER_COLLECTION).findOne({email:email})
        return isexist
    },
    updateProfile:async(name,phone,email,userId)=>{
        phone=Number(phone)
       await db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(userId)},{
        $set:{name:name,Phonenumber:phone,email:email}
       })
    }
    


}