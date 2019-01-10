require.config({
	paths : {
		jquery : './js/lib/jq',
		validate : './js/lib/validate.min',
		publicV : './js/module/publicV',
		uploadifive : './js/lib/jquery.uploadifive',
		tags : './js/module/tags',
		Promise : './js/lib/promise',
		tipsbox : './js/module/tipsbox',
		util : './js/module/util'
	},
	shim : {
		uploadifive :{
			deps : ['jquery']
		},
		tags :{
			deps:['jquery']
		}
	}
});



define(function(require){
	var $ = require('jquery');
	//私信页面
	require('./js/msg/index');

	//用户登录，注册，找回密码验证
	require('./js/member');

	//用户中心
	require('./js/user');

})