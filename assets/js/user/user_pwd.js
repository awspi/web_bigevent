let form = layui.form;
let layer = layui.layer;
$(function(){
  form.verify({
    pwd:[
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samepwd:function(val){
      if(val==$('[name=oldPwd]').val()){
        return '新密码不能和旧密码相同';
      }
    },
    repwd:function(val){
      if(val!==$('[name=newPwd]').val()){
        return '两次密码不一致';
      }
    },
  });

  $('.layui-form').on('submit',function(e){
    e.preventDefault();
    $.ajax({
      url:'/my/updatepwd',
      method:'POST',
      data:$(this).serialize(),
      success:function(res){
        if(res.status!==0){
          return layer.msg('更新密码失败');
        }
        //直接重新登录
        layer.msg('更新密码成功,请重新登录!',{
          time:400
        },function(){
          localStorage.removeItem('token')//清理token
          window.parent.location.href='/login.html';//强制跳转
        });
        // //原生dom reset表单
        // $('.layui-form')[0].reset();
        
      }
    })

  })
})

