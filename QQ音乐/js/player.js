(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor:Player,
        musicList:[],
        currentIndex:-1, // 当前播放歌曲的索引
        init:function($audio){
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        playMusic:function(index,music){
            if(this.currentIndex === index){
                //同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                //不是同一首音乐
                this.$audio.attr('src',music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex:function(){
            let index = this.currentIndex - 1;
            if(index < 0){
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex:function(){
            let index = this.currentIndex + 1;
            if(index > this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
        changeMusic:function(index){

            //删除后台对应歌曲信息
            this.musicList.splice(index,1);

            //判断当前删除的音乐是不是正在播放音乐的前面
            if(index < this.currentIndex){
                this.currentIndex -= 1; 
            }
        },
        getCurrentTime:function(){
            let timeStr = '00:00';
            let currentTime = this.audio.currentTime
            if(currentTime){
                let startMin = parseInt(currentTime / 60);
                let startSec = parseInt(currentTime % 60);
                if(startMin < 10){
                    startMin = '0' + startMin;
                }
                if(startSec < 10){
                    startSec = '0' + startSec;
                }
                timeStr = startMin + ':' + startSec
            }
            return timeStr;
        },
        musicTimeUpdate:function(cb){
            let $this = this;
            $this.$audio.on('timeupdate',function(){
                let duration = $this.audio.duration;
                let currentTime = $this.audio.currentTime;
                let timeStr =  $this.formatTime(currentTime,duration);
                cb(duration,currentTime,timeStr);
            })
        },
        formatTime:function(currentTime,duration){
            let endMin = parseInt(duration / 60);
            let endSec = parseInt(duration % 60);
            if(endMin < 10){
                endMin = '0' + endMin;
            }
            if(endSec < 10){
                endSec = '0' + endSec;
            }

            let startMin = parseInt(currentTime / 60);
            let startSec = parseInt(currentTime % 60);
            if(startMin < 10){
                startMin = '0' + startMin;
            }
            if(startSec < 10){
                startSec = '0' + startSec;
            }
            return startMin  + ':' + startSec + ' / ' + endMin + ':' + endSec;
        },
        musicSeekTo:function(value){
            if(isNaN(value) || isNaN(this.audio.duration)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo:function(value){
            if(isNaN(value))  return ;
            if(value < 0 || value > 1)  return;
            this.audio.volume = value;
        }
    }
    //每个函数都有自己的 prototype，因此这里需要改变 init 指向的原型才可以拥有 Player 里的方法
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window)