var handlerEmbed = function (captchaObj) {
    captchaObj.onReady(function () {
        $("#wait").addClass("hide");
    }).onSuccess(function () {
    	var phone = $("input[name='phone']")[0].value;
		var dom = document.querySelector('#sendSms');
		if(wait == 60) {
			$.$post('/api/sendVertiCode/',
			{
				body : 'type=phone&value='+phone
			}).then(function(res){
				
				if(res.code) {
					time(dom)
				}else{
					MsgBox('发送失败')
				}
				
			}).catch(err=>{
				console.log(err)
			})
		}
    });

    $('#sendSms').on('click',function(e){
		if(!SUBCHECK.phone) {
			MsgBox('请填写手机号');
			return;
		}
		captchaObj.verify();
		e.preventDefault();
	});
};

$.$get("/e/extend/geetest/web/StartCaptchaServlet.php?t=" + (new Date()).getTime())
.then(function(data){
 	initGeetest({
        gt: data.gt,
        challenge: data.challenge,
        new_captcha: data.new_captcha,
        product: "bind", 
        offline: !data.success,
        width: "300px"
    }, handlerEmbed);
});


$('#smsCode').on('blur',function(e){
	var el = e.target;
	var parent = el.parentNode;
	var i = $(parent).find('.inputIco')[0];
	var p = $(parent).find('.inputTips')[0];
	i.className = "inputIco";
	var phone = $("input[name='phone']")[0].value;
	var code = e.target.value;
	if(code){
		$.$get('/api/vertifyCode/?type=phone&value='+phone +'&code='+code)
		.then(function(res){
			if(res.code){
				SUBCHECK.verticode = true;
				$('#sendSms').remove();
				el.setAttribute('disabled',true);
				$(parent).css('backgroundColor','#ebebe4');
				i.classList.add('correct');
				p.innerHTML = "";
			}else{
				p.innerHTML = res.message
			}
		}).catch(err=>{
			console.log(err)
		})
	}else{
		p.innerHTML = "验证码不能为空"
	}
})

var wait=60;
function time(o) {
	if (wait == 0) {
		o.classList.remove("disable"); 
		o.innerHTML="发送验证码";
		wait = 60;
	}else{
		o.classList.add("disable");
		o.innerHTML = wait + "s";
		wait--;
		setTimeout(function() {
			time(o)
		},
		1000)
	}
}

$(".subBtn").on('click' ,function (e) {
	var memAgree = $('#mberAgree')[0];
    if(!memAgree.checked) { 
        $('.m-u-readMAgree')[0].style.display="block"; 
        e.preventDefault();
        return;
    }
     
    if(REG && (SUBCHECK['phone'] && SUBCHECK['verticode'] && SUBCHECK['password'])){
    	document.regForm.submit();
    }else{
    	[].slice.call(inputs).map(function(item){
			checkInput.bind(item)()
		})
		e.preventDefault();
		return;
    }
});