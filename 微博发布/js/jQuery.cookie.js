;(function($,window){
    //添加到jQuery的静态方法
    $.extend({
        /*****添加 cookie *****/
        addCookie:function (key,value,day,path,domain){
            //处理默认路径
            let index = window.location.pathname.lastIndexOf('/');
            currentPath = window.location.pathname.slice(0,index);
            path = path || currentPath;
            //处理默认二级域名
            domain = domain || document.domain;
            //处理默认过期时间
            if(!day){
                document.cookie = key + '=' + value + ';path=' + path + ';domain=' + domain + ';';
            }else{
                let date = new Date();
                date.setDate(date.getDate() + day);
                document.cookie = key + '=' + value + ';expires=' + date.toGMTString() + ';path=' + path + ';domain=' + domain + ';';
            }
        },

        /*****获取 cookie 的 value*****/
        getCookie:function (key){
            let res = document.cookie.split(';');
            for(let i = 0, len = res.length; i < len; i++){
                let temp = res[i].split('=');
                if(temp[0].trim() === key){
                    return temp[1];
                }
            }
        },

        /*****删除 cookie *****/
        //注意：path不传则为默认路径，只能删除默认路径下的 cookie
        delCookie:function (key,path){
            addCookie(key,getCookie(key),-1,path);
        }
    })
})(jQuery,window);