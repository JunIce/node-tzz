//cookie
var Cookie = {
	setCookie:function(name,value){
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() + 24*60*60*1000); 
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
	},
	getCookie:function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg)){
	    	return unescape(arr[2]); 
	    }
	    else {
	        return null; 
	    }
	},
	delCookie:function(name){
		var exp = new Date(); 
	    exp.setTime(exp.getTime() - 10); 
	    var cval=this.getCookie(name); 
	    if(cval!=null) {
	        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
	    }
	}
}

var $http = {};
$http.get = function(url, params) {  
    if (params) {  
        let paramsArray = [];  
        //encodeURIComponent  
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))  
        if (url.search(/\?/) === -1) {  
            url += '?' + paramsArray.join('&')  
        } else {  
            url += '&' + paramsArray.join('&')  
        }  
    }  
    return new Promise(function (resolve, reject) {  
      fetch(url, {  
            method: 'GET',  
            credentials: 'include',
          })  
          .then((response) => {  
              if (response.ok) {  
                  return response.json();  
              } else {  
                  reject({status:response.status})  
              }  
          })  
          .then((response) => {  
              resolve(response);  
          })  
          .catch((err)=> {  
            reject({status:-1});  
          })  
    })  
}
$http.post = function(url, obj) {  
    return new Promise(function (resolve, reject) {  
      fetch(url, Object.assign({},{  
            method: 'POST', 
            headers :{
				'Content-Type': 'application/x-www-form-urlencoded'
			},
            credentials: 'include',
          },obj))  
          .then((response) => {  
              if (response.ok) {  
                  return response.json();  
              } else {  
                  reject({status:response.status})  
              }  
          })  
          .then((response) => {  
              resolve(response);  
          })  
          .catch((err)=> {  
            reject({status:-1});  
          })  
    })  
} 


//search
	var searchIco = document.getElementsByClassName('search-ico')[0],
		search = document.getElementById('search');

	searchIco.addEventListener('click',function(){
		if(search.value != ''){
			search.parentNode.submit();
		}else{
			MsgBox("请输入搜索关键词！");
		}
	});
	
	//placehoder 事件
	search.addEventListener('focus',function(){
		this.setAttribute('placeholder','');
	});
	search.addEventListener('blur',function(){
		if(this.value == ''){
			this.setAttribute('placeholder','搜索你喜欢的') ;
		}
	});
	//logined
	var show = false,
	rote = document.getElementsByClassName('logined-rotate')[0],
	list = document.getElementsByClassName('logined-list')[0],
	login = document.getElementsByClassName('logined')[0];

	if(login){
		login.addEventListener('click',function(){
			if(!show){
				list.style.display = 'block';
				rote.classList.add('rota');
				show = true;
			}else{
				list.style.display = 'none';
				rote.classList.remove('rota');
				show = false;
			}
		});	
	}
	//nav-sep
	var navsep = document.getElementsByClassName('nav-sep')[0];
	if(navsep) {
		var tags = document.getElementsByClassName('tags')[0];
		navsep.addEventListener('click', function() {
			if(tags.classList.contains('hide')) {
				tags.classList.remove('hide')
			}else{
				tags.classList.add('hide')
			}
		})
	}
