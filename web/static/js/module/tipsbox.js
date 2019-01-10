var phone = window.navigator.userAgent.toLowerCase().match(/(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i) !== null;
if(phone) {  
	window.location.host = 'm.tuzhaozhao.com';  
}

function tipsbox(html, callback ) {
	 
	/*init*/
	this.winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	this.winHeight = window.innerHeight  || document.documentElement.clientHeight || document.body.clientHeight;
	this.width = this.height = '';
	this.body = document.body || document.getElementsByTagName('body')[0];
	this.closeEle = '';
	this.scrollTop = this.body.scrollTop ;
	this.bodyTop = this.body.style.top || 0;

	if(! (this instanceof tipsbox)){
        return new tipsbox().init(html, callback );  
    }
}
tipsbox.prototype.init = function (html, callback ) {
	// if(this.bodyTop != 0) {
	// 	this.body.style.position = "fixed";
	// 	this.body.style.width = "100%";
	// 	this.body.style.top = -this.scrollTop + 'px';
	// }
	/*wrap*/
	var div = document.createElement('div');
		
		div.style.cssText="width:100%;height:100%;";

	/*bg*/
	var bg = document.createElement('div');
	    bg.style.cssText = "position: fixed;background-color: #000;filter: alpha(opacity=50);-moz-opacity: 0.5;-khtml-opacity: 0.5;opacity: 0.5;width: 100%;height: 100%;top: 0;left: 0;z-index: 100;";
	    div.appendChild(bg);
	    this.body.appendChild(div);

	/*tipsbox*/
	var box = document.createElement('div');
		
		box.style.cssText = "    position: fixed;    background-color: #fff;    border-radius: 4px;    z-index: 100;";
	
	box.innerHTML = html;
	div.appendChild(box);
	if(callback) {
		callback.call(div, this);
	}
	
	/*close*/

	var close = document.createElement('i');
	this.closeEle = close;
	close.style.cssText = "    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPElEQVRYR+2W4QnCMBCFX8kA6iYWbgCdQEfQzRzBDXSAQB2lDlCQSAI1JM3dhVJ/tH8KIc378vrukgYLP83C+lgB/tMBa+0NwMkYc2zb9lWTk67r9sMwPADciegar5V0wFrbA9gA6GsgRuJbAG8icu+fJwngP3zWQMTixphDys1sBmoguOLOiskQaiAk4kUAN0ECIRVnAXAhNOJsgBKEVlwEkINw477Ov6WWS3uul4g7YZwJv7BKXOxA2EUE4YbFOw9riR0Y/QrXXkNnU3dMMUAcOL8TddsWAaTS7kOobttsgKlSkzQr1mEUT+LUuRai6ABHPFMdrGByDqOQdlapSZ0oHccicY0TUxcSlbgUonQlY9me6/Px7yCiHasK/KX0LD1YUiAjCHcpvbAAcjuaY7xYhnOIjtdcARZ34AMUKVAwSryVogAAAABJRU5ErkJggg==) no-repeat;    width: 16px;    height: 16px;    background-size: contain;    text-indent: -9999px;    position: absolute;    top: 12px;    right: 12px;    cursor: pointer;";
	box.appendChild(close);


	this.width = box.offsetWidth;
	this.height = box.offsetHeight;
	this.element = div;
	
	
	this.setStyle(box);

	this.close();

};
//样式插入监听
tipsbox.prototype.setStyle = function (el) {
	if(typeof el == 'object') {
	 	var left = (this.winWidth - el.offsetWidth) / 2 ;
		var top = (this.winHeight - el.offsetHeight) / 2 + this.scrollTop - this.bodyTop;
		el.style.left = left + 'px';
		el.style.top = top + 'px';
	}
};

//关闭box
tipsbox.prototype.close = function () {
	this.closeEle.addEventListener('click', this.remove.bind(this) , false);
};
//打开box
tipsbox.prototype.open = function () {
	this.show();
};
//显示box
tipsbox.prototype.show = function () {
	if(this.element) {
		this.element.style.display = 'block';
	}
};
//隐藏box
tipsbox.prototype.hide = function () {
	if(this.element) {
		this.element.style.display = 'none';
	}
};
//移除box
tipsbox.prototype.remove = function () {
	if(this.element) {
		this.element.remove()
		// this.body.style.position = 'relative';
		// this.body.style.top = 0
		// this.body.scrollTop = this.scrollTop;
	}
};
function MsgBox(message){
	tipsbox('<div id="alert"><div id="alert-box"><div id="alert-message">' + message + '</div><div id="alert-button-confirm">确定</div></div></div>',function(el){
		var confirm = document.getElementById('alert-button-confirm')
		confirm.addEventListener('click',function(){
			el.remove()
		})
	});
}