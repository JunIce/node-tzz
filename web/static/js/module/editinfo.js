 $(function () {
  userAct.changeUserHd();

  //修改资料页头像
  $('.userHead').on('mouseenter',function(){
    $('.userPic-save').show();
  }).on('mouseleave',function(){
    $('.userPic-save').hide();
  })
  //smallround
  $('.sexWrp').on('click',function(){
    $('.sex-radio label').css('background-color','#ddd');
    $(this).find('label').css('background-color',$(this).find('i').data('color'))
    $('#sexVal').val($(this).find('i').data('val'))
  })


  $('#province').change(function(){
      var val = this.value;
      console.log(this.value)
      $.getJSON('/api/city/?code='+val, function(data){
          if(data.status == 1) {
             $('#city').html(data.html)
          }
      })
  })
  $('.pri-tabs li').on('click',function(){
    $(this).addClass('tabsOn').siblings().removeClass('tabsOn');
    if($(this).hasClass('pri-info')){
      $('.pri-tabs-info').show().siblings().hide();
    }else if($(this).hasClass('pri-zhang')){
      $('.pri-tabs-bd').show().siblings().hide();
    }
  })
//toggle
  $('.setUPass,.reSetUPass').on('click',function(){
    $('.setPass').slideToggle();
  })
  $('.cha-em').on('click',function(){
    $('.changE').slideToggle();
  })



 

 

  var birth = [];
  $('#birthPl select').on('change',function(e){
      switch (e.target.className) {
         case 'sel_year':
            birth[0] = $(this).val();
            break;
          case 'sel_month':
            birth[1] = $(this).val();
            break;
           case 'sel_day':
            birth[2] = $(this).val();
            break;
      }
      $('#birth').val(birth);
  });



  $('.bd-email').on('click',function(){
      var val = $('#bd-email').val();
      if(val != ''){
        if(checkPUB.email(val)){
            bdAccount.init({
              type:'email',
              value:val
            },function(data){
              if(data.status == 0){
                $('#bd-email').val(val).attr('disabled','disabled').css('background-color','#ececec');
              }
            })
        }else{
          alert('邮箱不合法！');
        }
      }else{
        alert('请输入绑定邮箱！');
      }
  });

  $('.reEmail').click(function(){
      var val = $('#changeEmail').val();
      if(val != ''){
        if(checkPUB.email(val)){
            bdAccount.init({
              type:'email',
              value:val
            },function(data){
              if(data.status == 0){
                $('#bd-email').val(val);
              }else if(data.status == 3){
                alert('邮箱已存在！');
              }
            })
        }else{
          alert('邮箱不合法！');
        }
      }else{
        alert('请输入绑定邮箱！');
      }
  });


  $('.rePassCheck').click(function(){
    var rePass = $('#forPass').val().toString();
    var nowPass = $('#nowPass').val().toString();
    if(rePass == '' && nowPass == ''){
      alert('请输入密码！');
      return;
    }
    if(rePass.length < 6 || rePass.length > 12 || nowPass.length < 6 || nowPass.length > 12){
      alert('请设置6到12位密码！');
    }
    else{
      bdAccount.init({
        oriPass: rePass,
        newPass : nowPass,
        type:'password'
      },function(data){
        if(data.status == 0){
          alert('密码重设成功');
          setTimeout(function(){location.reload()},1000);
        }
      })
    }
  });

  $('.setOwnP').on('click',function(){
      var rePass = $('#setPass').val().toString();
      if(rePass != ''){
        bdAccount.init({
          newPass:rePass,
          type:'password'
        },function(data){
            if(data.status == 0){
              alert(data.msg);
              setTimeout(function(){location.reload()},1000);
            }
        })
      }else{
        alert('请输入密码！');
      }
  })
});



var bdAccount = {
  init:function(obj,fn){
    if(typeof obj == 'object'){
      switch (obj.type){
        case 'email':
          if(obj.value !== null){
            this.toServer(obj,fn);
          }else{
            alert('非法字符');
          }
          break;

        case 'password':
          if(obj.value !== null){
            this.toServer(obj,fn);
          }else{
            alert('密码至少6位!');
          }
          break;
      }
    }
  },
  toServer:function(obj,fn){
    $.ajax({
      type:'post',
      url:'/api/bdAccount/',
      data:obj,
      success:function(data){
        var data = JSON.parse(data);
        if(fn){
          fn.call(this,data);
        }
      }
    })
  },
  check:function(s){
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？《》]") 
    var rs = ""; 
    for (var i = 0; i < s.length; i++) { 
      rs = rs+pattern.exec(s[i]);
    } 
    return rs; 
  }
}
var checkPUB = {
  email:function(o){
    var reg=/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; 
    var bChk=reg.test(o); 
    return bChk; 
  }
}

var userAct = {
  changeUserHd:function(){//更换头像
    var that = this;
     $('#upload-headpic').uploadifive({
          'auto' : true,
          'formData': {
              'timestamp':$user.timestamp,
              'token':$user.vertify,
              'uid':$user.userid,
              'classid':$user.classid //由于360浏览器极速模式,上传图片时会忽略cookie,这里以post的方式提交过去
          },  
          
          'buttonClass'     : 'upload-user-hd',    
          'uploadScript' : '/api/show/',
          'fileObjName' : 'Filedata',
          'dnd':false,
          'buttonText'    : '',
          'width'                 : '140',
          'height'                : '140',
          'queueSizeLimit': '3',
          'uploadLimit'   : '3',
          'queueID'       : '',
          'multi'        : false,
          'itemTemplate'    : '<div class="uploadifive-queue-item"></div>',  
          'onUploadComplete' : function(file, data){
            var data = JSON.parse(data);
              $('.user-head-pic img').attr('src',data.url);
              that.saveHd($user.userid,data.url);
           },
       })
  },
  saveHd:function(id,url){//保存头像
    $.ajax({
      type:"post",
      url:'/api/savehead/',
      data:{
        'uid':id,
        'upic':url,
      },
      success:function(data){
        var data = JSON.parse(data);
        if(data.stats == '1'){
          $('.logined-userhd').attr('src',url);   
        }
      }
    });
  },
  cancelHd:function(){
    $('#save-part').remove();
    $('.user-head-pic img:last').remove();
    $('.user-head-pic img').eq(0).show();
    $('.upload-user-hd').show();
  },
}