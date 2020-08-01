## QQ音乐播放器

### 案例展示

![](E:\启嘉班\前端课程\Javascript\jQuery\QQ音乐播放器\01.gif)

### 案例实现的功能

1. 静态页面的布局
2. 歌曲信息的动态显示
3. 鼠标悬停，功能按钮和文字高亮
4. 歌曲信息的动态显示
5. 歌曲播放
6. 进度条显示和动态移动
7. 纯净模式的模板设置和歌词写入

#### 案例布局

![](C:\Users\佳乐\AppData\Roaming\Typora\typora-user-images\1593089305020.png)

#### 歌曲动态加载

> 其实就是向中-左的ul中动态添加li来实现动态数据显示

![](E:\启嘉班\前端课程\Javascript\jQuery\QQ音乐播放器\01.png)

1. 要想动态加载数据就要现有数据:
   1. 通过$.ajax({})来动态加载数据（注意：加载本地文件有跨域问题，建议打开本地服务器）
2. 循环期中的数据，动态的创建li添加到ul中
   1. 通过$.each()循环出数据传入到，动态创建函数createInfo()中
3. createInfo最后的两句是让每个DOM 对象都添加相应的信息，以便click时知道是哪个数据

```javascript
//加载数据
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
```

#### 歌曲信息动态显示

> 在播放某一首歌时获取其对应DOM元素的信息，动态替换歌曲信息

![](E:\启嘉班\前端课程\Javascript\jQuery\QQ音乐播放器\02.png)

![](E:\启嘉班\前端课程\Javascript\jQuery\QQ音乐播放器\03.png)

```javascript
 //对播放按钮绑定事件---事件委托
        $('.center_list').delegate('.play_music', "click", function () {

            var $music = $(this).parents('.content_common').get(0).music
            var $index = $(this).parents('.content_common').get(0).index
			//歌曲信息
            initInfo($music)
            //歌词信息
            lyrics.loadLyrics($music.link_lrc)

        }) 
//歌曲信息
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
```

#### 歌曲播放

> 歌曲播放简单来说就是切换\<audio src=""></audio>的src属性

1. 点击那个li获取对应的DOM信息
2. 获取信息中的播放src地址
3. 切换src地址

```javascript
 //对播放按钮绑定事件---事件委托
 $('.center_list').delegate('.play_music', "click", function () {
            var $music = $(this).parents('.content_common').get(0).music
            var $index = $(this).parents('.content_common').get(0).index
            
            //对象的方法用来动态切换src地址
			player.playMucis($index, $music)

 }) 

//对象中的方法---部分
 playMucis: function (index, music) {
     //currentIndex属性用来存上一首播放的索引，判断是否切换src还是暂停歌曲
            if (index == this.currentIndex) {
                //同一首歌
                if (this.item.paused) {
                    this.item.play()
                } else {
                    this.item.pause()
                }
            } else {
                //不同一首歌
                this.$item.attr('src', music.link_url)
                this.item.play()
                this.currentIndex = index
            }
        },


```

#### 进度条的移动

> 进度条的移动判定是高亮部分在背景部分所占的多少进行移动

+ 通过现在**播放时间和总时间的比例**来调节进度条的移动的比例

![](E:\启嘉班\前端课程\Javascript\jQuery\QQ音乐播放器\04.png)

```javascript
//监听播放时间
player.playTime(function (druction, currentTime, time) {
    //时间同步
    $('.play_info_top .right').text(time)
    //进度条同步
    var present = (currentTime / druction) * 100
    process.processUpdate(present)

})
//对象的方法：
processUpdate: function (value) {
    if (this, this.isMove) return;
    if (value < 0 || value > 100) return;
    //设置进度条高亮部分和球的比例
    this.play_info_current.css('width', value + '%')
    this.ball.css('left', value + '%')
}


```

#### 纯净模式

> 纯净模式是在蒙版上复制之前的歌词元素节点实现

![](E:\启嘉班\前端课程\Javascript\jQuery\QQ音乐播放器\05.png)

+ 点击纯净触发蒙版的fadeIn，再次点击fadeOut

```javascript
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
```

## 案例下载地址

+ <https://gitee.com/zhao_jia_le/test>