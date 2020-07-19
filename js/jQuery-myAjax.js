let ObjToStr = function(obj){
    let res = [];
    obj.t = new Date().getTime();
    for(let key in obj){
        res.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return res.join('&');
}
function ajax(obj){
    let str = ObjToStr(obj.data);
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    if(obj.type.toUpperCase() === 'GET'){
        xhr.open('GET',obj.url + '?' + str,true);
        xhr.send();
    }else{
        xhr.open('POST',obj.url,true);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send(str);
    }
    xhr.onreadystatechange = function(ev){
        if(xhr.readyState === 4){       
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){       
                obj.success(xhr);
            }else{
                obj.error(xhr);
            }
        }
    }
    if(obj.timeout){
        let timer = setInterval(function(){
            console.log('请求中断！');
            xhr.abort();
            clearInterval(timer);
        },obj.timeout)
    }

}