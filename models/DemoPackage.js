'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PackageSchema = new Schema({
  title: {
    type: String
  },
  no_of_days: {
    type: String
  },
  no_of_credits: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  last_updated: {
    type: Date,
    default:''
  }
});

const DemoPackage= mongoose.model('demopackage', PackageSchema);

exports.DemoPackage= DemoPackage;