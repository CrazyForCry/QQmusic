(function (window) {
    function Lyrics(song_word) {
        return new Lyrics.prototype.init(song_word)
    }
    Lyrics.prototype = {
        constructor: Lyrics,
        init: function (song_word) {
            this.$song_word = song_word
        }, times: [],
        words: [], objs: {},
        loadLyrics: function (data) {
            var $this = this
            $.ajax({
                url: data,
                dataType: "text",
                success: function (value) {
                    $this.lyricsDeal(value)
                    $this.createLi()
                }

            })
        },
        lyricsDeal: function (value) {
            var $this = this
            var online = value.split('\n')
            var regular = /\[(\d*:\d*\.\d*)\]/
            $this.times = []
            $this.words = []
            $this.index = -1
            //---
            $this.objs = {}
            numb = 0
            $.each(online, function (index, value) {

                var lrc = value.split(']')[1]
                if (lrc.length == 1) return true;
                $this.words.push(lrc)
                var number = regular.exec(value)
                if (number == null) return true;
                var timeStr = number[1]
                var res = timeStr.split(":")
                var min = parseInt(res[0]) * 60
                var sec = parseFloat(res[1])
                var num = parseFloat(Number(min + sec).toFixed(2))
                //---
                $this.times.push(num);
                $this.objs[num] = [numb, lrc]
                numb += 1
            })
        },
        createLi: function () {
            var $this = this
            this.$song_word.empty()
            $.each(this.words, function (index, ele) {
                var $item = $('<li>' + ele + '</li>')
                $this.$song_word.append($item)
            })
        },
        index: -1,
        nowWord: function (value) {
            var $this = this
            for (var i = 0; i < this.times.length; i++) {
                if (value <= this.times[i]) {
                    $this.index = i - 1
                    break
                }
            }
            var key = this.times[this.index]

            if (this.objs[key]) {
                var result = this.objs[key][0]
            }

            return result



        }
    }
    Lyrics.prototype.init.prototype = Lyrics.prototype
    window.Lyrics = Lyrics
})(window)