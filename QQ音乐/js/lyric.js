(function(window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor:Lyric,
        init:function(path){
            this.path = path;
        },
        times:[],
        lyrics:[],
        index:-1,
        loadLyric:function(cb){
            let $this = this;
            $.ajax({
                url:$this.path,
                dataType:'text',
                success:function(data){
                    // console.log(data);
                    $this.parseLyric(data);
                    cb();
                },
                error:function(e){
                    console.log(e);
                }
            });
        },
        parseLyric:function(data){
            let $this = this;
            //清空上一首歌曲的歌词
            $this.times = [];
            $this.lyrics = [];
            let arr = data.split('\n');
            // [00:00.92]
            let timeReg = /\[(\d*:\d*\.\d*)\]/;//加上括号可以取出我们想要的时间内容（去掉中括号的）
            $.each(arr,function(index,ele){
                //把同时有 时间和歌词 的数据取出来，分别存到时间数组和歌词数组，一对一方便实现歌词同步滚动
                 
                //歌词处理
                 let lrc = ele.split(']')[1];
                 if(lrc.length == 1)
                     return true;    //没有歌词
                 $this.lyrics.push(lrc);

                //时间处理
                let res = timeReg.exec(ele);
                if(res === null)
                    return true; //相当于 continue
                let timeStr = res[1];
                let res2 = timeStr.split(':');
                let min = parseInt(res2[0]) * 60;
                let sec = parseFloat(res2[1]);
                let time = parseFloat((min + sec).toFixed(2));
                $this.times.push(time);
            });
        },
        currentIndex:function(currentTime){
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift();
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window)