"use strict";
var window,document,localStorage;
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
var Hub = new Vue(); //事件管理





var AddAlbum = {
	data:function(){
		return{
			createAlbumName : '',
			hasSelctAlbum : false,
			selctAId : 0,
			userAlbumList : [],
			imgurl : Hub.info.titlepic
		}
	},
	props:['albumLists'],
	template:"<div><div class='tipsBox-title'><h4>创建专辑</h4></div>\
			       <div class='tipsBox-main'>\
			        <div class='add-album'>\
			        <div class='add-album-hdPic'><img :src='imgurl'></div>\
			        <div class='create-album'><div class='album-list-wrap'><div class='tips-album-list' >\
							<span :data-aid='album.aid' v-for='(album,index) in userAlbumList' @click='chooseAlbum($event,index)'\>{{album.album_name}}</span>\
			           </div>\
			           <div class='create-album-text'>\
			            <input type='text' name='album_name' placeholder='快速创建专辑' />\
			            <a href='javascript:;' id='create-album-btn' \
			            @click='createAlbum'>创建</a>\
			           </div></div><button id='finish-favor' class='finish-favor' @click='addToUserAlbum'>完成</button></div></div></div></div>",
	mounted(){
		this.getAlbumList();
	},
	methods:{
		createAlbum:function(){
			var that = this,info = Hub.info;
			var val = document.querySelector("input[name='album_name']").value
			this.createAlbumName = this.stripscript(val);

			if(this.createAlbumName != ''){
				$http.post('/api/addalbum/',{
					 body : 'album_name='+ that.createAlbumName + '&classid=' + info.classid
				}).then(function(data){
					if(data.status == 1){
						that.getAlbumList()
					}
				})
			}else{
				MsgBox('请输入专辑名称')
			}
		},
		addToUserAlbum : function(){
			var that= this
			var info = Hub.info;
			if(that.hasSelctAlbum){
				$http.post('/api/adatal/',{
					body : 'classid=' + info.classid + '&photoid=' + info.itemid +  '&aid=' + that.selctAId
				}).then(function(data){
					if(data.status == 1){
						Hub.$emit('favaStat',true)
						Hub.info.favaNum = Hub.info.favaNum + 1;
						Hub.info.aid = that.selctAId
						Hub.$emit('favaNum')
						Hub.$emit('favaMsg','已收藏')
						Hub.$emit('tipsBox',false)
						Hub.$emit('favaType',0)
					}
				})
			}else{
				$http.post('/api/adtfa/',{
						 body : 'userid='+ info.userid + '&classid=' + info.classid + '&photoid=' + info.itemid + '&username=' + info.username
				}).then(function(data){
					if(data.status == 1){
						Hub.$emit('favaStat',true)
						Hub.info.favaNum = Hub.info.favaNum + 1;
						Hub.$emit('favaNum')
						Hub.$emit('favaMsg','已收藏')
						Hub.$emit('tipsBox',false)
						Hub.$emit('favaType',1)
					}
				})
			}
		},
		stripscript : function(s) 
		{ 
			var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？《》]") 
			var rs = ""; 
			for (var i = 0; i < s.length; i++) { 
			rs = rs+s.substr(i, 1).replace(pattern, ''); 
			} 
			return rs; 
		},
		chooseAlbum : function(e,index){
			var parent = e.target.parentElement,
				child = parent.childNodes,
			 reg = new RegExp('(\\s|^)on(\\s|$)'),
			 that = this;
			 //样式切换
			for(var i = 0; i < child.length; i++)
			{	
				child[i].className = child[i].className.replace(reg,'')
			}
			e.target.classList.add('on')
			//根据index判断点击的元素
			if(index > 0){
				that.hasSelctAlbum = true
				that.selctAId = e.target.getAttribute('data-aid')
			}else{
				that.hasSelctAlbum = false
				that.selctAId = 0
			}
		},
		getAlbumList:function(){
			var that = this;
			$http.get('/api/getAlbumList/')
			.then(function(data){
				if(data.status == 1){
					that.userAlbumList = data.data;
					that.userAlbumList.unshift({
						aid : 0,
						album_name : '未选择专辑'
					})
				}
			})
		}
	}//收藏到专辑
};
var AccusBox = {//举报
	data:function(){
		return{
			lists : [
				{
					title: '垃圾广告',
					value : 1,
					id : 'adver'
				},{
					title: '色情内容',
					value : 2,
					id : 'seqing'
				},{
					title: '质量太差',
					value : 3,
					id : 'zhiliang'
				},{
					title: '其他',
					value : 4,
					id:'other'
				}
			],
			selected:[]
		}
	},
	template:"<div>\
			    <div class='tipsBox-title'><h4>举报</h4></div>\
			        <div class='tipsBox-main '><h4 class='accussTitle'>举报原因:</h4>\
			        <div class='cl'> \
					   <template v-for='(n,index) in lists'>\
					    <div class='accussWrap fl'> \
					     <div class='checkboxWrap'> \
					      <input type='radio' name='accus' :id='n.id'  :value='n.value' v-model='selected'/> <label :for='n.id'></label><i class='smallRound'></i> \
					     </div><span>{{n.title}}</span></div>\
					    </template>\
					 </div> \
					 <div style='font-size: 12px;text-align: center;padding: 10px 0;' >图片存在侵权问题？请按照<a href='/about/?key=copyright' style='color:#f66'>该页面的相关说明</a>进行举报/维权</div>\
					   <div class='accussubB'><a href='javascript:;' class='accusSub' @click='accusSub'>提交</a> </div> </div></div>",
					   
	
	methods:{
		accusSub:function(){
			if(this.selected.length <= 0){
				MsgBox('请选择');
				return;
			}
			$http.post('/api/accus/',{
				 body : 'reason='+ this.selected + '&photoid=' + this.itemid
			})
			.then(function(data){
				MsgBox(data.message)
				Hub.$emit('accusBox',false)
			})
		}
	},
	computed:{
		itemid:function(){
			//获取图片id
			var path = window.location.pathname
			return path.match(/(\d+)/)[0];
		},
	}				   
};
var tipsBox = {
	props:['com'],
	render:function(h){
		var div = h('div',{attrs : {class : 'bg-color'}});
		var closebox = h('i',{
			 	attrs:{class : 'boxClose'},
				on:{click:this.closeBox}
		})
		var tipsBox = h('div',{attrs : {class : 'tipsBox'}}, [h(this.com),closebox])

		return h('div',{
			attrs:{id : 'showTips'}
		},[div,tipsBox])
	},
	mounted:function(){
		Hub.$emit('setStyle')
	},
	methods:{
		closeBox:function(){
			Hub.$emit('tipsBox',false)
		}
	},
	components:{
		AddAlbum,
		AccusBox
	},
};

var a = new Vue({
	el:'.cont',
	data:{
		img : document.getElementById('mainImg'),
		favaStat: false,
		favaType : '',// 0: 收藏到专辑 1:直接收藏
		favaNum : '',
		favaMsg : '',
		userAlbumList : [],
		boxStat : false,
		contImgUrl : '', // photo titlepic
		hasAddFans : false,//isfavor
		com : '',
		likeStatus : false,
	},
	mounted:function(){
		var that = this
		
		//获取是否已经关注
		if(this.isLogin){
			$http.get('/api/isfollow/',{fusr: this.publicUserid})
				.then(function(data){
					if(data.status == 1){
						that.hasAddFans = true
					}
				})
			//获取是否已经收藏
			$http.get('/api/isfavor/',{photoid : that.itemid})
				.then(function(data){
					if(data.photo.favaid || data.album.length>0){
						Hub.$emit('favaStat',true)
						Hub.$emit('favaMsg','已收藏')

						if(data.photo.favaid){
							that.favaType = 1
						}else{
							that.favaType = 0
							Hub.info.aid = data.album[0].aid
						}
					}
					
				})
		
			//获取收藏数
			this.favaNum = parseInt(document.getElementsByClassName('fava-num')[0].innerText)
			this.favaMsg = document.getElementsByClassName('fava-msg')[0].innerText
			//获取图片标题图片
			this.contImgUrl = document.querySelector('.cont-img-wrap img').getAttribute('data-titlepic')
			//和子组件共享信息
			Hub.info = {
				userid : $user.userid,
				itemid : this.itemid,
				titlepic : this.contImgUrl,
				username : '',
				classid : 33,
				favaNum : this.favaNum,
				favaMsg : this.favaMsg,
				aid : ''
			}
		

			Hub.$on('favaStat',function(data){
				that.favaStat = data
			})

			Hub.$on('favaNum',function(data){//收藏数
				document.getElementsByClassName('fava-num')[0].innerHTML = Hub.info.favaNum
			});
			Hub.$on('favaType',function(data){//记录收藏类型
				that.favaType = data;
			});
			Hub.$on('favaMsg',function(data){//收藏提示
				document.getElementsByClassName('fava-msg')[0].innerHTML = data
			});

		}
		Hub.$on('tipsBox',function(data){
			that.boxStat = data
		})
		//监听事件
		Hub.$on('setStyle',function(){
			 that.setStyle();
		})
		Hub.$on('accusBox',function(data){//举报
			that.accusStat = data
		});
	},
	methods:{
		
		addToAlbum : function(){
			if(!this.isLogin) {
				MsgBox('请先登录')
				return;
			}

			if(!this.favaStat){
				this.boxStat = true
				this.com = 'AddAlbum';
			}else{//取消收藏
				if(this.favaType){//图片收藏取消
					this.removePhotoFava();
				}else{//专辑收藏取消
					this.removeAlFava();
				}
			}
		},
		setStyle:function(){
			var tipsBox = document.getElementsByClassName('tipsBox')[0];
			var body = document.documentElement
			var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			if(!tipsBox) return; 
			var left = (body.clientWidth - tipsBox.clientWidth)/2 + 'px',
			    top = (body.clientHeight - tipsBox.clientHeight)/2 + scrollTop + 'px';
				tipsBox.style.top = top ;
				tipsBox.style.left = left ;
		},
		addFans:function(){
			if(!this.isLogin) {
				MsgBox('请先登录')
				return;
			}

			var that = this;
			var str = 'fusr='+that.publicUserid;
			if(that.publicUserid != $user.userid){
				if(!that.hasAddFans){
					$http.post('/api/follow/',{
						body : str
					}).then(function(data) {
						if(data.status == 1){
							that.hasAddFans = true
						}
					})
				}else{
					$http.post('/api/unfollow/',{
						body : str
					}).then(function(data) {
						if(data.status == 1){
							that.hasAddFans = false
						}
					})
				}
			}else{
				MsgBox('不能关注自己')
			}
		},
		doLike:function(){
			var that = this;
			var str = 'photoid=' + that.itemid

			if(!that.likeStatus){
				$http.post('/api/like/',{
					body : str
				}).then(function(res) {
					if(res.status == 1) {
						Cookie.setCookie('voteID',that.itemid)
						that.likeStatus = true
					}else{
						MsgBox(res.message)
					}
				})
			}else{
				$http.post('/api/unlike/',{
					body : str
				}).then(function(res) {
					if(res.status == 1) {
						that.likeStatus = false
						Cookie.delCookie('voteID')
					}else{
						MsgBox(res.message)
					}
				})
			}
		},
		accusMsg : function(){
			this.boxStat = true
			this.com = 'AccusBox'
		},
		removePhotoFava : function(){
			var info = Hub.info
			$http.post('/api/reptfa/',{
				body : 'userid='+ info.userid + '&photoid=' + info.itemid + '&classid=' + info.classid
			}).then(function(data) {
				if(data.status == 1){
					Hub.$emit('favaStat',false)
					Hub.$emit('favaMsg','收藏')
					Hub.info.favaNum = Hub.info.favaNum - 1;
					Hub.$emit('favaNum')
				}
			})
		},
		removeAlFava:function(){
			var info = Hub.info
			$http.post('/api/reptal/',{
				body : 'userid='+ info.userid + '&photoid=' + info.itemid + '&classid=' + info.classid + '&aid=' + info.aid
			}).then(function(data) {
				if(data.status == 1){
					Hub.$emit('favaStat',false)
					Hub.$emit('favaMsg','收藏')
					Hub.info.favaNum = Hub.info.favaNum - 1;
					Hub.$emit('favaNum')
				}
			})
		}
		
	},
	watch:{
		boxStat :function(){
			if(this.boxStat) {
				window.addEventListener('resize', this.setStyle,false);
				window.addEventListener('scroll',this.setStyle,false);
			}else{
				window.removeEventListener('resize', this.setStyle,false);
				window.removeEventListener('scroll',this.setStyle,false);
			}
		}
	},
	computed:{
		isLogin:function(){
			return $user.userid ? true:false;
		},
		isLike:function(){
			//赞按钮
			var voteid = Cookie.getCookie('voteID');
		  	if(voteid == this.itemid){
		  		this.likeStatus = true;
		  		return true;
		  	}

		},
		itemid:function(){
			//获取图片id
			var path = window.location.pathname
			return path.match(/(\d+)/)[0];
		},
		publicUserid:function(){
			return document.getElementsByClassName('cont-addFans')[0].getAttribute('data-userid')
		},
		links:function(){
			var self = this

			return window.links.map(function(link){
				return{
					link : link.link,
					style : {
						top : link.ratio.y * self.img.height + 'px',
						left : link.ratio.x * self.img.width + 'px'
					}
				}
			})		
		}
	},
	components:{
		tipsBox
	}
})



