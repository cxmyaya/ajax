
$(function () {

    let $contentList = $(".content-list");
    let $audio = $('audio');
    let player = new Player($audio);
    let lyric;

    //歌曲进度条
    let $progressBar = $(".music-progress-bar");
    let $progressLine = $('.music-progress-line');
    let $progressDot = $('.music-progress-dot');
    let progress = new Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick(function(value){
        player.musicSeekTo(value);
    });
    progress.progressMove(function(value){
        player.musicSeekTo(value);
    });

    //声音进度条
    let $voiceBar = $(".music-voice-bar");
    let $voiceLine = $('.music-voice-line');
    let $voiceDot = $('.music-voice-dot');
    let voiceProgress = new Progress($voiceBar,$voiceLine,$voiceDot);
    voiceProgress.progressClick(function(value){
        player.musicVoiceSeekTo(value);
    });
    voiceProgress.progressMove(function(value){
        player.musicVoiceSeekTo(value);
    });


    //自定义滚动条
    $contentList.mCustomScrollbar();

     /**
     * 加载歌曲列表
     */
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: './source/musiclist.json',
            dataType: 'json',
            success: function (data) {
                player.musicList = data;
                // 遍历获取到的数据，创建每一条音乐
                let $musicList = $('.content-list ul');
                $.each(data, function (index, ele) {
                    let $item = createMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        })
    }

    /**
     * 创建一条音乐信息
     */
    function createMusicItem(index, music) {
        let $item = $(` <li class="list-music">
        <div class="list-check">
            <i class="iconfont"></i>
        </div>
        <div class="list-num">` + (index + 1) + `</div>
        <div class="list-name">` + music.name + `
            <div class="list-menu">
                <a href="javascript:;" title="播放" class='list-menu-play'></a>
                <a href="javascript:;" title="添加"></a>
                <a href="javascript:;" title="下载"></a>
                <a href="javascript:;" title="分享"></a>
            </div>
        </div>
        <div class="list-singer">` + music.singer + `</div>
        <div class="list-time">
            <a href="javascript:;" class='list-music-del'></a>
            <span class="time">` + music.time + `</span>
        </div>
        </li>`);
        // 给原生的 li 绑定 歌曲的 index 和 music 
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }

    //初始化歌曲信息
    function initMusicInfo(music){
        let $musicImage = $('.song-pic img');
        let $musicName = $('.song-name a');
        let $musicSinger = $('.song-singer a');
        let $musicAblum = $('.song-ablum a');
        let $musicProgressName = $(".music-progress-name");
        let $musicProgressTime = $('.music-progress-time');
        let $musicBg = $('.mask-bg');

        $musicImage.attr('src',music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name + ' - ' + music.singer);
        // 这里 player.getCurrentTime()若为 00:00 则会在播放中途暂停播放的时候,闪一下00:00
        $musicProgressTime.text(player.getCurrentTime() + ' / ' + music.time);
        $musicBg.css('background-image','url("' + music.cover + '")');
    }

    //初始化歌词信息
    function initMusicLyric(music){
        lyric = new Lyric(music.link_lrc);
        let lyricContainer = $('.song-lyric');
        //清空上一首音乐的li
        lyricContainer.html('');
        let fragment = document.createDocumentFragment();
        lyric.loadLyric(function(){
            $.each(lyric.lyrics,function(index,ele){
                let $item = $('<li>' + ele + '</li>')[0];
                fragment.appendChild($item);
            });
            lyricContainer[0].appendChild(fragment);
        });
    }

    /**
     * 用事件委托来监听事件，使动态添加的元素也能绑定事件
     *  把事件委托给在入口函数执行之前就已经存在的元素，这里用 .content-list
     *  注意 hover 事件只能拆成 mouseenter 和 mouseleave 来绑定
     */
    initEvents();
    function initEvents(){
        // 1. 监听歌曲的移入移除事件
        $contentList.delegate('.list-music', 'mouseenter', function () {
            //显示子菜单
            $(this).find('.list-menu').stop().fadeIn(100);
            $(this).find('.list-time > a').stop().fadeIn(100);
            //隐藏时长
            $(this).find('.list-time > .time').stop().fadeOut(100);
        });

        $contentList.delegate('.list-music', 'mouseleave', function () {
            //隐藏子菜单
            $(this).find('.list-menu').stop().fadeOut(100);
            $(this).find('.list-time > a').stop().fadeOut(100);
            //显示时长
            $(this).find('.list-time > .time').stop().fadeIn(100);
        });

        // 2. 监听复选框点击事件
        $contentList.delegate('.list-check', 'click', function () {
            $(this).children('i').toggleClass('icon-gou');
        });

        // 3. 监听子菜单播放按钮
        let $musicPlay = $(".music-play");
        $contentList.delegate('.list-menu-play','click',function(){
            let $parent = $(this).parents('.list-music');

            //切换播放图标
            $(this).toggleClass('list-menu-play2');

            //复原其他兄弟的播放图标，先找祖先再找其他兄弟
            $parent.siblings().find('.list-menu-play').removeClass('list-menu-play2')

            //同步底部播放按钮
            if($(this).attr('class').indexOf('list-menu-play2') != -1){
                //当前为播放状态
                $musicPlay.addClass('music-play2');
                //高亮文字
                $parent.find('div').css("color",'#fff');
                //高亮文字排他
                $parent.siblings().find('div').css("color",'rgba(255,255,255,.5)');
                
            }else{
                $musicPlay.removeClass('music-play2');
                //取消文字高亮
                $parent.find('div').css("color",'rgba(255,255,255,.5)');
            }

            //切换序号的状态和排他
            $parent.find('.list-num').toggleClass('list-num2');
            $parent.siblings().find('.list-num').removeClass('list-num2');
            
            //播放音乐
            player.playMusic($parent.get(0).index,$parent.get(0).music);

            //切换歌曲信息      
             initMusicInfo($parent.get(0).music);  
             //切换歌词
             initMusicLyric($parent.get(0).music);
        });
        
        // 4. 监听底部控制区域 播放按钮 的点击
        $musicPlay.click(function(){
            if(player.currentIndex === -1){
                //还未播放过音乐则默认播放第一首，通过自动触发子菜单的播放按钮来播放音乐
                $('.list-music').eq(0).find('.list-menu-play').trigger('click');
            }else{
                // 已经播放过音乐则自动触发对应的子菜单播放按钮
                $('.list-music').eq(player.currentIndex).find('.list-menu-play').trigger('click');
            }
        });

        // 5. 监听底部控制区域 上一首音乐按钮 的点击
        $('.music-pre').click(function(){
            $('.list-music').eq(player.preIndex()).find('.list-menu-play').trigger('click');
        });

        // 6. 监听底部控制区域 下一首音乐按钮 的点击
        $('.music-next').click(function(){
            $('.list-music').eq(player.nextIndex()).find('.list-menu-play').trigger('click');
        });

        // 7. 监听删除按钮(动态添加的，需要委托事件)
        $contentList.delegate('.list-music-del','click',function(){
            let $item = $(this).parents('.list-music');

            //判断当前删除的音乐是不是在正在播放,是就删除并自动播放下一首
            if($item.get(0).index === player.currentIndex){
                $('.music-next').trigger('click');
            }
            $item.remove();
            player.changeMusic($item.get(0).index);

            //重新排序
            $('.list-music').each(function(index,ele){
                ele.index = index;
                $(ele).find('.list-num').text(index + 1);
            })
        })
        
        // 8. 监听播放的进度
        player.musicTimeUpdate(function(duration,currentTime,timeStr){

            //同步播放时间
            if(!duration){
                //第一次点击播放的时候 duration 为 NaN
                $('.music-progress-time').text('00:00 / ' + '00:00' );
            }else{
                $('.music-progress-time').text(timeStr);
            }
            
            //同步进度条
            let value = currentTime / duration * 100;
            progress.setProgress(value);

            //同步歌词
            let index = lyric.currentIndex(currentTime);
            let $item = $('.song-lyric li').eq(index);
            //高亮当前歌词
            
            $item.addClass('cur');
            $item.siblings().removeClass('cur');

            //实现滚动歌词时当前高亮歌词在中间
            if(index <= 2)  return;

            $('.song-lyric').css({
                marginTop: (-index + 2) * 30
            })
            
        });

        // 9. 监听声音按钮的点击
        $('.music-voice-icon').click(function(){
            //图标切换
            $(this).toggleClass('music-voice-icon2');
            //声音切换
            if($(this).attr('class').indexOf('music-voice-icon2') != -1){
                //变为没有声音
                player.musicVoiceSeekTo(0);
            }else{
                //变为有声音
                player.musicVoiceSeekTo(1);
            }
        })
    }
    

   
})