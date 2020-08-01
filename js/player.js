(function (window) {
    function Player(item) {
        return new Player.prototype.init(item)
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function (item) {
            //初始化对象的属性:
            this.$item = item
            this.item = item.get(0)
        },
        currentIndex: -1,
        playMucis: function (index, music) {
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
        deleteLi: function (index) {
            this.musicList.splice(index, 1)
            console.log(index, this.currentIndex)
            if (index < this.currentIndex) {
                this.currentIndex = this.currentIndex - 1
            }
        },
        playTime: function (callBack) {
            var $this = this
            this.$item.on('timeupdate', function () {
                var druction = $this.item.duration
                var currentTime = $this.item.currentTime
                var time = $this.timeText(druction, currentTime)
                callBack(druction, currentTime, time)
            })
        },
        timeText: function (druction, currentTime) {
            var druction_m = parseInt(druction / 60)
            var druction_s = parseInt(druction % 60)
            var currentTime_m = parseInt(currentTime / 60)
            var currentTime_s = parseInt(currentTime % 60)
            if (druction_m < 10) {
                druction_m = "0" + druction_m
            }
            if (druction_s < 10) {
                druction_s = "0" + druction_s
            }
            if (currentTime_m < 10) {
                currentTime_m = "0" + currentTime_m
            }
            if (currentTime_s < 10) {
                currentTime_s = "0" + currentTime_s
            }
            return currentTime_m + ":" + currentTime_s + " / " + druction_m + ":" + druction_s
        },
        musicSeekTo: function (value) {
            if (isNaN(value)) return;
            this.item.currentTime = this.item.duration * value
        },
        musicSeekVocieTo: function (value) {
            if (isNaN(value)) return;
            if (value < 0 || value > 1) return;
            this.item.volume = value
        }



    }
    Player.prototype.init.prototype = Player.prototype
    window.Player = Player
})(window)