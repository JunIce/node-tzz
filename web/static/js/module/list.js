"use strict";
var window,document,localStorage;
var phone = window.navigator.userAgent.toLowerCase().match(/(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i) !== null;
if(phone) {  
	window.location.host = 'm.tuzhaozhao.com';  
}

$(function(){
	var body = $(body),
		mainList = $('.main-list'),
		type = mainList.data('page'),
         tid = mainList.data('tid'),
         aid = mainList.data('aid'),
          ph = mainList.data('ph');
	//nav-sep
	$('.nav-sep').on('click',function(){
		var tagClass = $('.tags').classList;
		if(tagClass.contains('hide')) {
			tagClass.remove('hide')
		}else{
			tagClass.add('hide')
		}
	})

	//gotoTop
	gototop($('.goToTop')[0], 100)

	function gototop(gotop, speed){
	    var timer;
	    var oldTop = document.documentElement.scrollTop || document.body.scrollTop;
	    gotop.addEventListener('click',function(){
	        var speed = speed || 10;
	        timer = setInterval(function(){
	            var top = document.documentElement.scrollTop || document.body.scrollTop;
	            var gospeed = top/100;
	            if(gospeed>speed){
	                gospeed = speed;
	            }else if(gospeed<3){
	                gospeed = 3;
	            }
	            if(top>speed){
	                if(document.documentElement.scrollTop){
	                    top = document.documentElement.scrollTop-=speed;
	                }else{
	                    top = document.body.scrollTop-=speed;
	                }
	            }else{
	                clearInterval(timer);
	            }
	        },5);
	    });

	    window.onscroll = function(e){
	        var newTop = document.documentElement.scrollTop || document.body.scrollTop;
	        if(newTop>100){
	            gotop.style.display = "block";
	        }else{
	            gotop.style.display = "none";
	        }
	        if(newTop>oldTop){
	            clearInterval(timer);
	        }
	        oldTop = newTop;
	    }
	}
	var	$num = 1,$i = $num1,scrollBol = false; //滚动次数
	//roll	
	$(window).on('scroll', function(){
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
			bodyHeight = document.body.offsetHeight,
		 	innerHeight = window.innerHeight; // 浏览器窗口的视口的高度。

		//scroll top
		$('.goToTop')[0].style.display = scrollTop > 200 ? 'block':'none';
		//200高度获取数据
		if(!scrollBol && parseInt(bodyHeight - scrollTop - innerHeight) < 350 && $num % 4 != 0) {
			scrollBol = true;
			$.$post("/api/list/",{
				body: "num="+ $num1++ +"&classid="+ 33 +"&ph="+ ph +"&type="+ type +"&tid="+ tid +"&aid="+aid,
			}).then(function(data) {
				if(data.status == 1){
						loadingData(data);
						$num++;
					}else if(data.status == 3){
						var p = document.createElement('p');
						p.innerText = data.message;
						p.style.cssText="font-size: 12px;    text-align: center;    padding: 18px;    color: #999;";

						var div = document.getElementsByClassName('main-list')[0];
						div.appendChild(p);

					}else{
						alert(data.message);
					}
			})
		}
	});

	function loadingData(data){

		if(scrollBol) {
			var oFragment = document.createDocumentFragment();
			data.data.map(function(i){
				var li = document.createElement('li'),
					div = document.createElement('div'),
					a = document.createElement('a'),  
					img = document.createElement('img');    

					img.className = 'lazyload';
					img.setAttribute('src','/dist/images/placeholder.png');
					img.setAttribute('data-src',i.titlepic);
					img.setAttribute('alt', i.title);
					
					a.appendChild(img);
					a.setAttribute('href', i.titleurl);
					a.setAttribute('alt', i.title);
					a.setAttribute('target', '_blank');

					div.appendChild(a);
					li.appendChild(div);
					oFragment.appendChild(li);
			});

			var ul = document.getElementById('waterfall');
			ul.appendChild(oFragment);
			document.getElementsByClassName('pageInfo')[0].innerHTML = data.page;
			$i ++;
			scrollBol = false;
		}
	}

		//tags follow
	

		$('.tags-col').on('click', function(){
			var self = $(this),tagid = $(this).data('tid'),
				tagBol = $(this).hasClass('tags-colDone'),
				tnum = $('.tag-num').html();
			
			if(!$user.userid) {
				MsgBox("请先登录");
				return;
			}
			$.$post(tagBol ? '/api/cancelSub/' :'/api/subscribe/',{
				body: 'tagid='+tagid,})
			.then(function(data){
				if(data.status == 1){
					$('.tag-msg').html(tagBol ? '订阅':'已订阅');
					$('.tag-num').html(tagBol ? parseInt(tnum) - 1 : parseInt(tnum) + 1);
					if(tagBol) {
						self.removeClass('tags-colDone')
					}else{
						self.addClass('tags-colDone')
					}
				}
			})					
		});

		//tags-page slide down
		if(tid) {
			var down = false, 
				arrow = $('.arrow-down'),
				cHeight = $('.cont-album')[0].offsetHeight,
			    vHeight = $('.list-album')[0].offsetHeight;
			$('.type-down').on('click',function(){
				$('.cont-album')[0].style.height = (down ? cHeight : vHeight) + 'px';
				
				if(down){
					arrow.removeClass('up');
				}else{
					arrow.addClass('up');
				}
				down = down ? false : true;
			});
		}
		//album
		
		$('.album-collect').on('click', function() {
			var self = $(this),
				alBol = self.hasClass('col');

			if(!$user.userid) {
				MsgBox("请先登录");
				return;
			}

			$.$post(alBol ? '/api/userCancelAlbum/' : '/api/userFavaAlbum/',{
				body : 'aid='+aid,
			}).then(function(data) {
				if(data.status == 1){
					if(alBol) {
					 	self.removeClass('col');
					}else{
					 	self.addClass('col');
					}
				}
			});
		});
});