function tag2arr(str) {
  var tagArr = str.split(/,\s\w+\s,/);
  tagArr.pop()
  return tagArr;
}
function render(data) {
  var html = template('tpl', data);
  document.getElementById('root').innerHTML = html;
  window.scrollTo(0,0);
}
function ajaxSend(option, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(option.method || 'GET', option.url);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200){
      var res = JSON.parse(xhr.responseText);
      callback(res);
    }
  }
  xhr.send(JSON.stringify(option.data) || null);
}
function getPage(page=1) {
  ajaxSend({
    url: `/pages?page=${page}`
  }, function(res) {
    var dataArr = res.data.map(function(page) {
      return {
        tag : tag2arr(page.tag),
        id: page._id,
        content: page.content,
        duplicated: page.duplicated,
        changed: page.changed
      }
    });
    res.data = dataArr;
    document.getElementById('page').value = page;
    render(res);
  });
}
function pop(data) {
  var popup = document.getElementById('popup');
  popup.innerHTML = data;
  popup.style.top = '10px';
  setTimeout(function() {
    popup.style.top = '-33px';
  }, 2000);
}
function deleSend(event) {
  if(event.target.nodeName == 'BUTTON') {
    var data = {
      _id: event.target.dataset.id,
      content: event.target.innerHTML === '都不对' ? '' : event.target.innerHTML
    }
    var siblings = event.target.parentElement.querySelectorAll('button[data-id]');
    var lock = 0;
    for(var i=0;i<siblings.length;i++) {
      if(!data.content) siblings[i].disabled = true;
      else if(i<siblings.length-1) {
        if(!lock&&siblings[i]!=event.target) {
          siblings[i].disabled = true;
          lock = 1;
        }
        siblings[i].className = '';
      }
    }
    ajaxSend({
      url: '/pages',
      method: 'POST',
      data: data
    }, function(res) {
      if(res.msg==='修改成功') event.target.className = 'active';
      event.target.parentElement.parentElement.className = 'changed';
      pop(res.msg);
    });
  }
}
window.onload = function() {
  // simple pagination
  var page = 1;
  getPage(page);
  var gobtn = document.getElementById('go');
  var nextbtn = document.getElementById('next');
  gobtn.onclick = function() {
    page = pageinput.value;
    getPage(page);
  }
  nextbtn.onclick = function() {
    page++;
    getPage(page);
  }
}