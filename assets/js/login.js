$(function(){
  // login/reg toggle
  $('#link_reg,#link_login').on('click',function(){
    $('.login-box').toggle() ;
    $('.reg-box').toggle() ;
  })

  let form=layui.form;
  let layer=layui.layer;
  // 表单验证
  form.verify({
    pwd: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ],
    repwd:function(value){
      if($('#form-reg [name=password]').val()!=value){
        return '密码不一致';
      }
    }
  });
  // 监听注册表单
 
  $('#form-reg').on('submit',function(e){
    e.preventDefault();
    $.post('/api/reguser',{
      username: $('#form-reg [name=username').val(),
      password: $('#form-reg [name=password').val()
    },function(res){
      if(res.status!=0){
        return console.log(res.message);
      }
      layer.msg('注册成功!',{
        time:800
      },function(){
        $('#link_login').click();
      });
    });
  })
})

  // 监听登录表单
  $('#form-login').on('submit',function(e){
    e.preventDefault();
    $.ajax(
      {
        url: '/api/login',
        method: 'POST',
        data: $(this).serialize(),
        success: function(res){
          if(res.status!= 0){
            return console.log(res.message);
          }
          layer.msg('登录成功!',{
            time:400
          },function(){
            localStorage.setItem('token',res.token);
            location.href='/index.html';
        });
      }
    });
})