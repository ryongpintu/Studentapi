'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
student_id:{
    type:String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
 email:{
     type:String,
    
 },
 phone_number:{ 
    type: String
   
 },
 password:{
     type:String,
     default: ""
 },
 real_password:{
  type:String,
  default: ""
},
course_id:{
  type:Array
 
},
pin_code:{
  type:String,
  default: ""
},
package_id:{
  type:String,
  default: ""
},
package_credits:{
  type:String,
  default: "0"
},
credits_used:{
  type:String,
  default: "0"
},
package_expiry_date:{
  type: Date,
  default:''
},
type:{
  type:String
},
social_media_id:{
  type:String
},
verification_code:{
  type:String
},
verification_status:{
  type: Number,
  default:0
},
  created_date: {
    type: Date,
    default: Date.now
  },
  profile_image:{
    type: String,
    default: ""
  },
  address:{
    type:String,
    default: ""
  },
  city:{
    type:String,
    default: ""
  },
  state:{
    type:String,
    default: ""
  },
  secure_token:{
    type: String,
    default: ""
  },
  hubspot_id:{
    type: String,
    default: ""
  },
  status: {
    type:String,  
    default: 1,
  }
});
const StudentList= mongoose.model('student_list', TaskSchema);

exports.StudentList = StudentList;