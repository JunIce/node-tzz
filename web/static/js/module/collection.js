//edit album
	var editBtn = document.getElementsByClassName('editAInfo')[0];
	var aid = editBtn.getAttribute('data-aid');
function showTips(){
	if(editBtn) {
		
		var charNumAll = 100;
		tipsbox('<div style="width:400px;height:310px;"><div style="color:#333;font-size:14px;padding:10px 20px;border-bottom:1px solid #999;">编辑专辑信息</div><div>\
		<div style="padding:20px;">\
			<div style="padding:15px 0;">\
				<span style="width:90px;display:inline-block;text-align:right;font-size:14px;">专辑名 :</span><input id="albumTitle" type="text" style="outline:0;border:1px solid #ddd;border-radius:5px;width:200px;margin-left:20px;padding:5px 8px;"/>\
			</div>\
			<div style="padding:15px 0;">\
				<span style="width:90px;display:inline-block;text-align:right;font-size:14px;">专辑描述 :</span><textarea id="album_desc" type="text" style="outline:0;border:1px solid #ddd;border-radius:5px;width:200px;margin-left:20px;padding:5px 8px;height:80px;vertical-align:top;resize: none;font-size:14px;" ></textarea>\
			</div>\
			<div style="font-size:12px;text-align:right;padding-right:30px;">还可输入 <i style="color:red" id="charNum"> '+ charNumAll +' </i> 个字符</div>\
			<div style="margin:auto;text-align:center;padding:8px 0;"><button id="editABtn" style="padding:8px 25px;outline:none;border:none;background-color:#ff6666;color:#fff;border-radius:5px;cursor:pointer;">确认</button></div>\
		</div>\
	</div></div>',function(){
		var textarea = document.getElementById('album_desc');
		var charNum = document.getElementById('charNum');
		var editABtn = document.getElementById('editABtn');

		textarea.addEventListener('input',function() {
			charNum.innerHTML = charNumAll - parseInt(checksum(this.value));
		});

		editABtn.addEventListener('click', function() {
			var name = document.getElementById('albumTitle').value;
			if(confirm('确认提交')){
				if(name == 'undefined' || name == '') {
					MsgBox('专辑名不能为空');
					return
				}

				getAjax({
					url:'/api/editAlbum/',
					method:'post',
					data: 'al_name='+name + '&al_desc='+ textarea.value + '&aid='+aid,
					success:function(data){
						if(data.status == 1){
							MsgBox('专辑修改成功')
						}
					},
					err:function(){}
				});
			}
		})
	});
	}
}

editBtn.addEventListener('click',function(){
	showTips()
},false);