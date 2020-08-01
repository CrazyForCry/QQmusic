$(function () {
    //初始化滚动条
    $('.center_list').mCustomScrollbar();
    //播放对象
    var player = new Player($('audio'))
    var process
    var volumeProcess
    //歌词对象
    var $song_word = $('.song_word')
    var lyrics = new Lyrics($song_word)

    //绑定事件
    bindEvent()
    function bindEvent() {
        //歌曲移入移出效果显示---事件委托
        $('.center_list').delegate('.content_common', "mouseenter", function () {
            //图标显示
            $(this).find('.content_fuction').stop().fadeIn(100)
            $(this).find('.content_time a').stop().fadeIn(100)
            //时间文字去除
            $(this).find('.content_time span').stop().fadeOut(100)
        })
        $('.center_list').delegate('.content_common', "mouseleave", function () {
            // 图标去除
            $(this).find('.content_fuction').stop().fadeOut(100)
            $(this).find('.content_time a').stop().fadeOut(100)
            //时间文字显示
            $(this).find('.content_time span').stop().fadeIn(100)
        })


        //选中事件绑定---事件委托
        $('.center_list').delegate('.content_check', "click", function () {
            $(this).children('span').toggleClass('content_checked')
        })

        //对播放按钮绑定事件---事件委托
        $('.center_list').delegate('.play_music', "click", function () {

            var $music = $(this).parents('.content_common').get(0).music
            var $index = $(this).parents('.content_common').get(0).index


            var thisParent = $(this).parents('.content_common')
            //切换正在播放的图标
            $(this).toggleClass('play_music2')
            //去除其他正在播放的class
            thisParent.siblings().find('.play_music').removeClass('play_music2')
            thisParent.find('.content_number').toggleClass('content_number2')
            thisParent.siblings().find('.content_number').removeClass('content_number2')
            //下面同步
            var $play = $('.bottom_in .music_play')
            if ($(this).attr('class').indexOf('play_music2') != -1) {
                //播放

                $play.addClass('music_play2')
                thisParent.find('div').css("color", "#fff")
                thisParent.siblings().find('div').css("color", "rgba(255, 255, 255, 0.5)")
            } else {
                //非播放
                $play.removeClass('music_play2')
                thisParent.find('div').css("color", "rgba(255, 255, 255, 0.5)")

            }

            player.playMucis($index, $music)
            initInfo($music)
            lyrics.loadLyrics($music.link_lrc)


        })
        //删除歌曲
        $('.center_list').delegate('.deleteLi', "click", function () {
            player.deleteLi($(this).parents('.content_common').get(0).index)
            $(this).parents('.content_common').remove()

            $('.content_common').each(function (index, music) {
                music.index = index
                $(music).find('.content_number').text(index + 1)
            })
        })


        //底部按钮事件绑定---播放
        $('.music_play').click(function () {
            if (player.currentIndex == -1) {
                $('.content_common').eq(0).find('.play_music').trigger('click')
            } else {
                $('.content_common').eq(player.currentIndex).find('.play_music').trigger('click')
            }
        })
        //上一首
        $('.music_pre').click(function () {
            var $lastNum = $('.content_common:last').get(0).index

            if (player.currentIndex - 1 < 0) {

                player.currentIndex = $lastNum + 1
            }
            $('.content_common').eq(player.currentIndex - 1).find('.play_music').trigger('click')
        })
        //下一首
        $('.music_next').click(function () {
            var $lastNum = $('.content_common:last').get(0).index
            if (player.currentIndex + 1 > $lastNum) {
                player.currentIndex = -1
            }
            $('.content_common').eq(player.currentIndex + 1).find('.play_music').trigger('click')
        })
        var index
        //监听播放时间
        player.playTime(function (druction, currentTime, time) {
            //时间同步
            $('.play_info_top .right').text(time)
            //进度条同步
            var present = (currentTime / druction) * 100

            process.processUpdate(present)
            if (present == 100) {
                $('.music_next').trigger('click')
            }
            index = lyrics.nowWord(currentTime)
            $('.song_word li').eq(index).addClass('current')
            $('.song_word li').eq(index).siblings().removeClass('current')
            $('.pureMask .pure_container .song_word li').eq(index).addClass('current')
            $('.pureMask .pure_container .song_word li').eq(index).siblings().removeClass('current')

            if (index <= 2 || index == undefined) {
                $('.song_word').css('marginTop', 0)
                $('.pureMask .pure_container .song_word').css('marginTop', 0)
                return;
            };
            $('.song_word').css('marginTop', (-index + 2) * 30)
            $('.pureMask .pure_container .song_word').css('marginTop', (-index + 2) * 40)

        })

        //调节声音
        $('.music_volume .voice').click(function () {
            $(this).toggleClass('voice2')
            if ($(this).attr('class').indexOf('voice2') == -1) {
                //有声音
                player.musicSeekVocieTo(1)
            } else {
                //没声音
                player.musicSeekVocieTo(0)
            }
        })
        //喜欢监听
        $('.music_faver').click(function () {
            $(this).toggleClass('music_faver2')
        })
        //纯享事件监听
        $('.bottom_in .music_pure').click(function () {
            $('.pureMask').stop().fadeIn(300)
            $('.pureMask >.pure_container').empty()
            var $item = $('.center_right .song_word_container').clone(true)
            $('.pureMask >.pure_container').append('<a href="javascript:;" class="music_pure"></a>')
            $('.pureMask>.pure_container').append($item)
        })
        $('.pureMask').delegate(".pure_container .music_pure", "click", function () {
            $('.pureMask').stop().fadeOut(300)
        })
    }
    info()
    //加载信息数据函数
    function info() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data
                var $ul = $('.center_list #mCSB_1_container')
                $.each(data, function (index, value) {
                    var $item = createInfo(index, value)
                    $ul.append($item)
                })
                initInfo(data[0])
                lyrics.loadLyrics(data[0].link_lrc)
            }

        }
        )
    }
    //创建歌曲li信息
    function createInfo(index, value) {
        var item = $('<li class="content_common"><div class= "content_check" > <span></span></div><div class="content_number">' + (index + 1) + '</div><div class="content_music">' + value.name + '<div class="content_fuction"><a href="javascript:;" title="播放" class="play_music"></a><a href="javascript:;" title="添加"></a><a href="javascript:;" title="下载"></a><a href="javascript:;" title="分享"></a></div></div><div class="content_singer">' + value.singer + '</div><div class="content_time"> <span>' + value.time + '</span><a href="javascript:;" title="删除" class="deleteLi"></a></div></li >')
        item.get(0).index = index
        item.get(0).music = value
        return item
    }

    //初始化背景等信息
    function initInfo(music) {
        var $song_info_img = $('.song_info .bj>img')
        var $song_info_name = $('.song_info_name>a')
        var $song_info_singer = $('.song_info_singer>a')
        var $song_info_album = $('.song_info_album>a')
        var $song_info = $('.play_info_top .left')
        var $song_info_time = $('.play_info_top .right')
        var $mask_bj = $('.mask_bj')
        $song_info_img.attr('src', music.cover)
        $song_info_name.text(music.name)
        $song_info_singer.text(music.singer)
        $song_info_album.text(music.album)
        $song_info.text(music.name + "-" + music.singer)
        $song_info_time.text('00:00/' + music.time)
        $mask_bj.css('background', "url(" + music.cover + ")")

    }
    //进度条对象
    createProcess()
    function createProcess() {
        //进度条对象
        var $play_info_bar = $('.play_info_bar')
        var $play_info_current = $('.play_info_current')
        var $ball = $('.play_info_current>.ball')
        process = new Process($play_info_bar, $play_info_current, $ball)
        process.clickBar(function (value) {
            player.musicSeekTo(value)

        })
        process.moveBar(function (value) {
            player.musicSeekTo(value)

        })
        //声音进度条
        var $play_volume_bar = $('.play_volume_bar')
        var $play_volume_current = $('.play_volume_current')
        var $volume_ball = $('.volume_ball')
        volumeProcess = new Process($play_volume_bar, $play_volume_current, $volume_ball)
        volumeProcess.clickBar(function (value) {
            player.musicSeekVocieTo(value)
        })
        volumeProcess.moveBar(function (value) {
            player.musicSeekVocieTo(value)
        })
    }
})