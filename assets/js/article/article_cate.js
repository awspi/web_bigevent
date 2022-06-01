let layer=layui.layer;
let form=layui.form;
$(function(){
  initArticle();
  let formIndex=null;
  let editIndex=null;
  $('#btnAddCate').on('click',function(){
    formIndex=layer.open({
      type:1,
      area: ['500px', '300px'],
      title: '添加类别',
      content: $('#dialog-add').html()
    });     
  })
  //通过代理 为form-add绑定事件
  $('body').on('submit','#form-add',function(e){
    e.preventDefault();
    $.ajax({
      url:'/my/article/addcates',
      method:'POST',
      data:$(this).serialize(),
      success:function(res){
        if(res.status!=0){
          return layer.msg(res.message);
        }
        layer.msg('添加成功!',{time:400},function(){
          layer.close(formIndex);
          initArticle();
        });
      }
    })
  })
  $('body').on('click','#btnClose',function(){
    layer.close(formIndex);
  })

  // //通过代理 为edit绑定事件

  $('tbody').on('click','.btn-edit',function(){
    let id=$(this).attr('data-id')
    $.ajax({
      url:'/my/article/cates/'+id,
      method:'GET',
      success:function(res){
        form.val('form-edit',res.data);
      }
    })
    formIndex=layer.open({
      type:1,
      area: ['500px', '300px'],
      title: '编辑',
      content: $('#dialog-edit').html()
    });
  })
  $('body').on('submit','#form-edit',function(e){
    e.preventDefault();
    $.ajax({
      url:'/my/article/updatecate',
      method:'POST',
      data:$(this).serialize(),
      success:function(res){
        if(res.status!=0){
          return layer.msg(res.message);
        }
        layer.msg('修改成功!',{time:400},function(){
          layer.close(formIndex);
          initArticle();
        });
      }
    })
  })
  $('tbody').on('click','#btnClose',function(){
    layer.close(editIndex);
  })

  //通过代理 为del绑定事件
  $('tbody').on('click','.btn-del',function(){
    let id=$(this).attr('data-id')
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        url:'/my/article/deletecate/'+id,
        method:'GET',
        success:function(res){
          if(res.status!=0){
            return layer.msg(res.message);
          }
          layer.msg('删除成功',{time:400},function(){
            initArticle();
          })
        }

      })
      layer.close(index);
    });
  })
})

function initArticle(){
  $.ajax({
    url:'/my/article/cates',
    method:'GET',
    success:function(res){
     let htmlStr=template('tpl-table',res)
     $('tbody').html(htmlStr);
    }
  })
}

