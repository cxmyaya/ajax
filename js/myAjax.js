let ObjToStr = function(obj){
    let res = [];
    obj.t = new Date().getTime();
    for(let key in obj){
        //encodeURIComponent()对中文进行编码
        //url 中只能出现 字母/数字/下划线/ASCII码
        res.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return res.join('&');
}

let ajax = function (type,url,obj,timeout,success,error) {
    let str = ObjToStr(obj);
    let timer ;
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    if(type.toUpperCase() === 'GET'){
        xhr.open('GET',url + '?' + str,true);
        xhr.send();
    }else{
        xhr.open('POST',url,true);
        //注意点：以下代码必须放到 open 和 send 之间
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send(str);
    }
    
    xhr.onreadystatechange = function(ev){
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                success(xhr);
            }else{
                error(xhr);
            }
        }
    }

    //如果传入了超时时间，则达到超时时间后就中断请求
    if(timeout){
        timer = setInterval(function(){
            console.log('请求中断')
            xhr.abort();//中断对服务器的请求
            clearInterval(timer);
        },timeout)
    }
}