const { StudentList } = require('../models/Register');
const {DemoPackage} = require('../models/DemoPackage')
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const nodemailer = require("nodemailer");
const _ = require('lodash')
const router = express.Router();


router.post('/',async(req,res)=>{
	
	let userE=await StudentList.findOne({email:req.body.email});
    if(userE)return res.status(400).send({error:'Email already Exist'});
    
    let user=await StudentList.findOne({phone_number:req.body.phone_number});
    if(user)return res.status(400).send({error:'Mobile Number already Exist'});
    
    user = new StudentList(_.pick(req.body,['first_name','last_name','phone_number','course_id','pin_code','email','password'])
	);

	 const salt = await bcrypt.genSalt(10);
     user.password=await bcrypt.hash(user.password,salt);
     
     //Create OTP
    var vcode=Math.floor(100000 + Math.random() * 900000);
    user.verification_code= await vcode
    
    
    // SEND OTP
    axios.get('https://apps.learncab.com/payment/sms.php?mobile_no='+req.body.phone_number+'&message=Hi '+req.body.first_name +' '+ req.body.last_name+',\n'+ vcode +' is your OTP for LearnCab account verification.').then(res => {  });

    
    //Creating hubspot entry and fetching hubspot_id
    axios.get('https://apps.learncab.com/payment/create_hubspot_contact.php?first_name='+req.body.first_name+'&last_name='+req.body.last_name+'&email='+req.body.email+'&mobile_no='+req.body.phone_number+'&pin_code='+req.body.pin_code+'&course_level='+req.body.course_id+'&student_id='+user._id )
        .then(async(resd) => { 

            user.hubspot_id=resd.data;
            console.log('hubspot_id',resd.data)
           await user.save()
            
      }).catch(err=>{
          console.log(err)
      })

      

    res.send(user);
    
});


router.post('/verifyotp',async(req,res)=>{
    let vcode = req.body.verification_code;
   let user= await StudentList.findOne({ email :req.body.email, verification_code: vcode })
   if(!user)return res.status(400).send({error:'Enter Valid OTP'});
  
 
     
    const demo_package= await DemoPackage.findOne({last_updated:null})
    
    let nuOfDays= await demo_package.no_of_days;
    let exp_date = new Date(new Date().getTime()+(nuOfDays*24*60*60*1000));
   
    //update student info
    user.verification_status= 1;
    user.package_id=await demo_package._id;
    user.package_credits=await demo_package.no_of_credits;
    user.package_expiry_date= await exp_date;
    await user.save()
    res.send(demo_package)
    
})

router.post('/resendotp',async(req,res)=>{

var vcode=Math.floor(100000 + Math.random() * 900000);
 
// SEND OTP
axios.get('https://apps.learncab.com/payment/sms.php?mobile_no='+req.body.phone_number+'&message=Hi '+ vcode +' is your OTP for LearnCab account verification.').then(res => {  });


res.send('done')
})

router.post('/forgotpassword',async(req,res)=>{
    let user= await StudentList.findOne({ email :req.body.email})

//TODO add to env
    var smtpTransport = nodemailer.createTransport({
        host: "mail.learncab.com",
        port : 587,
       // secure : true,
        auth: {
            user: "noreply@learncab.com",
            pass: "$Le@rnCab123#"
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });

//TODO verify token query
      var mailOptions={
        to : user.email,
        subject : 'LearnCab | Password Reset  ',
        html :'<p>Dear '+user.first_name+' '+user.last_name+',</p><pForgotten your password? No need to worry.  Click below to reset password:</p><p>https://apps.learncab.com/#/student_reset_password/ </p><p>If you didn’t request a password reset, please contact us at <a href="mailto:support@learncab.com;">support@learncab.com</a>.</p> </p> <p>If you suddenly remembered your password, ignore this email.</p><p>Do continue enjoying your LearnCab experience.</p> <p> For any queries, please contact  <a href="mailto:support@learncab.com;">support@learncab.com</a><p>Regards,<br/>LearnCab Team</p>'
      }

      smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('errorr',error);
            res.end("error");
        }else{
          console.log('Message sent: %s', response.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(response));
            console.log("Message sent: " + response);
        }
      });

      res.send('done')
   
})


module.exports= router;