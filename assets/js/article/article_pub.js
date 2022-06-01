$(function(){
  let layer=layui.layer;
  let form=layui.form;
  initCate();
  // 分类获取
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()
      }
    })
  }
  // 初始化富文本编辑器
  initEditor();

  //初始化裁剪区域
  // 1. 初始化图片裁剪器
  let $image = $('#image')
  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)

  $('#btnChooseImg').on('click',function(){
    $('#file').click();
  })
  $('#file').on('change',function(e){
    let fileList=e.target.files;
    if(fileList.length==0){
      return layer.msg('请选择图片')
    }
    let newImgURL = URL.createObjectURL(fileList[0]);
    $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域

  })
  // 文章发布状态
  let art_status='已发布';
  // 存为草稿
  $('.btnSave2').on('click',function(){
    art_status='草稿';
  })
  $('.layui-form').on('submit',function(e){
    e.preventDefault();
    let fd=new FormData($(this)[0]);
    fd.append('status',art_status)
    $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      fd.append('cover_img',blob)
    })
    publish(fd);
  })
  function publish(fd){
    $.ajax({
      url:'/my/article/add',
      method:'POST',
      data:fd,//提交formData格式
      contentType: false,
      processData: false,
      success:function(res){
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})