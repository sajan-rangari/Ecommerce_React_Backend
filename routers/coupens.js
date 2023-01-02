const { Coupen } = require('../models/coupen')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) => {
    // const productList= await Product.find().select('name image -_id');
    // localhost:3000/api/v1/products?categories=2342342, 234234
    // let filter = {};
    // if(req.query.categories){
    //     filter = {category: req.query.categories.split(',')}
    // }
    const coupenList = await Coupen.find();
    if (!coupenList) {
        res.status(500).json({ success: false });
    }
    res.send(coupenList);
});


router.get(`/:id`, async (req, res) => {
    const coupen = await Coupen.findById(req.params.id);

    if (!coupen) {
        res.status(500).json({ success: false });
    }
    res.send(coupen);
});

router.post(`/`, async (req, res) => {
    let coupen = new Coupen({
        name: req.body.name,
        discountType: req.body.discountType,
        discountValue: req.body.discountValue,
        minOrderAmount: req.body.minOrderAmount,
        expiryDate: req.body.expiryDate,
    })

    coupen = await coupen.save();

    if (!coupen) {
        return res.status(500).send('the coupen cannot be created');
    }
    res.send(coupen);
    
});



router.put(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Coupen ID');
    }

    const coupenId = req.params.id;

    const coupen = await Coupen.findById({ _id: coupenId });
    if (!coupen) {
        return res.status(400).send('Invalid Coupen!');
    }


    const updateCoupen = await Coupen.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            discountType: req.body.discountType,
            discountValue: req.body.discountValue,
            minOrderAmount: req.body.minOrderAmount,
            expiryDate: req.body.expiryDate,
        },
        {
            new: true
        }
    )

    if (!updateCoupen)
        return res.status(500).send('the coupen cannot be updated');

    res.send(updateCoupen);
})

router.delete('/:id', (req, res) => {
    Coupen.findByIdAndRemove(req.params.id).then(coupen => {
        if (coupen) {
            return res.status(200).json({ success: true, message: 'coupen is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: 'coupen not found!' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    })
})


router.get(`/get/count`, async (req, res) => {
    const coupenCount = await Coupen.countDocuments((count) => count);

    if (!coupenCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        coupenCount: coupenCount
    });
});

router.get(`/get/featured/:count`, async (req ,res) =>{
    const count= req.params.count ? req.params.count : 0
    const coupens= await Coupen.find({isFeatured: true}).limit(+count);

    if(!coupens){
        res.status(500).json({success:false});
    }
    res.send(coupens);
});



// router.put(`/gallery-images/:id`,uploadOptions.array('images', 10), async (req,res) => {
//         if(!mongoose.isValidObjectId(req.params.id)){
//             res.status(400).send('Invalid Product ID');
//         }
//         const files=req.files;
//         // console.log(files);
//         let imagesPaths = [];
//         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//         if(files){
//             files.map(file =>{
//                 imagesPaths.push(`${basePath}${file.filename}`);
//             })
//         }
//         const product= await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 images: imagesPaths
//             },
//             {
//                 new: true
//             }
//         )

//         if(!product)
//             return res.status(500).send('the product cannot be updated');

//         res.send(product);

// })



module.exports = router;