const db=require('../config/connection')
const collection=require('../config/collection')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb-legacy');

const insertamount=async(userId,total)=>{
console.log(userId);
console.log(total);
// total=total.replace(/,/g,"")
// total=total.replace('₹','')
// total=parseInt(total)
let alreadyexist= await db.get().collection(collection.WALLET_COLLECTION).findOne({user:userId})
if(alreadyexist){
    await db.get().collection(collection.WALLET_COLLECTION).updateOne({user:userId},{
        $inc:{amount:total}
    })
}else{
    await db.get().collection(collection.WALLET_COLLECTION).insertOne({user:userId,amount:total})
}
}


const getuserwallet=async(userId)=>{
   let userwallet=await db.get().collection(collection.WALLET_COLLECTION).findOne({user:userId}) 
   return userwallet
}

const updateWallet = async (userId,amount)=>{

    await db.get().collection(collection.WALLET_COLLECTION).updateOne({ user:userId},{
        $inc:{amount:amount}
   })
}

const findamount=async(userId)=>{
 let amount=await db.get().collection(collection.WALLET_COLLECTION).findOne({user:userId})
 console.log(amount);
 return amount
}

module.exports={insertamount,getuserwallet,updateWallet,findamount}