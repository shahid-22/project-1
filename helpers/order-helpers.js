const db=require('../config/connection')
const collection=require('../config/collection');
const { ObjectId } = require('mongodb-legacy');


module.exports={
    insertorderdata:async(products,address,userId,status,date,total,paymentmethod,offer)=>{
      const paymentstatus="pending"
      total=total.replace(/,/g,"")
      total=total.replace('₹','')
      total=parseInt(total)
      let today =new Date()
      today= new Date(today).toISOString().slice(0, 10);
      const result= await db.get().collection(collection.ORDER_COLLECTION).insertOne(
           { userId:userId,deliverydetails:address,products:products,date:date,total:total,paymentmethod,status,paymentstatus,today,offer}
        )
         return result
    },
    getorderdetails:async(userId)=>{
      const orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{userId:userId}
        },
        {
          $project:{
            date:1,
            status:1,
            paymentmethod:1,
            paymentstatus:1
          }
        },
        {
          $sort:{date:-1}
        }
      ]).toArray()
      return orders
    },
    Findalldetails:async(orderId)=>{
      const findallorderdetails= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{_id:orderId}
        },
        {
          $unwind:{path:"$products"}
        },
        {
          $lookup:{
            from:"product",
            localField:"products.productid",
            foreignField:"_id",
            as: "productdetails"
          }
        },
        {
          $unwind:{path:"$productdetails"}
        },
        {
          $project:{
            products:1,
            productdetails:1,
            subTotal:{$multiply:["$products.quantity","$productdetails.price"]},
            status:1,
            offer:1,
            paymentmethod:1,
            total:1,
            date:1,
            deliverydetails:1,
            userId:1

          }
        }
      ]).toArray()

      return findallorderdetails
    },
    findAll:async()=>{
      let orders=await db.get().collection(collection.ORDER_COLLECTION).find({}).sort({date:-1}).toArray()
      console.log(orders);
      return orders
    },
    changeorderstatus:async(orderId,status)=>{
      const changeorderstatus=await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:new ObjectId(orderId)},{
        $set:{status:status}
      })

      if(status==='delivered'){

        await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:new ObjectId(orderId)},{
          $set:{paymentstatus:'paid'}

        })
        
      }
      console.log(changeorderstatus);
    },
    findordersanduser:async(orderId)=>{
      let orderanduser=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{_id:new ObjectId(orderId)}
        },
        {
          $lookup:{
            from:"user",
            localField:"userId",
            foreignField:"_id",
            as:"userdetails"
          }
        },
        {
          $unwind:{path:"$userdetails"}
        },
        {
          $addFields:{
            username:"$userdetails.name",
            useremail:"$userdetails.email",
            userphonenumber:"$userdetails.Phonenumber",
          }
        },
        {
          $unset:"userdetails"
        },
        {
          $unwind:{path:"$products"}
        },
        {
          $lookup:{
            from:"product",
            localField:"products.productid",
            foreignField:"_id",
            as: "productdetails"
          }
        },
        {
          $unwind:{path:"$productdetails"}
        }
      ]).toArray()
      console.log(orderanduser);
      return orderanduser
    },

    changepaymentstatus:async(orderId)=>{
      console.log(orderId);
      await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:new ObjectId(orderId)},{
        $set:{
              paymentstatus:"paid",
              status:'PLACED'
        }
      })

    },
    failedpaystatus:async(orderId)=>{
      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
      console.log(orderId);
      await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:new ObjectId(orderId)},{
        $set:{
              paymentstatus:"failed"
        }
      })
    },

    delivereditems:async()=>{
      let delivereditem=await db.get().collection(collection.ORDER_COLLECTION).find({status:"delivered"}).sort({date:-1}).toArray()
      return delivereditem
    },

    filterproduct:async(startDate,endDate)=>{
      startDate=new Date(startDate)
      endDate=new Date(endDate)
    const filterproduct= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
      {
        $match: {
          $and:[{date:{$gte:startDate}},{date:{$lte:endDate}},{status:'delivered'}]
        }
      },
      {
        $project:{ 'deliverydetails':0,'products':0}
      },
      {
        $sort:{date:-1}
      }
    ]).toArray()
    return filterproduct
    },

    currentdateorder:async(todaydate)=>{
      let todaysale=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{
            $and:[{today:todaydate},{status:'delivered'}]
        }
      },
      ]).toArray()
      return todaysale
    },

    weeksalesreport:async(today,weekdate)=>{
      console.log(today,weekdate);
      let weeksale=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: {
            $and:[{today:{$lte:today}},{today:{$gte:weekdate}},{status:'delivered'}]
          }
        }
      ]).toArray()
      return weeksale
    },

    getorder:async(orderId)=>{
      console.log("hiiiiiiiiiiii");
      console.log(orderId);
      let order=await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:orderId})
      return order
    },

    changepaystatus:async(orderId)=>{
      await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:orderId},{
        $set:{
              paymentstatus:"refunded",
        }
      })
    },

    totalSale : async ()=>{
      const totalSale = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: {
          status:"delivered"
        }
      },
        {
          $group: {
          _id:null,
          grandtotal:{
            $sum:"$total"
          }
        }}
      ]).toArray()

      // console.log("hhh"+totalSale[0].grandtotal)
      // return totalSale[0].grandtotal
      return totalSale
  
    },

    filterSales : async(startDate,endDate)=>{
      const salesAmount = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {$match:{status:'delivered'}},
        {$match:{ today:{$gte:startDate,$lt:endDate}} },
        { $group: {_id: null, total: {$sum: '$total'}}},
      ]).toArray()
      // console.log("sales amount"+salesAmount[0].total);
      return salesAmount
  
    },

    salesPerMonth:async(startDate,endDate)=>{
      const salesPerMonth = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{ 
            status:'delivered' 
          }
        },
        {
          $match :{
            today:{
              $gte:startDate,
              $lt:endDate
            }
          }
        },
        {
          $group: {
            _id: {
              $month:'$date'
            },
            sale: {
              $sum: '$total'
            }
          }
  
        }
      ]).toArray()
      // console.log(salesPerMonth[0].sale);
      console.log("shahid");
      console.log(salesPerMonth);
      return salesPerMonth
  
    },

    getpayStatusordercount:async()=>{
      const orderpayStatusDetails = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $group: {
            _id:'$paymentmethod',
            count: {
              $sum: 1
            }
          }
        },
      ]).toArray()
      console.log(orderpayStatusDetails);
      
      return orderpayStatusDetails
  
  
    }
    

}