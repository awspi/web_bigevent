$(function(){
  let layer=layui.layer;
  let form=layui.form;
  let laypage = layui.laypage;
  // 请求参数q
  let q={
    pagenum:1,
    pagesize:2,
    cate_id:'',
    state:''
  }

  // template过滤器
  template.defaults.imports.dateFormat=function(date){
    const dt=new Date(date);
    let y=padZero(dt.getFullYear());
    let m=padZero(dt.getMonth()+1);
    let d=padZero(dt.getDay());
    let hh=padZero(dt.getHours());
    let mm=padZero(dt.getMinutes());
    let ss=padZero(dt.getSeconds());
    return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss;
  }
  //补0
  function padZero(n){
    return n>9?n:'0'+n;
  }

  initTable();
  initCate();

  //获取列表数据
  function initTable(){
    $.ajax({
      url:'/my/article/list',
      method:'GET',
      data:q,
      success:function(res){
        if(res.data!=0){
          return layer.msg(res.message);
        }
       renderPage(res.total);
        let htmlStr=template('tpl-table',res);
        $('tbody').html(htmlStr);
      }
    })
  }

  // 分类获取
  function initCate(){
    $.ajax({
      url:'/my/article/cates',
      method:'GET',
      success:function(res){
        if(res.status!=0){
          return layer.msg(res.message);
        }
       let htmlStr=template('tpl-cate',res)
       $('[name=cate_id]').html(htmlStr);
       form.render();
      }
    })
  }

  // 筛选
  $('#form-search').on('submit',function(e){
    e.preventDefault();
    let cate_id=$('[name=cate_id]').val();
    let state=$('[name=state]').val();
    q.cate_id=cate_id;
    q.state=state;
    console.log(q);
    initTable();
  })

  function renderPage(total){
    laypage.render({
      elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
      ,layout:['count','limit','prev', 'page', 'next','skip']
      ,limits:[2,3,5,10]
      ,count: total //数据总数，从服务端得到
      ,limit:q.pagesize
      ,curr:q.pagenum
      ,jump: function(obj, first){//jump 回调函数
        //1.分页发生切换的时候,触发jump回调
        //2.laypage.render()方法会触发jump回调

        
        if(!first){//首次不执行
        //obj包含了当前分页的所有参数，比如：
        // obj.curr//得到当前页，以便向服务端请求对应页的数据。
        q.pagenum=obj.curr;
        q.pagesize=obj.limit
        initTable();
        }
      }
    });
  }

  $('tbody').on('click','.btn-del',function(){
    let len=$('.btn-del').length;

    layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
      let id= $(this).attr('data-id');
      $.ajax({
        url:'/my/article/delete/'+id,
        method:'GET',
        success:function(res){
          if(res.status!=0){
            return layer.msg(res.message);
          }
          layer.msg('删除成功',{time:400},function(){
            if(len==1){//len==1删除完就没有数据了
              q.pagenum=q.pagenum==1?1:q.pagenum-1;
            }
            initTable();
          })
        }
      })
      layer.close(index);
    });
  })

})