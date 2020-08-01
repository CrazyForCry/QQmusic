(function (window) {
    function Process($play_info_bar, $play_info_current, $ball) {
        return new Process.prototype.init($play_info_bar, $play_info_current, $ball)
    }
    Process.prototype = {
        constructor: Process,
        init: function ($play_info_bar, $play_info_current, $ball) {
            //初始化对象的属性:
            this.play_info_bar = $play_info_bar
            this.play_info_current = $play_info_current
            this.ball = $ball
        },
        isMove: false,
        processUpdate: function (value) {
            if (this, this.isMove) return;
            if (value < 0 || value > 100) return;
            this.play_info_current.css('width', value + '%')
            this.ball.css('left', value + '%')
        }
        ,
        clickBar: function (callBack) {
            var $this = this

            this.play_info_bar.click(function (event) {
                //在这里面的this为由play_info_bar通过click触发的回调，所以this为：play_info_bar
                var barLeft = $(this).offset().left;
                var currentLeft = event.pageX

                if (currentLeft - barLeft >= 0 && currentLeft - barLeft <= $this.play_info_bar.width()) {
                    $this.play_info_current.css('width', currentLeft - barLeft)
                    $this.ball.css('left', currentLeft - barLeft)
                }
                var value = (currentLeft - barLeft) / $(this).width()
                callBack(value)
                return false;
            })
        },
        moveBar: function (callBack) {
            var $this = this
            var barLeft = $this.play_info_bar.offset().left
            var currentLeft
            this.play_info_bar.mousedown(function () {
                $this.isMove = true
                $(document).mousemove(function (event) {
                    currentLeft = event.pageX
                    if (currentLeft - barLeft >= 0 && currentLeft - barLeft <= $this.play_info_bar.width()) {
                        $this.play_info_current.css('width', currentLeft - barLeft)
                        $this.ball.css('left', currentLeft - barLeft)
                    }

                })
            })
            this.play_info_bar.mouseup(function () {
                $(document).off('mousemove')
                $this.isMove = false
                var value = (currentLeft - barLeft) / $this.play_info_bar.width()
                callBack(value)

            })
        }


    }
    Process.prototype.init.prototype = Process.prototype
    window.Process = Process
})(window)