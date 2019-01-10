//VUE BUS
var Hub = new Vue()
var user = Object.assign(
    {
        timestamp: 0,
        vertify: 0,
        classid: 0,
        userid: 0
    },
    $user
)

function createAlbum() {
    var html = function() {
        var userAlbumList = Hub.userAlbumList
        if (userAlbumList.length <= 0) return
        var html = '<span class="on">未创建专辑</span>'
        userAlbumList.map(function(item) {
            html += '<span data-aid=' + item.aid + '>' + item.album_name + '</span>'
        })
        return html
    }

    var chooseAlbum = function() {
    // 选择专辑事件
        $('.tips-album-list').on('click', function(e) {
            if (e.target.nodeName == 'SPAN') {
                var el = e.target
                $(el)
                    .addClass('on')
                    .siblings()
                    .removeClass('on')
                Hub.$emit('chooseAlbum', {
                    album_name: el.innerText,
                    aid: el.getAttribute('data-aid')
                })
            }
        })
    }

    var c_Album = function() {
    // 创建专辑事件
        $('#create-album-btn').on('click', function(e) {
            var album = $('#album_name').val()
            if (album == null) {
                MsgBox('请输入专辑名')
                return
            } else {
                $.$post('/api/album/', {
                    body: 'album_name=' + album
                }).then(function(res) {
                    if (res.status == 1) {
                        Hub.$emit('createAlbum', {
                            album_name: res.album_name,
                            aid: res.aid
                        })
                        $('.tips-album-list').html(html())
                    } else {
                        MsgBox(res.message)
                    }
                })
            }
        })
    }

    return tipsbox(
        '<div id=\'tipsbox\'><div class=\'tipsBox-title\'><h4>创建专辑</h4></div><div class=\'tipsBox-main\'><div class=\'add-album\'><div class=\'create-album\'><div class=\'album-list-wrap\'><div class=\'tips-album-list\'>' +
      html() +
      ' </div><div class=\'create-album-text\'><input type=\'text\' id=\'album_name\' name=\'album_name\' placeholder=\'快速创建专辑\' /><a href=\'javascript:;\' id=\'create-album-btn\'>创建</a></div></div></div></div></div></div>',
        function() {
            chooseAlbum() // 选择专辑事件
            c_Album() // 创建专辑事件
        }
    )
}

Vue.config.keyCodes = {
    enter: 13
}

Vue.component('useralbum', {
    data: function() {
        return {
            defaultChoose: '未选择专辑'
        }
    },
    props: ['userAlist'],
    template:
    ' <ul><li >{{defaultChoose}}</li><template v-for=\'item in userAlist\'><li :data-aid=item.aid >{{item.album_name}}</li></template></ul>'
})

//根实例
new Vue({
    el: '.upload-page',
    data: function() {
        return {
            textPlaceHolder: true, // 描述框 placeholder
            inputPlaceHolder: true, // 输入框 placeholder
            showAlbum: false, // 专辑列表切换
            defaultChoose: '未选择专辑',
            userAlbumList: [],
            aidVal: '',
            tagsList: [],
            userInput: [],
            relaTags: [],
            tagsName: '',
            tipsBox: false,
            describeValue: '',
            tagshow: false,
            showForm: false,
            showChild: false,
            selectIndex: -1,
            childTag: {}
        }
    },
    created: function() {
        var that = this
        if ($user.userid) {
            $.$get('/api/getTags/').then(function(data) {
                data.map(function(i) {
                    i.check = false
                    if (i.rela_tags.length > 0) {
                        i.rela_tags.map(function(j) {
                            j.check = false
                        })
                    }
                })
                that.tagsList = data
            })
        }
    },
    mounted: function() {
        var that = this
        //tipsbox init
        if ($user.userid) {
            // 登录后获取标签和个人专辑列表
            var that = this,
                tagsObj = []
            $.$get('/api/getAlbumList/').then(function(data) {
                if (data.status == 1) {
                    that.userAlbumList = data.data.reverse()
                    Hub.userAlbumList = that.userAlbumList
                }
            })
        }

        Hub.$on('showForm', function(data) {
            that.showForm = data
        })
        Hub.$on('createAlbum', function(data) {
            that.userAlbumList.unshift({
                album_name: data.album_name,
                aid: data.aid
            })
        })
        //专辑选择时间
        Hub.$on('chooseAlbum', function(data) {
            that.defaultChoose = data.album_name
            that.aidVal = data.aid
        })
    },
    methods: {
        toggleAlbum: function() {
            this.showAlbum = this.showAlbum == true ? false : true
        },
        checkSubBtn: function(e) {
            //submit check提交按钮监听
            e.preventDefault()

            if (
                !$('input[name=\'photoimg\']').attr('value') &&
        !$('input[name=\'titlepic\']').attr('value')
            ) {
                MsgBox('请上传图片')
                return
            } else if (this.describeValue == '') {
                MsgBox('请输入描述')
                return
            } else {
                $('form[name=\'add\']')[0].submit()
            }
        },
        selectAlbum: function(e) {
            if (e.target && e.target.nodeName == 'LI') {
                this.defaultChoose = $(e.target).html()
                this.aidVal = $(e.target).data('aid')
                this.showAlbum = false
            }
        },
        keySub: function(value, e) {
            var val = this.stripscript(value)
            var bol = this.alreadyHasTag(val)
            if (e.keyCode == 13) {
                if (this.stripscript(value) != '' && bol) {
                    this.addToTags(val)
                }
            }
        },
        recTag: function(val) {
            var bol = this.alreadyHasTag(val) //判断有没有

            if (bol) {
                this.addToTags(val)
            }
        },
        alreadyHasTag: function(val) {
            var bol = true

            this.totalTags.map(function(i) {
                if (i.tagname == val) bol = false
            })
            return bol
        },
        addToTags: function(val) {
            var bol = true
            this.tagsName = ''
            this.tagsList.map(function(i) {
                if (i.tagname == val) {
                    i.check = true
                    bol = false
                }
                if (i.rela_tags.length > 0) {
                    i.rela_tags.map(function(j) {
                        if (j.tagname == val) {
                            j.check = true
                            bol = false
                        }
                    })
                }
            })
            if (bol) {
                this.userInput.push({ tagname: val })
            }
        },
        inputFilter: function(name) {
            this.tagsName = this.stripscript(name)
        },
        stripscript: function(s) {
            var pattern = new RegExp(
                '[0-9`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？《》]'
            )
            var rs = ''
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '')
            }
            return rs
        },
        SelectTag: function(e, index) {
            var self = this
            this.tagsList[index].check = true
            this.selectIndex = index
            this.childTag = {
                top: e.target.offsetTop + 49 + 'px',
                left: e.target.offsetLeft + 'px'
            }
        },
        SelectChildTag: function(e, index) {
            var parent = this.tagsList[this.selectIndex]
            if (parent.rela_tags.length > 0) {
                parent.rela_tags[index].check = true
            }
        },
        unCheckTag: function(e, index) {
            // 数组中移除
            var tagname = e.target.innerText
            var that = this

            this.tagsList.map(function(i) {
                if (i.tagname == tagname) {
                    i.check = false
                }
                if (i.rela_tags.length > 0) {
                    i.rela_tags.map(function(j) {
                        if (j.tagname == tagname) {
                            j.check = false
                        }
                    })
                }
            })

            this.userInput.map(function(i, index) {
                if (i.tagname == tagname) {
                    that.userInput.splice(index, 1)
                }
            })
        },

        MOutTag: function() {
            this.selectIndex = -1
        },
        pageClick: function(e) {
            if (e.target.className == 'upload-page') {
                this.selectIndex = -1
            }
        },
        setWrapCss: function(e) {
            var el = e.target
            $('.child-tags').css({
                top: el.offsetTop + el.offsetHeight + 12 + 'px',
                left: el.offsetLeft + el.offsetWidth / 2 - 30 + 'px'
            })
        },
        createAlbum: function() {
            createAlbum()
            this.showAlbum = false
        }
    },
    computed: {
        listFilter: function() {
            var that = this
            var newTags = []
            that.tagsList.map(function(i) {
                if (i.tagname.indexOf(that.tagsName) != -1) {
                    if (newTags.indexOf(i.tagname) == -1) {
                        newTags.push(i.tagname)
                    }
                }
            })
            return newTags
        },
        subTags: function() {
            var a = []

            this.totalTags.map(function(i) {
                a.push(i.tagname)
            })

            return a
        },
        totalTags: function() {
            return this.tagSelect.concat(this.userInput)
        },
        tagSelect: function() {
            var a = []
            this.tagsList.map(function(i) {
                if (i.check) {
                    a.push(i)
                }
                if (i.rela_tags.length > 0) {
                    i.rela_tags.map(function(j) {
                        if (j.check) {
                            a.push(j)
                        }
                    })
                }
            })
            return a
        },
        rela_tags: function() {
            if (this.tagsList[this.selectIndex] !== void 0) {
                return this.tagsList[this.selectIndex].rela_tags || []
            }
            return []
        }
    },
    watch: {
        tagsName: function() {
            if (this.tagsName !== '') {
                this.tagshow = true
            } else {
                this.tagshow = false
            }
        },
        tagsList: {
            handler: function() {},
            deep: true
        }
    }
})

$('#upComm').on('click', function(e) {
    if ($user.userid == void 0) {
        e.preventDefault()
        MsgBox('请先登录')
        return
    }
})
$('#upComm').on('change', function(e) {
    console.log(e)
    $.upload({
        file: e.target.files[0],
        url: '/api/upComm/',
        formData: {
            timestamp: user.timestamp,
            token: user.vertify,
            uid: user.userid,
            classid: user.classid
        },
        success: function(data) {
            var data = JSON.parse(data.responseText)
            var img =
        '<div class=\'pic-item\'><img src=' +
        data.url +
        '><i class=\'del-pic-item\'></i></div>'
            $('#pic-container').append(img)
            $('.uploadbtn').css('display', 'none')
            $('input[name=\'photoimg\']').attr('value', data.url)
            $('input[name=\'titlepic\']').attr('value', data.titlepic)
            //监听删除操作
            $('.del-pic-item').on('click', function() {
                $('.pic-item').remove()
                $('#imgUpLoad')[0].reset()
                $('.uploadbtn').css('display', 'block')
                $('input[name=\'photoimg\']').attr('value', '')
                $('input[name=\'titlepic\']').attr('value', '')
            })
            Hub.$emit('showForm', true)
        }
    })
})
