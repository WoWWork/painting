const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const db_url = 'mongodb+srv://' + process.env.mongodb_usr + ':' + process.env.mongodb_pwd + '@datadb.jgr2l.mongodb.net/DataDB?retryWrites=true&w=majority';

var self;
var view_h;
var view_w;
var users = new Array();
var data_x = new Array();
var data_y = new Array();
var data_w;
var data_c = new Array();
var list_text = new Array();

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => { console.log('connected to db') })
  .catch((err) => { 
    console.log(err) 
})

const table_c = new mongoose.Schema({
  data_x:{
    type: String,
    require: true
  },
  data_y:{
    type: String,
    require: true
  },
  data_w:{
    type: String,
    require: true
  },
  data_c:{
    type: String,
    require: true
  }
},{ timestamps: true });

const table_t = new mongoose.Schema({
  message:{
    type: String,
    require: true
  }
},{ timestamps: true });

const db_table_c = mongoose.model('coordinate', table_c);
const db_table_t = mongoose.model('text', table_t);

module.exports = {
  self: self,
  users: users,
  db_table_c: db_table_c,
  db_table_t: db_table_t,
  view_h: view_h,
  view_w: view_w,
  data_x: data_x,
  data_y: data_y,
  data_w: data_w,
  data_c: data_c,
  list_text: list_text
};