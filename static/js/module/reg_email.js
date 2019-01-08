var handlerEmbed = function (captchaObj) {
	captchaObj.appendTo("#gtest");
    captchaObj.onReady(function () {
        $("#wait").addClass("hide");
    });

    $(".subBtn").on('click' ,function (e) {
        var validate = captchaObj.getValidate();
        if (!validate) {
            $("#notice").removeClass('hide').addClass("show") ;
            setTimeout(function () {
                $("#notice").removeClass('show').addClass("hide");
            }, 2000);
            e.preventDefault();
            return;
        }

        var memAgree = $('#mberAgree')[0];
        if(!memAgree.checked) { 
            $('.m-u-readMAgree')[0].style.display="block"; 
            e.preventDefault();
            return;
        }
        
        if(REG && (SUBCHECK['email'] && SUBCHECK['password'])){
        	document.regForm.submit();
        }else{
        	[].slice.call(inputs).map(function(item){
				checkInput.bind(item)()
			})
			e.preventDefault();
			return;
        }
    });
};

$.$get("/e/extend/geetest/web/StartCaptchaServlet.php?t=" + (new Date()).getTime())
.then(function(data){
 	initGeetest({
        gt: data.gt,
        challenge: data.challenge,
        new_captcha: data.new_captcha,
        product: "float", 
        offline: !data.success,
        width : '100%'
    }, handlerEmbed);
});	
