document.getElementById('server').addEventListener('click', serverSet);
document.getElementById('client').addEventListener('click', clientSet);

/* Be Server Setting */
  
function serverSet()
{
  document.getElementById('config').innerHTML = "";
  let game = document.createElement('select');
  game.id = 'game';
  let op = document.createElement('option');
  op.value = 'draw';
  op.text = 'draw';
  game.appendChild(op);
  let text_game = document.createTextNode('type : ');
  let t_tag = document.createElement("h5");
  t_tag.id = 'h_tag';
  t_tag.appendChild(text_game);
  t_tag.appendChild(game);
  let name_t = document.createElement('input');
  name_t.id = 'name_t';
  let text_name = document.createTextNode('name : ');
  let n_tag = document.createElement('h5');
  n_tag.id = 'n_tag';
  n_tag.appendChild(text_name);
  n_tag.appendChild(name_t);
  let btn = document.createElement('BUTTON');
  btn.innerHTML = 'Confirm';
  btn.addEventListener('click', function(){ checkSet(game.options[game.selectedIndex].text, name_t.value) });
  document.getElementById('config').appendChild(t_tag);
  document.getElementById('config').appendChild(n_tag);
  document.getElementById('config').appendChild(btn);
}

/* Be Client Setting */

function clientSet()
{
  document.getElementById('config').innerHTML = "";
  let ip_t = document.createElement('input');
  ip_t.id = 'ip_t';
  let text_ip = document.createTextNode('connect : ');
  let i_tag = document.createElement('h5');
  i_tag.id = 'i_tag';
  i_tag.appendChild(text_ip);
  i_tag.appendChild(ip_t);
  let name_t = document.createElement('input');
  name_t.id = 'name_t';
  let text_name = document.createTextNode('name : ');
  let n_tag = document.createElement('h5');
  n_tag.id = 'n_tag';
  n_tag.appendChild(text_name);
  n_tag.appendChild(name_t);
  let btn = document.createElement('BUTTON');
  btn.innerHTML = 'Confirm';
  btn.addEventListener('click', function(){ connect(ip_t.value, name_t.value) });
  document.getElementById('config').appendChild(i_tag);
  document.getElementById('config').appendChild(n_tag);
  document.getElementById('config').appendChild(btn);
}
  
/* Page Option Check */  
  
function checkSet(type, name)
{
  if(!name || !type) return;
  if(type === 'draw') {
	  setCookie('game_type', type);
	  setCookie('state', 'host');
	  setCookie('user', name);
	  local_info('host');
  }
  else window.location.href = '/404';
}
  
function local_info(state)
{
  let url = 'https://www.cloudflare.com/cdn-cgi/trace';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  //xhr.setRequestHeader("Content-Type", "application/text");
  xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    //console.log(xhr.status);
    let ip_data = xhr.responseText.toString();
    data = ip_data.split("\n");
    data.forEach((element) => {
	    let str = element.replace(/\s*;\s*/, ' ').replace(/\s*;\s*/, ' ').replace(/\s*;\s*/, ' ');
	    let pair = str.split('=');
	    if(pair[0] != 'h') setCookie(pair[0], pair[1]);
    });
    if(state == 'host') window.location.href = '/draw'
    else if(state == 'client') window.location.href = '/join';
    else setTimeout(console.log(xhr.status), 500);
  }};
  xhr.send(); 
}

/* connecting infomation */

function connect(ip, name)
{
	if(!name || !ip) return;
  
  /* LAN Connection Method */
	
  let regx = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if(regx.test(ip)) {
	  setCookie('user', name);
          setCookie('state', 'client');
	  setCookie('connect', ip);
	  local_info('client');
	}
 
  /* DB Connection Method */
  /*
  let regx = /^[A-Za-z0-9]{3,10}$/;
  if(regx.test(ip)) {
    setCookie('user', name);
    setCookie('state', 'client');
    setCookie('pwd', ip);
    local_info('client');
  }
  */
	else window.location.href = '/404';
}

/* cookie lifetime setting */

function setCookie(name, value)
{
  if(!name || !value) return;
  let d = new Date();
  d.setTime(d.getTime() + (60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
  let Enabled = document.cookie.indexOf(name+"=") != -1;
  if(!Enabled) setTimeout(console.log('cookie not setting!'), 500);
}
