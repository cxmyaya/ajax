
(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor:Progress,
        isMove:false,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        progressClick:function(cb){
            let $this = this; // 这里的 this 是 progress (调用此函数的对象)
            //监听背景的点击
            $this.$progressBar.click(function(event){
                // console.log(1);
                //获取背景距离窗口默认的位置
                //这里的 this 是触发点击事件的对象 $progressBar
                let normalLeft = $(this).offset().left;
                //获取点击的位置距离窗口的位置
                let eventLeft = event.pageX;
                let len = eventLeft - normalLeft;
                //设置前景的宽度
                $this.$progressLine.css('width',len);
                $this.$progressDot.css('left',len);
                //计算进度条比例
                let value = len / $(this).width();
                // console.log(value)
                cb(value);
            })
        },
        progressMove:function(cb){
            let $this = this;
            let len = 0;
            // 1. 监听鼠标按下事件
            $this.$progressBar.mousedown(function(){
                let normalLeft = $(this).offset().left;
                $this.isMove = true;
                // 2. 监听鼠标移动事件
                $(document).mousemove(function(){
                    let eventLeft = event.pageX;
                    //移动长度在进度条范围内
                    if(eventLeft < normalLeft){
                        eventLeft = normalLeft;
                    }else if(eventLeft > normalLeft + $this.$progressBar.width()){       
                        eventLeft = normalLeft + $this.$progressBar.width();
                    }

                    len = eventLeft - normalLeft;
                    //设置前景的宽度
                    $this.$progressLine.css('width',len);
                    $this.$progressDot.css('left',len);
                });
                 // 3. 监听鼠标的抬起事件
                $(document).mouseup(function(){
                    $(document).off('mousemove');
                    $this.isMove = false;
                    //拉动进度条松手后再计算进度条比例,改变歌曲播放时间
                    let value = len / $this.$progressBar.width();
                    cb(value);
                    // console.log(1,value)
                });  
            });
           
        },
        setProgress:function(value){
            if(this.isMove) return ;
            if(value < 0 || value > 100)return;
            this.$progressLine.css({
                width:value + '%'
            });
            this.$progressDot.css({
                left:value + '%'
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)