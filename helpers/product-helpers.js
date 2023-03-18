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
                $match:{
                    isdeleted:{$ne:true}
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
        ]).toArray().then((response)=>{
            console.log(response);
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
     
    }


}