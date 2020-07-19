  $(function(){
            let $send = $('#send'),
                $p = $('.info > p'),
                $time = $('.info > .time'),
                $top = $('.info-oper > a').eq(0),
                $down = $('.info-oper > a').eq(1),
                $delete = $('.info-oper > a').eq(2),
                $btns = $('.page .btns');

                // let pageNum = $.getCookie('pageNum') || 1;
            
                let pageNum = window.location.hash.substring(1) || 1;

                //初始化微博数据
                getMsgList(pageNum);

                //初始化页码
                getMsgPage();

                //监听内容什么时候输入
                $('body').delegate('#mes','propertychange focus input',function(){
                    if($(this).val().length > 0){
                        //让按钮可用
                        $send.prop('disabled',false);
                    }else{
                        //让按钮不可用
                        $send.prop('disabled',true);
                    }
                })

                //监听发布按钮的点击
                $send.click(function(){
                    //拿到用户输入的内容
                    let $text = $('#mes').val();
                    $.ajax({
                        type:"get",
                        url:"weibo.php",
                        data: "act=add&content="+$text,
                        success:function(msg){
                            //{error: 0, id: 新添加内容的ID, time: 添加时间, acc: 点赞数, ref: 点踩数}
                        //    console.log(msg)
                           let obj = eval("(" + msg + ")"); //方便将不规范的 json 数据转化为 对象
                           obj.content = $text;
                           //根据内容创建节点
                            let $weibo = createEle(obj);
                            $weibo.get(0).obj = obj;
                            //插入微博
                            $('.mes-list').prepend($weibo);
                            //清空内容后自动聚焦
                            $('#mes').val('').focus();

                            //重新获取页码
                            getMsgPage();
                            if($(".info").length > 6){
                                $(".info:last-child").remove();
                            }
                        },
                        error:function(xhr){
                            console.length(xhr.status);
                        }
                    })
                   
                });

                //要监听动态产生的节点需要用时间委托
                //监听赞
                $('body').delegate('.info-top','click',function(){
                    $(this).children('.num').text(parseInt($(this).children('.num').text()) + 1);
                    let obj = $(this).parents('.info').get(0).obj;
                    $.ajax({
                        type:'get',
                        url:'weibo.php',
                        data:'act=acc&id=' + obj.id,
                        success:function(msg){
                            console.log(msg);
                        },
                        error:function(xhr){
                            console.log(xhr.status);
                        }
                    })
                })
                //监听踩
                $('body').delegate('.info-down','click',function(){
                    $(this).children('.num').text(parseInt($(this).children('.num').text()) + 1);
                    let obj = $(this).parents('.info').get(0).obj;
                    $.ajax({
                        type:'get',
                        url:'weibo.php',
                        data:'act=ref&id=' + obj.id,
                        success:function(msg){
                            console.log(msg);
                        },
                        error:function(xhr){
                            console.log(xhr.status);
                        }
                    })
                })
                //监听删除
                $('body').delegate('.info-del','click',function(){
                    $(this).parents('.info').remove();
                   // act=del&id
                   let obj = $(this).parents('.info').get(0).obj;
                    $.ajax({
                        type:'get',
                        url:'weibo.php',
                        data:'act=del&id=' + obj.id,
                        success:function(msg){
                            console.log(msg);
                            //删除后重新获取当前页面数据
                            getMsgList($('.cur').text());
                        },
                        error:function(xhr){
                            console.log(xhr.status);
                        }
                    });
                   

                })
                //监听页码按钮
                $('body').delegate('.page a','click',function(){
                    getMsgList($(this).text());
                    $(this).addClass('cur');
                    $(this).siblings().removeClass('cur');

                    //保存当前点击的页码,使得刷新后依然在当前页面
                    // 1) 用 cookie
                    // $.addCookie('pageNum',$(this).text());

                    // 2) 用 hash
                    window.location.hash = $(this).text();
                })

                //创建节点
                function createEle(obj){
                    let $info = $(`<div class="info">
                    <p>${obj.content}</p>
                    <span class="time">${formatDate(obj.time)}</span>
                    <div class="info-oper">
                        <a href="javascript:;" class='info-top'>
                            <span>赞</span>
                            <span class="num">${obj.acc}</span>
                        </a>
                        <a href="javascript:;" class='info-down'>
                            <span>踩</span>
                            <span class="num">${obj.ref}</span>
                        </a>
                        <a href="javascript:;" class='info-del'>
                             <span>删除</span>
                        </a>
                    </div>
                </div>`);
                return $info;
                }

                //格式化当前时间
                function formatDate(time){
                    let date = new Date(time * 1000);
                    let arr = [
                        date.getFullYear() + '-',
                        date.getMonth() + 1 + '-',
                        date.getDate() + ' ',
                        date.getHours() + ':',
                        date.getMinutes() + ':',
                        date.getSeconds()
                    ];
                    let str = arr.join('');
                    return str;
                }

                //获取微博数据
                function getMsgList(num){
                    //每次获取某页数据之前，先清空数据
                    $(".mes-list").html('');
                    $.ajax({
                        type:'get',
                        url:'weibo.php',
                        data:'act=get&page=' + num,
                        success:function(msg){
                            // console.log(msg);
                            let obj = eval("(" + msg + ")"); //方便将不规范的 json 数据转化为 对象
                            obj.forEach(function(item,index){
                            //根据内容创建节点
                            let $weibo = createEle(item);
                            $weibo.get(0).obj = item;
                            //插入微博
                            $('.mes-list').append($weibo);
                            })
                          
                        }
                    })
                }

                //获取页码
                function getMsgPage(){
                    let btnsDiv = $btns.get(0);
                    //每次重新获之前先清空
                    btnsDiv.innerHTML = '';
                    $.ajax({
                        type:'get',
                        url:'weibo.php',
                        data:'act=get_page_count',
                        success:function(msg){
                            // console.log(msg);
                            let obj = eval('(' + msg + ')');
                            let str = ''
                            for(let i = 0, len = obj.count; i < len; i++){
                                if(i === (pageNum-1)){
                                    str += `<a href='javasrcipt:;' class='cur'>${i+1}</a>`
                                }else{
                                    str += `<a href='javasrcipt:;'>${i+1}</a>`
                                }
                                
                            }
                            btnsDiv.innerHTML = str;
                        },
                        error:function(xhr){
                            console.log(xhr.status)
                        }
                    })
                }
        })