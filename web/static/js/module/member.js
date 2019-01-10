var LOGIN = document.LoginForm == void 0 ? false : true
var GETPASS = document.GetPassForm == void 0 ? false : true
var REG = document.regForm == void 0 ? false : true



var PLAHODER = '';
var SUBCHECK = {};
//用作提交判断变量
if(LOGIN){
	SUBCHECK.email=SUBCHECK.password=false;
}else if(REG){
	SUBCHECK.email=SUBCHECK.password=SUBCHECK.repassword = false;
}else if(GETPASS){
	SUBCHECK.email=SUBCHECK.password=SUBCHECK.phone = SUBCHECK.verticode = false;
}

var validate = {
	val : '',
	email : function(str) {
		return (/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/).test(str)
	},
	phone : function(str) {
		return (/^1[3|4|5|7|8][0-9]{9}$/).test(str)
	},
	password : function(str) {
		this.val = str.toString(16)
		return str != '' && (/^[0-9a-zA-Z]{6,16}$/).test(str)
	},
	repassword : function(str) {
		var code = str.toString(16);
		return (this.val != '' && this.val === code )? true : false;
	},
	isempty:function( str ) {
		return str == '' ? true : false
	}
}

//输入框初始化
var inputs = $('.hoderShow');
inputs.on('focus',function(){
	PLAHODER = $(this).attr('placeholder')
	$(this).attr('placeholder','')
}).on('blur',function(e){
	$(this).attr('placeholder', PLAHODER)
	checkInput.bind(e.target)()
})

	

function checkInput() {
	//验证结果
	var self = this
	new Promise((resolve) => resolve(userInputCheck[self.name].bind(self)()))
	.then(res=>{
		Object.assign(self,res);
		setDom.call(self);
	})
}


function setDom(){
	var parent = this.parentNode;
	var i = $(parent).find('.inputIco')[0];
	var tips = $(parent).find('.inputTips')[0];
	i.className = "inputIco";

	//显示手机验证码输入框
	if(this.code && this.ntype == 'phone') {
		$("input[name='phone']")[0].value = this.value
		$('#phoneCode').removeClass('hide')

		//判断增加手机号码
		SUBCHECK.verticode = false;
	}else if(this.code && this.ntype == 'email') {
		$("input[name='email']")[0].value = this.value
	}

	SUBCHECK[this.ntype] = this.code
	this.code ? i.classList.add('correct') : i.classList.add('wrong')
	//文本提示框
	tips.innerHTML = this.code ? '' : this.responseText 
}

var userInputCheck = {
	 usercount:function() {
	 	var val = this.value

	 	if(validate.isempty( val )){
	 		return { ntype : 'email' , code: false , responseText: '账号不能为空'}
	 	}else if(validate.email( val )){
	 		//验证为邮箱
	 		return new Promise(resolve => {
	 			$.$post('/api/check/',
				{
					body : 'value=' + val + '&type=email' 
				}).then(function(res){
					resolve(res);
				}).catch(err=>{
					console.log(err)
				})
			}).then(data=>{
				if(data.stats) {
					var code,msg;
					if(LOGIN){ // 登录
						msg = data.num == 0 ? '账号不存在': '';
						code = data.num == 0 ? false : true;
					}else{ //注册
						msg = data.num == 0 ? '': '账号已被注册';
						code = data.num == 0 ? true : false;
					}
		 			return {
		 			 	ntype : 'email',
			 			code : code,
			 			responseText: msg
		 			}
				}else{
					return {
		 			 	ntype : 'email',
			 			code : false,
			 			responseText: data.msg
		 			}
				}
			})

	 	}else if(validate.phone( val )) {
	 		//验证为手机号
	 		return new Promise(resolve => {
	 			$.$post('/api/check/',
				{
					body : 'value=' + val + '&type=phone' 
				}).then(function(res){
					resolve(res);
				}).catch(err=>{
					console.log(err)
				})
			}).then(data=>{
				if(data.stats) {
					var code,msg;
					if(LOGIN){ // 登录
						msg = data.num == 0 ? '账号不存在': '';
						code = data.num == 0 ? false : true;
					}else{ //注册
						msg = data.num == 0 ? '': '账号已被注册';
						code = data.num == 0 ? true : false;
					}
					var a = {
		 			 	ntype :'phone',
			 			code : code,
			 			responseText: msg
		 			}
		 			return a
				}else{
					return {
		 			 	ntype : 'phone',
			 			code : false,
			 			responseText: data.msg
		 			}
				}
			})
	 	}else{
	 		return { ntype : 'usercount' , code : false, responseText: '格式不正确'}
	 	}
	},
	email: function(){
		var val = this.value
		if(validate.isempty( val )){
	 		return { ntype : 'email' , code: false , responseText: '账号不能为空'}
	 	}else if(validate.email( val )){

	 		return new Promise(resolve => {
	 			$.$post('/api/check/',
				{
					body : 'value=' + val + '&type=email' 
				}).then(function(res){
					resolve(res);
				}).catch(err=>{
					console.log(err)
				})
			}).then(data=>{
				if(data.stats) {
					var code,msg;
					if(LOGIN || GETPASS){ // 登录
						msg = data.num == 0 ? '账号不存在': '';
						code = data.num == 0 ? false : true;
					}else{ //注册
						msg = data.num == 0 ? '': '账号已被注册';
						code = data.num == 0 ? true : false;
					}
		 			return {
		 			 	ntype : 'email',
			 			code : code,
			 			responseText: msg
		 			}
				}else{
					return {
		 			 	ntype : 'email',
			 			code : false,
			 			responseText: data.msg
		 			}
				}
			})

	 	}else{
	 		return { ntype : 'email' , code : false, responseText: '格式不正确'}
	 	}
	},
	phone:function(){
		var val = this.value

	 	if(validate.isempty( val )){
	 		return { ntype : 'phone' , code: false , responseText: '账号不能为空'}
	 	}else if(validate.phone( val )) {
	 		//验证为手机号
	 		return new Promise(resolve => {
	 			$.$post('/api/check/',
				{
					body : 'value=' + val + '&type=phone' 
				}).then(function(res){
					resolve(res);
				}).catch(err=>{
					console.log(err)
				})
			}).then(data=>{
				if(data.stats) {
					var code,msg;
					if(LOGIN || GETPASS){ // 登录
						msg = data.num == 0 ? '账号不存在': '';
						code = data.num == 0 ? false : true;
					}else{ //注册
						msg = data.num == 0 ? '': '账号已被注册';
						code = data.num == 0 ? true : false;
					}
					var a = {
		 			 	ntype :'phone',
			 			code : code,
			 			responseText: msg
		 			}
		 			return a
				}else{
					return {
		 			 	ntype : 'phone',
			 			code : false,
			 			responseText: data.msg
		 			}
				}
			})
		}else{
	 		return { ntype : 'phone' , code : false, responseText: '格式不正确'}
	 	}
	},
	password : function(){
		var val = this.value
	 	if(validate.isempty( val )){
	 		return { ntype : 'password' , code: false , responseText: '密码不能为空'}
	 	}else if(validate.password( val )){
	 		//验证为邮箱
	 		return { ntype : 'password' , code: true , responseText: ''}

	 	}else{
	 		return { ntype : 'password' , code: false , responseText: '密码至少6位,包含数字、字母、下划线'}
	 	}
	},
	repassword : function(e){
		var val = this.value
	 	if(validate.isempty( val )){
	 		return { ntype : 'repassword' , code: false , responseText: '密码不能为空'}
	 	}else if(validate.repassword( val )){
	 		//验证为邮箱
	 		return { ntype : 'repassword' , code: true , responseText: ''}

	 	}else{
	 		return { ntype : 'repassword' , code: false , responseText: '密码不匹配,请重新输入'}
	 	}
	}
}






