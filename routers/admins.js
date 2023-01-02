const { Admin } = require('../models/admin')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const authJwt = require('../helpers/jwt');


// For getting all login admins
router.get(`/`, async (req, res) => {

    const AdminsList = await Admin.find().select('-passwordHash');
    if (!AdminsList) {
        res.status(500).json({ success: false });
    }
    res.send(AdminsList);
});

// For getting particular admin with id
router.get(`/:id`, async (req, res) => {
    const admin = await Admin.findById(req.params.id).select('-passwordHash');

    if (!admin) {
        res.status(500).json({ success: false });
    }
    res.send(admin);
});




router.post(`/`, async (req, res) => {
    let admin = new Admin({
        name:req.body.name,
        email: req.body.email,
        passwordHash:req.body.passwordHash,
        // passwordHash: bcrypt.hashSync(req.body.password,10),
        isAdmin: req.body.isAdmin
    })

    admin = await admin.save();

    if (!admin) {
        return res.status(500).send('the admin cannot be created');
    }
    res.send(admin);

});



router.post('/login', async (req,res) =>{
    const admin = await Admin.findOne({
        $and: [{ email: req.body.email }, { passwordHash: req.body.passwordHash }]
      });
 
    if(!admin){
        return res.status(400).send('The Admin Not found');
    }
    // bcrypt.compareSync(req.body.password, admin.passwordHash)

    if(admin && admin.passwordHash){
        const secret=process.env.secret;
        const token=jwt.sign(
            {
                adminId: admin.id,
                isAdmin: admin.isAdmin,
                name:admin.name,
                email: admin.name
            },
            secret,
            {expiresIn: '1d'}
        )

        res.status(200).send({name: admin.name,email: admin.email , token: token});
        // res.status(200).send('Admin Authenticated');
    }else{
        // res.status(400).send('Email or Password is Wrong');
        res.status(400).send('Password is Wrong');
    }
})


// for Editing admin information
router.put(`/:id`, async (req,res)=>{

    const adminExist= await Admin.findById(req.params.id);
    let newPassword
    if(req.body.passwordHash){
        newPassword=req.body.passwordHash
    }else{
        newPassword=adminExist.passwordHash;
    }
    const admin= await Admin.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            isAdmin:req.body.isAdmin
        },
        {
            new: true
        }
    )

    if(!admin)
    return res.status(404).send('the admin cannot be created');


    res.send(admin);
})

router.post('/register',async (req,res)=>{
    let admin =new  Admin({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        isAdmin: req.body.isAdmin
        
    })

    // console.log("category data ==> ", category)
    admin = await admin.save();

    if(!admin)
    return res.status(404).send('the admin cannot be created');

    res.send(admin);
})




// for deleting particular admin
router.delete('/:id', (req, res) => {
    Admin.findByIdAndRemove(req.params.id).then(admin => {
        if (admin) {
            return res.status(200).json({ success: true, message: 'admin is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: 'admin not found!' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    })
})











module.exports = router;