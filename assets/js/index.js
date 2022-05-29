$(function(){
  getUserInfo();

})
let layer=layui.layer;
function getUserInfo(){
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    success: function(res){
      if(res.status !== 0){
        return layer.msg('获取用户信息失败');
      }
      renderAvatar(res.data);//渲染函数
    }
  })
}
// 渲染头像 nickname
function renderAvatar(user){
  let name =  user.nickname || user.username;
  $('#welcome').html(`欢迎!  ${name}`)
  if(user.user_pic!=null){
    console.log('not null');
    $('.text-avatar').hide();
    $('.layui-nav-img').attr('src',user.user_pic).show();
  }else{
    $('.text-avatar').html(name[0].toUpperCase()).show();
    $('.layui-nav-img').hide();
  }
}

// logOut
$('#btn_logout').on('click',function(){
  layer.confirm('是否退出?', {icon: 3, title:'提示'}, function(index){ 
    localStorage.removeItem('token');
    location.href='/login.html'
    layer.close(index);
  });
})