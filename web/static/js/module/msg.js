// retu-msg-page


	var type = typeof($sys) == 'undefined' ? '': $sys;

	if(type && type == 'xt' || type == 'gz') {
		$('.msg_list_right a,.gz_msg_c a').on('click', function(){
			var mid = $(this).data('mid');
			if(mid && confirm('确认删除吗?')) {

                $.$post("/majax/delmsg/", {
                	body : 'mid=' +  mid},).
                then(function (result) {
                    if (result.status == 1) {
                        $("#msg" + result.mid).remove()
                        return true;
                    }
                });
	        }else{
	            return false;
	        }
		});
	}else if(type == 'sx') {
		var temp = function(obj){

			var str = "<div class='toSendMsg'>\
					<p class='MsgTitle'>给 <a class='MsgToName'>"+ obj.from_username +"</a>的私信：</p class='MsgTitle'>\
					<div class='MsgBox'>\
						<ul>\
							<a href='javascript:;' class='loadingMsg'>正在加载...</a>\
						</ul>\
					</div>\
					<div class='sendBox'>\
						<div class='sayArea'>\
							<textarea id='toFreSay'></textarea>\
						</div>\
						<div class='sendMsg cl'>\
							<button data-fid="+ obj.from_userid +" data-mid="+ obj.mid +">发送</button>\
						</div>\
					</div>\
					<i class='tipsbox-close'></i>\
				</div>";
			return str;
		};



		$('.msg_list_right').on('click',function(){
			var mid = $(this).data('mid');

			var uObj = JSON.parse(sxStr[mid]); //全局变量
			//如果用户信息存在
			if(uObj) {
				tipsbox(temp(uObj), function() {
					//发送监听
					$('.sendMsg button').click(function(){
						if($('#toFreSay').val() != ''){
							sendMsg(uObj.from_userid ,$('#toFreSay').val());
						}else{
							alert('请输入私信内容！');
						}
					})

					// 获取信息ajax
					$.get('/api/getMsg/?mid='+mid,function(data){
						var data = JSON.parse(data);
						if(data.status == -1) {
							$('.loadingMsg').html(data.message)
						}else{
							var str = '';
							var list = data.code;

							if(list.length > 0) {
							list.map(function(item){
								if(item.to_userid == uObj.from_userid){//根据userid进行模板渲染
									str += "<li>\
												<span class='Umg-time'>"+ item.msgtime +"</span>\
												<div class='M-msg cl'>\
												<a href='/user/"+ item.from_userid +"' class='msg-hdpic fr'><img src='"+ $user.userpic +"' alt=''></a>\
													<span class='msg-Main fromMe'>" + item.msgtxt + "</span>\
												</div>\
											</li>";
								}else{
									str += "<li>\
												<span class='Umg-time'>"+ item.msgtime +"</span>\
												<div class='M-msg cl'>\
												<a href='/user/"+ item.from_userid +"' class='msg-hdpic fl'><img src='" + uObj.userpic + "' alt=''></a>\
													<span class='msg-Main ToMe'>" + item.msgtxt + "</span>\
												</div>\
											</li>";
									}
								});

								$('.loadingMsg').remove();
								//渲染
								$('.MsgBox ul').append(str);
								//控制滚动条
								$('.MsgBox ul').scrollTop($('.MsgBox ul')[0].scrollHeight)
							}
						}
					})
				})
			}
		});

		function sendMsg(to_userid, msgtext) {
			$.ajax({
				url:'/api/sendMsg/',
				type:'post',
				data : {
					uid: to_userid,
					saytxt: msgtext
				},
				success:function(data) {
					var data = JSON.parse(data);
					if(data.status == 1){
						var ty = new Date();
						var say = "<li>\
						<span class='Umg-time'>"+ ty.getFullYear() +"年" + ty.getMonth() + "月" + ty.getDate() +"日 "+ ty.getHours() +":" + ty.getMinutes() +"</span>\
						<div class='M-msg cl'><a href='/user/"+ $user.userid +"' class='msg-hdpic fr' target='_blank'>\
						<img src='"+ $user.userpic +"'></a><span class='msg-Main fromMe'>"+ msgtext +"</span></div></li>";
						//渲染
						$('.MsgBox ul').append(say);
						//控制滚动条
						$('.MsgBox ul').scrollTop($('.MsgBox ul')[0].scrollHeight)
					}else{	
						alert(data.message);
					}
				}
			})
		}
	}
