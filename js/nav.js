// import './flexible';
// import {shop} from '../../config/shop.config.js';

var $dom = $(document);


/**
 * @todo 展示导航区域代码
 */
// 叉号按钮点击事件
$dom.on('click', '.nav__lock', function () {
    var $ct = $('.nav');

    //lock背景图替换
    if (!$(this).hasClass('close')) {
        $(this).addClass('close');
    } else {
        $(this).removeClass('close');
    }
    // 没展示
    if (!$ct.hasClass('show-1') && !$ct.hasClass('show-2')) {
        $ct.addClass('show-1');
    }
    // 已展示面板1
    else if ($ct.hasClass('show-1') && !$ct.hasClass('show-2')) {
        $ct.removeClass('show-1');
    }
    // 已展示面板2
    else if ($ct.hasClass('show-1') && $ct.hasClass('show-2')) {
        // $(this).addClass('close');
        $ct.removeClass('show-1');
        $ct.removeClass('show-2');
    }
});

// $dom.on('click', '.container', function() {
//     $('.nav').removeClass('show-1');
//     $('.nav').removeClass('show-2');
//     $('.nav__lock').removeClass('close');
// })
$dom.on('click', '.icon-close', function () {
    $('.nav').removeClass('show-2');
});


/**
 * @todo 控制show-1中循环出的li的间距
 */
$dom.on('click', '.trade__list', function () {
    let $trade = $dom.find('.trade__list');
    let $this = $(this),
    $list = $this.find('.list__wrap');
    
    //利用循环去掉每个li的外边距
    for (let i = 0; i < $trade.length; i++) {
        $trade[i].classList.remove('selected');
        // console.dir($trade[i])
    }
    
    if ($list.hasClass('selected')) {
        $list.removeClass('selected');
        $this.find('.list__icon').removeClass('active');
        $this.css('height',``);
        // $this.removeClass('selected');
    } else {
        $this.find('.list__wrap').addClass('selected').end().siblings().find('.list__wrap').removeClass('selected');
        $this.find('.list__icon').addClass('active').end().siblings().find('.list__icon').removeClass('active');
        $this.find('.list__group').show().end().siblings().find('.list__group').parent().css('height',``);
        /**
         * @param 对要展示的li计算高度平缓展示
         */
        var fixheight = $this.find('.list__wrap')[0].offsetHeight;
        var groupHeight = $this.find('.list__group')[0].offsetHeight + fixheight;
        $this.css('height',`${groupHeight}px`);

        $this.find('.list__group__child').first().addClass('relevant');
        $this.find('.list__group__child').first().trigger('click');
        
        //对当前选中的添加外边距
        $this.addClass('selected');
    }

    
});


// 面板1里的li的点击事件
// $dom.on('click', '.trade__list', function () {
//     var $this = $(this),
//         $list = $this.find('.list__wrap');
//     if ($list.hasClass('selected')) {
//         $list.removeClass('selected');
//         $this.find('.list__icon').removeClass('active');
//         $this.find('.list__group').hide();

//     } else {
//         $this.find('.list__wrap').addClass('selected').end().siblings().find('.list__wrap').removeClass('selected');
//         $this.find('.list__icon').addClass('active').end().siblings().find('.list__icon').removeClass('active');
//         $this.find('.list__group').show().end().siblings().find('.list__group').hide();
//         $this.find('.list__group__child').first().addClass('relevant');
//         $this.find('.list__group__child').first().trigger('click');
//     }
// });



/**
 * @todo 以上代码主要控制展示效果，后续代码主要控制展示内容
 * @todo 对节点添加内容
 */
function bindData() {
    /**
     * @param 核心部分
     * @param 获取json数据，分组，循环，拼装
     */
    var arr = shop;
    // 拼装dom
    var $tag = $('.trade__list');
    // 分组容器
    let obj = {};

    // 先分组，将数组添加id 再变成对象
    for (let i = 0; i < arr.length; i++) {
        // obj没有该id时，绑上id -> 创建分组
        if (!obj[arr[i].type]) {
            obj[arr[i].type] = [];
            // console.log(obj[arr[i].type)
        }
        // 如果有id了，直接将该项放进去 -> 推入对象
        obj[arr[i].type].push(arr[i]);
        // console.log(obj[arr[i].type]);
    }

    /**
     * @param 1.遍历对象obj上的每个id（属性id：值{}） -> 0: {type: 1, age: 17}
     * @param 2.用foreach方法为对应的id拼装dom
     */
    Object.keys(obj).forEach(function (key) {
        let str = '';
        //商户总数
        $('.trade__title').html(`${arr.length}家商户`);
        //2. 对每个id的数组 拼装dom
        for (let i = 0; i < obj[key].length; i++) {
            // 每项拼装dom
            str = `
                <li class="list__group__child" sub-type=${obj[key][i].subType}>
                    <span class="child-left">${obj[key][i].title}</span>
                    ${ obj[key][i].desc ? `<span class="child-right">${obj[key][i].desc}</span>` : '' }
                </li>
            `;

            // 拼完一次，对符合条件dom挂载一次
            for (let j = 0; j < $tag.length; j++) { //循环dom
                if (+$tag.eq(j).attr('type') === +key) {
                    $tag.eq(j).find('.list__group').append(str);
                }

            }
        }
    });


    //show-2 详情页内容展示
    $dom.on('click', '.list__group__child', function (e) {
        e.stopPropagation();
        // 拿数据
        var $this = $(this),
            type = $this.closest('.trade__list').attr('type'),
            obj = null,
            $nav = $('.nav'),
            $detail = $('.nav__detail');
        !$this.hasClass('relevant') ? $this.addClass('relevant').siblings().removeClass('relevant') : null;
        !$nav.hasClass('show-2') ? $nav.addClass('show-2') : null;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].type == type && arr[i].subType == $(this).attr('sub-type')) {
                obj = arr[i];
            }
        }
        // 展示数据
        $detail.find('.open__name').html(obj.title);
        $detail.find('.detail__img').css('background-image', `url(${obj.shopImg})`);
        $detail.find('.intro__text').html(obj.time);
        $detail.find('.phone__text').html(obj.call);
        $detail.find('.address__text').html(obj.address);
        $detail.find('.detail__map').css('background-image', `url(${obj.map})`);
        $detail.find('.code__img').css('background-image', `url(${obj.QR})`);
    });

    //对点击的背景变色，展示show-2页
    $('.list__group__child').on('click', function () {
        $(this).addClass('relevant').siblings().removeClass('relevant');
        $('.nav').addClass('show-2');
    });


    //show-2左上角切换show-1图标
    $dom.on('click', '.icon-btn', function (e) {
        // e.stopPropagation();
        // 判断点左还是点右
        // 判断第一个面板子菜单的索引
        // 边缘情况：当为0时，展示最后，当最后一个，展示第一个
        // 正常情况：点左向上，点右向下

        var direction = $(this).hasClass('icon-left') ? 'left' : 'right',
            $li = $('.list__wrap.selected'),
            $parent = $li.closest('.trade__list'),
            $child = $parent.find('.list__group__child'),
            idx = $parent.find('.relevant').index();
        if (direction === 'left') {
            if (idx === 0) {
                $child.last().addClass('relevant').siblings().removeClass('relevant');

            } else {
                $parent.find('.relevant').prev().addClass('relevant').siblings().removeClass('relevant');
            }
        } else {
            if (idx === $child.length - 1) {
                $child.first().addClass('relevant').siblings().removeClass('relevant');
            } else {

                $parent.find('.relevant').next().addClass('relevant').siblings().removeClass('relevant');
            }
        }

        $parent.find('.relevant').trigger('click');
    })
}

$(function () {
    bindData();
    $('.nav').removeClass('hidden');
})