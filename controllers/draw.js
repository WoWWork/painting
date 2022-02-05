const canvas = document.getElementById('canvas')
const b_save = document.getElementById('save')
const r_width = document.getElementById('width')
const r_red = document.getElementById('red')
const r_green = document.getElementById('green')
const r_blue = document.getElementById('blue')
const t_btn = document.getElementById('btn_text')

const ctx = canvas.getContext('2d')

let data_x = new Array();
let data_y = new Array();
let data_w = 1;
let data_c = new Array([0, 0, 0]);

  /* document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0'  ',minimum-scale=0.5'  ',maximum-scale=2'  ',user-scalable=yes">'); */

const init = () => {
  let gap_y = document.getElementById('icon-bar').offsetHeight;
  let view_w = document.body.clientWidth
  let view_h = document.body.clientHeight
  if(document.body.clientWidth > 750)
  {
    canvas.setAttribute("width", view_w * 0.75);
    canvas.setAttribute("height", view_h - gap_y);
  }
  else
  {
    canvas.setAttribute("width", view_w);
    canvas.setAttribute("height", view_h * 0.7 - gap_y);
  }
}

  /* start coordination */
  
let x1= 0
let y1= 0

  /* end coordination */
  
let x2= 0
let y2= 0
  
  /* declare a hasTouchEvent variable，to check for touch event existing */

const hasTouchEvent = 'ontouchstart' in window ? true : false

  /* depend on hasTouchEvent decisive to monitor mouse or touch event */
  
const downEvent = hasTouchEvent ? 'ontouchstart' : 'mousedown'
const moveEvent = hasTouchEvent ? 'ontouchmove' : 'mousemove'
const upEvent = hasTouchEvent ? 'touchend' : 'mouseup'

  /* declare isMouseActive for mouse status，for check mouse in mousedown status and trigger mousemove status. */

let isMouseActive = false
  
window.addEventListener('resize', function(e){
  init();
}, true)  
  
  /* trigger mouse down event */

canvas.addEventListener(downEvent, function(e){
  isMouseActive = true  
  
  let gap_y = document.getElementById('icon-bar').offsetHeight;
  
  x1 = e.clientX + document.body.scrollLeft
  y1 = e.clientY - gap_y + document.body.scrollTop
  
  data_x.push(x1);
  data_y.push(y1);
  
  ctx.lineWidth = data_w
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
})
  
  /* trigger mouse move event */
  
canvas.addEventListener(moveEvent, function(e){
  if(!isMouseActive) return;
  
  let gap_y = document.getElementById('icon-bar').offsetHeight;
  
  /* get end coordinate */
  
  x2 = e.clientX + document.body.scrollLeft
  y2 = e.clientY - gap_y + document.body.scrollTop
    
  data_x.push(x2);
  data_y.push(y2);
    
  /* start drawing */
  
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  /* update start coordinate */
  
  x1 = x2
  y1 = y2
    
})
  
  /* trigger mouse up event */
  
canvas.addEventListener(upEvent, function(e){  
  isMouseActive = false;
  
  //send_data();
  send_data_db();
})

  /* trigger text button event */

t_btn.addEventListener('click', function(e){
  
  //send_text();
  send_text_db();
})

  /* adjust pen width */
  
const width_change = () => {
  data_w = r_width.value
}
  
  /* adjust pen color */
  
const color_change = () => {
  let r = r_red.value
  let g = r_green.value
  let b = r_blue.value
  data_c = [r, g, b]
  ctx.strokeStyle = "rgb("+ r +"," + g + "," + b + ")";
}

  /* get text data through LAN */

const get_text = async (data) => {
  let url = "http://" + data + ':3000/g_text';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
      let data_list = JSON.parse(xhr.responseText);
      if(data_list.message.length != 0){
        display_text(data_list)
      }
    }
  }
}

  /* read text from MongoDB */

const read_text_db = async (data) => {
  let url = "http://" + data + ':3000/db_read_t';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
      let data_list = JSON.parse(xhr.responseText);
      if(data_list.length != 0){
        display_text(data_list);
      }
    }
  };
  xhr.send();
};

  /* send text through LAN */

const send_text = () => {
  let message = document.getElementById('text_input').value;
  let url = '/s_text';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      console.log('done');
    }
  }
  xhr.send('message=' + message);
};

  /* send text to DB */

const send_text_db = () => {
  let message = document.getElementById('text_input').value;
  let url = '/db_write_t';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      console.log('done');
    }
  }
  xhr.send('message=' + message);
};

  /* sending data through LAN */

const send_data = () => {
  data_percentage();
  let url = '/s_data';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      console.log('done!!');
      data_x=[];
      data_y=[];
      data_w=[];
      data_c=[];
    }
  }
  xhr.send('data_x=' + data_x + '&data_y=' + data_y + '&data_w=' + data_w + '&data_c=' + data_c);
};
  
  /* get corrdinate data through LAN */

const get_data = async (data) => {
  let url = "http://" + data + ':3000/g_data';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      //console.log(xhr.responseText);
      let data_list = JSON.parse(xhr.responseText);
      if(data_list.length != 0){
        console.log(data_list);
        drawing(data_list);
        width_change();
        color_change();
      }
    }
  }
  xhr.send();
};

  /* read corrdinate data from MongoDB */

const read_data_db = async (data) => {
  let url = "http://" + data + ':3000/db_read_c';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      //console.log(xhr.responseText);
      let data_list = JSON.parse(xhr.responseText);
      if(data_list.length != 0){
        console.log(data_list);
        drawing(data_list);
        width_change();
        color_change();
      }
    }
  };
  xhr.send();
};
  
  /* sending coordinate data to MongoDB */
  
const send_data_db = () => {
  data_percentage();
  let url = '/db_write_c';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      console.log('send_data_db : done!!');
      data_x=[];
      data_y=[];
      data_w=[];
      data_c=[];
    }
  }
  xhr.send('data_x=' + data_x + '&data_y=' + data_y + '&data_w=' + data_w + '&data_c=' + data_c);
}

const data_percentage = () => {
  for(let i = 0; i < data_x.length; i++)
  {
    data_x[i] = data_x[i] / canvas.clientWidth;
    data_y[i] = data_y[i] / canvas.clientHeight;
  }
}

  /* draw on canvas */

const drawing = (data) => {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for(let j = 0; j < data.length; j++)
  {
    let px = data[j].data_x.split(',');
    let py = data[j].data_y.split(',');
    ctx.lineWidth = data[j].data_w;
    ctx.strokeStyle = "rgb(" + data[j].data_c + ")";
    for(let i = 0; i < px.length - 1; i++)
    {
      ctx.moveTo(px[i] * canvas.clientWidth, py[i] * canvas.clientHeight);
      ctx.lineTo(px[i + 1] * canvas.clientWidth, py[i + 1] * canvas.clientHeight);
    }
  }
  ctx.stroke();
  ctx.closePath();
};

  /* disply text on textarea */

const display_text = (data) => {
  //console.log('display : ' + data[0].message);
  for(let i = 0; i < data.length; i++)
  {
    document.getElementById("chat_content").value += "\r\n" + data[i].message;
  }
  document.getElementById("text_input").value = "";
};

  /* update event collection */

const update_set = async () => {
  //await setInterval("get_text(document.title)", 1000);
  await setInterval("read_text_db(document.title)", 1000);
  //await setInterval("get_data(document.title)", 1000);
  await setInterval("read_data_db(document.title)", 1000);
};

init();
update_set();