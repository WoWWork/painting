const path = require('path');
const fs = require('fs');

//const cors = require('cors');

const express = require('./socket').express;
const app = require('./socket').app;
const server = require('./socket').server;
const client = require('./socket').client;

var time_t_l = new Date();
var time_c_l = new Date();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static('controllers'));
app.use(express.urlencoded({ extended: true }));

//app.use(cors());
//app.options('*',cors());
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/

const _port = server.listen(3000, () => { console.log('app listening on port 3000!') });

app.get('/', (req, res) => {
  res.render('index');
});

  /* create platform */

app.get('/draw', (req, res) => {
  let output = new Array();
  req.headers.cookie.split(/\s*;\s*/).forEach((element) => {
    pair = element.split(/\s*=\s*/);
	  output[pair[0]] = pair.splice(1).join('=');
  });
  require('./admin').self = output;
  let lan = require('./socket').lan_info();
  require('./admin').self['lan'] = lan.eth0[0];
  //console.log(require('./admin').self);
  require('./admin').users.push(require('./admin').self);
  res.render('draw', { lan: require('./admin').self.lan });
});

  /* join platform */

app.get('/join', (req, res) => {
  let output = new Array();
  req.headers.cookie.split(/\s*;\s*/).forEach((element) => {
    pair = element.split(/\s*=\s*/);
	  output[pair[0]] = pair.splice(1).join('=');
  });
  require('./admin').self = output;
  let lan = require('./socket').lan_info();
  require('./admin').self['lan'] = lan.eth0[0];
  console.log(require('./admin').self);
  require('./socket')._socket = require('./socket')._io('http://' + require('./admin').self.connect + ':3000');
  require('./socket')._socket.on('login', (info) => { 
    //console.log(info);
  });
  require('./socket')._socket.emit('player_info', { 
    state: require('./admin').self.state,
    fl: require('./admin').self.fl,
    user: require('./admin').self.user, 
    ip: require('./admin').self.ip,
    ts: require('./admin').self.ts,
    visit_scheme: require('./admin').self.visit_scheme,
    usg: require('./admin').self.usg,
    colo: require('./admin').self.colo,
    http: require('./admin').self.http,
    loc: require('./admin').self.loc,
    tls: require('./admin').self.tls,
    sni: require('./admin').self.sni,
    warp: require('./admin').self.warp,
    gateway: require('./admin').self.gateway,
    lan: require('./admin').self.lan
  });
  res.render('draw', { lan: require('./admin').self.lan });
});

  /* get text through LAN */

app.post('/g_text', (req, res) => {
  res.header("Content-Type", "application/json");
  res.write(JSON.stringify({
    message: require('./admin').list_text
  }));
  require('./admin').list_text = [];
  res.end();
});
  
  /* send text through LAN */
  
app.post('/s_text', (req, res) => {
  for(let i = 0; i < require('./admin').users.length; i++)
  {
    require('./socket')._socket = require('./socket')._io('http://' + require('./admin').users[i].lan + ':3000');
    require('./socket')._socket.on('login', (info) => {
      //console.log(info);
    });
    require('./socket')._socket.emit('send_text', { message: req.body.message });
  }
  res.end();
});

  /* get coordinate data through LAN */

app.post('/g_data', (req, res) => {
  //res.header("Content-Type", "text/plain");
  res.header("Content-Type", "application/json");
  res.write(JSON.stringify({ 
    data_x: require('./admin').data_x, 
    data_y: require('./admin').data_y, 
    data_w: require('./admin').data_w,
    data_c: require('./admin').data_c 
  }));
  require('./admin').data_x = [];
  require('./admin').data_y = [];
  require('./admin').data_w = [];
  require('./admin').data_c = [];
  res.end();
});

app.post('/db_write_t', (req, res) => {
  const text = new require('./admin').db_table_t({
    message: req.body.message    //get req.query.message
  });
  text.save()
      .then((result) => {
        res.send(result);
        res.end();
      })
      .catch((err) => {
        console.log(err);
      })
});

app.post('/db_read_t', (req, res) => {
  res.header("Content-Type", "application/json");
  let time_n = new Date();
  require('./admin').db_table_t.find({
    createdAt: { $gt: time_t_l }
  })
      .then((result) => {
        res.write(JSON.stringify(result));
        time_t_l = time_n;
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
});

  /* send coordinate data through LAN */

app.post('/s_data', (req, res) => {
  for(let i = 0; i < require('./admin').users.length; i++)
  {
    //if(require('./admin').self.lan != require('./admin').users[i].lan)
    //{
      //console.log(require('./admin').users[i]);
      require('./socket')._socket = require('./socket')._io('http://' + require('./admin').users[i].lan + ':3000');
      require('./socket')._socket.on('login', (info) => {
        //console.log(info);
      });
      require('./socket')._socket.emit('send_data', {
        data_x: req.body.data_x, 
        data_y: req.body.data_y,
        data_w: req.body.data_w,
        data_c: req.body.data_c
      });
    //}
  }
  
  /* broadcast mode */
  /*
   *require('./socket')._socket = require('./socket')._io('http://192.168.1.255:3000');
   *require('./socket')._socket.emit('send_data', {
        //console.log(list);
        data_x: req.body.data_x, 
        data_y: req.body.data_y,
        data_w: req.body.data_w,
        data_c: req.body.data_c
      });
  */
  res.end();
});

  /* send coordinate data to DB */
  
app.post('/db_write_c',(req, res) => {
  const data = new require('./admin').db_table_c({
    data_x: req.body.data_x,
    data_y: req.body.data_y,
    data_w: req.body.data_w,
    data_c: req.body.data_c
  });
  data.save()
    .then((result) => {
      res.send(result);
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });
});
  
  /* read coordinate data from DB */
  
app.post('/db_read_c', (req, res) => {
  res.header("Content-Type", "application/json");
  let time_n = new Date();
  require('./admin').db_table_c.find({
    createdAt: { $gt: time_c_l }
    })
      .then((result) => {
        res.write(JSON.stringify(result));
        time_c_l = time_n;
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
});

app.get('/404', (req, res) => {
  res.render('404');
});

module.exports = {
  _port: _port
};