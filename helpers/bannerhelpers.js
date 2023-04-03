const db=require('../config/connection')
const collection=require('../config/collection');
const cloudinary=require('../util/cloudinary');
const { ObjectId } = require('mongodb-legacy');


module.exports={

    addbannerdata:async(bannertext,images)=>{
        const banners=[]
        for(let i=0;i<images.length;i++){
            const {url} = (await cloudinary.uploader.upload(images[i].path))
            banners.push(url)
        }
        bannertext.banners=banners
        bannertext.ischoose=false
       await db.get().collection(collection.BANNER_COLLECTION).insertOne(bannertext)


    },
    getall:async()=>{
        let banners=await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
        console.log(banners);
        return banners
    },
    findOne:()=>{
      let banners=db.get().collection(collection.BANNER_COLLECTION).findOne({ischoose:true})
      return banners
    },

    // updateBanner:async(bannerId)=>{
    //     await db.get().collection(collection.BANNER_COLLECTION).updateMany({},{$set:{isChoose:false}})
    //     await db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:bannerId},{
    //         $set:{isChoose:true}
    //     })  
    // },

    unlistbanner:async(bannerId)=>{
        let bannerlist= await db.get().collection(collection.BANNER_COLLECTION).findOne({_id:bannerId})
        if(bannerlist.ischoose){
            await db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:bannerId},{
                $set:{
                  ischoose:false
                }
            })
        }else{
            await db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:bannerId},{
                $set:{
                  ischoose:true
                }
            })
        }
    },
    specificproduct:async(productId)=>{
        const product = await db.get().collection(collection.BANNER_COLLECTION).findOne({_id:new ObjectId(productId)})
            return product;
    },

    editbanner:async(bannerId,bannerText,newImages)=>{

        const Result=await db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:new ObjectId(bannerId)},{
            $set:{
                bannerText:bannerText,banners:newImages
            }
        })
        console.log(Result);
        return Result

    },
    deletebanner:async(bannerId)=>{
       await db.get().collection(collection.BANNER_COLLECTION).deleteOne({_id:new ObjectId(bannerId)})
    }
    
}