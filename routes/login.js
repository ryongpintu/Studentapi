const jwt = require('jsonwebtoken');
const {StudentList} = require('../models/Register');
const bcrypt = require('bcrypt');
const express = require('express');
const keys = require('../config/keys')
const _ =require('lodash');
const router = express.Router();

router.post('/', async(req, res) => {
    
    //TODO input validation using JOI

    // Find user by email
     let user = await StudentList.findOne({email:req.body.email});
    if(!user) return res.status(400).send({error:"Invalid email or password"});
      const validpassword = await bcrypt.compare(req.body.password,user.password);
      if(!validpassword) return res.status(400).send({error:"Invalid email or password"});
     
          const payload = { id: user.id, name: user.email}; // Create JWT Payload
  
          // Sign Token
        let token=await  jwt.sign(
            payload,
            keys.secretKeys,
            { expiresIn: 3600 });

        // Check student status
        if(user.status ==0 )return res.status(400).send({error:"You are blocked"});
        



        res.send({
            success: true,
            token: 'Bearer ' + token
          })

});
  
module.exports= router;
