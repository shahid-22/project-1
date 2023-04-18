const db=require('../config/connection')
const collection=require('../config/collection');
const cloudinary=require('../util/cloudinary');
const { ObjectId } = require('mongodb-legacy');

module.exports={
    productdata:(productdata,images)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(productdata);
            productdata.price=Number(productdata.price)
            productdata.quantity=Number(productdata.quantity)
            productdata.categoryname= new ObjectId(productdata.categoryname)
            productdata.brandname=new ObjectId(productdata.brandname)
            const imagesurl=[]
            for(let i=0;i<images.length;i++){
                const {url} = (await cloudinary.uploader.upload(images[i].path))
                imagesurl.push(url)
            }
           console.log(imagesurl);
           console.log(productdata);
           productdata.imagesurl=imagesurl
           productdata.isdeleted=false
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productdata).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    findproducts:()=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
          
            {
                $lookup:{
                    from: "category",
                    localField: "categoryname",
                    foreignField:"_id",
                    as:"categorydetails"
                }
            },
            {
                $lookup:{
                    from: "Brand",
                    localField: "brandname",
                    foreignField:"_id",
                    as: "branddetails"
                }
            }
        ]).toArray().then((response)=>{
            // console.log("response"+response);
            resolve(response)
        })
        })
    },
    findsingleproductdata:async(productId)=>{
        let product=await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
            {
               $match:{
                _id:new ObjectId(productId)
               }
            },
            {
                $lookup:{
                    from: "category",
                    localField: "categoryname",
                    foreignField:"_id",
                    as:"categorydetails"
                }
            },
            {
                $lookup:{
                    from: "Brand",
                    localField: "brandname",
                    foreignField:"_id",
                    as: "branddetails"
                }
            } 
        ]).toArray();
        return product;

    },
    specificproduct:async(productId)=>{
            const product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(productId)})
            return product;
    },
    editProduct : async (productId,productname,description,categoryname,brandname,price,quantity, newImages)=>{

        categoryname= new ObjectId(categoryname)
        brandname = new ObjectId(brandname)
        quantity=parseInt(quantity)
        price=parseInt(price)


       const result = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{
            $set:{

                productname:productname,description:description,categoryname:categoryname,brandname:brandname,price:price,quantity:quantity,imagesurl:newImages
            }
        })
        console.log(result);
    },
    deleteproduct:async(productId)=>{
        await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{
            $set:{
                isdeleted:true
            }
        })
     
    },
    findcategoryproduct:async(catrgoryId)=>{
        let product=await db.get().collection(collection.PRODUCT_COLLECTION).find({categoryname:new ObjectId(catrgoryId)}).toArray();
        return product;
    },
    findbrandproduct:async(brandId)=>{
        let brandproduct=await db.get().collection(collection.PRODUCT_COLLECTION).find({brandname:new ObjectId(brandId)}).toArray();
        return brandproduct;
    },
    delete:async(productId)=>{
        let productstaus= await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(productId)})
        console.log(productstaus);
        if(productstaus.isdeleted){
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{
                $set:{
                    isdeleted:false
                }
            })
        }else{
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{
                $set:{
                    isdeleted:true
                }
            }) 
        }
    },

    changestock:async(productId,quantity)=>{

        await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{
            $inc:{quantity:quantity}
        })

    },

    findfilterproduct:async(minamount,maxamount)=>{
        console.log(minamount,maxamount);
        minamount=Number(minamount)
        maxamount=Number(maxamount)
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
            {
              $match: {
                isdeleted:false
              }
            },
            {
                
              $match: {
                $and:[{price:{$gte:minamount,$lte:maxamount}}]
              }
                  
            },{
                $sort:{price:1}
            }
        ]).toArray()
        console.log(products);
        return products
    },

    totalproduct:async()=>{
    const totalproductcount=await db.get().collection(collection.PRODUCT_COLLECTION).countDocuments({isdeleted:false})
    return totalproductcount
    },

    findsearchproducts:async(search)=>{
        const searchedproduct=await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        {
            $match:{      
                isdeleted:false
            }
         },
         {
             $lookup:{
                 from: "category",
                 localField: "categoryname",
                 foreignField:"_id",
                 as:"categorydetails"
             }
         },
         {
             $lookup:{
                 from: "Brand",
                 localField: "brandname",
                 foreignField:"_id",
                 as: "branddetails"
             }
         },
         {
            $unwind: {
              path: '$branddetails',
             
            }
        },
        {
            $unwind: {
              path: '$categorydetails',
            }

        },
        {
            $match: {
              $or:[
                {productname:{$regex:search,$options:'i'}},
                {'branddetails.brandname':{$regex:search,$options:'i'}},
                {'categorydetails.categoryname':{$regex:search,$options:'i'}},
              ]
            }

        }
        ]).toArray()
        console.log(searchedproduct);
        return searchedproduct

         

    }




    


}