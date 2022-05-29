let layer=layui.layer;
let form =layui.form;
$(function(){
    // 表单验证
  form.verify({
    nickname:function(val){
      if(val.length>6){
        return '昵称要在1~6位'
      }
    }
  })

  initUserInfo();
})
  //初始化用户基本信息
function initUserInfo(){
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    success: function(res){
      if(res.status !== 0){
        return layer.msg('获取用户信息失败');
      }
      form.val('formUserInfo',res.data);
      console.log(res.data);
    }
  })
}
// reset 
$('#btnReset').on('click',function(e){
  e.preventDefault();
  initUserInfo();
})
// Submit
$('.layui-form').on('submit',function(e){
  e.preventDefault();
  $.ajax({
    url:'/my/userinfo',
    method:'POST',
    data: $(this).serialize(),
    success:function(res){
      if(res.status!=0){
        return layer.msg('更新用户信息失败');
      }
      layer.msg('更新用户信息成功');
      window.parent.getUserInfo();
    }
  })
})